# DPS921 Parallel Algorithms and Programming Techniques

# Week 8 Guided Lab Worksheet

**Value:** 1% for Lab 3 marks

## CPU Baseline and Basic CUDA Matrix Multiplication

---

## Learning Goals

By the end of this guided lab session, students should be able to:

- Implement matrix indexing in row-major format
- Write a basic CPU matrix multiplication algorithm
- Understand CUDA grid and thread hierarchy
- Implement and run a simple CUDA kernel, vector addition
- Verify correctness of GPU results

---

## Student Information

| Field | Information |
|---|---|
| Student Name | |
| Student's Seneca email | |
| Student ID | |
| Section | NAA |
| Submission Date | |

---

# Exercise 1: Understanding Matrix Storage

**Estimated time:** 15 minutes

Matrices are stored as one-dimensional arrays in row-major order. Before implementing matrix multiplication, it is important to understand how two-dimensional matrix indices map to a one-dimensional array.

Consider the following matrix:

```text
          Column
          0   1   2   3
        +---+---+---+---+
Row 0   |   |   |   |   |
        +---+---+---+---+
Row 1   |   |   |   |   |
        +---+---+---+---+
Row 2   |   |   |   |   |
        +---+---+---+---+
Row 3   |   |   |   |   |
        +---+---+---+---+
```

The matrix is stored in memory as:

```cpp
float matrix[16];
```

## Part A

Complete the following table by determining the corresponding index in the one-dimensional array.

| Matrix Element | Array Index |
|---|---|
| `matrix(2,3)` | `11` |
| `matrix(1,0)` | `4` |
| `matrix(3,2)` | `14` |
| `matrix(0,1)` | `1` |

## Part B

Complete the following expression so that it accesses the element at `(row, column)` in an `N × N` matrix.

```cpp
float value = matrix[row * N + column];
```

## Part C

Complete the following function.

```cpp
int getIndex(int row, int column, int N)
{
    return row * N + column;
}
```

## Part D

Using your function from Part C, determine the array index for:

```text
row = 5
column = 7
N = 10
```

```text
Index = 57
```

---

# Exercise 2: Small CPU Matrix Multiplication

**Estimated time:** 25 minutes

In this exercise, you will implement the sequential CPU version of matrix multiplication. This implementation will serve as the baseline for the CUDA implementations you will develop later.

Recall that each element of the output matrix is computed by multiplying one row of `A` with one column of `B` and summing the products.

Assume that all matrices are stored in row-major order using one-dimensional arrays.

## Part A

Complete the following function:

```cpp
void matrixMultiplyCPU(float *A,
                       float *B,
                       float *C,
                       int N)
{
    // TODO:
    // Compute C = A × B
}
```

Your implementation should:

- Use the standard three-loop algorithm
- Compute every element of the output matrix `C`
- Support matrices of arbitrary size `N`

## Part B

Test your implementation using:

```cpp
N = 4;
```

Initialize the matrices with any values of your choice, or use the provided initialization function if available.

Print matrices `A`, `B`, and `C`, using `N = 4` only, to verify correctness.

**Answer:**

```text
A =
1 2 3 4
5 6 7 8
9 10 11 12
13 14 15 16

B =
1 0 0 0
0 1 0 0
0 0 1 0
0 0 0 1

C =
1 2 3 4
5 6 7 8
9 10 11 12
13 14 15 16
```

## Part C

Measure the execution time of your implementation using `std::chrono`.

Report the execution time for:

- `N = 256`
- `N = 512`

Run once or twice for practice. Formal benchmarking will be done in the Lab 3 assignment.

**Answer:**

```text
N = 256 -> 61.7133 ms
N = 512 -> 490.97 ms
```

## Reflection Questions

### 1. How many nested loops are required to implement matrix multiplication? Why?

**Answer:**

```text
Three nested loops are required.
One loop selects the output row, one loop selects the output column,
and one loop performs the dot product for that element.
```

### 2. What is the computational complexity, Big-O notation, of the standard matrix multiplication algorithm?

**Answer:**

```text
O(N^3)
```

### 3. Why is this CPU implementation useful as a baseline when evaluating GPU performance later in the assignment?

**Answer:**

```text
This CPU implementation gives a correct sequential reference result and a CPU
execution time, which can later be used to compare correctness and speedup
against the GPU implementation.
```

**Include your code in the submission.**

---

# Exercise 3: Understanding CUDA Thread Mapping

**Estimated time:** 15 minutes

In CUDA, a kernel is executed by many threads organized into thread blocks, and thread blocks are organized into a grid. Each thread is responsible for computing a small portion of the overall problem.

