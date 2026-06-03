#include <mpi.h>
#include <iostream>
/*
Scatter

P0[1,2,3,4,5,6,7,8]

p1    p2     p3    p4
[1,2] [3,4] [5,6]  [7,8]

Gather

P0[]


*/


int main(int argc, char* argv[])
{
    MPI_Init(&argc, &argv);

    int rank,size;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    // Request object tracks the non-blocking operation
    MPI_Request request;

    int sendbuf[8];
    int recvbuf[2];

    if(rank == 0)
    {
        sendbuf[0] = 10;
        sendbuf[1] = 20;
        sendbuf[2] = 30;
        sendbuf[3] = 40;
        sendbuf[4] = 50;
        sendbuf[5] = 60;
        sendbuf[6] = 70;
        sendbuf[7] = 80;
 
        std::cout << "Root scattering data..\n";
    }

    MPI_Scatter(
        sendbuf ,
        2,
        MPI_INT,
        recvbuf,
        2,
        MPI_INT,
        0, //    root process
        MPI_COMM_WORLD
    );

    std::cout << "Rank " << rank << " received " << recvbuf[0] 
        << " " << recvbuf[1] << std::endl;
    recvbuf[0]+=2;
    recvbuf[1]+=2;

    int gatherbuf[8];

    MPI_Gather(
        recvbuf,
        2,
        MPI_INT,
        gatherbuf,
        2,
        MPI_INT,
        0,
        MPI_COMM_WORLD
    );

    if(rank == 0){
        std::cout << "Root gathered: " << size;
        for(int i=0; i<size*2; i++)
            std::cout << gatherbuf[i] << " ";
        std::cout << std::endl;
    }

    MPI_Finalize();
}