// Sequential baseline for Lab 2: discretize an array and count zeros/ones.

#include <chrono>
#include <cmath>
#include <cstdlib>
#include <iomanip>
#include <iostream>

using clock_type = std::chrono::steady_clock;

void reportTime(const char* msg, double seconds) {
    std::cout << msg << " - took - " << std::fixed << std::setprecision(6)
              << seconds << " seconds\n";
}

void discretize(float* data, int n) {
    for (int i = 0; i < n; i++) {
        const double x = static_cast<double>(data[i]);
        data[i] = static_cast<float>((std::pow(std::sin(x), std::cos(x)) +
                                      std::pow(std::cos(x), std::sin(x))) / 2.0);
    }
}

double elapsedSeconds(clock_type::time_point start, clock_type::time_point end) {
    return std::chrono::duration<double>(end - start).count();
}

int main(int argc, char** argv) {
    if (argc != 2) {
        std::cerr << "Usage: " << argv[0] << " <no_of_elements>\n";
        return 1;
    }

    const int n = std::atoi(argv[1]);
    if (n <= 0) {
        std::cerr << "n must be positive\n";
        return 1;
    }

    auto ts = clock_type::now();
    float* data = new float[n];
    std::srand(1);
    for (int i = 0; i < n; i++) {
        data[i] = static_cast<float>(std::rand()) / static_cast<float>(RAND_MAX);
    }
    auto te = clock_type::now();
    reportTime("allocation and initialization", elapsedSeconds(ts, te));

    ts = clock_type::now();
    discretize(data, n);

    int zeroes = 0;
    for (int i = 0; i < n; i++) {
        if (data[i] < 0.707f) {
            zeroes++;
        }
    }
    te = clock_type::now();
    reportTime("conversion", elapsedSeconds(ts, te));

    std::cout << "Result: " << n << " = " << zeroes << " (0s) + "
              << (n - zeroes) << " (1s)\n";

    delete[] data;
    return 0;
}
