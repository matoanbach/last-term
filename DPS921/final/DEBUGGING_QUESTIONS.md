# Parallel Programming Review Answers

## Week 8 — Thrust: High-Level GPU Programming

### Question 1

The program may not achieve good GPU performance for three reasons:

1. The reduction does not explicitly specify a GPU execution policy.
2. The vector contains only 1,000 elements, which may be too small to offset GPU launch overhead.
3. Initializing `device_vector` one element at a time from the CPU can cause repeated host-to-device transfers.

To explicitly request GPU execution, use `thrust::device`:

```cpp
#include <iostream>
#include <thrust/device_vector.h>
#include <thrust/reduce.h>
#include <thrust/execution_policy.h>

int main()
{
    thrust::device_vector<int> data(1000, 1);

    int sum = thrust::reduce(
        thrust::device,
        data.begin(),
        data.end(),
        0
    );

    std::cout << "Sum = " << sum << std::endl;

    return 0;
}
```

The important change is:

```cpp
thrust::device
```

This explicitly requests device execution. Initializing the vector with:

```cpp
thrust::device_vector<int> data(1000, 1);
```

is also better than assigning each element individually.

> Note: Thrust can often infer GPU execution from `device_vector` iterators, but using an explicit execution policy makes the intended execution location clear.

---

## Week 9 — CUDA Memory and Optimization

### Question 1

The kernel writes values into shared memory and immediately reads from shared memory:

```cpp
temp[tid] = input[i];
output[i] = temp[tid] * 2;
```

Threads in the same block are not guaranteed to finish their writes at exactly the same time. If a thread needs to read a value written by another thread, it may read the value before that write has completed.

A synchronization barrier should be placed after loading shared memory:

```cpp
#include <cuda_runtime.h>

__global__
void process(const int* input, int* output, int N)
{
    __shared__ int temp[256];

    int tid = threadIdx.x;
    int i = blockIdx.x * blockDim.x + tid;

    if (i < N)
    {
        temp[tid] = input[i];
    }

    __syncthreads();

    if (i < N)
    {
        output[i] = temp[tid] * 2;
    }
}
```

`__syncthreads()` makes every thread in the block wait until all threads reach the barrier.

In this exact kernel, each thread reads only the same shared-memory element that it wrote:

```cpp
temp[tid]
```

Therefore, synchronization is not strictly required for correctness here. However, it becomes necessary when threads read values written by other threads, such as:

```cpp
temp[tid - 1]
```

The boundary check `i < N` also prevents out-of-range memory access when the array size is not an exact multiple of the block size.

---

## Week 10 — OpenMP and Preventing Race Conditions

### Question 2

The program has two main problems:

1. `sum` is shared by all threads, so several threads may update it at the same time. This creates a race condition.
2. If `N` is not evenly divisible by the number of threads, some elements may not be processed.

Variables declared inside the parallel region, such as `id`, `numThreads`, `start`, `end`, and `localSum`, are private to each thread. The array `A` and the final variable `sum` are shared.

Each thread should calculate its own private partial sum. The partial results can then be safely added to the shared final sum using `atomic`:

```cpp
#include <iostream>
#include <omp.h>

int main()
{
    const int N = 1000;
    int A[N];

    for (int i = 0; i < N; i++)
    {
        A[i] = i;
    }

    long long sum = 0;

    #pragma omp parallel
    {
        int id = omp_get_thread_num();
        int numThreads = omp_get_num_threads();

        int chunk = N / numThreads;
        int start = id * chunk;
        int end = (id == numThreads - 1)
                    ? N
                    : start + chunk;

        long long localSum = 0;

        for (int i = start; i < end; i++)
        {
            localSum += A[i];
        }

        #pragma omp atomic
        sum += localSum;
    }

    std::cout << "Sum = " << sum << std::endl;

    return 0;
}
```

The last thread receives any leftover elements:

```cpp
int end = (id == numThreads - 1) ? N : start + chunk;
```

The update:

```cpp
#pragma omp atomic
sum += localSum;
```

ensures that only one thread modifies the shared final sum at a time.

---

## Week 11 — OpenMP: Loop Parallelism and Performance Awareness

### Question 1

The possible performance problem is **false sharing**.

Although each thread updates a different array element:

```cpp
partialSum[id]
```

the elements are next to each other in memory. Several elements may be stored in the same CPU cache line.

When one thread updates its element, the entire cache line may be invalidated in the caches of other processor cores. The threads repeatedly compete for ownership of the same cache line, which reduces performance.

A simple improvement is to use a private local variable inside each thread and write to the shared array only once:

```cpp
#include <iostream>
#include <omp.h>

long long partialSum[8];

int main()
{
    #pragma omp parallel num_threads(8)
    {
        int id = omp_get_thread_num();
        long long localSum = 0;

        for (int i = 0; i < 100000000; i++)
        {
            localSum += i;
        }

        partialSum[id] = localSum;
    }

    return 0;
}
```

This reduces the number of writes to neighboring shared-memory locations.

Another option is to place each result on a separate cache line:

```cpp
struct alignas(64) PaddedSum
{
    long long value;
};

PaddedSum partialSum[8];
```

Then each thread writes to:

```cpp
partialSum[id].value
```

This padding reduces false sharing.

The original program also makes every thread perform the entire loop. It does not divide the loop iterations among threads. Therefore, increasing the number of threads increases the total amount of work instead of reducing it.