In matrix multiplication, a common approach is for each thread to compute one element of the output matrix.

Consider the following kernel launch configuration:

```cpp
dim3 block(16, 16);
dim3 grid(2, 2);
```

Assume the following code is used inside the CUDA vector addition kernel to determine which matrix element is processed by the current thread:

```cpp
int row = blockIdx.y * blockDim.y + threadIdx.y;
int col = blockIdx.x * blockDim.x + threadIdx.x;
```

## Part A

How many:

- Thread blocks are launched?
- Threads are contained in each block?
- Total CUDA threads are launched?

Show your calculations clearly.

**Answer:**

```text
Thread blocks launched = 2 x 2 = 4
Threads per block = 16 x 16 = 256
Total CUDA threads launched = 4 x 256 = 1024
```

## Part B

Suppose a thread is responsible for computing the matrix element:

```cpp
C[20][5]
```

Assume matrix size is at least `32 × 32`.

Determine the following:

- Which thread block, `(blockIdx.x, blockIdx.y)`, processes this element?
- Which thread, `(threadIdx.x, threadIdx.y)`, within that block computes it?

Show your calculations clearly.

**Answer:**

```text
row = 20, col = 5

blockIdx.x = col / 16 = 5 / 16 = 0
blockIdx.y = row / 16 = 20 / 16 = 1

threadIdx.x = col % 16 = 5
threadIdx.y = row % 16 = 4

Thread block = (0, 1)
Thread inside block = (5, 4)
```

## Part C

Complete the following code by filling in the missing expressions.

```cpp
int row = blockIdx.y * blockDim.y + threadIdx.y;
int col = blockIdx.x * blockDim.x + threadIdx.x;
```

## Reflection Questions

### 1. Why are both the thread index and the block index needed to determine the matrix element processed by a thread?

**Answer:**

```text
threadIdx gives the thread's position only within its own block.
blockIdx identifies which block the thread belongs to.
Together they determine the global matrix element handled by that thread.
```

### 2. What would happen if the matrix size is larger than the total number of threads launched?

**Answer:**

```text
Some output elements would not be assigned to any thread, so part of the
matrix would remain uncomputed.
```

### 3. Why is the following bounds check typically included in a CUDA vector addition kernel?

```cpp
if (row < N && col < N)
{
    // Compute one element of C
}
```

**Answer:**

```text
The bounds check prevents threads outside the valid matrix size from reading or
writing invalid memory. This usually happens when the grid is larger than the
matrix dimensions.
```

---

# Exercise 4: First CUDA Vector Addition Kernel

**Estimated time:** 25 minutes

In this exercise, you will implement a simple CUDA program that adds two vectors.

Although vector addition is much simpler than matrix multiplication, it introduces the fundamental steps required for GPU programming:

- Allocating memory on the GPU
- Transferring data between the host and device
- Launching a CUDA vector addition kernel
- Retrieving results from the GPU
- Verifying correctness

These steps are the same ones you will use when implementing CUDA matrix multiplication in Question 2.

## Problem Statement

Given two vectors `A` and `B`, compute their sum.

## Part A: Implement the CUDA Vector Addition Kernel

Complete the following CUDA vector addition kernel.

```cpp
__global__
void vectorAdd(float *A,
               float *B,
               float *C,
               int N)
{
    // TODO:
    // Compute the global thread index.
    // Ensure the thread is within the vector bounds.
    // Compute one element of the output vector.
}
```

Each thread should compute exactly one element of the output vector.

## Part B: Complete the Host Program

Modify the host program to perform the following steps:

1. Allocate memory for the input and output vectors on the GPU.
2. Copy the input vectors from host memory to device memory.
3. Launch the CUDA vector addition kernel using an appropriate one-dimensional grid and block configuration.
4. Synchronize the device after the kernel completes.
5. Copy the output vector back to host memory.
6. Release all allocated device memory.

## Part D: Experiment with Different Vector Sizes

Test your program using at least the following vector sizes:

- `1,024` elements
- `16,384` elements

No timing is required here. Only correctness is required.

---

# Deliverables

Submit the following:

- CPU matrix multiplication program, Exercise 2
- CUDA vector addition program, Exercise 4
- Completed Guided Lab Worksheet:
  - Answers to Exercise 1, Matrix Storage
  - Answers to Exercise 3, CUDA Thread Mapping

---

```text
☆★☆★☆★☆★☆★☆★☆★☆★☆★☆
             Good Luck!
☆★☆★☆★☆★☆★☆★☆★☆★☆★☆
```
