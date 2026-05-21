// Q2.cpp
#include <iostream>
#include <cmath>
#include <chrono>
#include <cstdlib>
#include <thread>
#include <vector>
#include <algorithm>
using namespace std::chrono;

class Version {
public:
    // used to identify the compiler used
    // if you are not using a compiler listed replace blocks as appropiate
    void operator()() const {
        std::cout << "Hello from the ";

        // Note: Clang defines GCC-compatible macros too, so check Clang first.
        #if defined(__clang__)
        std::cout << "Clang compiler: ";
        std::cout << __clang_major__ << "."
                  << __clang_minor__ << "."
                  << __clang_patchlevel__ << " version\n";

        #elif defined(__GNUC__)
        std::cout << "GNU compiler: ";
        std::cout << __GNUC__ << "."
                  << __GNUC_MINOR__ << "."
                  << __GNUC_PATCHLEVEL__ << " version\n";

        #elif defined(__INTEL_COMPILER)
        std::cout << "Intel compiler: ";
        std::cout << __INTEL_COMPILER;
        #if defined(__INTEL_COMPILER_UPDATE)
        std::cout << "." << __INTEL_COMPILER_UPDATE;
        #endif
        std::cout << " version\n";

        #elif defined(_MSC_VER)
        std::cout << "Microsoft VC++: ";
        // _MSC_FULL_VER typically contains more detail than _MSC_VER.
        std::cout << _MSC_FULL_VER;
        #if defined(_MSC_BUILD)
        std::cout << "." << _MSC_BUILD;
        #endif
        std::cout << " version\n";

        #else
        std::cout << "unknown compiler\n";
        #endif
    }
};

// report system time
//
void reportTime(const char* msg, steady_clock::duration span) {
    auto ms = duration_cast<milliseconds>(span);
    std::cout << msg << " - took - " <<
    ms.count() << " milliseconds" << std::endl;
}

// double magnitude(const double* x, int n) {
//     double sum = 0.0;
//     for (int i = 0; i < n; i++)
//         sum += x[i] * x[i];
//     return sqrt(sum);
// }
double getMagnitude(const double* x, int start, int end) {
    double sum = 0.0;
    for (int i = start; i < end; i++) 
        sum += x[i] * x[i];
    return sum;
}

double magnitude(const double* x, int n, int numThreads) {
    if (n <= 0)
        return 0.0;

    if (numThreads <= 1) {
        return std::sqrt(getMagnitude(x, 0, n));
    }

    // Cap threads to avoid creating more threads than work items.
    if (numThreads > n)
        numThreads = n;

    const int chunk = (n + numThreads - 1) / numThreads;

    std::vector<double> partial((size_t)numThreads, 0.0);
    std::vector<std::thread> threads;
    threads.reserve((size_t)numThreads);

    for (int t = 0; t < numThreads; t++) {
        const int start = t * chunk;
        const int end = std::min(n, start + chunk);
        threads.emplace_back([&, t, start, end]() {
            partial[(size_t)t] = getMagnitude(x, start, end);
        });
    }

    for (auto &th : threads)
        th.join();

    double sum = 0.0;
    for (double s : partial)
        sum += s;

    return std::sqrt(sum);
}


int main(int argc, char* argv[]) {
    Version version;
    version();
    if (argc != 3) {
        std::cerr << argv[0] << ": invalid number of arguments\n";
        std::cerr << "Usage: " << argv[0] << "  <no_of_elements> <numThreads>\n";
        return 1;
    }
    int n = std::atoi(argv[1]); // number of elements in a
    int numThreads = std::atoi(argv[2]);
    if(n <= 0){
        std::cerr << "n must be positive\n";
        return 1;
    }
    if (numThreads <= 0) {
        std::cerr << "numThreads must be positive\n";
        return 1;
    }
    steady_clock::time_point ts, te;

    // allocate memory
    ts = steady_clock::now();
    double* a = new double[n];

    // populate vector a
    for (int i = 0; i < n; i++)
        a[i] = 1.0;
    te = steady_clock::now();
    reportTime(" - allocation and initialization", te - ts);

    // determine magnitude
    ts = steady_clock::now();
    double length = magnitude(a, n, numThreads);
    te = steady_clock::now();
    reportTime(" - magnitude calculation", te - ts);

    // display result
    std::cout << "Magnitude of a[" << n << "] = " << length  <<  std::endl;

    // deallocate host memory
    delete [] a;
}
