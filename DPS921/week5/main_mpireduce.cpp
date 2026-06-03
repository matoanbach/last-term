#include <mpi.h>
#include <iostream>
/*
MPI_Reduce
- sum
- mul
- max
- min
*/


int main(int argc, char* argv[])
{
    MPI_Init(&argc, &argv);

    int rank,size;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    int local_value = rank+1;

    // sum, mul, max, min
    int global_sum = 0;
    MPI_Reduce(
        &local_value, 
        &global_sum,
        1,
        MPI_INT,
        MPI_MAX,           // operation (sum)
        0, // root process
        MPI_COMM_WORLD
    );

    if(rank == 0){
        std::cout << "Global sum = "
            << global_sum << std::endl;
    }

    std::cout << "Rank " << rank << " local value = " << local_value 
        << std::endl;

    MPI_Finalize();

    return 0;
}

int main2(int argc, char* argv[]){
    MPI_Init(&argc, &argv);

    int rank, size;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    int local_value = rank + 1;

    // sum, mul, max, min
    int global_sum = 0;
    MPI_Reduce(
        &local_value,
        &global_sum,
        1,
        MPI_INT,
        MPI_MAX,
        0,
        MPI_COMM_WORLD
    );

    if (rank == 0) {
        std::cout << "Global sum = " << global_sum << std::endl;
    }

    std::cout << "Rank " << rank << " local value = " << local_value << std::endl;

    MPI_Finalize();
}