[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/l11VAeYQ)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=24203018&assignment_repo_type=AssignmentRepo)
# Lab Activity 3 (5%)
## Due Date - Sunday July 12, 2025 (Late Policy: 10% per day)

## Learning Outcomes

- implement matrix multiplication using both sequential C++ and CUDA
- manage data movement between host and GPU memory
- optimize CUDA applications using shared memory
- utilize the Thrust library for GPU memory management
- evaluate the performance of CPU and GPU implementation using benchmarking techniques
- analyze and communicate performance results through graphical and written reports

## Environment Setup
Install the following compilers on your computer:
- [NVIDIA's CUDA Toolkit 12.4](https://developer.nvidia.com/cuda-12-4-0-download-archive)
The computers in the lab has it already installed. 


## Question 1: Sequential Matrix Multiplication (40%)
Create a sequential (CPU-only) implementation of matrix multiplication using the provided starter code (`question1.cpp`). This serves as the baseline implementation for later GPU-based optimizations.

Matrix multiplication is defined as:
$$
C = A \times B, \quad c_{ij}​= \sum_{k=1}^N a_{ik} b_{kj}​
$$
All matrices are stored in row-major order using 1D arrays.


### Requirements
- Accept the matrix size as a command line argument
- Use the provided code to
    - allocate memory
    - initialize matrices with random values
- Implement matrix multiplication using standard 3-loop C++ method
- Verify correctness using the correctness test function (`verifySample`)
- Measure and report the execution time of your implementation

### Output Requirements
Your program must print:
- Matrix size (N x N)
- CPU execution time (in milliseconds)
- Correctness result (PASS/FAIL)

### Constraints
- Do not use external libraries (e.g., Eigen, BLAS, cuBLAS)
- Do not perform any parallelism in this equation
- Use only standard C++ (loops and arrays)
- Floating-point comparisons are handled using the provided verification function

### Deliverables
- CPU source code (`.cpp`)
- Execution time for at least two different matrix sizes, **averaged over at least 5 runs**.
- Correctness verification output

**NOTE** Maintain your CPU implementation, as it will be extended in Question 2.

## Question 2: CUDA Matrix Multiplication (60%)
Starting from your solution to Question 1, modify your program to perform matrix multiplication on the GPU using CUDA. Preserve your CPU implementation so that it can be used to verify the correctness of the GPU results. You may create a new source file named `question2.cu` by copying your Question 1 solution and then extending it with CUDA functionality. 

### Part A - Basic CUDA Implementation
Implement a CUDA version using global memory.

#### Requirements
- Allocate device memory for the input and output matrices
- Copy the input matrices from host memory to device memory
- Implement a CUDA kernel that computes one output matrix element per thread
- Launch the kernel using a two-dimensional grid and block configuration
- Copy the resulting matrix back to host memory
- Synchronize the device after launching each kernel before measuring execution time or copying results back to the host
- Verify the correctness of the GPU results using your CPU implementation or the provided verification function
- Measure and report:
    - Kernel execution time (CUDA events only)
    - Total execution time (including memory transfers and allocation)

#### Verification 
For the verification use the matrix obtained through `matrixMultiplyCPU` from Question 1 as reference in the function:
```cpp
bool verify(float *ref, float *result, int N)
{
    for (int i = 0; i < N * N; i++)
    {
        if (fabs(ref[i] - result[i]) > 1e-3)
            return false;
    }
    return true;
}
```
   
**NOTE** **Kernel execution time** refers to time measured using CUDA events only for kernel execution, excluding memory transfers.

#### Kernel Requirements
Implement the following CUDA kernel:
```cpp
__global__
void matrixMultiplyBasicCUDA(float *A, float *B, float *C, int N);
```
The kernel must:
- Compute the row and column corresponding to the current thread
- Ensure that the computed row and column are within the matrix bounds
- Compute exactly one element of the output matrix `C`
- Store the computed value in the appropriate location in `C`

Launch the kernel using a two-dimensional grid and **two-dimensional thread blocks**.

**HINT** Use the built-in CUDA variables `blockIdx`, `blockDim`, and `threadIdx` to determine the row and column processed by each thread.

### Part B - CUDA Optimization
Create an optimized CUDA implementation using **shared memory tiling**.

#### Requirements
- Implement tiled matrix multiplication using shared memory
- Select an appropriate tile size
- You may assume a tile size of 16 × 16, or choose another tile size and justify your choice.
- Compare the performance of the tiled implementation with your basic CUDA implementation
- Briefly explain why shared memory improves performance

#### Shared Memory Kernel
Implement a second CUDA kernel (`matrixMultiplyTiledCUDA`) that performs matrix multiplication using shared memory tiling.

Your kernel should:
- Declare shared memory tiles for the input matrices.
- Cooperatively load matrix tiles into shared memory
- Synchronize threads before performing computations
- Compute one output matrix element per thread
- Repeat the process for all required tiles before writing the final result to global memory

### Kernel launch configuration
Both kernels can be launched using:
```cpp
dim3 block(16,16);

dim3 grid(
    (N + block.x - 1) / block.x,
    (N + block.y - 1) / block.y
);

matrixMultiplyBasicCUDA<<<grid,block>>>(d_A, d_B, d_C, N);

matrixMultiplyTiledCUDA<<<grid, block>>>(d_A, d_B, d_C, N);
```

### Deliverables
- Updated CUDA source code (`.cu`)
- Basic CUDA implementation
- Optimized CUDA Implementation using shared memory
- Timing results comparing:
    - CPU implementation (Question 1)
    - Basic CUDA implementation
    - Shared memory CUDA implementation
- Correctness verification
- A brief discussion comparing the performance of the two GPU implementations


## Question 3: Performance Analysis and Thrust - Optional bonus component (up to 15-25%, awarded based on completeness and correctness)

### Part A - Thrust Implementation
Modify your CUDA program to use Thrust for memory management. You may create a new source file named `question3.cu` if you attempt this optional extension.

#### Requirements
- Replace manual CUDA memory allocation and host-device transfers with Thrust containers.
    - thrust::host_vector
    - thrust::device_vector
- Use `thrust::raw_pointer_cast()` to obtain device pointers when launching CUDA kernels.
- The CUDA kernels from Question 2 remain unchanged. Only memory management and data transfer must be replaced using Thrust.
- Verify that the Thrust-based implementation produces the same output as previous CUDA versions.

### Part B - Performance Evaluation
Compare the performance of the following implementations
- Sequential CPU
- Basic CUDA
- Shared Memory CUDA
- CUDA with Thrust memory management

#### Test Cases
Use the following matrix sizes:
- 256 x 256 
- 512 x 512
- 1024 x 1024
- 2048 x 2048 (optional, for advanced testing)
#### Requirements
- Run each test five times
- Report the average execution time
- Clearly distinguish between:
    - kernel execution time 
    - total execution time 

**NOTE** Use the same definition of kernel execution time as in Question 2.

### Part C - Results and Discussion
Create graphs comparing:
- Execution time versus matrix size
- Speedup relative to the CPU implementation

Write a discussion (approximately 2-3 pages) addressing the following questions:
1. Which implementation performed the best?
2. How much speedup did the GPU achieve over the CPU?
3. Did shared memory improve performance? Explain why or why not
4. What overheads affect GPU execution time?
5. What advantages does Thrust provide compared to manual CUDA memory management?
6. Under what circumstances would you choose thrust over handwritten CUDA code?


The reports are to be submitted in a single file (Section 1 - Question 1, Section 2 - Question 2, Section 3 - Question 3 (optional)) on **Blackboard**.  Code, files containing the raw data collected and files used to generate visualizations should be uploaded to **your assigned GitHub repository**.

Note that you will explain your work in a discussion with the professor.  This discussion will be worth 25% of your grade.
