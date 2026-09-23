#include <iostream>
#include <thread>
#include <chrono>
#include <omp.h>

using namespace std;

int main() {
    omp_set_num_threads(4);
    cout << "Number of threads = " << omp_get_num_threads() << endl;

    #pragma omp parallel for schedule(static)
    for(int i=0;i<16;i++){
        int tid = omp_get_thread_num();

        int work = (i + 1) * 300;

        cout << "Thread " << tid
             << " starting iteration " << i
             << " (" << work << " ms)" << endl;

        this_thread::sleep_for(chrono::milliseconds(work))

        cout << "Thread " << tid
             << " finished iteration " << i << endl;
    }
}