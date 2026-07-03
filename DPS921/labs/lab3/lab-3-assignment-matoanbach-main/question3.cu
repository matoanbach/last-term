#include <chrono>
#include <climits>
#include <cmath>
#include <cstdlib>
#include <iomanip>
#include <iostream>

#include <cuda_runtime.h>
#include <thrust/device_vector.h>
#include <thrust/host_vector.h>

namespace
{
constexpr int DEFAULT_MATRIX_SIZE = 512;
constexpr int DEFAULT_RUNS = 5;
constexpr int TILE_SIZE = 16;

struct TimingStats
{
    float averageKernelMs = 0.0f;
    float averageTotalMs = 0.0f;
    bool passed = false;
};

bool tryParsePositiveInt(const char *text, int &value)
{
    char *end = nullptr;
    long parsedValue = std::strtol(text, &end, 10);
    if (end == text || *end != '\0' || parsedValue <= 0 || parsedValue > INT_MAX)
    {
        return false;
    }

    value = static_cast<int>(parsedValue);
    return true;
}

void printUsage(const char *programName)
{
    std::cerr << "Usage: " << programName << " <matrix_size> [runs]\n";
    std::cerr << "Example: " << programName << " 512 5\n";
}

void checkCuda(cudaError_t status, const char *message)
{
    if (status != cudaSuccess)
    {
        std::cerr << message << ": " << cudaGetErrorString(status) << '\n';
        std::exit(EXIT_FAILURE);
    }
}
}

void initializeMatrix(float *matrix, int matrixSize)
{
    for (int index = 0; index < matrixSize * matrixSize; index++)
    {
        matrix[index] = static_cast<float>(std::rand()) / static_cast<float>(RAND_MAX);
    }
}

void matrixMultiplyCPU(const float *matrixA, const float *matrixB, float *matrixC, int matrixSize)
{
    for (int row = 0; row < matrixSize; row++)
    {
        for (int col = 0; col < matrixSize; col++)
        {
            float sum = 0.0f;
            for (int k = 0; k < matrixSize; k++)
            {
                sum += matrixA[row * matrixSize + k] * matrixB[k * matrixSize + col];
            }
            matrixC[row * matrixSize + col] = sum;
        }
    }
}

bool verifyMatrices(const float *reference, const float *result, int matrixSize)
{
    for (int index = 0; index < matrixSize * matrixSize; index++)
    {
        if (std::fabs(reference[index] - result[index]) > 1e-3f)
        {
            return false;
        }
    }

    return true;
}

__global__ void matrixMultiplyBasicCUDA(const float *matrixA, const float *matrixB, float *matrixC, int matrixSize)
{
    int row = blockIdx.y * blockDim.y + threadIdx.y;
    int col = blockIdx.x * blockDim.x + threadIdx.x;

    if (row < matrixSize && col < matrixSize)
    {
        float sum = 0.0f;
        for (int k = 0; k < matrixSize; k++)
        {
            sum += matrixA[row * matrixSize + k] * matrixB[k * matrixSize + col];
        }
        matrixC[row * matrixSize + col] = sum;
    }
}

__global__ void matrixMultiplyTiledCUDA(const float *matrixA, const float *matrixB, float *matrixC, int matrixSize)
{
    __shared__ float tileA[TILE_SIZE][TILE_SIZE];
    __shared__ float tileB[TILE_SIZE][TILE_SIZE];

    int row = blockIdx.y * blockDim.y + threadIdx.y;
    int col = blockIdx.x * blockDim.x + threadIdx.x;
    float sum = 0.0f;

    int tileCount = (matrixSize + TILE_SIZE - 1) / TILE_SIZE;
    for (int tileIndex = 0; tileIndex < tileCount; tileIndex++)
    {
        int sourceCol = tileIndex * TILE_SIZE + threadIdx.x;
        int sourceRow = tileIndex * TILE_SIZE + threadIdx.y;

        // Each thread loads one value from A and one value from B into shared memory.
        if (row < matrixSize && sourceCol < matrixSize)
        {
            tileA[threadIdx.y][threadIdx.x] = matrixA[row * matrixSize + sourceCol];
        }
        else
        {
            tileA[threadIdx.y][threadIdx.x] = 0.0f;
        }

        if (sourceRow < matrixSize && col < matrixSize)
        {
            tileB[threadIdx.y][threadIdx.x] = matrixB[sourceRow * matrixSize + col];
        }
        else
        {
            tileB[threadIdx.y][threadIdx.x] = 0.0f;
        }

        // Wait until the full tile has been loaded before using shared memory.
        __syncthreads();

        // Multiply the current pair of tiles.
        for (int k = 0; k < TILE_SIZE; k++)
        {
            sum += tileA[threadIdx.y][k] * tileB[k][threadIdx.x];
        }

        // Wait again before reusing shared memory for the next tile.
        __syncthreads();
    }

    if (row < matrixSize && col < matrixSize)
    {
        matrixC[row * matrixSize + col] = sum;
    }
}

