// Compilation: nvcc -o Week8_Thrust3_ex7 Week8_Thrust3_ex7.cu
#include <algorithm>
#include <vector>
#include <iostream>
#include <thrust/host_vector.h>
#include <thrust/device_vector.h>
#include <thrust/scan.h>

/* Scan
x: [ 1,2,3,4,5 ]
y: [ 1,3,6,10,16 ] - Inclusive scan
y: [ 0,1,3,6,10 ] - Exclusive scan


*/
// Scan
// 1. Inclusive
// 2. Exclusive



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

	thrust::device_vector<int> op(5);

	//thrust::inclusive_scan(A.begin(), A.end(), op.begin());
	thrust::exclusive_scan(A.begin(), A.end(), op.begin());

	C = op;

	for (int i = 0; i < C.size(); i++)
		std::cout << C[i] << " ";
	std::cout << std::endl;





	return 0;
}
