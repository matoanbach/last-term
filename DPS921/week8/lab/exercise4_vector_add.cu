#include <cmath>
#include <cstdlib>
#include <cuda_runtime.h>
#include <iostream>
#include <vector>

void checkCuda(cudaError_t result, const char *message)
{
    if (result != cudaSuccess)
    {
        std::cerr << message << ": " << cudaGetErrorString(result) << '\n';
        std::exit(EXIT_FAILURE);
    }
}

__global__ void vectorAdd(float *A, float *B, float *C, int N)
{
    int i = blockIdx.x * blockDim.x + threadIdx.x;

    if (i < N)
    {
        C[i] = A[i] + B[i];
    }
}

void fillInput(std::vector<float> &A, std::vector<float> &B)
{
    for (int i = 0; i < static_cast<int>(A.size()); i++)
    {
        A[i] = static_cast<float>(i) * 0.5f;
        B[i] = static_cast<float>(i % 7) + 1.0f;
    }
}

bool verifyResult(const std::vector<float> &A,
                  const std::vector<float> &B,
                  const std::vector<float> &C)
{
    for (int i = 0; i < static_cast<int>(C.size()); i++)
    {
        const float expected = A[i] + B[i];
        if (std::fabs(C[i] - expected) > 1e-5f)
        {
            std::cerr << "Mismatch at index " << i
                      << ": expected " << expected
                      << ", got " << C[i] << '\n';
            return false;
        }
    }
    return true;
}

void runVectorAdd(int N)
{
    std::vector<float> A(N);
    std::vector<float> B(N);
    std::vector<float> C(N, 0.0f);
    fillInput(A, B);

    float *d_A = nullptr;
    float *d_B = nullptr;
    float *d_C = nullptr;
    const size_t size = static_cast<size_t>(N) * sizeof(float);

    checkCuda(cudaMalloc(reinterpret_cast<void **>(&d_A), size), "cudaMalloc d_A failed");
    checkCuda(cudaMalloc(reinterpret_cast<void **>(&d_B), size), "cudaMalloc d_B failed");
    checkCuda(cudaMalloc(reinterpret_cast<void **>(&d_C), size), "cudaMalloc d_C failed");

    checkCuda(cudaMemcpy(d_A, A.data(), size, cudaMemcpyHostToDevice), "Copy A to device failed");
    checkCuda(cudaMemcpy(d_B, B.data(), size, cudaMemcpyHostToDevice), "Copy B to device failed");

    const int threadsPerBlock = 256;
    const int blocksPerGrid = (N + threadsPerBlock - 1) / threadsPerBlock;
    vectorAdd<<<blocksPerGrid, threadsPerBlock>>>(d_A, d_B, d_C, N);

    checkCuda(cudaGetLastError(), "Kernel launch failed");
    checkCuda(cudaDeviceSynchronize(), "Kernel execution failed");
    checkCuda(cudaMemcpy(C.data(), d_C, size, cudaMemcpyDeviceToHost), "Copy C to host failed");

    std::cout << "N = " << N << ": "
              << (verifyResult(A, B, C) ? "correct" : "incorrect") << '\n';

    for (int i = 0; i < 5 && i < N; i++)
    {
        std::cout << "C[" << i << "] = " << C[i] << '\n';
    }
    std::cout << '\n';

    cudaFree(d_A);
    cudaFree(d_B);
    cudaFree(d_C);
}

int main()
{
    runVectorAdd(1024);
    runVectorAdd(16384);
    return 0;
}
