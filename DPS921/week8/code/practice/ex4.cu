// Compilation:  nvcc -o Week8_Thrust3_ex4 Week8_Thrust3_ex4.cu
// Sorting (ascending and descending)

#include <algorithm>
#include <vector>
#include <iostream>
#include <thrust/host_vector.h>
#include <thrust/device_vector.h>
#include <thrust/sort.h>


int main() {

	thrust::host_vector<int> A(5);
	thrust::host_vector<int> B(5);
	thrust::host_vector<int> C(5);

	A[0] = 7;
	A[1] = 9;
	A[2] = 4;
	A[3] = 2;
	A[4] = 5;
	B[0] = 40;
	B[1] = 30;
	B[2] = 50;
	B[3] = 20;
	B[4] = 45;

    thrust::sort(A.begin(), A.end());
    thrust::sort(A.begin(), A.end(), thrust::greater<int>())

    return 0;
}