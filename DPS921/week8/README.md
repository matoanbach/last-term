# CUDA Streams and Thrust

CUDA Streams and Thrust are two different layers of GPU programming:

1. CUDA Streams provide low-level control over execution order and concurrency on the GPU.
2. Thrust provides high-level parallel algorithms similar to the C++ STL.

Thrust gives you algorithms such as:

- `sort`
- `transform`
- `reduce`
- `scan`

The relationship between them is simple:

- CUDA Streams decide when and where work runs.
- Thrust decides what computation runs.

## CUDA Streams

A CUDA stream is a sequence of GPU operations that execute in order.

Example of a single stream:

```text
Stream 0:
Copy -> Kernel -> Copy
```

Inside one stream:

- execution is sequential
- operations do not overlap with each other

## Multiple Streams

When work is placed in different streams, the GPU may execute it concurrently if hardware resources allow it.

```text
Stream 1: Copy A -> Kernel A -> Copy A
Stream 2: Copy B -> Kernel B -> Copy B
```

This allows separate GPU pipelines to overlap.

## Why Streams Matter

Streams help improve GPU utilization by allowing:

- overlapping computation
- overlapping memory transfer
- concurrent execution of independent work

## Thrust

Thrust is a high-level abstraction over CUDA kernels.

Instead of writing a kernel manually:

```cpp
kernel<<<grid, block>>>();
```

you can write:

```cpp
thrust::transform(...);
```

Thrust automatically:

- launches kernels
- manages temporary memory
- schedules GPU execution

By default, Thrust uses the default CUDA stream.

## The Default Stream Problem

Without explicit stream control, operations such as:

```text
Thrust sort -> Thrust transform -> Thrust reduce
```

execute sequentially in the default stream.

Even if the GPU could run independent work concurrently, it will not do so automatically when everything is submitted to the same stream.

## Combining Thrust and Streams

Thrust can be told to run an algorithm in a specific CUDA stream using:

```cpp
thrust::cuda::par.on(stream)
```

This is the bridge between CUDA Streams and Thrust.

## Example: Two Streams with Thrust

```cpp
#include <cuda_runtime.h>
#include <thrust/device_vector.h>
#include <thrust/execution_policy.h>
#include <thrust/transform.h>

struct square {
    __host__ __device__
    float operator()(float x) const {
        return x * x;
    }
};

int main()
{
    cudaStream_t s1, s2;
    cudaStreamCreate(&s1);
    cudaStreamCreate(&s2);

    thrust::device_vector<float> A(1000, 2.0f);
    thrust::device_vector<float> B(1000, 3.0f);

    thrust::transform(
        thrust::cuda::par.on(s1),
        A.begin(), A.end(),
        A.begin(),
        square()
    );

    thrust::transform(
        thrust::cuda::par.on(s2),
        B.begin(), B.end(),
        B.begin(),
        square()
    );

    cudaStreamSynchronize(s1);
    cudaStreamSynchronize(s2);

    cudaStreamDestroy(s1);
    cudaStreamDestroy(s2);

    return 0;
}
```

In this program:

- Stream 1 runs `square(A)`
- Stream 2 runs `square(B)`

Because the work is in separate streams and the two vectors are independent, the GPU may execute both kernels in parallel.

## Independence Requirement

Streams help only when the workloads are independent.

For stream-based concurrency, `A` and `B` must not depend on each other. If one task needs the output of another, they must be ordered correctly.

## Stream vs Thread

This is an important distinction.

In a kernel launch:

```cpp
kernel<<<grid, block, 0, stream>>>(...);
```

the stream argument is not about threads.

It controls:

- ordering of GPU operations
- scheduling of GPU work

Threads are the workers inside a kernel and they still execute in parallel.

Example:

```text
STREAM LAYER:
Kernel A -> Kernel B -> Kernel C

KERNEL A:
Thread 0, 1, 2, ..., N run in parallel
```

With two streams:

```text
Stream 1: Kernel A -> Kernel B
Stream 2: Kernel C -> Kernel D
```

the GPU may execute work like this:

```text
Kernel A (stream 1)
Kernel C (stream 2)   <- parallel possible
Kernel B (stream 1)
Kernel D (stream 2)
```

## Simple Analogy

Without streams:

```text
One assembly line:
A -> B -> C -> D
```

With streams:

```text
Line 1: A1 -> B1 -> C1
Line 2: A2 -> B2 -> C2
Line 3: A3 -> B3 -> C3
```

Streams let the GPU work on multiple independent pipelines instead of forcing all work into one queue.

## Key Takeaway

- CUDA Streams manage concurrency between GPU operations.
- Thrust provides high-level parallel algorithms.
- `thrust::cuda::par.on(stream)` lets you combine both.
- Streams do not replace thread parallelism; they organize and overlap GPU tasks.
