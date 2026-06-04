#include <mpi.h>

#include <cstdlib>
#include <iostream>
#include <vector>

namespace {
void printChunk(const char* label, int rank, const std::vector<int>& values) {
    std::cout << "Rank " << rank << ' ' << label << ':';
    for (int value : values)
        std::cout << ' ' << value;
    std::cout << '\n';
}
} // namespace

int main(int argc, char** argv) {
    MPI_Init(&argc, &argv);

    int rank = 0;
    int size = 0;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    int n = 8;
    if (argc == 2)
        n = std::atoi(argv[1]);

    if (n <= 0 || n % size != 0) {
        if (rank == 0)
            std::cerr << "Usage: mpirun -np <p> ./part1_manual_send_recv <n>, where n > 0 and n % p == 0\n";
        MPI_Finalize();
        return 1;
    }

    const int chunkSize = n / size;
    std::vector<int> local((size_t)chunkSize);

    if (rank == 0) {
        std::vector<int> data((size_t)n);
        for (int i = 0; i < n; i++)
            data[(size_t)i] = (i + 1) * 10;

        for (int i = 0; i < chunkSize; i++)
            local[(size_t)i] = data[(size_t)i];

        for (int dest = 1; dest < size; dest++) {
            MPI_Send(data.data() + (size_t)dest * (size_t)chunkSize,
                     chunkSize,
                     MPI_INT,
                     dest,
                     0,
                     MPI_COMM_WORLD);
        }
    } else {
        MPI_Recv(local.data(), chunkSize, MPI_INT, 0, 0, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
    }

    printChunk("received", rank, local);

    for (int& value : local)
        value += 1;

    printChunk("processed", rank, local);

    if (rank == 0) {
        std::vector<int> result((size_t)n);
        for (int i = 0; i < chunkSize; i++)
            result[(size_t)i] = local[(size_t)i];

        for (int src = 1; src < size; src++) {
            MPI_Recv(result.data() + (size_t)src * (size_t)chunkSize,
                     chunkSize,
                     MPI_INT,
                     src,
                     1,
                     MPI_COMM_WORLD,
                     MPI_STATUS_IGNORE);
        }

        std::cout << "Root reconstructed result:";
        for (int value : result)
            std::cout << ' ' << value;
        std::cout << '\n';
    } else {
        MPI_Send(local.data(), chunkSize, MPI_INT, 0, 1, MPI_COMM_WORLD);
    }

    MPI_Finalize();
    return 0;
}
