#include <chrono>
#include <cstdlib>
#include <iomanip>
#include <iostream>
#include <omp.h>

using namespace std::chrono;

void reportTime(const char* msg, steady_clock::duration span) {
    auto ms = duration_cast<milliseconds>(span);
    std::cout << msg << " took " << ms.count() << " milliseconds" << std::endl;
}

int main(int argc, char* argv[]) {
    if (argc != 2) {
        std::cerr << argv[0] << ": invalid number of arguments\n";
        std::cerr << "Usage: " << argv[0] << " no_of_slices\n";
        return 1;
    }

    long long n = std::atoll(argv[1]);
    steady_clock::time_point ts, te;

    ts = steady_clock::now();

    double pi, sum = 0.0;
    double stepSize = 1.0 / static_cast<double>(n);

    #pragma omp parallel for default(none) shared(n, stepSize, sum)
    for (long long i = 0; i < n; ++i) {
        double x = (static_cast<double>(i) + 0.5) * stepSize;
        double term = 1.0 / (1.0 + x * x);

        #pragma omp atomic
        sum += term;
    }

    pi = 4.0 * sum * stepSize;

    te = steady_clock::now();

    std::cout << "n = " << n
              << std::fixed << std::setprecision(15)
              << "\npi(exact)   = " << 3.141592653589793
              << "\npi(calcd)   = " << pi << std::endl;

    reportTime("Integration", te - ts);
}
