# Week 6 Review — CUDA Fundamentals + Introduction to Thrust

**Agenda covered**

- **CUDA Topics**
  - 6.1 Introduction
  - 6.2 CUDA’s Programming Model
  - 6.3 CUDA’s Execution Model
  - 6.4 CUDA Compilation Process
  - 6.5 Putting Together a CUDA Project
- **Thrust Topics — Introduction Only**
  - 10.1 Introduction
  - 10.2 First Steps in Thrust

---

## How to use this review

Read this in this order:

1. Understand **why CUDA exists**: CPU vs GPU.
2. Memorize the **CUDA workflow**: allocate → copy → kernel → copy back → free.
3. Understand the **thread hierarchy**: grid → block → thread.
4. Memorize the **global thread index formula**.
5. Understand execution-performance basics: **SIMT, warps, warp divergence, occupancy**.
6. Know the role of **`nvcc`**, **PTX**, and project organization.
7. Understand why **Thrust** is easier than raw CUDA for common operations like sorting and reducing.

---

# 6.1 Introduction to CUDA

## What is CUDA?

**CUDA** stands for **Compute Unified Device Architecture**.

It is NVIDIA’s parallel computing platform that lets programmers use the **GPU** for general-purpose computing, not just graphics.

Simple idea:

```text
CUDA = C/C++ programming + GPU computing
```

A regular C/C++ program mostly runs on the **CPU**. With CUDA, the CPU can launch work onto the **GPU** for tasks that have a lot of parallel computation.

---

## CPU vs GPU

### CPU

A CPU usually has fewer but stronger cores.

Think:

```text
CPU = a few powerful workers
```

A CPU is good at:

- sequential logic
- branching decisions
- operating system tasks
- complex control flow
- tasks where each step depends on the previous step

Example:

```cpp
for (int i = 0; i < N; i++) {
    C[i] = A[i] + B[i];
}
```

On a CPU, the loop is usually thought of as processing elements one after another, although modern CPUs also have optimizations.

---

### GPU

A GPU has many smaller cores.

Think:

```text
GPU = thousands of smaller workers
```

A GPU is good at:

- doing the same operation on many pieces of data
- vector addition
- matrix operations
- image processing
- simulations
- machine learning workloads

Example:

```text
A and B have 1,000,000 elements.

CPU idea:
  add one element, then next, then next...

GPU idea:
  launch many threads so many additions happen at the same time
```

---

## When is CUDA useful?

CUDA is useful when the problem has **data parallelism**.

Data parallelism means:

> The same operation is applied to many independent data elements.

Examples:

- `C[i] = A[i] + B[i]`
- image filter applied to every pixel
- matrix multiplication
- neural network calculations
- scientific simulations
- financial risk calculations

CUDA is less useful when the program is mostly sequential or full of complex branches where each step depends on previous results.

---

# 6.2 CUDA’s Programming Model

## Host and Device

CUDA programs involve two main parts:

| Term | Meaning | Memory |
|---|---|---|
| **Host** | CPU side | System RAM |
| **Device** | GPU side | GPU/device memory |

Important point:

> CPU memory and GPU memory are separate. They do not automatically share the same data.

Data usually moves between them through the **PCIe bus**.

---

## Standard CUDA workflow

Most beginner CUDA programs follow this pattern:

```text
1. Allocate memory on the host
2. Allocate memory on the device
3. Copy input data from host to device
4. Launch a kernel on the GPU
5. Copy result data from device back to host
6. Free allocated memory
7. Display/use the result
```

Short version:

```text
allocate → copy to GPU → launch kernel → copy back → free
```

This is the main CUDA workflow you should memorize.

---

## What is a kernel?

A **kernel** is a function that runs on the GPU.

Example:

```cpp
__global__
void add(int* A, int* B, int* C, int N) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;

    if (i < N) {
        C[i] = A[i] + B[i];
    }
}
```

Important keyword:

```cpp
__global__
```

Meaning:

> This function is called from the CPU but executed on the GPU.

So a kernel is different from a normal C++ function because many GPU threads can execute it in parallel.

---

## Kernel launch syntax

CUDA uses triple angle brackets:

```cpp
add<<<1, 256>>>(d_A, d_B, d_C, N);
```

Meaning:

