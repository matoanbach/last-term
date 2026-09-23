// Compilation: nvcc -o Week8_Thrust3_ex5 Week8_Thrust3_ex5.cu
// Sorting

#include <algorithm>
#include <vector>
#include <iostream>
#include <thrust/host_vector.h>
#include <thrust/device_vector.h>
#include <thrust/find.h>


int main() {

	thrust::host_vector<int> A(5);
	thrust::device_vector<int> B(5);
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


	//thrust::device_vector<int> dv = hv;

	auto iterator = thrust::find(A.begin(), A.end(), 6);
	
	if (iterator != A.end())
		std::cout << "Found at index: " << iterator - A.begin() << std::endl;
	else
		std::cout << "Not found" << std::endl;


	auto iterator2 = thrust::find(B.begin(), B.end(), 6);

	if (iterator2 != B.end())
		std::cout << "Found at index: " << iterator2 - B.begin() << std::endl;
	else
		std::cout << "Not found" << std::endl;




	//hv = dv;


	for (int i = 0; i < A.size(); i++)
		std::cout << A[i] << " ";
	std::cout << std::endl;





	return 0;
}