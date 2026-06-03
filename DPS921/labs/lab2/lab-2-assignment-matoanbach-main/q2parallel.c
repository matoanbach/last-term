// Discretize the elements of an array using MPI collectives.
// Original kernel: Chris Szalwinski, revised for Lab 2 MPI assignment.

#include <math.h>
#include <mpi.h>
#include <stdio.h>
#include <stdlib.h>

void reportTime(const char* msg, int rank, double span) {
    printf("Process %d: %-12s took %.6lf seconds\n", rank, msg, span);
}

void discretize(float* data, int n) {
    for (int i = 0; i < n; i++) {
        data[i] = (pow(sin(data[i]), cos(data[i])) +
                   pow(cos(data[i]), sin(data[i]))) / 2.0f;
    }
}

int main(int argc, char** argv) {
    MPI_Init(&argc, &argv);

    int rank = 0;
    int np = 0;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &np);

    if (argc != 2) {
        if (rank == 0) {
            fprintf(stderr, "Usage: %s <no_of_elements>\n", argv[0]);
        }
        MPI_Finalize();
        return 1;
    }

    int n = atoi(argv[1]);
    if (n <= 0) {
        if (rank == 0) {
            fprintf(stderr, "n must be positive\n");
        }
        MPI_Finalize();
        return 1;
    }
    if (n < np) {
        if (rank == 0) {
            fprintf(stderr, "n must be at least the number of MPI processes\n");
        }
        MPI_Finalize();
        return 1;
    }

    int nPerProcess = n / np;
    n = nPerProcess * np;

    float* data = NULL;
    float* local = (float*)malloc((size_t)nPerProcess * sizeof(float));
    if (local == NULL) {
        fprintf(stderr, "Process %d: failed to allocate local buffer\n", rank);
        MPI_Abort(MPI_COMM_WORLD, 1);
    }

    MPI_Barrier(MPI_COMM_WORLD);
    double global_start = MPI_Wtime();

    if (rank == 0) {
        data = (float*)malloc((size_t)n * sizeof(float));
        if (data == NULL) {
            fprintf(stderr, "Process 0: failed to allocate input buffer\n");
            MPI_Abort(MPI_COMM_WORLD, 1);
        }

        srand(1);
        for (int i = 0; i < n; i++) {
            data[i] = (float)rand() / (float)RAND_MAX;
        }
    }

    MPI_Scatter(data, nPerProcess, MPI_FLOAT,
                local, nPerProcess, MPI_FLOAT,
                0, MPI_COMM_WORLD);

    double local_start = MPI_Wtime();
    discretize(local, nPerProcess);

    int local_zeros = 0;
    for (int i = 0; i < nPerProcess; i++) {
        if (local[i] < 0.707f) {
            local_zeros++;
        }
    }
    double local_time = MPI_Wtime() - local_start;

    int global_zeros = 0;
    MPI_Reduce(&local_zeros, &global_zeros, 1, MPI_INT, MPI_SUM, 0, MPI_COMM_WORLD);

    double* all_times = NULL;
    if (rank == 0) {
        all_times = (double*)malloc((size_t)np * sizeof(double));
        if (all_times == NULL) {
            fprintf(stderr, "Process 0: failed to allocate timing buffer\n");
            MPI_Abort(MPI_COMM_WORLD, 1);
        }
    }

    MPI_Gather(&local_time, 1, MPI_DOUBLE,
               all_times, 1, MPI_DOUBLE,
               0, MPI_COMM_WORLD);

    MPI_Barrier(MPI_COMM_WORLD);
    double global_time = MPI_Wtime() - global_start;

    if (rank == 0) {
        printf("parallel wall time - took - %.6lf seconds\n", global_time);

        double total_work_time = 0.0;
        for (int i = 0; i < np; i++) {
            reportTime("Conversion", i, all_times[i]);
            total_work_time += all_times[i];
        }
        printf("total process work time - took - %.6lf seconds\n", total_work_time);
        printf("Result: %d = %d (0s) + %d (1s)\n", n, global_zeros, n - global_zeros);

        free(data);
        free(all_times);
    }

    free(local);
    MPI_Finalize();
    return 0;
}
