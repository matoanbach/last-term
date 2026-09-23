#include <iostream>
#include <chrono>
#include <omp.h>

int main() {
    const int n = 100000;
    int A[n];
    for (int i = 0; i < n; i++)
        A[i] = rand() % 100 - 50;

    double sum = 0;
    #pragma omp parallel for
    for (int i = 0; i < n; i++)
        #pragma omp atomic
        sum += A[i];

    std::cout << "Sum: " << sum << std::endl;
    return 0;
}