```text
1 block
256 threads per block
```

General form:

```cpp
kernelName<<<numberOfBlocks, threadsPerBlock>>>(arguments);
```

Example:

```cpp
add<<<100, 256>>>(d_A, d_B, d_C, N);
```

Total threads:

```text
100 blocks × 256 threads/block = 25,600 threads
```

---

## Thread hierarchy: grid, block, thread

CUDA organizes work in three levels:

```text
Grid
 ├── Block 0
 │    ├── Thread 0
 │    ├── Thread 1
 │    └── ...
 ├── Block 1
 │    ├── Thread 0
 │    ├── Thread 1
 │    └── ...
 └── ...
```

Analogy:

| CUDA term | Analogy |
|---|---|
| Grid | Company |
| Block | Department |
| Thread | Employee |

A **grid** contains blocks.  
A **block** contains threads.  
A **thread** performs the actual work.

---

## Important built-in variables

CUDA automatically gives each thread built-in variables:

| Variable | Meaning |
|---|---|
| `threadIdx.x` | Thread’s position inside its block |
| `blockIdx.x` | Block’s position inside the grid |
| `blockDim.x` | Number of threads per block |
| `gridDim.x` | Number of blocks in the grid |

You do not create these variables. CUDA provides them inside kernels.

---

## The global index formula

This is one of the most important formulas in introductory CUDA:

```cpp
int i = blockIdx.x * blockDim.x + threadIdx.x;
```

Meaning:

```text
global thread ID = block ID × block size + local thread ID
```

Why we need this:

- `threadIdx.x` restarts from 0 inside every block.
- So `threadIdx.x` alone is not unique across the whole grid.
- The formula creates a unique global index.

Example:

```text
blockIdx.x = 2
blockDim.x = 256
threadIdx.x = 10

i = 2 × 256 + 10
i = 522
```

So that thread works on element `522`:

```cpp
C[522] = A[522] + B[522];
```

---

## Why do we check `if (i < N)`?

In a kernel, we often write:

```cpp
if (i < N) {
    C[i] = A[i] + B[i];
}
```

This prevents out-of-range memory access.

Example:

```text
N = 1000 elements
threads launched = 1024

The last 24 threads do not have valid array elements.
```

Without the boundary check, those extra threads might access memory outside the array.

---

## CUDA memory functions

### `cudaMalloc`

Allocates memory on the GPU.

```cpp
cudaMalloc((void**)&d_A, size);
```

Meaning:

```text
Create space in GPU memory and store the device pointer in d_A.
```

---

### `cudaMemcpy`

Copies data between CPU and GPU.

Host to device:

```cpp
cudaMemcpy(d_A, h_A, size, cudaMemcpyHostToDevice);
```

Device to host:

```cpp
cudaMemcpy(h_C, d_C, size, cudaMemcpyDeviceToHost);
```

Remember:

```text
First argument  = destination
Second argument = source
```

---

### `cudaFree`

Frees memory on the GPU.

```cpp
cudaFree(d_A);
cudaFree(d_B);
cudaFree(d_C);
```

This prevents GPU memory leaks.

---

# Code walkthrough from your uploaded files

Your uploaded code is split into multiple files:

```text
main.cpp      -> CPU-side entry point
file.cu       -> CUDA kernel + process function
file_2.cpp    -> print helper function
main          -> compiled executable/binary
```

---

## `main.cpp`

Your `main.cpp` creates arrays on the host:

```cpp
int Arr[] = {1,2,3,4,5};
int Brr[] = {10,20,30,40,60};
int Crr[5];
```

Then it calls:

```cpp
process(Arr, Brr, Crr, 5);
print(Crr, 5);
```

So the high-level logic is:

```text
create input arrays → process with CUDA → print result
```

Expected result:

```text
1 + 10 = 11
2 + 20 = 22
3 + 30 = 33
4 + 40 = 44
5 + 60 = 65
```

So the final array should be:

```text
11 22 33 44 65
```

---

## `file.cu`

This file contains the GPU kernel:

```cpp
__global__
void add(int *A, int *B, int* C, int N) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;

    if (i < N) {
        C[i] = A[i] + B[i];
    }
}
```

Each GPU thread handles one array element.

It also contains the host-side `process` function:

