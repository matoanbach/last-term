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

	A[0] = 7;
	A[1] = 9;
	A[2] = 4;
	A[3] = 2;
	A[4] = 5;

    auto iterator = thrust::find(A.begin(), A.end(), 0);
    if (iterator != A.end()) {
        std::cout << "Found at index: " << iterator - A.begin() << std::endl;
    }
    return 0;
}