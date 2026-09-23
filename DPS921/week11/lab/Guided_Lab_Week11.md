# DPS921 Parallel Algorithms and Programming Techniques

## Week 11 Guided Lab Worksheet

**Value:** 1% of Lab 4 marks  
**Topic:** OpenMP Performance Analysis and False Sharing

## Learning Goals

By the end of this guided lab session, students should be able to:

- Explain false sharing in shared-memory systems.
- Implement padding to reduce false sharing.
- Compare synchronization approaches.
- Collect and analyze OpenMP performance data.

## Student Information

**Student Name:** Ma Toan Bach  
**Student's Seneca email:** mbach@myseneca.ca  
**Student ID:** 112708227  
**Section:** NAA  
**Submission Date:** July 23, 2026

## Exercise 1: Review Naive Implementation (15 minutes)

Review the naive OpenMP implementation that you developed during the previous guided lab session.

Recall that each thread updates its own partial sum stored in:

```cpp
partial[id]
```

**Question:** Although each thread updates a different array element, why might performance still be affected?

**Answer:**

Performance can still be affected by false sharing. Even though each thread
updates a different element such as `partial[id]`, nearby elements may still be
stored in the same cache line. When multiple threads update values in that same
cache line, the processor keeps invalidating and reloading the line across
cores, which adds overhead and reduces scalability.

## Exercise 2: False Sharing Experiment (40 minutes)

### Background

Modern CPUs transfer memory in cache lines.

Example:

```text
Cache Line
+----------+----------+----------+
| partial0 | partial1 | partial2 |
+----------+----------+----------+
  Thread 0   Thread 1   Thread 2
```

Multiple variables stored in the same cache line may cause frequent cache invalidations when updated by different threads. Although the variables are independent, these unnecessary cache invalidations can significantly reduce performance. This phenomenon is known as **false sharing**.

### 2.1 Create a Padded Version

Modify the shared array so that each thread's partial sum occupies a separate cache line.

**Naive:**

```cpp
double partial[NUM_THREADS];
```

**Padded:**

```cpp
double partial[NUM_THREADS][16];
```

Store the partial sum in:

```cpp
partial[id][0]
```

### 2.2 Compare Performance

Execute both the naive and padded implementations using the following thread counts:

```text
1, 2, 4, 8, and 16 threads
```

Record the results:

| Threads | Naive | Padded |
|---:|---:|---:|
| 1 | 1150.1143 ms | 1189.2791 ms |
| 2 | 657.8590 ms | 623.4647 ms |
| 4 | 1097.5345 ms | 1103.9934 ms |
| 8 | 742.2632 ms | 708.3512 ms |
| 16 | 502.3754 ms | 441.3982 ms |

These results were collected using `exercise2_naive.cpp` and
`exercise2_padded.cpp` compiled with `-O3`.
The 16-thread run was included for the worksheet comparison even though this
Apple M1 system provides 8 logical CPUs.

### Discussion Questions

**1. Which implementation performs better as the number of threads increases?**

**Answer:**

The padded implementation generally performs better as the thread count
increases. In this experiment it was faster at 2, 8, and 16 threads. At 4
threads both versions were very close, which suggests some normal run-to-run
variation, but the overall trend still favors padding.

**2. Why does padding improve performance?**

**Answer:**

Padding improves performance because it separates each thread's partial sum into
different cache-line regions. That reduces unnecessary cache invalidations and
cache-line bouncing between cores, which lowers false-sharing overhead.

## Exercise 3: Synchronized Version (35 minutes)

In this version, all threads update a single shared accumulator.

Implement a synchronized version of the program using one of the following OpenMP synchronization mechanisms:

- `critical`
- `atomic`

After implementing the synchronized version, compare all three approaches.

### Compare Three Approaches

| Version | Description |
|---|---|
| Naive | Separate partial sums stored in a shared array |
| Padded | Separate partial sums with padding to reduce false sharing |
| Synchronized | Single shared accumulator protected by synchronization |

Discuss the advantages and disadvantages of each approach before proceeding to the performance evaluation.

**Answer:**

The naive version is simple and usually provides useful parallel speedup, but
it can suffer from false sharing when adjacent partial sums land in the same
cache line. The padded version keeps the same overall structure while reducing
false sharing, so it usually scales better. The synchronized version is easy to
reason about for correctness because all threads update one shared sum, but it
adds significant contention because every update must be protected by
synchronization.

**Question:** Which implementation is expected to have the greatest synchronization overhead?

**Answer:**

The synchronized implementation is expected to have the greatest
synchronization overhead because every thread repeatedly updates the same shared
accumulator using `atomic`, which creates heavy contention.

## Exercise 4: Preparing Performance Data for the Lab Report (20 minutes)

Compile each implementation using:

- No optimization: `/Od` or `-O0`
- Maximum optimization for speed: `/O2` or `-O3`

Prepare the experiments required for your Lab 4 report.

**Thread counts:**

```text
1, 2, 4, 8, 16, 32, and 64 (if available)
```

### Required Data Collection

Collect the execution time for each of the following implementations:

- Serial
- Naive
- Padded
- Synchronized

| Version | Optimization | Threads | Time (ms) |
|---|---|---:|---:|
| Serial | `-O0` | 1 | 3577 |
| Serial | `-O3` | 1 | 977 |
| Naive | `-O0` | 1 | 3629 |
| Naive | `-O0` | 2 | 2099 |
| Naive | `-O0` | 4 | 1334 |
| Naive | `-O0` | 8 | 1221 |
| Naive | `-O3` | 1 | 1018 |
| Naive | `-O3` | 2 | 533 |
| Naive | `-O3` | 4 | 279 |
| Naive | `-O3` | 8 | 206 |
| Padded | `-O0` | 1 | 3764 |
| Padded | `-O0` | 2 | 1855 |
| Padded | `-O0` | 4 | 1120 |
| Padded | `-O0` | 8 | 948 |
| Padded | `-O3` | 1 | 1043 |
| Padded | `-O3` | 2 | 531 |
| Padded | `-O3` | 4 | 273 |
| Padded | `-O3` | 8 | 211 |
| Synchronized | `-O0` | 1 | 6250 |
| Synchronized | `-O0` | 2 | 9040 |
| Synchronized | `-O0` | 4 | 39812 |
| Synchronized | `-O0` | 8 | 75812 |
| Synchronized | `-O3` | 1 | 4711 |
| Synchronized | `-O3` | 2 | 4597 |
| Synchronized | `-O3` | 4 | 32628 |
| Synchronized | `-O3` | 8 | 36564 |

These measurements came from the Lab 4 benchmark set on an Apple M1 system
with 8 logical CPUs. Because the machine provides 8 logical CPUs, the Lab 4
report data was collected up to 8 threads.

**Question:** Based on your experimental results, which implementation would you recommend for this application? Justify your answer using the performance data you collected.

**Answer:**

I would recommend the padded implementation. It consistently avoided the severe
slowdowns seen in the synchronized version and generally matched or slightly
outperformed the naive version as thread count increased. In the optimized
results, padded reached 531 ms at 2 threads and 273 ms at 4 threads, compared
with 533 ms and 279 ms for naive, while synchronized became dramatically slower
at higher thread counts because the shared `atomic` update created a major
bottleneck.

## Deliverables

Submit the following through the Blackboard submission link:

- Completed guided lab worksheet.
- Source code.
- Raw timing data.
- Graphs or visualization files used in your report.

---

**Good Luck!**
