// Compilation: nvcc -o Week8_Thrust3_ex6 Week8_Thrust3_ex6.cu

#include <algorithm>
#include <vector>
#include <iostream>
#include <thrust/host_vector.h>
#include <thrust/device_vector.h>
#include <thrust/binary_search.h>
// Reduction
// - sum
// - minimum
// - maximum
// - average
// - count, etc. 
// 1. Host-vector reduction
// 2. Device-vector reduction

/*

*/


int main() {

	thrust::host_vector<int> A(5);
	thrust::device_vector<int> B(5);
	thrust::host_vector<int> C(5);

	A[0] = 2;
	A[1] = 4;
	A[2] = 5;
	A[3] = 9;
	A[4] = 11;
	B[0] = 20;
	B[1] = 30;
	B[2] = 45;
	B[3] = 60;
	B[4] = 55;

	int sum = 0;
	for (int i = 0; i < 5; i++)
		sum += A[i];

	//thrust::device_vector<int> dv = hv;

	sum = thrust::reduce(A.begin(), A.end(), 0, thrust::plus<int>());

	std::cout << "Sum: " << sum << std::endl;


	//hv = dv;


	for (int i = 0; i < A.size(); i++)
		std::cout << A[i] << " ";
	std::cout << std::endl;





	return 0;
}
