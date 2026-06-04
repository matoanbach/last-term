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
            std::cerr << "Usage: mpirun -np <p> ./part2_scatter_gather <n>, where n > 0 and n % p == 0\n";
        MPI_Finalize();
        return 1;
    }

    const int chunkSize = n / size;
    std::vector<int> local((size_t)chunkSize);
    std::vector<int> data;
    std::vector<int> result;

    if (rank == 0) {
        data.resize((size_t)n);
        result.resize((size_t)n);
        for (int i = 0; i < n; i++)
            data[(size_t)i] = (i + 1) * 10;
    }

    MPI_Scatter(rank == 0 ? data.data() : nullptr,
                chunkSize,
                MPI_INT,
                local.data(),
                chunkSize,
                MPI_INT,
                0,
                MPI_COMM_WORLD);

    printChunk("received", rank, local);

    for (int& value : local)
        value += 1;

    printChunk("processed", rank, local);

    MPI_Gather(local.data(),
               chunkSize,
               MPI_INT,
               rank == 0 ? result.data() : nullptr,
               chunkSize,
               MPI_INT,
               0,
               MPI_COMM_WORLD);

    if (rank == 0) {
        std::cout << "Root gathered result:";
        for (int value : result)
            std::cout << ' ' << value;
        std::cout << '\n';
    }

    MPI_Finalize();
    return 0;
}
