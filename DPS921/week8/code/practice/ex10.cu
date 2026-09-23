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

    thrust::transform(first, last, op.begin(),
        [] __device__ __host__(int x) {
            return x * x;
        }
    )

    c = op

}