```cpp
__host__
void process(int* Arr, int* Brr, int* Crr, int N) {
    int* d_A, *d_B, *d_C;

    int size = 5 * sizeof(int);

    cudaMalloc((void**)&d_A, size);
    cudaMalloc((void**)&d_B, size);
    cudaMalloc((void**)&d_C, size);

    cudaMemcpy(d_A, Arr, size, cudaMemcpyHostToDevice);
    cudaMemcpy(d_B, Brr, size, cudaMemcpyHostToDevice);

    add<<<1,256>>>(d_A, d_B, d_C, N);

    cudaMemcpy(Crr, d_C, size, cudaMemcpyDeviceToHost);

    cudaFree(d_A);
    cudaFree(d_B);
    cudaFree(d_C);
}
```

This is the CUDA workflow in code form:

```text
1. Create device pointers
2. Allocate device memory
3. Copy host arrays to GPU
4. Launch kernel
5. Copy result back to host
6. Free device memory
```

---

## Small correction/improvement in `file.cu`

Your code has:

```cpp
int size = 5 * sizeof(int);
```

This works only because the current arrays have 5 elements.

A more general version should use:

```cpp
int size = N * sizeof(int);
```

Better:

```cpp
size_t size = N * sizeof(int);
```

So the improved line is:

```cpp
size_t size = N * sizeof(int);
```

Why?

Because if `N` changes from 5 to 1000, the memory size should automatically change too.

---

## Useful improved CUDA pattern

A cleaner beginner version:

```cpp
__global__
void add(int* A, int* B, int* C, int N) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;

    if (i < N) {
        C[i] = A[i] + B[i];
    }
}

__host__
void process(int* Arr, int* Brr, int* Crr, int N) {
    int *d_A, *d_B, *d_C;
    size_t size = N * sizeof(int);

    cudaMalloc((void**)&d_A, size);
    cudaMalloc((void**)&d_B, size);
    cudaMalloc((void**)&d_C, size);

    cudaMemcpy(d_A, Arr, size, cudaMemcpyHostToDevice);
    cudaMemcpy(d_B, Brr, size, cudaMemcpyHostToDevice);

    int threadsPerBlock = 256;
    int blocks = (N + threadsPerBlock - 1) / threadsPerBlock;

    add<<<blocks, threadsPerBlock>>>(d_A, d_B, d_C, N);

    cudaDeviceSynchronize();

    cudaMemcpy(Crr, d_C, size, cudaMemcpyDeviceToHost);

    cudaFree(d_A);
    cudaFree(d_B);
    cudaFree(d_C);
}
```

Important formula:

```cpp
int blocks = (N + threadsPerBlock - 1) / threadsPerBlock;
```

This gives enough blocks to cover all `N` elements.

Example:

```text
N = 1000
threadsPerBlock = 256

blocks = (1000 + 256 - 1) / 256
blocks = 1255 / 256
blocks = 4
```

So this launches:

```text
4 × 256 = 1024 threads
```

The extra 24 threads are protected by:

```cpp
if (i < N)
```

---

# 6.3 CUDA’s Execution Model

## SIMT

CUDA uses **SIMT**, which stands for:

```text
Single Instruction, Multiple Threads
```

Meaning:

> Many threads execute the same instruction, but on different data.

Example:

```cpp
C[i] = A[i] + B[i];
```

Thread 0 does:

```cpp
C[0] = A[0] + B[0];
```

Thread 1 does:

```cpp
C[1] = A[1] + B[1];
```

Thread 2 does:

```cpp
C[2] = A[2] + B[2];
```

Same instruction, different data.

---

## Warps

A **warp** is a group of **32 threads**.

Important:

> The GPU does not mainly schedule individual threads. It schedules warps.

So when you launch threads, CUDA groups them into warps.

Example:

```cpp
add<<<1, 96>>>(d_A, d_B, d_C, N);
```

96 threads means:

```text
96 / 32 = 3 full warps
```

Example:

```cpp
add<<<1, 50>>>(d_A, d_B, d_C, N);
```

50 threads means:

```text
Warp 0: 32 useful threads
Warp 1: 18 useful threads + 14 unused lanes
```

So it is legal, but not ideal.

---

## Choosing block sizes

