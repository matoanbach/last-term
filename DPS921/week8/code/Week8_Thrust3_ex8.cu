// Compilation: nvcc -o Week8_Thrust3_ex8 Week8_Thrust3_ex8.cu

#include <algorithm>
#include <vector>
#include <iostream>
#include <thrust/host_vector.h>
#include <thrust/device_vector.h>
#include <thrust/gather.h>

/* Scan
x: [ 1,2,3,4,5 ]

*/
// Gather
// y: [ 2, 4] - gather  
// Scatter
// z: [ , 2, , 4, ];



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

	thrust::device_vector<int> op(2);

	thrust::device_vector<int> map{ 2,3 };

	//thrust::inclusive_scan(B.begin(), B.end(), op.begin());
	thrust::gather(map.begin(), map.end(), B.begin(), op.begin());
	


	C = op;

	for (int i = 0; i < C.size(); i++)
		std::cout << C[i] << " ";
	std::cout << std::endl;





	return 0;
}
