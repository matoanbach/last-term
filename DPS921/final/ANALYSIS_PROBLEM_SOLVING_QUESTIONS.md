# Week 12–13 Parallel Programming Questions and Answers

---

# Week 12 — Design Patterns and Applied Model Comparison

## Question 1: MPI Communication Bottleneck Analysis

### Performance Data

| Number of Processes | Computation Time | Communication Time | Total Time |
|---:|---:|---:|---:|
| 4 | 80 sec | 10 sec | 90 sec |
| 8 | 42 sec | 18 sec | 60 sec |
| 16 | 22 sec | 30 sec | 52 sec |
| 32 | 12 sec | 55 sec | 67 sec |

## (a) Communication Overhead Analysis

The communication percentage is:

\[
\text{Communication Percentage}
=
\frac{\text{Communication Time}}{\text{Total Time}}
\times 100
\]

### Calculations

- 4 processes: \(\frac{10}{90}\times100=11.11\%\)
- 8 processes: \(\frac{18}{60}\times100=30.00\%\)
- 16 processes: \(\frac{30}{52}\times100\approx57.69\%\)
- 32 processes: \(\frac{55}{67}\times100\approx82.09\%\)

| Processes | Communication Percentage |
|---:|---:|
| 4 | 11.11% |
| 8 | 30.00% |
| 16 | 57.69% |
| 32 | 82.09% |

## (b) Scalability Analysis

Performance improves from 4 to 16 processes:

- 4 processes: 90 seconds
- 8 processes: 60 seconds
- 16 processes: 52 seconds

However, increasing from 16 to 32 processes raises the total execution time from 52 seconds to 67 seconds. Therefore, performance stops improving after **16 processes**.

The reason is that the reduction in computation time is no longer large enough to compensate for the increase in communication time. From 16 to 32 processes, computation time decreases by 10 seconds, but communication time increases by 25 seconds. At 32 processes, about 82.09% of the total time is spent communicating, so communication dominates useful computation.

## (c) Communication Bottleneck Explanation

As the number of MPI processes increases, the total problem is divided into smaller pieces. Each process receives less computation, so the useful workload per process becomes smaller.

At the same time, more process boundaries are created. Neighboring processes must exchange boundary data more frequently, which increases the number of messages and the total communication cost.

Processes may also need to wait at synchronization points until neighboring processes finish and provide the required data. This adds synchronization overhead and idle time.

As a result, the communication-to-computation ratio increases. Each process spends less time calculating and more time communicating or waiting. Eventually, communication becomes the main bottleneck and adding more processes no longer improves performance.

## (d) Improving MPI Scalability

### Strategy 1: Use non-blocking communication

Functions such as `MPI_Isend()` and `MPI_Irecv()` allow a process to start sending or receiving data and then continue performing independent calculations. This overlaps communication with computation and reduces idle time.

### Strategy 2: Improve data decomposition and reduce communication frequency

The grid should be divided so that each process receives a balanced region with as few boundaries as possible. Processes can also combine several small messages into fewer larger messages. This reduces message startup overhead and lowers the total communication cost.

---

# Question 2: Choosing the Appropriate Parallel Programming Model and Execution Pattern

## Application A: Weather Simulation

### Programming Model: MPI

### Execution Pattern: SPMD

The weather simulation runs on hundreds of compute nodes, so it uses a distributed-memory system. Each node has its own private memory, and processes must exchange data explicitly.

MPI is appropriate because it supports communication among processes running on different nodes. The large three-dimensional grid can be divided into smaller subregions, and each MPI process can calculate one region.

SPMD is suitable because every process runs the same simulation program but works on a different region of the grid. Neighboring regions exchange boundary or halo data during each simulation step.

MPI is also highly scalable because it can run across hundreds or thousands of compute nodes.

**Final selection:** MPI with SPMD.

## Application B: Image Processing on a Workstation

### Programming Model: OpenMP

### Execution Pattern: Loop Parallelism

The application runs on one computer with a 16-core CPU, so it uses shared memory. All threads can access the same input and output image arrays.

OpenMP is appropriate because it can divide loop iterations among multiple CPU threads with little code. Since the same operation is applied independently to millions of pixels, the pixel-processing loop can be parallelized directly:

```cpp
#pragma omp parallel for
for (int i = 0; i < numberOfPixels; i++)
{
    output[i] = processPixel(input[i]);
}
```

Communication is minimal because each thread works on different pixels while sharing the same memory.

**Final selection:** OpenMP with Loop Parallelism.

## Application C: Machine Learning Matrix Operations

### Programming Model: CUDA

### Execution Pattern: SPMD

The application performs very large matrix operations and has a GPU accelerator. CUDA is designed to run thousands of lightweight threads on an NVIDIA GPU.

Each CUDA thread can execute the same kernel on a different matrix element. For example:

```cpp
C[row][column] = A[row][column] + B[row][column];
```

This matches SPMD because all threads run the same program but operate on different data.

The GPU has separate device memory, so data is usually copied from host memory to device memory before computation and copied back when the CPU needs the result.

Matrix operations often have a high computation-to-communication ratio, meaning a large amount of computation is performed compared with the amount of data transferred.

**Final selection:** CUDA with SPMD.

## Summary Table

| Application | Programming Model | Execution Pattern | Main Reason |
|---|---|---|---|
| Weather Simulation | MPI | SPMD | Distributed grid across many nodes with boundary communication |
| Image Processing | OpenMP | Loop Parallelism | Independent pixel operations on a shared-memory multicore CPU |
| Matrix Operations | CUDA | SPMD | Thousands of independent calculations on a GPU |