Because a warp has 32 threads, beginner-friendly block sizes are usually multiples of 32.

Good common choices:

```text
128, 256, 512
```

Avoid unusual sizes like:

```text
17, 43, 91
```

Reason:

> Unusual sizes may create partially filled warps and waste hardware resources.

For beginner CUDA code, `256` threads per block is often a good default.

Small note: your in-class notes list `265`, but this is likely a typo. It should be **256** because 256 is divisible by 32.

---

## Warp divergence

Warp divergence happens when threads in the same warp take different branches.

Example:

```cpp
if (x > 0) {
    doA();
} else {
    doB();
}
```

If some threads in the same warp go to `doA()` and others go to `doB()`, the GPU cannot run both paths at the exact same time for that warp.

Instead:

```text
1. Execute path A for the threads that need A
2. Execute path B for the threads that need B
```

This slows the warp down.

Analogy:

```text
A teacher has 32 students reading together.
If all students read the same page, it is efficient.
If half need chapter 1 and half need chapter 2,
the teacher must handle them separately.
```

---

## Independent blocks

CUDA blocks are designed to be independent.

One block should not depend on another block.

Why this matters:

### 1. Scalability

The same CUDA program can run on different GPU models.

```text
Small GPU: runs fewer blocks at the same time
Large GPU: runs more blocks at the same time
```

The code does not need to change.

### 2. Scheduling flexibility

The GPU scheduler can choose which block runs first.

As CUDA programmers:

```text
We specify the work.
The hardware decides how to schedule it efficiently.
```

Do not write beginner CUDA code that assumes block 0 finishes before block 1.

---

## GPU scheduler

The GPU scheduler decides:

- which blocks run
- which warps run
- when they run
- how to keep GPU resources busy

Your job is to write correct parallel work.  
The scheduler’s job is to decide execution order.

---

## Occupancy

Occupancy measures how full/busy the GPU is with active warps.

Correct basic idea:

```text
Occupancy = active warps / maximum possible active warps
```

Example:

```text
Active warps = 32
Maximum possible warps = 64

Occupancy = 32 / 64 = 0.5 = 50%
```

Important correction:

> In the in-class notes, the formula is written as maximum possible warps divided by active warps. That is likely reversed. Occupancy is normally active warps divided by maximum possible active warps.

Higher occupancy often helps performance because while one warp waits for memory, another warp can run.

But:

> Higher occupancy does not always guarantee higher performance.

It is a useful guideline, not an absolute rule.

---

# 6.4 CUDA Compilation Process

## Why CUDA needs a special compiler

A CUDA source file may contain both:

```text
CPU code / host code
GPU code / device code
```

Because there are two targets, CUDA uses a special compiler:

```text
nvcc = NVIDIA CUDA Compiler
```

---

## `.cu` files

CUDA source files usually use the extension:

```text
.cu
```

Example:

```text
main.cu
vector_add.cu
kernel.cu
```

A `.cu` file can contain:

- normal C/C++ host code
- CUDA device code
- kernel launch syntax like `<<< >>>`

---

## Compilation command

Typical command:

```bash
nvcc main.cu -o main
```

Meaning:

```text
nvcc       -> CUDA compiler
main.cu    -> source file
-o main    -> output executable named main
```

For your multi-file project, a possible command is:

```bash
nvcc main.cpp file.cu file_2.cpp -o main
```

This compiles:

- `main.cpp`
- `file.cu`
- `file_2.cpp`

and creates the executable:

```text
main
```

---

## What `nvcc` does behind the scenes

`nvcc` separates the program into different compilation paths:

```text
CUDA source file
      |
      v
    nvcc
      |
      |---- host code  -> CPU compilation path
      |
      |---- device code -> GPU compilation path
      |
      v
single executable
```

The final executable contains code needed for both the CPU and GPU side.

---

## PTX

**PTX** stands for:

```text
Parallel Thread Execution
```

PTX is an intermediate representation.

Think:

```text
CUDA C++ code → PTX → GPU machine code
```

PTX looks closer to assembly language than C++.

Example PTX-like operations:

```text
ld.global   -> load from global memory
add.f32     -> add two 32-bit floating-point values
st.global   -> store to global memory
```

As a beginner CUDA programmer, you usually do not write PTX manually.  
You write CUDA C++, and the compiler handles PTX generation.

