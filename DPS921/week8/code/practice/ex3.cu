// Compilation: nvcc -o Week8_Thrust3_ex3 Week8_Thrust3_ex3.cu
// STL transform

#include <algorithm>
#include <vector>
#include <iostream>
#include <thrust/host_vector.h>
#include <thrust/device_vector.h>

int main(A {
	thrust::host_vector<int> A(5);
	thrust::host_vector<int> B(5);
	thrust::host_vector<int> C(5);

	A[0] = 1;
	A[1] = 2;
	A[2] = 3;
	A[3] = 4;
	A[4] = 5;
	B[0] = 10;
	B[1] = 20;
	B[2] = 30;
	B[3] = 40;
	B[4] = 50;

    
    thrust::transform(A.begin(), A.end(), B.begin(), C.begin(), thrust::plus<int>());


})