---

# Week 13 — Load Balancing, Scalability, Debugging

## Question 1: Load Balancing and Scalability Analysis

### Task Costs

| Task | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Cost | 10 | 15 | 40 | 50 | 20 | 45 | 10 | 30 |

## (a) Total Workload for Each Processor

### Approach A: Static Assignment

For P0:

\[
10+15+40+50=115
\]

For P1:

\[
20+45+10+30=105
\]

| Processor | Workload |
|---|---:|
| P0 | 115 units |
| P1 | 105 units |

The total execution time is:

\[
\max(115,105)=115\text{ units}
\]

### Approach B: Cost-Based Assignment

For P0:

\[
50+20+10=80
\]

For P1:

\[
40+45+10+15+30=140
\]

| Processor | Workload |
|---|---:|
| P0 | 80 units |
| P1 | 140 units |

The total execution time is:

\[
\max(80,140)=140\text{ units}
\]

## (b) Better Load-Balancing Approach

Based on the assignments provided, **Approach A provides better load balancing**.

Approach A has a workload difference of only 10 units and an execution time of 115 units. Approach B has a workload difference of 60 units and an execution time of 140 units.

Approach A keeps both processors busy for approximately the same amount of time. In Approach B, P0 finishes much earlier and remains idle while P1 continues working.

Although Approach B is called cost-based, the specific assignment shown is not well balanced.

## (c) Why Equal Task Counts Do Not Guarantee Good Scalability

Assigning the same number of tasks to each processor does not guarantee good scalability because different tasks may require different amounts of computation.

One processor could receive four inexpensive tasks while another receives four expensive tasks. Even though both processors have the same number of tasks, one may take much longer to finish.

The processor that finishes early must wait for the slower processor. This idle time reduces processor utilization and limits speedup. Good load balancing should therefore consider task cost, not just task count.

## (d) Mandelbrot Image Generation

For a Mandelbrot image-generation application, **dynamic load balancing** is the better choice.

Different pixels require different numbers of iterations. Some pixels finish quickly, while pixels near the Mandelbrot-set boundary may require many more calculations.

Because the cost of each pixel is difficult to predict in advance, static assignment can create an imbalance. One processor may receive many expensive pixels while another receives mostly easy pixels.

With dynamic load balancing, processors request new blocks of pixels whenever they finish their current work. This keeps processors busy, reduces waiting time, and improves scalability for irregular workloads.

---

# Question 2: Debugging and Scalability of a Parallel Program

## Given Code

```cpp
#pragma omp parallel num_threads(4)
{
    int id = omp_get_thread_num();

    if (id == 0)
    {
        lock(A);
        update(sharedData1);
        lock(B);
        update(sharedData2);
    }
    else if (id == 1)
    {
        lock(B);
        update(sharedData2);
        lock(A);
        update(sharedData1);
    }
}
```

## (a) Correctness Problems Causing Inconsistent Results

The program may have race conditions involving `sharedData1` and `sharedData2`.

A race condition occurs when multiple threads access and update shared data without complete and correct synchronization. The final result may depend on the order in which the threads execute, and that order can change between runs.

The code also does not show any `unlock()` operations. If a lock is not released, other threads may be permanently blocked from accessing the protected data.

All shared updates must be protected consistently, and every acquired lock must be released.

## (b) Cause of the Program Freeze

The program may freeze because of a **deadlock**.

Thread 0 acquires lock A and then waits for lock B. Thread 1 acquires lock B and then waits for lock A.

```text
Thread 0: holds A, waits for B
Thread 1: holds B, waits for A
```

Neither thread can continue because each is waiting for a lock held by the other. This circular waiting causes the program to freeze permanently.

## (c) Why More Threads Do Not Always Improve Performance

Adding more threads introduces parallel overhead, including:

- lock contention
- synchronization overhead
- context switching
- thread scheduling overhead
- cache contention
- false sharing
- serial sections
- limited CPU cores

In this application, multiple threads compete for the same locks. As more threads are added, more threads may spend time waiting instead of performing useful work.

If the number of threads exceeds the number of available CPU cores, the operating system must switch between threads, which adds more overhead.

The locked sections are also partly serial because only one thread can hold a lock at a time. Therefore, adding threads improves performance only when enough independent work exists to outweigh synchronization and thread-management costs.

## (d) Debugging and Optimization Strategies

### Strategy 1: Use a consistent lock order

Every thread should acquire locks in the same order:

```cpp
lock(A);
lock(B);

update(sharedData1);
update(sharedData2);

unlock(B);
unlock(A);
```

Using one global lock order prevents circular waiting and deadlock. Every lock must also be released after the protected operation is complete.

### Strategy 2: Reduce shared updates and lock contention

Threads should perform as much work as possible using private local variables and combine results afterward.

```cpp
#pragma omp parallel
{
    int localResult = performWork();

    #pragma omp atomic
    sharedResult += localResult;
}
```

An OpenMP reduction can also be used when appropriate:

```cpp
int total = 0;

#pragma omp parallel for reduction(+:total)
for (int i = 0; i < n; i++)
{
    total += data[i];
}
```

This keeps most computation outside synchronized sections, reduces waiting, and improves scalability. Debugging tools such as ThreadSanitizer, logging, and OpenMP-aware debuggers can also help identify races and deadlocks.