---

# 6.5 Putting Together a CUDA Project

## Why organize a CUDA project?

A tiny demo can fit in one `.cu` file.

But real CUDA applications are usually organized into folders because they may include:

- CPU-side logic
- GPU kernels
- helper functions
- header files
- build files
- compiled objects/executables

---

## Typical CUDA project structure

A simple structure:

```text
cuda_project/
├── src/
│   └── main.cpp
├── kernels/
│   └── vector_add.cu
├── include/
│   └── vector_add.h
├── build/
└── Makefile
```

Meaning:

| Folder | Purpose |
|---|---|
| `src/` | Main application logic, often CPU/host-side code |
| `kernels/` | CUDA GPU kernels and device-related implementations |
| `include/` | Header files and function declarations |
| `build/` | Compiled binaries/object files |
| `Makefile` | Build instructions |

---

## Your uploaded project structure

Your current uploaded files are like a smaller version of this:

```text
project/
├── main.cpp
├── file.cu
├── file_2.cpp
└── main
```

Conceptually:

```text
main.cpp
  - starts the program
  - creates input arrays
  - calls process()
  - calls print()

file.cu
  - defines the add kernel
  - defines process()
  - manages CUDA memory and kernel launch

file_2.cpp
  - defines print()

main
  - compiled executable
```

---

## Important separation

In a CUDA project, it is useful to separate:

```text
Host code   -> CPU-side control logic
Device code -> GPU-side kernel computation
```

This makes projects easier to maintain.

---

# Thrust Topics — Introduction Only

# 10.1 Introduction to Thrust

## What is Thrust?

**Thrust** is a high-level C++ template library for CUDA.

It feels similar to the C++ Standard Template Library, also called STL.

Simple idea:

```text
Raw CUDA: you write kernels and manage low-level details.
Thrust: you use ready-made GPU algorithms.
```

---

## Why does Thrust exist?

Raw CUDA is powerful, but writing custom kernels for every operation can be repetitive.

For example, writing your own GPU sort or reduction is not beginner-friendly.

Thrust provides ready-made algorithms such as:

- `thrust::sort`
- `thrust::reduce`
- `thrust::transform`
- `thrust::copy`
- `thrust::fill`
- scans / prefix sums

Main benefits:

| Benefit | Meaning |
|---|---|
| Less code | Many operations can be written in one line |
| More readable | Focus on the operation, not thread indexing |
| Faster development | Common algorithms already exist |
| STL-like | Easier for C++ programmers to learn |

---

## Raw CUDA vs Thrust

### Raw CUDA

With raw CUDA, you often tell the GPU **how** to do the work.

You manage:

- device memory
- `cudaMalloc`
- `cudaMemcpy`
- kernels
- thread indexing
- block sizes
- synchronization
- memory cleanup

Example:

```cpp
add<<<blocks, threadsPerBlock>>>(d_A, d_B, d_C, N);
```

---

### Thrust

With Thrust, you often tell the GPU **what** work you want done.

Example:

```cpp
thrust::sort(vec.begin(), vec.end());
```

You do not manually write the sorting kernel.

Thrust handles the lower-level GPU details.

---

# 10.2 First Steps in Thrust

## Important headers

For a Thrust device vector:

```cpp
#include <thrust/device_vector.h>
```

For sorting:

```cpp
#include <thrust/sort.h>
```

For reduction:

```cpp
#include <thrust/reduce.h>
```

For printing with `printf`:

```cpp
#include <stdio.h>
```

---

## `thrust::device_vector`

A `thrust::device_vector` is like a `std::vector`, but it stores data in GPU memory.

CPU vector:

```cpp
std::vector<int> v(5);
```

GPU vector:

```cpp
thrust::device_vector<int> v(5);
```

Meaning:

```text
Create a vector of 5 integers in GPU memory.
```

---

## Thrust sorting example

```cpp
#include <stdio.h>
#include <thrust/device_vector.h>
#include <thrust/sort.h>

int main() {
    thrust::device_vector<int> v(5);

    v[0] = 10;
    v[1] = 5;
    v[2] = 8;
    v[3] = 2;
    v[4] = 1;

    thrust::sort(v.begin(), v.end());

    for (int i = 0; i < v.size(); i++) {
        printf("%d ", (int)v[i]);
    }

    printf("\n");

    return 0;
}
```

