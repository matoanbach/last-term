// -----------------------------------------------------
// Guided Lab Session - Week 2
// Parallel Performance Measurement (pthreads)
// -----------------------------------------------------

#include <iostream>
#include <vector>
#include <chrono>
#include <cstdlib>
#include <cmath>
#include <algorithm>
#include <pthread.h>

using namespace std;
using namespace chrono;

struct ThreadArgs {
    const vector<double>* a;
    size_t start;
    size_t end;
    double* out;
};

static void* processChunk(void* p) {
    ThreadArgs* args = (ThreadArgs*)p;
    const vector<double>& arr = *args->a;
    double local = 0.0;
    for (size_t i = args->start; i < args->end; i++) {
        double x = arr[i];
        double transformed =
            (x * 0.5) +
            (x * x * 0.1) +
            (sin(x) * 0.01);
        local += transformed;
    }
    *args->out = local;
    return 0;
}

/*
// -----------------------------------------------------
// Workload: transform + reduce (SEQUENTIAL - old version)
// -----------------------------------------------------
double processArray(const vector<double>& a) {
    double sum = 0.0;

    for (size_t i = 0; i < a.size(); i++) {

        // Simple compute-heavy transformation
        double x = a[i];

        double transformed =
            (x * 0.5) +
            (x * x * 0.1) +
            (sin(x) * 0.01);

        sum += transformed;
    }

    return sum;
}

// -----------------------------------------------------
// Timing helper (SEQUENTIAL - old version)
// -----------------------------------------------------
long long measure(const vector<double>& a, int runs) {

    // volatile prevents aggresive compiler optimization
    volatile double result = 0.0;

    auto start = high_resolution_clock::now();

    for (int i = 0; i < runs; i++) {
        result = processArray(a);
    }

    auto end = high_resolution_clock::now();

    cout << "Last result: " << result << endl;

    return duration_cast<milliseconds>(end - start).count();
}
*/

// -----------------------------------------------------
// Workload: transform + reduce (PARALLEL)
// -----------------------------------------------------
double processArrayParallel(const vector<double>& a, int numThreads) {
    if (a.empty())
        return 0.0;

    if (numThreads <= 1) {
        double sum = 0.0;
        for (size_t i = 0; i < a.size(); i++) {
            double x = a[i];
            double transformed =
                (x * 0.5) +
                (x * x * 0.1) +
                (sin(x) * 0.01);
            sum += transformed;
        }
        return sum;
    }

    // Cap threads to avoid creating more threads than work items.
    if ((size_t)numThreads > a.size())
        numThreads = (int)a.size();

    vector<double> partial((size_t)numThreads, 0.0);
    vector<pthread_t> threads((size_t)numThreads);
    vector<ThreadArgs> args((size_t)numThreads);

    const size_t n = a.size();
    const size_t chunkSize = (n + (size_t)numThreads - 1) / (size_t)numThreads;

    for (int t = 0; t < numThreads; t++) {
        const size_t start = (size_t)t * chunkSize;
        const size_t end = min(n, start + chunkSize);

        args[(size_t)t].a = &a;
        args[(size_t)t].start = start;
        args[(size_t)t].end = end;
        args[(size_t)t].out = &partial[(size_t)t];

        pthread_create(&threads[(size_t)t], 0, processChunk, &args[(size_t)t]);
    }

    for (int t = 0; t < numThreads; t++)
        pthread_join(threads[(size_t)t], 0);

    double sum = 0.0;
    for (size_t t = 0; t < (size_t)numThreads; t++)
        sum += partial[t];

    return sum;
}

// -----------------------------------------------------
// Timing helper (PARALLEL)
// -----------------------------------------------------
long long measureParallel(const vector<double>& a, int runs, int numThreads) {

    // volatile prevents aggresive compiler optimization
    volatile double result = 0.0;

    high_resolution_clock::time_point start = high_resolution_clock::now();

    for (int i = 0; i < runs; i++) {
        result = processArrayParallel(a, numThreads);
    }

    high_resolution_clock::time_point end = high_resolution_clock::now();

    cout << "Last result: " << result << endl;

    return duration_cast<milliseconds>(end - start).count();
}

// -----------------------------------------------------
// Main
// -----------------------------------------------------
int main(int argc, char* argv[]) {

    if (argc != 3) {
        cerr << "Usage: " << argv[0] << " <n> <numThreads>\n";
        return 1;
    }

    int n = atoi(argv[1]);
    int numThreads = atoi(argv[2]);

    if (n <= 0) {
        cerr << "Error: n must be positive\n";
        return 1;
    }
    if (numThreads <= 0) {
        cerr << "Error: numThreads must be positive\n";
        return 1;
    }

    // Create input array
    vector<double> a(n);

    // Initialize input values
    for (int i = 0; i < n; i++) {
        a[i] = static_cast<double>(i % 100);
    }

    int runs = 3;

    cout << "n = " << n << endl;
    cout << "threads = " << numThreads << endl;
    cout << "runs = " << runs << endl;

    long long time_ms = measureParallel(a, runs, numThreads);

    cout << "Total time: " << time_ms << " ms" << endl;
    cout << "Avg time: " << static_cast<double>(time_ms) / runs << " ms" << endl;

    return 0;
}
