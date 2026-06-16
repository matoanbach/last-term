#include <cuda_runtime.h>

// Kernel function 
__global__
void add(int *A, int * B, int* C, int N){
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    if(i < N)
        C[i] = A[i] + B[i];
}


__host__ 
void process(int* Arr, int* Brr, int* Crr, int N){

    int* d_A, *d_B, *d_C;

    int size = 5 * sizeof(int);


        // allocate memory in device
    cudaMalloc((void**)&d_A,size);
    cudaMalloc((void**)&d_B,size);
    cudaMalloc((void**)&d_C,size);

    // copy data in device memory
    cudaMemcpy(d_A,Arr,size,cudaMemcpyHostToDevice);
    cudaMemcpy(d_B,Brr,size,cudaMemcpyHostToDevice);
    
    // have instructions to do computation in device
    //  launch kernel 
    add<<<1,256>>>(d_A, d_B,d_C,N);
        // make number of threads per block to be equal to 
        //  integer multiple of 32. 

    cudaMemcpy(Crr, d_C, size, cudaMemcpyDeviceToHost);

    cudaFree(d_A);
    cudaFree(d_B);
    cudaFree(d_C);   

}