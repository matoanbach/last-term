// Compilation: nvcc -o Week8_Thrust3_ex9 Week8_Thrust3_ex9.cu

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

	thrust::device_vector<int> B(2);
	thrust::host_vector<int> C(5);

	B[0] = 20;
	B[1] = 30;


	//thrust::device_vector<int> dv = hv;

	thrust::device_vector<int> op(5,0);

	thrust::device_vector<int> map{ 2,4 };

	//thrust::inclusive_scan(B.begin(), B.end(), op.begin());
	thrust::scatter(B.begin(), B.end(), map.begin(), op.begin());

	// thrust::gather(map.begin(), map.end(), B.begin(), op.begin());
	C = op;

	for (int i = 0; i < C.size(); i++)
		std::cout << C[i] << " ";
	std::cout << std::endl;





	return 0;
}
