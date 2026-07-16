#include <chrono>
#include <cstdlib>
#include <iomanip>
#include <iostream>
#include <omp.h>
#include <vector>

double computePiSerial(long steps)
{
    double step = 1.0 / static_cast<double>(steps);
    double sum = 0.0;

    for (long i = 0; i < steps; i++)
    {
        double x = (static_cast<double>(i) + 0.5) * step;
        sum += 4.0 / (1.0 + x * x);
    }

    return step * sum;
}

double computePiParallelManual(long steps, int &actualThreads)
{
    double step = 1.0 / static_cast<double>(steps);
    std::vector<double> partial(omp_get_max_threads(), 0.0);

    #pragma omp parallel
    {
        int id = omp_get_thread_num();
        int total = omp_get_num_threads();

        if (id == 0)
        {
            actualThreads = total;
        }

        double localSum = 0.0;

        for (long i = id; i < steps; i += total)
        {
            double x = (static_cast<double>(i) + 0.5) * step;
            localSum += 4.0 / (1.0 + x * x);
        }

        partial[id] = localSum;
    }

    double sum = 0.0;

    for (int i = 0; i < actualThreads; i++)
    {
        sum += partial[i];
    }

    return step * sum;
}

int main(int argc, char *argv[])
{
    long steps = 100000000;

    if (argc > 1)
    {
        steps = std::atol(argv[1]);
    }

    auto serialStart = std::chrono::high_resolution_clock::now();
    double piSerial = computePiSerial(steps);
    auto serialEnd = std::chrono::high_resolution_clock::now();

    int actualThreads = 0;
    auto parallelStart = std::chrono::high_resolution_clock::now();
    double piParallel = computePiParallelManual(steps, actualThreads);
    auto parallelEnd = std::chrono::high_resolution_clock::now();

    double serialMs = std::chrono::duration<double, std::milli>(serialEnd - serialStart).count();
    double parallelMs = std::chrono::duration<double, std::milli>(parallelEnd - parallelStart).count();
    double speedup = serialMs / parallelMs;

    std::cout << std::fixed << std::setprecision(12);
    std::cout << "Steps             : " << steps << '\n';
    std::cout << "Threads used      : " << actualThreads << '\n';
    std::cout << "Serial pi         : " << piSerial << '\n';
    std::cout << "Parallel pi       : " << piParallel << '\n';
    std::cout << std::setprecision(4);
    std::cout << "Serial time (ms)  : " << serialMs << '\n';
    std::cout << "Parallel time (ms): " << parallelMs << '\n';
    std::cout << "Speedup           : " << speedup << 'x' << '\n';

    return 0;
}