Expected output:

```text
1 2 5 8 10
```

Important idea:

```text
No custom kernel.
No manual cudaMalloc.
No manual cudaMemcpy.
No manual block size.
```

Thrust handles those details.

---

## Thrust reduction example

Reduction means combining many values into one value.

Example:

```text
1 + 2 + 5 + 8 + 10 = 26
```

Code:

```cpp
#include <stdio.h>
#include <thrust/device_vector.h>
#include <thrust/reduce.h>

int main() {
    thrust::device_vector<int> v(5);

    v[0] = 10;
    v[1] = 5;
    v[2] = 8;
    v[3] = 2;
    v[4] = 1;

    int sum = thrust::reduce(v.begin(), v.end());

    printf("Sum = %d\n", sum);

    return 0;
}
```

Expected output:

```text
Sum = 26
```

---

## Other Thrust functions to recognize

| Function | Purpose | Example idea |
|---|---|---|
| `thrust::sort` | Sort values | `[10,5,8] → [5,8,10]` |
| `thrust::reduce` | Combine values into one | `[1,2,3] → 6` |
| `thrust::transform` | Apply operation to each element | `x → x²` |
| `thrust::copy` | Copy between containers | device vector to host vector |
| `thrust::fill` | Fill with same value | all elements become `12` |
| `thrust::scan` | Prefix/cumulative sum | `[1,2,3,4] → [1,3,6,10]` |

---

# One-page cheat sheet

## CUDA vocabulary

| Term | Meaning |
|---|---|
| CUDA | NVIDIA platform for GPU computing |
| Host | CPU + system memory |
| Device | GPU + GPU memory |
| Kernel | Function that runs on GPU |
| Thread | Smallest execution unit |
| Block | Group of threads |
| Grid | Group of blocks |
| Warp | Group of 32 threads |
| SIMT | Single Instruction, Multiple Threads |
| `nvcc` | NVIDIA CUDA Compiler |
| PTX | Intermediate GPU representation |
| Thrust | High-level CUDA C++ library |

---

## Must-memorize CUDA workflow

```text
1. Allocate host memory
2. Allocate device memory: cudaMalloc
3. Copy host → device: cudaMemcpyHostToDevice
4. Launch kernel: kernel<<<blocks, threads>>>(...)
5. Copy device → host: cudaMemcpyDeviceToHost
6. Free memory: cudaFree
```

---

## Must-memorize formula

```cpp
int i = blockIdx.x * blockDim.x + threadIdx.x;
```

Purpose:

```text
Give each thread a unique global index.
```

---

## Must-know launch syntax

```cpp
kernel<<<numberOfBlocks, threadsPerBlock>>>(arguments);
```

Example:

```cpp
add<<<1, 256>>>(d_A, d_B, d_C, N);
```

Meaning:

```text
Launch 1 block with 256 threads.
```

---

## Must-know block calculation

```cpp
int threadsPerBlock = 256;
int blocks = (N + threadsPerBlock - 1) / threadsPerBlock;
```

Purpose:

```text
Launch enough threads to cover all N elements.
```

---

## Common mistakes

### Mistake 1: Forgetting boundary check

Bad:

```cpp
C[i] = A[i] + B[i];
```

Better:

```cpp
if (i < N) {
    C[i] = A[i] + B[i];
}
```

---

### Mistake 2: Hard-coding array size

Bad:

```cpp
int size = 5 * sizeof(int);
```

Better:

```cpp
size_t size = N * sizeof(int);
```

---

### Mistake 3: Choosing awkward block sizes

Not ideal:

```cpp
add<<<1, 43>>>(...);
```

Better beginner default:

```cpp
add<<<blocks, 256>>>(...);
```

---

### Mistake 4: Assuming blocks run in order

Bad assumption:

```text
Block 0 must finish before block 1.
```

Correct idea:

```text
The GPU scheduler decides block order.
Do not rely on block execution order.
```

---

### Mistake 5: Confusing host and device pointers

Host pointer:

```cpp
int* Arr;
```

Device pointer:

```cpp
int* d_A;
```

A device pointer points to GPU memory.  
A host pointer points to CPU memory.

