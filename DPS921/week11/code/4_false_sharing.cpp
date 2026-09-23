#include <iostream>
#include <chrono>
#include <omp.h>

using namespace std;

struct Counter {
    int value;
    int padding[60];
}

int main() {
    Counter counter[4];
    auto start = chrono::high_resolution_clock::now();

    #pragma omp parallel num_threads(4)
    {
        int tid = omp_get_thread_num();

        for(long long i=0;i<5000000000;i++)
            counter[tid].value++;
    }

    auto end = chrono::high_resolution_clock::now();

    cout << chrono::duration<double>(end - start).count() << " sec\n";
}