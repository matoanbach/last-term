// Compilation: nvcc -o Week8_Thrust3_ex1 Week8_Thrust3_ex1.cu

// Demonstrates host_vector, device_vector, and data transfer between 
// host and device. 
#include <iostream>
#include <thrust/host_vector.h>
#include <thrust/device_vector.h>

int main()
{
    thrust::host_vector<int> hv(5);
    for (int i = 0; i < 5; i++)
        hv[i] = i + 1;

    for (int i = 0; i < 5; i++)
        std::cout << hv[i] << " ";

    thrust::device_vector<int> dv;
    dv = hv;

    dv[2] += 100;

    hv = dv;

    for (int i = 0; i < 5; i++)
        std::cout << hv[i] << " ";
    std::cout << std::endl;

    return 0;
}

