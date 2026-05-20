// -----------------------------------------------------
// Guided Lab Session - Week 2
// Sequential Performance Measurement
// -----------------------------------------------------

#include <iostream>
#include <vector>
#include <chrono>
#include <cstdlib>
#include <cmath>

using namespace std;
using namespace chrono;

// -----------------------------------------------------
// Workload: transform + reduce
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
// Timing helper
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

// -----------------------------------------------------
// Main
// -----------------------------------------------------
int main(int argc, char* argv[]) {

    if (argc != 2) {
        cerr << "Usage: " << argv[0] << " <n>\n";
        return 1;
    }

    int n = atoi(argv[1]);

    if (n <= 0) {
        cerr << "Error: n must be positive\n";
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
    cout << "runs = " << runs << endl;

    long long time_ms = measure(a, runs);

    cout << "Total time: " << time_ms << " ms" << endl;
    cout << "Avg time: " << static_cast<double>(time_ms) / runs << " ms" << endl;

    return 0;
}