#include <mpi.h>
#include <iostream>

// MPI_Alltoall


int main(int argc, char* argv[])
{
    MPI_Init(&argc, &argv);

    int rank,size;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    int sendbuf[4]; // 0 index value -> rank 0
                // 1 index value -> rank 1
                // ....
    int recvbuf[4];

    for(int i=0; i<4; i++)
    {
        sendbuf[i] = rank *10 + i; 
    }

    std::cout << " Rank " << rank << " sent: ";
    for(int i=0; i<size; i++){
        std::cout << sendbuf[i] << " ";
    }
    std::cout << std::endl;


    MPI_Alltoall(
        sendbuf,
        1,
        MPI_INT,
        recvbuf,
        1,
        MPI_INT,
        MPI_COMM_WORLD
    );




    std::cout << " Rank " << rank << " received: ";
    for(int i=0; i<size; i++){
        std::cout << recvbuf[i] << " ";
    }
    std::cout << std::endl;


    MPI_Finalize();

    return 0;
}

int main2(int argc, char* argv[]) {
    MPI_Init(&argc, &argv);

    int rank, size;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    int sendbug[4];
    int recvbuf[4];

    for (int i = 0; i < 4; i++)
    {
        sendbuf[i] = rank * 10 + i;
    }
    
    std::cout << " Rank " << rank << " sent: ";
    for (int i = 0; i < size; i++)
    {
        std::cout << sendbuf[i] << " ";
    }
    std::cout << std::endl;

    MPI_Alltoall(
        sendbuf,
        1,
        MPI_INT,
        recvbuf,
        1,
        MPI_INT,
        MPI_COMM_WORLD
    )
    
    std::cout << " Rank " << rank << " received: ";
    for (int i = 0; i < size; i++)
    {
        std::cout << recvbuf[i] << "  ";
    }
    std::cout << std::endl;

    return 0;
}