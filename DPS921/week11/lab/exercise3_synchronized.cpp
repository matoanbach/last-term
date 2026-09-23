#include <chrono>
#include <cstdlib>
#include <iomanip>
#include <iostream>
#include <omp.h>

int main(int argc, char *argv[])
{
    long long steps = 1000000000LL;

    if (argc > 1)
    {
        steps = std::atoll(argv[1]);
    }

    double step = 1.0 / static_cast<double>(steps);
    double sum = 0.0;
    int actualThreads = 0;

    auto start = std::chrono::high_resolution_clock::now();

    #pragma omp parallel shared(sum, actualThreads, step, steps)
    {
        if (omp_get_thread_num() == 0)
        {
            actualThreads = omp_get_num_threads();
        }

        #pragma omp for
        for (long long i = 0; i < steps; i++)
        {
            double x = (static_cast<double>(i) + 0.5) * step;
            double term = 1.0 / (1.0 + x * x);

            #pragma omp atomic
            sum += term;
        }
    }

    double pi = 4.0 * sum * step;
    auto end = std::chrono::high_resolution_clock::now();
    double elapsedMs = std::chrono::duration<double, std::milli>(end - start).count();

    std::cout << std::fixed << std::setprecision(15);
    std::cout << "Steps             : " << steps << '\n';
    std::cout << "Threads used      : " << actualThreads << '\n';
    std::cout << "pi(calculated)    : " << pi << '\n';
    std::cout << std::setprecision(4);
    std::cout << "Integration time  : " << elapsedMs << " ms\n";

    return 0;
}
