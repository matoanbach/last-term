# DPS921 Parallel Algorithms and Programming Techniques

## Week 9 Guided Lab Worksheet

**1% for Lab 3 marks**

# Shared Memory and CUDA Performance

## Learning Goals

By the end of this guided lab session, students should be able to:

- Explain the purpose of shared memory and thread synchronization
- Use `__syncthreads()` correctly in a CUDA kernel
- Implement a simple shared-memory CUDA kernel
- Measure kernel execution time using CUDA events
- Analyze and interpret GPU performance results

## Student Information

**Student Name:** Ma Toan Bach

**Student's Seneca email:** mbach@myseneca.ca

**Student ID:** 112708227

**Section:** NAA

**Submission Date:** July 9, 2026

---

## Exercise 1: Thread Synchronization

**Time:** 20 minutes

When threads within the same thread block cooperate by sharing data through shared memory, they must coordinate their execution to ensure that all required data has been loaded before it is used. CUDA provides the `__syncthreads()` function, which acts as a barrier synchronization. Every thread in the thread block must reach this point before any thread is allowed to continue execution.

Consider the following CUDA kernel:

```cuda
__global__
void example(...)
{
    __shared__ float tile[16][16];
    ...
}
```

Answer the following questions:

### 1. Purpose of Synchronization

Explain why `__syncthreads()` is needed when multiple threads are reading from and writing to shared memory.

**Answer:**

```text
__syncthreads() is needed to make sure all threads in the same block finish
writing their values into shared memory before any thread starts reading those
values. Without this barrier, some threads may read data before other threads
have finished storing it.
```

### 2. Consequences of Removing Synchronization

Describe what might happen if `__syncthreads()` is omitted from a kernel that uses shared memory.

**Answer:**

```text
If __syncthreads() is omitted, the kernel can have a race condition. Some
threads may continue execution early and read uninitialized or incomplete
shared-memory values, which can produce incorrect or inconsistent output.
```

### 3. Placement of Synchronization

At what point(s) in the kernel should `__syncthreads()` typically be called? Briefly justify your answer.

**Answer:**

```text
__syncthreads() should usually be placed immediately after threads load shared
data and before any thread uses that shared data. It should also be used
between phases when the same shared-memory array is reused for a new purpose.
This ensures that all threads see valid and fully updated values.
```

---

## Exercise 2: Shared Memory Practice

**Time:** 25 minutes

Shared memory is significantly faster than global memory and allows threads within the same block to cooperate efficiently. In this exercise, you will modify a simple CUDA program so that data is first copied into shared memory before being written back to global memory.

### 1. Complete the CUDA kernel

Complete the following CUDA kernel by filling in the missing code.

```cuda
__global__
void sharedCopy(float *input,
                float *output,
                int N)
{
    __shared__ float tile[256];

    int tid = blockIdx.x * blockDim.x + threadIdx.x;

    if (tid < N)
    {
        // Load into shared memory
        tile[threadIdx.x] = input[tid];
    }

    __syncthreads();

    if (tid < N)
    {
        // Copy back to global memory
        output[tid] = tile[threadIdx.x];
    }
}
```

Your kernel should:

- Compute the global thread index
- Load one element from global memory into shared memory
- Synchronize all threads
- Copy the value from shared memory back to global memory

### 2. Run your program

Run your program using the following input sizes:

- 1024 elements
- 16384 elements

Verify that the output matches the input.

**No timing required.**

**Answer:**

```text
Expected verification for a correct program:

N = 1024  -> PASS (output matches input)
N = 16384 -> PASS (output matches input)
```

## Reflection Questions

### 1. Why is shared memory faster than global memory?

**Answer:**

```text
Shared memory is faster because it is on-chip and located much closer to the
Streaming Multiprocessors than global memory. It has much lower access latency
and is designed for fast data sharing within a block.
```

### 2. Why must every thread in a thread block reach `__syncthreads()`?

**Answer:**

```text
Every thread must reach __syncthreads() because it is a block-wide barrier.
If some threads skip it while others wait at it, the block can stall or behave
incorrectly. CUDA requires all threads in the block to participate.
```

