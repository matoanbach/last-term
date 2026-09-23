# Week 8 - Thrust - high-level GPU programming
- Question 1: Given an unsorted array of integers stored in a thrust::device_vector, write a program that:
```
Sorts the array in ascending order using thrust::sort.
Searches for a target value using thrust::binary_search.
Uses thrust::copy_if to create a new vector containing only the even numbers.
Prints the sorted array, whether the target was found, and the filtered even numbers.
Input example

Array: 7, 2, 9, 4, 1, 8, 6

Target value: 4

Requirements

Use only Thrust algorithms.
Do not use manual loops for sorting or filtering.
Store the filtered result in a separate thrust::device_vector.
```
- Answer
```cpp

struct IsEven {
    __host__ __device__ bool operator()(int x) const {
        return x % 2 == 0;
    }
};

int main() {
    int target = 4;

    thrust::device_vector<int> arr{7, 2, 9, 4, 1, 8, 6};
    thrust::device_vector<int> ouput(arr.size());

    thrust::sort(arr.begin(), arr.end());
    auto found = thrust::binary_search(arr.begin(), arr.end(), target);

    thrust::copy_if(arr.begin(), arr.end(), output.begin(), IsEven())

    if (found) {
        for(int i = 0; i < 10; i++)  {
            cout << arr[i] << endl;
        }
    }

    thrust::host_vector<int> sorted = arr;
    thrust::host_vector<int> evens = output;

    return 0;
}
```

- Question 2: Write a CUDA C++ program using Thrust that generates a sequence of integers from 1 to N without explicitly storing the input sequence in a separate array. Then:
```
Use a thrust::counting_iterator to generate the values.
Compute the inclusive prefix-sum using thrust::inclusive_scan.
Execute the scan using the thrust::device execution policy.
Launch the scan asynchronously using a CUDA stream.
Synchronize the stream before printing the results.
Requirements

Use thrust::counting_iterator as the input range.
Store the scan result in a thrust::device_vector.
Use thrust::cuda::par.on(stream) for asynchronous execution.
Print the resulting prefix sums.
Expected output example (for N = 6)

Generated sequence: 1 2 3 4 5 6

Inclusive prefix sums: 1 3 6 10 15 21
```

- Answer
```cpp
int main() {
    int N = 10;
    thrust::counting_iterator<int> first(0);
    thrust::counting_iterator<int> last = first + N;

    cudaStream_t s1;
    cudaStreamCreate(&s1);
    
    thrust::device_vector<int> result(N);
    thrust::inclusive_scan(thrust::cuda::par.on(s1), thrust::device, first, last, result.begin());

    thrust::host_vector<int> output = result;
    // print the result here ...
    for(int value: output) {
        cout << value << endl;
    }

    cudaStreamSynchronize(s1);
    cudaStreamDestroy(s1);
}
```

# Week 9 - CUDA Memory and Optimization
- Question#1: Write a CUDA program that performs element-wise addition of two matrices of size M × N.
```
Your program should:

Allocate memory for the matrices.
Initialize the input matrices on the host.
Launch a CUDA kernel using an appropriate two-dimensional block and grid configuration.
Compute the matrix addition on the GPU.
Copy the result back to the host and verify the output.
Requirements

Use a 2D grid and 2D thread blocks.
Ensure the kernel correctly handles matrices whose dimensions are not exact multiples of the block dimensions.
```
- Answer
```cpp
__global__ void addMatrix(int *A, int *B, int *C) {
    __shared__ int sA[matrixSize];
    __shared__ int sB[matrixSize];

    int row = blockIdx.x * blockDim.x + threadIdx.x;
    int col = blockIdx.y * blockDim.y + threadIdx.y;

    if (row < M && col < N) {
        int index = row * cols + col;
        C[index] = sA[index] + sB[index];
    }
}
int main() {
    int M, N = 3;
    int matrixSize = M * N;
    int h_A[matrixSize] = {0,1,2,3,4,5,6,7,8}; 
    int h_B[matrixSize] = {0,1,2,3,4,5,6,7,8}; 
    int h_C[matrixSize];

    int *d_A, *d_B, *d_C;

    cudaMalloc(*d_A, matrixSize*sizeof(int));
    cudaMalloc(*d_B, matrixSize*sizeof(int));
    cudaMalloc(*d_C, matrixSize*sizeof(int));

    cudaMemcpy(d_A, h_A, matrixSize*sizeof(int), cudaMemcpyHostToDevice);
    cudaMemcpy(d_B, h_B, matrixSize*sizeof(int), cudaMemcpyHostToDevice);


    dim3 block(16, 16);
    dim3 grid(
        (N + block.x - 1) / block.x,
        (M + block.y - 1) / block.y
    );
    addMatrix<<<grid, block>>>(d_A, d_B, d_C);

    cudaMemcpy(h_C, d_C, matrixSize*sizeof(int), cudaMemcpyDeviceToHost);
    
    for (int i = 0; i < M; i++) {
        for (int j = 0; j < M; j++) {
            cout << h_C[i] << " - ";
        }
        cout << endl;
    }

    cudaFree(d_A);
    cudaFree(d_B);
    cudaFree(d_C);

    return 0;
}
```

