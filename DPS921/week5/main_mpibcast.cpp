#include <mpi.h>
#include <iostream>
/*
Broadcast

*/


int main(int argc, char* argv[])
{
    MPI_Init(&argc, &argv);

    int rank,size;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    int sendbuf[5];

    if(rank == 0)
    {
        sendbuf[0] = 10;
        sendbuf[1] = 20;
        sendbuf[2] = 30;
        sendbuf[3] = 40;
        sendbuf[4] = 50;
 
        std::cout << "Rank 0 will broadcast..\n";
    }
    std::cout << "(before)Rank  " << rank << " received ";
    for(int i=0; i<5; i++)
        std::cout << sendbuf[i] << " ";
    std::cout << std::endl;

    MPI_Bcast(
        sendbuf ,
        5,
        MPI_INT,
        0, //    root process
        MPI_COMM_WORLD
    );

    std::cout << "Rank  " << rank << " received ";
    for(int i=0; i<5; i++)
        std::cout << sendbuf[i] << " ";
    std::cout << std::endl;

    MPI_Finalize();
}

int main2(int argc, char* argv[]) {
    MPI_Init(&argc, &argv);

    int rank, size;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    int sendbuf[5];
    if (rank == 0)
    {
        sendbuf[0] = 10;
        sendbuf[0] = 20;
        sendbuf[0] = 30;
        sendbuf[0] = 40;
        sendbuf[0] = 50;

        std::cout << "Rank 0 will broadcass..\n";
    }
    std::cout << "(before)Rank " << rank << " received ";
    for (int i = 0; i < 5; i++)
    {
        std::cout << sendbuf[i] << "  ";
    }
    std::cout << std::endl;
    
    MPI_Bcast(
        sendbuf,
        5,
        MPI_INT,
        0,
        MPI_COMM_WORLD
    );

    std::cout << "Rank " << rank << " received ";
    for (int i = 0; i < 5; i++)
    {
        std::cout << sendbuf[i] << "  ";
    }
    std::cout << std::endl; 
   
    MPI_Finalize();
}