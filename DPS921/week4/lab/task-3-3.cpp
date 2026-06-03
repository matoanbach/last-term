#include <mpi.h>

#include <iostream>

int main(int argc, char** argv) {
    MPI_Init(&argc, &argv);

    int rank = 0;
    int size = 0;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    // Task 3.3 requires rank 0 -> rank 1 communication.
    if (size < 2) {
        if (rank == 0)
            std::cout << "Need at least 2 processes for Task 3.3 (rank 0 -> rank 1).\n";
        MPI_Finalize();
        return 0;
    }

    if (rank == 0) {
        int value = 42;
        MPI_Send(&value, 1, MPI_INT, 1, 0, MPI_COMM_WORLD);
        std::cout << "Rank 0 sent value " << value << " to rank 1\n";
    } else if (rank == 1) {
        int value = 0;
        MPI_Status status;
        MPI_Recv(&value, 1, MPI_INT, 0, 0, MPI_COMM_WORLD, &status);
        std::cout << "Rank 1 received value " << value << "\n";
    } else {
        // All other ranks print only their rank.
        std::cout << "Hello from rank " << rank << "\n";
    }

    MPI_Finalize();
    return 0;
}