double benchmarkCPU(const float *matrixA, const float *matrixB, float *matrixC, int matrixSize, int runs)
{
    double totalTimeMs = 0.0;

    for (int run = 0; run < runs; run++)
    {
        auto start = std::chrono::high_resolution_clock::now();
        matrixMultiplyCPU(matrixA, matrixB, matrixC, matrixSize);
        auto end = std::chrono::high_resolution_clock::now();
        totalTimeMs += std::chrono::duration<double, std::milli>(end - start).count();
    }

    return totalTimeMs / runs;
}

template <typename KernelFunction>
TimingStats benchmarkThrust(KernelFunction kernelFunction, thrust::host_vector<float> &hostMatrixA,
                            thrust::host_vector<float> &hostMatrixB, const float *referenceMatrix,
                            thrust::host_vector<float> &hostResultMatrix, int matrixSize, int runs)
{
    // This helper keeps the timing logic in one place while letting us run either CUDA kernel.
    TimingStats stats;
    dim3 blockSize(TILE_SIZE, TILE_SIZE);
    dim3 gridSize((matrixSize + blockSize.x - 1) / blockSize.x,
                  (matrixSize + blockSize.y - 1) / blockSize.y);

    for (int run = 0; run < runs; run++)
    {
        auto totalStart = std::chrono::high_resolution_clock::now();

        // Thrust handles the host-to-device and device-to-host copies for us.
        thrust::device_vector<float> deviceMatrixA = hostMatrixA;
        thrust::device_vector<float> deviceMatrixB = hostMatrixB;
        thrust::device_vector<float> deviceMatrixC(matrixSize * matrixSize, 0.0f);

        cudaEvent_t kernelStart;
        cudaEvent_t kernelStop;
        checkCuda(cudaEventCreate(&kernelStart), "cudaEventCreate kernelStart failed");
        checkCuda(cudaEventCreate(&kernelStop), "cudaEventCreate kernelStop failed");

        // Measure only the kernel execution with CUDA events.
        checkCuda(cudaEventRecord(kernelStart), "cudaEventRecord kernelStart failed");
        kernelFunction<<<gridSize, blockSize>>>(thrust::raw_pointer_cast(deviceMatrixA.data()),
                                                thrust::raw_pointer_cast(deviceMatrixB.data()),
                                                thrust::raw_pointer_cast(deviceMatrixC.data()),
                                                matrixSize);
        checkCuda(cudaGetLastError(), "Kernel launch failed");
        checkCuda(cudaEventRecord(kernelStop), "cudaEventRecord kernelStop failed");
        checkCuda(cudaEventSynchronize(kernelStop), "cudaEventSynchronize failed");
        checkCuda(cudaDeviceSynchronize(), "cudaDeviceSynchronize failed");

        float kernelTimeMs = 0.0f;
        checkCuda(cudaEventElapsedTime(&kernelTimeMs, kernelStart, kernelStop), "cudaEventElapsedTime failed");
        stats.averageKernelMs += kernelTimeMs;

        hostResultMatrix = deviceMatrixC;

        auto totalEnd = std::chrono::high_resolution_clock::now();
        stats.averageTotalMs += static_cast<float>(std::chrono::duration<double, std::milli>(totalEnd - totalStart).count());

        checkCuda(cudaEventDestroy(kernelStart), "cudaEventDestroy kernelStart failed");
        checkCuda(cudaEventDestroy(kernelStop), "cudaEventDestroy kernelStop failed");
    }

    stats.averageKernelMs /= runs;
    stats.averageTotalMs /= runs;
    stats.passed = verifyMatrices(referenceMatrix, hostResultMatrix.data(), matrixSize);
    return stats;
}