### 3. Can one thread block access another block's shared memory? Explain.

**Answer:**

```text
No. Shared memory is private to a single thread block. Threads in one block can
share data only with other threads in the same block, not with threads in a
different block.
```

---

## Exercise 3: Measuring CUDA Execution Time

**Time:** 15 minutes

CUDA events provide an accurate way to measure GPU kernel execution time. Assume that `cudaEventCreate()` has already been called for both `start` and `stop`.

Complete the following code:

```cuda
cudaEvent_t start, stop;

// Assume cudaEventCreate(&start) and cudaEventCreate(&stop) were already called.

cudaEventRecord(start);

kernel<<<grid, block>>>(...);

cudaEventRecord(stop);

cudaEventSynchronize(stop);

float ms;

cudaEventElapsedTime(&ms, start, stop);

printf("Kernel Time = %f ms\n", ms);
```

## Reflection Questions

### 1. Why is `cudaDeviceSynchronize()` not sufficient for measuring kernel execution time accurately?

**Answer:**

```text
cudaDeviceSynchronize() only waits until GPU work is finished. It does not
directly measure elapsed kernel time with the same precision as CUDA events.
CUDA events timestamp operations on the GPU timeline, so they provide a more
accurate measurement of kernel execution time.
```

### 2. What does CUDA event timing exclude?

**Answer:**

```text
CUDA event timing excludes work outside the recorded event region. For example,
if the events are placed only around the kernel launch, the measured time does
not include host-side code, memory allocation, host-to-device transfer,
device-to-host transfer, or file and console I/O.
```

---

## Exercise 4: Performance Analysis

**Time:** 25 minutes

Suppose the following execution times were recorded.

| Matrix Size | CPU | GPU |
|---|---:|---:|
| 256 x 256 | 12 | 3 |
| 512 x 512 | 95 | 14 |
| 1024 x 1024 | 760 | 65 |

### 1. Compute the GPU speedup for each matrix size

Use:

```text
Speedup = CPU Time / GPU Time
```

**Record your observations:**

```text
The GPU is faster than the CPU for all three matrix sizes, and the speedup
increases as the matrix size becomes larger.
```

**Show your calculations:**

```text
256 x 256:
Speedup = CPU / GPU = 12 / 3 = 4.00x

512 x 512:
Speedup = CPU / GPU = 95 / 14 = 6.79x

1024 x 1024:
Speedup = CPU / GPU = 760 / 65 = 11.69x
```

### 2. Answer the following questions

#### 1. Does GPU performance improve relative to the CPU as the matrix size increases?

**Answer:**

```text
Yes. GPU performance improves relative to the CPU as matrix size increases.
The speedup grows from 4.00x to 6.79x and then to 11.69x.
```

#### 2. Why does the GPU become more beneficial for larger problems?

**Answer:**

```text
Larger problems provide more parallel work, so the GPU can keep more threads
and cores busy. As the workload grows, the fixed overheads of launching kernels
and transferring data are spread across more computation.
```

#### 3. Under what circumstances might the CPU outperform the GPU?

**Answer:**

```text
The CPU may outperform the GPU for very small workloads, irregular tasks with
limited parallelism, or cases where memory-transfer and launch overhead are
larger than the actual computation time.
```

#### 4. Besides kernel execution, what other overheads contribute to total GPU execution time?

**Answer:**

```text
Other overheads include GPU memory allocation, host-to-device copies,
device-to-host copies, kernel launch overhead, synchronization, and resource
cleanup.
```

---

## Final Reflection

Which concept introduced in today's guided lab do you think will have the greatest impact on improving the performance of CUDA matrix multiplication? Explain your answer.

**Answer:**

```text
Shared memory will likely have the greatest impact on CUDA matrix
multiplication performance. In matrix multiplication, many threads reuse the
same input values multiple times. By loading a tile of each matrix into shared
memory once and reusing it, the kernel greatly reduces slow global-memory
accesses and improves overall throughput.
```

---

☆★☆★☆★☆★☆★☆★☆★☆★☆★☆

**Good Luck!**

☆★☆★☆★☆★☆★☆★☆★☆★☆★☆
