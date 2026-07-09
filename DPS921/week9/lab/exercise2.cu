#include <cuda_runtime.h>
#include <iostream>
#include <vector>

__global__ void sharedCopy(const float *input, float *output, int N)
{
    __shared__ float tile[256];

    int tid = blockIdx.x * blockDim.x + threadIdx.x;

    if (tid < N)
    {
        tile[threadIdx.x] = input[tid];
    }

    __syncthreads();

    if (tid < N)
    {
        output[tid] = tile[threadIdx.x];
    }
}

bool verifyMatch(const std::vector<float> &input, const std::vector<float> &output)
{
    for (size_t i = 0; i < input.size(); i++)
    {
        if (input[i] != output[i])
        {
            return false;
        }
    }

    return true;
}

int runCase(int N)
{
    std::vector<float> h_input(N);
    std::vector<float> h_output(N, 0.0f);

    for (int i = 0; i < N; i++)
    {
        h_input[i] = static_cast<float>(i);
    }

    float *d_input = nullptr;
    float *d_output = nullptr;

    cudaMalloc(&d_input, N * sizeof(float));
    cudaMalloc(&d_output, N * sizeof(float));

    cudaMemcpy(d_input, h_input.data(), N * sizeof(float), cudaMemcpyHostToDevice);

    int blockSize = 256;
    int gridSize = (N + blockSize - 1) / blockSize;

    sharedCopy<<<gridSize, blockSize>>>(d_input, d_output, N);
    cudaDeviceSynchronize();

    cudaMemcpy(h_output.data(), d_output, N * sizeof(float), cudaMemcpyDeviceToHost);

    bool pass = verifyMatch(h_input, h_output);

    std::cout << "N = " << N << " | Correctness = " << (pass ? "PASS" : "FAIL") << std::endl;

    cudaFree(d_input);
    cudaFree(d_output);

    return pass ? 0 : 1;
}

int main()
{
    int result1 = runCase(1024);
    int result2 = runCase(16384);

    return (result1 == 0 && result2 == 0) ? 0 : 1;
}