TimingStats benchmarkBasicThrust(thrust::host_vector<float> &hostMatrixA, thrust::host_vector<float> &hostMatrixB,
                                 const float *referenceMatrix, thrust::host_vector<float> &hostResultMatrix,
                                 int matrixSize, int runs)
{
    return benchmarkThrust(matrixMultiplyBasicCUDA, hostMatrixA, hostMatrixB,
                           referenceMatrix, hostResultMatrix, matrixSize, runs);
}

TimingStats benchmarkTiledThrust(thrust::host_vector<float> &hostMatrixA, thrust::host_vector<float> &hostMatrixB,
                                 const float *referenceMatrix, thrust::host_vector<float> &hostResultMatrix,
                                 int matrixSize, int runs)
{
    return benchmarkThrust(matrixMultiplyTiledCUDA, hostMatrixA, hostMatrixB,
                           referenceMatrix, hostResultMatrix, matrixSize, runs);
}

int main(int argc, char **argv)
{
    int matrixSize = DEFAULT_MATRIX_SIZE;
    int runs = DEFAULT_RUNS;

    if (argc >= 2 && !tryParsePositiveInt(argv[1], matrixSize))
    {
        std::cerr << "Matrix size must be a positive integer.\n";
        printUsage(argv[0]);
        return EXIT_FAILURE;
    }

    if (argc >= 3 && !tryParsePositiveInt(argv[2], runs))
    {
        std::cerr << "Run count must be a positive integer.\n";
        printUsage(argv[0]);
        return EXIT_FAILURE;
    }

    std::cout << std::fixed << std::setprecision(4);
    std::cout << "Matrix Size            : " << matrixSize << " x " << matrixSize << '\n';
    std::cout << "Runs                   : " << runs << '\n';

    thrust::host_vector<float> hostMatrixA(matrixSize * matrixSize);
    thrust::host_vector<float> hostMatrixB(matrixSize * matrixSize);
    thrust::host_vector<float> basicThrustResult(matrixSize * matrixSize, 0.0f);
    thrust::host_vector<float> tiledThrustResult(matrixSize * matrixSize, 0.0f);

    std::srand(42);
    initializeMatrix(hostMatrixA.data(), matrixSize);
    initializeMatrix(hostMatrixB.data(), matrixSize);

    float *cpuResult = new float[matrixSize * matrixSize];
    double cpuAverageTimeMs = benchmarkCPU(hostMatrixA.data(), hostMatrixB.data(), cpuResult, matrixSize, runs);
    TimingStats basicStats = benchmarkBasicThrust(hostMatrixA, hostMatrixB, cpuResult, basicThrustResult, matrixSize, runs);
    TimingStats tiledStats = benchmarkTiledThrust(hostMatrixA, hostMatrixB, cpuResult, tiledThrustResult, matrixSize, runs);

    std::cout << "CPU Average Time       : " << cpuAverageTimeMs << " ms\n";
    std::cout << "Thrust Basic Kernel Avg: " << basicStats.averageKernelMs << " ms\n";
    std::cout << "Thrust Basic Total Avg : " << basicStats.averageTotalMs << " ms\n";
    std::cout << "Thrust Basic Correct   : " << (basicStats.passed ? "PASS" : "FAIL") << '\n';
    std::cout << "Thrust Tiled Kernel Avg: " << tiledStats.averageKernelMs << " ms\n";
    std::cout << "Thrust Tiled Total Avg : " << tiledStats.averageTotalMs << " ms\n";
    std::cout << "Thrust Tiled Correct   : " << (tiledStats.passed ? "PASS" : "FAIL") << '\n';

    delete[] cpuResult;
    return 0;
}
