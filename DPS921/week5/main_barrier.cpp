#include <mpi.h>
#include <iostream>

int main(int argc, char* argv[]){

    /*
    process 0 ----|
    process 1 ----|---- MPI_Barrier  --> continue together
    process 2 ----|
    process 3 ----|
      
    
    */

    // Explore yourself... 

    MPI_Init(&argc, &argv);

    int rank;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);

    std::cout << "Rank " << rank << " before barrier " << std::endl;

    MPI_Barrier(MPI_COMM_WORLD);
    
    std::cout << "Rank " << rank << " after barrier " << std::endl;

    MPI_Barrier();

    return 0;
}