---

# Practice questions

## Concept questions

1. What does CUDA stand for?
2. Why are GPUs useful for vector addition?
3. What is the difference between host and device?
4. Why do we need to copy data from host to device?
5. What is a kernel?
6. What does `__global__` mean?
7. What does `add<<<1,256>>>(...)` mean?
8. Why does `threadIdx.x` alone not give a globally unique thread ID?
9. What is the global index formula?
10. Why do we write `if (i < N)` inside the kernel?
11. What is a warp?
12. Why are block sizes like 128, 256, and 512 common?
13. What is warp divergence?
14. What does the GPU scheduler do?
15. What is occupancy?
16. What does `nvcc` do?
17. What is PTX?
18. What problem does Thrust solve?
19. How is `thrust::device_vector` similar to `std::vector`?
20. What is the difference between `thrust::sort` and writing your own sorting kernel?

---

## Code reading questions

Given:

```cpp
int i = blockIdx.x * blockDim.x + threadIdx.x;
```

If:

```text
blockIdx.x = 3
blockDim.x = 256
threadIdx.x = 7
```

Then:

```text
i = 3 × 256 + 7 = 775
```

So this thread processes element:

```cpp
A[775], B[775], C[775]
```

---

Given:

```cpp
add<<<4, 256>>>(d_A, d_B, d_C, N);
```

Total threads:

```text
4 × 256 = 1024
```

If `N = 1000`, then:

```text
1024 - 1000 = 24 extra threads
```

Those threads must be protected by:

```cpp
if (i < N)
```

---

# Quick exam-style answers

## Explain CUDA in one sentence

CUDA lets C/C++ programs run computationally heavy parts on NVIDIA GPUs using many parallel threads.

---

## Explain host/device in one sentence

The host is the CPU and system memory; the device is the GPU and GPU memory.

---

## Explain kernel in one sentence

A kernel is a GPU function launched by the CPU and executed by many GPU threads in parallel.

---

## Explain warp in one sentence

A warp is a group of 32 CUDA threads that the GPU schedules together.

---

## Explain warp divergence in one sentence

Warp divergence happens when threads in the same warp take different branches, causing the GPU to execute those paths separately.

---

## Explain Thrust in one sentence

Thrust is a high-level CUDA C++ library that provides STL-like GPU containers and algorithms such as sort and reduce.

---

# Final study checklist

Before the quiz/test, make sure you can do these without notes:

- [ ] Define CUDA.
- [ ] Explain CPU vs GPU in simple words.
- [ ] Explain host vs device.
- [ ] Write the CUDA workflow in order.
- [ ] Explain what a kernel is.
- [ ] Explain `__global__`.
- [ ] Explain `kernel<<<blocks, threads>>>(...)`.
- [ ] Use the global index formula.
- [ ] Explain why `if (i < N)` is needed.
- [ ] Explain SIMT.
- [ ] Define a warp as 32 threads.
- [ ] Explain why 256 is a good beginner block size.
- [ ] Explain warp divergence.
- [ ] Explain why blocks should be independent.
- [ ] Explain what `nvcc` does.
- [ ] Explain PTX at a high level.
- [ ] Describe a basic CUDA project structure.
- [ ] Explain why Thrust is easier than raw CUDA for common algorithms.
- [ ] Write a small `thrust::device_vector` example.
- [ ] Explain `thrust::sort` and `thrust::reduce`.

---

# Mini summary

Week 6 is mainly about learning how CUDA lets C/C++ programs use the GPU for parallel work. The CPU is the **host**, the GPU is the **device**, and data must be copied between their separate memories. A CUDA **kernel** is launched by the CPU and executed by many GPU threads. Threads are organized into **blocks**, and blocks are organized into a **grid**. Each thread usually computes its global index using `blockIdx.x * blockDim.x + threadIdx.x`, then works on one data element. CUDA execution uses **SIMT**, and threads are scheduled in **warps** of 32. Good block sizes are usually multiples of 32, like 128, 256, or 512. CUDA programs are compiled with **nvcc**, which handles both host code and device code. **Thrust** is introduced as a higher-level CUDA library that gives STL-like GPU tools such as `device_vector`, `sort`, and `reduce`, so you can perform common GPU operations without writing custom kernels.