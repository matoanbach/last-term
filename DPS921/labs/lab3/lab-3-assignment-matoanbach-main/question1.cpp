#include <chrono>
#include <climits>
#include <cmath>
#include <cstdlib>
#include <iostream>

namespace
{
constexpr int DEFAULT_MATRIX_SIZE = 512;
constexpr int DEFAULT_RUNS = 5;
constexpr int SAMPLE_COUNT = 50;

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
}

// ------------------------------
// Initialize matrix with random values
// ------------------------------
void initializeMatrix(float *matrix, int N)
{
    for (int i = 0; i < N * N; i++)
    {
        matrix[i] = static_cast<float>(rand()) / static_cast<float>(RAND_MAX);
    }
}

// ------------------------------
// Check a small set of output positions against a recomputed value.
// ------------------------------
bool verifySample(const float *result, const float *matrixA, const float *matrixB,
                  int matrixSize, int sampleCount, const int *sampleRows, const int *sampleCols)
{
    const float epsilon = 1e-3f;

    for (int sampleIndex = 0; sampleIndex < sampleCount; sampleIndex++)
    {
        const int row = sampleRows[sampleIndex];
        const int col = sampleCols[sampleIndex];
        float expectedValue = 0.0f;

        for (int k = 0; k < matrixSize; k++)
        {
            expectedValue += matrixA[row * matrixSize + k] * matrixB[k * matrixSize + col];
        }

        const float actualValue = result[row * matrixSize + col];
        if (std::fabs(expectedValue - actualValue) > epsilon)
        {
            return false;
        }
    }

    return true;
}

// ------------------------------
// Standard 3-loop CPU matrix multiplication.
// ------------------------------
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

    std::cout << "Matrix Size         : " << matrixSize << " x " << matrixSize << '\n';
    std::cout << "Runs                : " << runs << '\n';

    // Allocate memory
    float *matrixA = new float[matrixSize * matrixSize];
    float *matrixB = new float[matrixSize * matrixSize];
    float *matrixC = new float[matrixSize * matrixSize];

    // Initialize matrices
    std::srand(42);
    initializeMatrix(matrixA, matrixSize);
    initializeMatrix(matrixB, matrixSize);

    double averageCpuTimeMs = benchmarkCPU(matrixA, matrixB, matrixC, matrixSize, runs);

    // ------------------------------
    // Verify correctness
    // ------------------------------
    int *sampleRows = new int[SAMPLE_COUNT];
    int *sampleCols = new int[SAMPLE_COUNT];
    for (int sampleIndex = 0; sampleIndex < SAMPLE_COUNT; sampleIndex++)
    {
        sampleRows[sampleIndex] = std::rand() % matrixSize;
        sampleCols[sampleIndex] = std::rand() % matrixSize;
    }
    bool passedVerification = verifySample(matrixC, matrixA, matrixB, matrixSize,
                                           SAMPLE_COUNT, sampleRows, sampleCols);

    // ------------------------------
    // Output results
    // ------------------------------
    std::cout << "Average CPU Time    : " << averageCpuTimeMs << " ms\n";
    std::cout << "Correctness         : " << (passedVerification ? "PASS" : "FAIL") << '\n';

    // ------------------------------
    // Cleanup
    // ------------------------------
    delete[] matrixA;
    delete[] matrixB;
    delete[] matrixC;
    delete[] sampleRows;
    delete[] sampleCols;

    return 0;
}
