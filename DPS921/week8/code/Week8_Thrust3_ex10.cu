// Compilatin: nvcc -o Week8_Thrust3_ex10 Week8_Thrust3_ex10.cu --extended-lambda

#include <algorithm>
#include <vector>
#include <iostream>
#include <thrust/host_vector.h>
#include <thrust/device_vector.h>
#include <thrust/iterator/counting_iterator.h>
#include <thrust/transform.h>

int main() {
	thrust::device_vector<int> B(2);
	thrust::host_vector<int> C(5);

	B[0] = 20;
	B[1] = 30;

	int N = 10;

	thrust::counting_iterator<int> first(0);
	thrust::counting_iterator<int> last = first + N;


	thrust::device_vector<int> op(N);


	thrust:transform(first, last, op.begin(), 
		[] __device__ __host__(int x) {
			return x * x;
		}
	)

	C = op;

	for (int i = 0; i < C.size(); i++)
		std::cout << C[i] << " ";
	std::cout << std::endl;





	return 0;
}
