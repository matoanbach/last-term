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

void runCase(int N)
{
    std::vector<float> h_input(N, 1.0f);
    std::vector<float> h_output(N, 0.0f);

    float *d_input = nullptr;
    float *d_output = nullptr;
    cudaEvent_t start, stop;

    cudaMalloc(&d_input, N * sizeof(float));
    cudaMalloc(&d_output, N * sizeof(float));
    cudaMemcpy(d_input, h_input.data(), N * sizeof(float), cudaMemcpyHostToDevice);

    cudaEventCreate(&start);
    cudaEventCreate(&stop);

    int blockSize = 256;
    int gridSize = (N + blockSize - 1) / blockSize;

    cudaEventRecord(start);

    sharedCopy<<<gridSize, blockSize>>>(d_input, d_output, N);

    cudaEventRecord(stop);
    cudaEventSynchronize(stop);

    float ms = 0.0f;
    cudaEventElapsedTime(&ms, start, stop);

    cudaMemcpy(h_output.data(), d_output, N * sizeof(float), cudaMemcpyDeviceToHost);

    std::cout << "N = " << N << " | Kernel Time = " << ms << " ms" << std::endl;

    cudaEventDestroy(start);
    cudaEventDestroy(stop);
    cudaFree(d_input);
    cudaFree(d_output);
}

int main()
{
    runCase(1024);
    runCase(16384);
    return 0;
}
