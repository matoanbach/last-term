# Introduction

## What is OpenMP?
OpenMP (Open Multi-Processing) is an Application Programming Interface (API) that supports shared-memory parallel programming in C, C++, and Fortran. It allows programmers to create parallel applications by adding simple compiler directives (called pragmas) to existing sequential programs, without significantly changing the program structure.

Unlike CUDA, which is designed for GPU programming, OpenMP is designed to exploit the multiple CPU cores available in modern multicore processors.

OpenMP follows the fork-join execution model. A program begins execution with a single thread (the master thread). When a parallel region is encountered, the master thread creates (forks) additional worker threads to execute the work concurrently. Once the parallel region completes, the worker threads terminate (join), and execution continues with a single thread.

## Why OpenMP?

Writing multithreaded applications using low-level threading libraries such as POSIX Threads (Pthreads), Windows Threads (Win32 Threads), or the C++ Standard Library's <thread> and <future> can be complex and time-consuming. In these approaches, programmers are responsible for explicitly creating and managing threads, partitioning work, synchronizing shared data, and coordinating thread execution. This increases code complexity and the likelihood of programming errors such as race conditions and deadlocks.

OpenMP significantly simplifies shared-memory parallel programming by allowing developers to parallelize existing programs using compiler directives (pragmas), compiler-supported runtime library functions, and environment variables. The OpenMP runtime automatically creates, manages, schedules, and synchronizes threads, enabling programmers to focus on the parallel algorithm rather than low-level thread management. As a result, OpenMP programs are generally shorter, easier to read, easier to maintain, and more portable across different operating systems and multicore CPU architectures.

### Benefits
- Simple syntax using compiler directives (#pragma omp...)
- Minimal code changes required to parallelize existing sequential programs
- Automatic thread creation and management
- Built-in work-sharing constructs (e.g., parallel for, sections)
- Automatic synchronization and reduction operations
- Portable across Windows, Linux, and macOS with OpenMP-supported compilers
- Ideal for shared-memory multicore systems
- Reduces development time compared to manually managing threads with Pthreads, Windows Threads, or C++ thread.

# Sample OpenMP program
```cpp
#include <omh.h>

#include <iostream>
#include <omp.h>

int main() {
    #pragma omp parallel
    {
        std::cout << "Hello from thread "
                  << omp_get_thread_num()
                  << std::endl;
    }

    return 0;
}
```

## Key Functions

| Function / Environment Variable | Purpose | Example |
|---|---|---|
| `omp_get_thread_num()` | Returns the **ID (rank)** of the calling thread within the current parallel region. Thread IDs range from `0` to `N-1`. | `int id = omp_get_thread_num();` |
| `omp_get_num_threads()` | Returns the **total number of threads** in the current parallel region. Outside a parallel region, it typically returns `1`. | `int n = omp_get_num_threads();` |
| `omp_set_num_threads(8)` | Sets the **requested number of threads** to use for subsequent parallel regions in the program. This is a runtime library function. | `omp_set_num_threads(8);` |
| `OMP_NUM_THREADS=8` | An **environment variable** that specifies the default number of threads OpenMP should use when creating parallel regions. It can be overridden by `omp_set_num_threads()` or a `num_threads()` clause. | **Windows:** `set OMP_NUM_THREADS=8`<br>**Linux/macOS:** `export OMP_NUM_THREADS=8` |
| `omp_get_num_procs()` | Returns the **number of processors** available to the program, such as CPU cores or logical processors. It indicates the hardware resources available, not the number of OpenMP threads. | `int p = omp_get_num_procs();` |

# Variable Scope
One of the most important concepts in OpenMP is variable scope

Variable scope determines whether a variable is:
- Shared among all threads, or
- Private to each thread.
Choosing the wrong scope often leads to incorrect program results due to race conditions.

## Type of variables

### Shared Variables
Shared variables are accessible by every thread.
All threads read and write the same memory location.

### Private Variables
Each thread receives its own indenpendent copy.
Example:
```cpp
#pragma omp parallel private(i) // each thread has its own value of i.
```

### Reduction Variables
Reduction variables combine partial results from all threads.
Example:
```cpp
#pragma omp parallel for reduction(+:sum)
```
Each thread computes a local sum. OpenMP gives each thread its own private copy of the variable and combines (reduces) the results only after all threads have finished.
OpenMP combines all local sums into the final result automatically. This is one reason reductions are usually much faster than using atomic or critical.

# OpenMP Integration
## Manual
```cpp
int start = threadID * chunkSize;
int end   = start + chunkSize;
 
for(int i = start; i < end; i++)
    partialSum += data[i];
```
Initially, programmers may divide work manually among threads.

Suppose we wish to compute the sum of an array.

The programmer calculates the portion assigned to each thread.

- Advantages
    - Easy to understand
    - Full control over workload
- Disadvantages
    - Programmer must calculate partitions manually.
    - Difficult to maintain.
    - Not scalable.

## Manual without a race condition
```cpp
#pragma omp parallel
{
    int localSum = 0;

    for(...)
        localSum += data[i];

#pragma omp critical
    sum += localSum;
}
```
Suppose each thread computes its own partial sum.

Instead of updating one shared variable repeatedly, each thread stores its own local result.

Only the final updat requires synchronization.

This greatly reduces contention compared to updating the shared variable every iteration.

### Benefits
- Correct results
- Fewer synchronization operations
- Better performance

## Implicit Partitioning with Locking
OpenMP can automatically divide loop iteraitons among threads using

```cpp
#pragma omp parellel for
for (int i=0;i<N;i++){

    #pragma omp critical
    sum += data[i];
}
```

- Advantages
    - Very easy to write
    - Correct execution
- Disadvantages
    - Threads wait for each other.
    - Poor scalability.
    - Locking overhead.

## Implicit Partitioning with Reduction
The preferred solution is the reduction clause.

OpenMP automatically creates a private copy of the variable for each thread.

After all threads finish, OpenMP combines the partial results.

Example

```cpp
int sum = 0;

#pragma omp prallel for reduction(+:sum)
for(int i=0;i<N;i++) {
    sum += data[i];
}
```

# General Guidlines
- Use shared variables only when threads must access the same data.
- Use private variables for loop indices and temporary calculations.
- Use reduction for summations, products, minimums, maximums, and similar operations.
- Avoid unnecessary use of critical sections because they reduce parallel performance.
- Prefer reduction whenever possible, as it provides both correctness and good scalability.

## Summary

| Variable Type | Description | Typical Use |
|---|---|---|
| **Shared** | One copy shared by all threads | Input arrays, shared data structures |
| **Private** | Each thread has its own copy | Loop variables, temporary calculations |
| **Reduction** | Private copies automatically combined | Sum, product, minimum, maximum |