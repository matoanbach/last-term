#include <cstdio>
#include <omp.h>

int main()
{
    #pragma omp parallel
    {
        int id = omp_get_thread_num();
        int total = omp_get_num_threads();

        std::printf("Hello from thread %d of %d\n", id, total);
    }

    return 0;
}
