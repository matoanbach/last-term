#include <algorithm>
#include <chrono>
#include <iomanip>
#include <iostream>
#include <vector>

int getIndex(int row, int column, int N)
{
    return row * N + column;
}

void matrixMultiplyCPU(float *A, float *B, float *C, int N)
{
    for (int row = 0; row < N; row++)
    {
        for (int col = 0; col < N; col++)
        {
            float sum = 0.0f;
            for (int k = 0; k < N; k++)
            {
                sum += A[getIndex(row, k, N)] * B[getIndex(k, col, N)];
            }
            C[getIndex(row, col, N)] = sum;
        }
    }
}

void printMatrix(const std::vector<float> &matrix, int N, const char *name)
{
    std::cout << name << " =\n";
    for (int row = 0; row < N; row++)
    {
        for (int col = 0; col < N; col++)
        {
            std::cout << std::setw(8) << matrix[getIndex(row, col, N)] << ' ';
        }
        std::cout << '\n';
    }
    std::cout << '\n';
}

void fillSequential(std::vector<float> &matrix, int N)
{
    for (int i = 0; i < N * N; i++)
    {
        matrix[i] = static_cast<float>(i + 1);
    }
}

void fillIdentity(std::vector<float> &matrix, int N)
{
    std::fill(matrix.begin(), matrix.end(), 0.0f);
    for (int i = 0; i < N; i++)
    {
        matrix[getIndex(i, i, N)] = 1.0f;
    }
}

void fillBenchmarkData(std::vector<float> &A, std::vector<float> &B, int N)
{
    for (int i = 0; i < N * N; i++)
    {
        A[i] = static_cast<float>((i % 17) + 1);
        B[i] = static_cast<float>((i % 13) + 1);
    }
}

double benchmarkMatrixMultiply(int N)
{
    std::vector<float> A(N * N);
    std::vector<float> B(N * N);
    std::vector<float> C(N * N, 0.0f);

    fillBenchmarkData(A, B, N);

    const auto start = std::chrono::high_resolution_clock::now();
    matrixMultiplyCPU(A.data(), B.data(), C.data(), N);
    const auto end = std::chrono::high_resolution_clock::now();

    std::chrono::duration<double, std::milli> elapsed = end - start;
    return elapsed.count();
}

int main()
{
    const int testN = 4;
    std::vector<float> A(testN * testN);
    std::vector<float> B(testN * testN);
    std::vector<float> C(testN * testN, 0.0f);

    fillSequential(A, testN);
    fillIdentity(B, testN);
    matrixMultiplyCPU(A.data(), B.data(), C.data(), testN);

    printMatrix(A, testN, "A");
    printMatrix(B, testN, "B");
    printMatrix(C, testN, "C");

    for (int N : {256, 512})
    {
        std::cout << "N = " << N << ", time = "
                  << benchmarkMatrixMultiply(N) << " ms\n";
    }

    return 0;
}