- Question#2: The following CUDA kernel copies data from one array to another using only global memory.
```cpp
__global__ void copyKernel(int* input, int* output)
{
            int i = blockIdx.x * blockDim.x + threadIdx.x;
            output[i] = input[i];
}
```

```
Modify the kernel to use shared memory as an intermediate buffer before writing the results to global memory.

Requirements

Allocate shared memory within the kernel.
Synchronize threads appropriately.
Explain why this optimization may or may not improve performance for this particular operation.
```
- Answer
```cpp
__global__ void copyKernel(int* input, int* output)
{
    __shared__ int sInput[256];

    int globalIndex = blockIdx.x * blockDim.x + threadIdx.x; 
    int localIndex = threadIdx.x;

    sInput[localIndex] = input[globalIndex];

    __syncthreads();

    output[globalIndex] = sInput[localIndex];
}
```
- Shared memory helps when data is reused. It usually does not help when every value is read once and written once.

# Week 10 - OpenMP and preventing race conditions
- Question 1: Given an array of N integers, write an OpenMP program that manually partitions the array among the available threads.
```
Each thread should:
    Compute the sum of its assigned portion.
    Store the partial sum in a local variable.
    Print its thread ID and partial sum.
Do not use parallel for or reduction.
```
- Answer
```cpp
int main() {
    int arr[] = {1, 2, 3, 4, 5, 6, 7, 8};
    int N = 8;
    int globalSum = 0;
#pragma omp parallel
{
    int id = omp_get_thread_num();
    int threads = omp_get_num_threads();

    int chunk = N / threads;
    int start = id * chunk;
    int end = (id == threads - 1) ? N : start + chunk;

    int localSum = 0;
    for (int i = start; i < end; i++) {
        localSum += arr[i];
    }

#pragma omp critical
    globalSum += localSum;
}

    return 0;
}
```
- Question 2: The following code attempts to compute the sum of an array:
```cpp
int sum = 0;
#pragma omp parallel for
for(int i = 0; i < N; i++)
{
  sum += A[i];
}
```
Tasks:
1. Explain why this program may produce incorrect results.
- The program may produce incorrect results because all threads update the same shared variable.
2. Modify the program using OpenMP locking (or atomic) to eliminate the race condition. 
```cpp
int sum = 0;
#pragma omp parallel for
for(int i = 0; i < N; i++)
{
#pragma omp atomic
  sum += A[i];
}
```

# Week 11 - OpenMP - Loop Parallelism and Performance awareness
- Question 1: Consider the following code:
```cpp
for(int i = 1; i < N; i++)
{
  A[i] = A[i-1] + B[i];
}
```
Tasks:
1. Explain why this loop cannot be directly parallelized using: `#pragma omp parallel for`
    - The loop cannot use #pragma omp parallel for because each iteration depends on the previous one:
2. Identify the dependency between iterations.
    - Iteration i needs A[i-1], which is calculated by iteration i-1. Running them at the same time may use an unfinished value and produce incorrect results.
3. Suggest an alternative strategy to improve performance.
    - A better approach is a parallel prefix-sum (scan) algorithm, which computes the same result in parallel.

- Question 2: Given the matrix initialization code:
```cpp
for(int i = 0; i < N; i++)
{
  for(int j = 0; j < M; j++)
  {
    A[i][j] = i + j;
  }
}
```

- Answer 1:
```cpp
#pragma omp parallel for
for(int i = 0; i < N; i++)
{
  for(int j = 0; j < M; j++)
  {
    A[i][j] = i + j;
  }
}
```   

- Answer 2:
```cpp
#pragma omp parallel for collapse(2)
for(int i = 0; i < N; i++)
{
  for(int j = 0; j < M; j++)
  {
    A[i][j] = i + j;
  }
}
```
- Comparison:
    - Outer-loop parallelization is simpler and usually works well when `N` is large.
    - `collapse(2)` may perform better when `N` is small but `M` is large, because it creates more work to distribute among threads.
    - For large matrices, both may perform similarly.
    - Parallelizing only the outer loop may have slightly less scheduling overhead.