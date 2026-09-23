#include <chrono>
#include <cstdlib>
#include <iomanip>
#include <iostream>
#include <omp.h>
#include <vector>

int main(int argc, char *argv[])
{
    long long steps = 1000000000LL;

    if (argc > 1)
    {
        steps = std::atoll(argv[1]);
    }

    constexpr int PAD = 8;
    double step = 1.0 / static_cast<double>(steps);
    int actualThreads = 0;
    std::vector<double> partial(omp_get_max_threads() * PAD, 0.0);

    auto start = std::chrono::high_resolution_clock::now();

    #pragma omp parallel
    {
        int id = omp_get_thread_num();
        int threads = omp_get_num_threads();

        if (id == 0)
        {
            actualThreads = threads;
        }

        for (long long i = id; i < steps; i += threads)
        {
            double x = (static_cast<double>(i) + 0.5) * step;
            partial[id * PAD] += 1.0 / (1.0 + x * x);
        }
    }

    double sum = 0.0;

    for (int i = 0; i < actualThreads; i++)
    {
        sum += partial[i * PAD];
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
