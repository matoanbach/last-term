// compilation: nvcc -o Week8_Thrust3_ex2 Week8_Thrust3_ex2.cu --extended-lambda
// Thrust trnsform ( similar to STL transform)
#include <algorithm>
#include <vector>
#include <iostream>
#include <thrust/host_vector.h>
#include <thrust/device_vector.h>

/*
__global__
void vecAdd(int* A, int* B, int* C, int N) {
	int index = ....;
	if (index < N)
		C[i] = A[i] * B[i];
}
*/

int main() {
    std::vector<int> v{1, 2, 3, 4, 5}
    thrust::host_vector<int> hv(5);
    for (int i = 0; i < 5; i++)
        hv[i] = i + 1;

    thrust::device_vector<int> dv = hv;

    thrust::transform(dv.begin(), dv.end(), dv.begin(), [] __host__ __device__ (int i) {
        return x * x;
    });

    hv = dv;

    for (int i = 0; i < 5; i++)
        std::cout << hv[i] << " ";
    std::cout << std::endl;
}