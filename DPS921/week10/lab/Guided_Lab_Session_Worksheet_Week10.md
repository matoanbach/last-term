# DPS921 Parallel Algorithms and Programming Techniques

## Week 10 Guided Lab Worksheet

**Value:** 1% of Lab 4 marks

# OpenMP Parallelization of π Approximation

## Learning Goals

By the end of this guided lab session, students should be able to:

- Compile and execute an OpenMP program.
- Identify data dependencies in a sequential algorithm.
- Parallelize a numerical integration loop using OpenMP.
- Understand thread-local computation and reduction of partial results.

## Student Information

- **Student Name:** Ma Toan Bach
- **Student's Seneca email:** mbach@myseneca.ca
- **Sudent ID:** 112708227
- **Section:** NAA
- **Submission Date:** July 16, 2026

---

## Exercise 1: Environment Verification (15 minutes)

### 1.1 Verify OpenMP Support

Create and execute a simple OpenMP program.

**Program:** `exercise1.cpp`

```cpp
#include <iostream>
#include <omp.h>

int main()
{
    #pragma omp parallel
    {
        int id = omp_get_thread_num();
        int total = omp_get_num_threads();

        printf("Hello from thread %d of %d\n", id, total);
    }

    return 0;
}
```

Compile and execute the program.

### Example Output

> **Note:** The order of the output may differ because threads execute concurrently.

```text
Hello from thread 0 of 8
Hello from thread 1 of 8
...
```

### Your Output

```text
Hello from thread 0 of 8
Hello from thread 4 of 8
Hello from thread 3 of 8
Hello from thread 1 of 8
Hello from thread 2 of 8
Hello from thread 7 of 8
Hello from thread 6 of 8
Hello from thread 5 of 8
```

### Questions

#### 1. How many threads were created by default?

**Answer:**

```text
8 threads were created by default on this Mac. In general, OpenMP usually
creates a number of threads equal to the available logical CPU cores unless
that value is changed explicitly.
```

#### 2. Name two ways to control the number of OpenMP threads.

**Answer:**

```text
1. Set the OMP_NUM_THREADS environment variable.
2. Call omp_set_num_threads(...) in the program.
```

---

## Exercise 2: Understanding the Serial π Program (20 minutes)

Open the following file from the Lab-4 repository:

`exercise3.cpp` includes both the serial baseline and the first manual OpenMP version.

Review the main computation loop and identify what each iteration computes.

### Example

```cpp
for (long i = 0; i < steps; i++)
{
    double x = (i + 0.5) * step;
    sum += 4.0 / (1.0 + x*x);
}
```

### 2.1 Identify Parallelism

Answer the following questions.

#### Question 1

Which loop can be parallelized?

**Answer:**

```text
The main loop over i can be parallelized:

for (long i = 0; i < steps; i++)

Each iteration computes one rectangle contribution to the numerical integral.
```

#### Question 2

Why can iterations execute independently?

Consider:

- Does iteration `i` depend on iteration `i - 1`?
- Which variable causes a potential race condition when the loop is parallelized?

**Answer:**

```text
The iterations are independent because iteration i does not depend on
iteration i - 1. Each iteration computes its own x value and its own function
evaluation. The variable that causes a potential race condition is sum, because
multiple threads could try to update it at the same time.
```

---

## Exercise 3: First OpenMP Version (Naive Approach) (45 minutes)

In this version, each thread accumulates its own partial sum before the final results are combined.

### Design

```text
Thread 0 → partial[0]
Thread 1 → partial[1]
Thread 2 → partial[2]
...
```

Final result:

```cpp
sum = partial[0] + partial[1] + ...
```

This version is implemented in `exercise3.cpp`.

### 3.1 Create Thread Partial Storage

Declare a shared array that stores one partial sum per thread.

Initialize every element to zero.

### 3.2 Parallelize the Loop

Use:

```cpp
#pragma omp parallel
```

Inside the parallel region:

1. Obtain the thread ID:

   ```cpp
   int id = omp_get_thread_num();
   ```

2. Compute the partial sum assigned to the current thread.

### 3.3 Combine Results

After the parallel region:

```cpp
for (int i = 0; i < num_threads; i++)
{
    sum += partial[i];
}
```

### Checkpoint 1

Run your program using the following thread counts:

```bash
OMP_NUM_THREADS=1
OMP_NUM_THREADS=2
OMP_NUM_THREADS=4
```

Record the following results:

> **Speedup formula:**  
> Speedup = Serial Execution Time ÷ Parallel Execution Time

These measurements were collected using the default `100000000` steps in
`exercise3.cpp`.

| Threads | Execution Time (ms) | Speedup |
|--------:|--------------------:|--------:|
| 1       | 349.3960 | 1.0185x |
| 2       | 180.7080 | 1.9420x |
| 4       | 93.9952  | 3.7262x |

### Questions

#### 1. Does increasing the number of threads always improve performance?

**Answer:**

```text
No. Increasing the number of threads does not always improve performance.
Thread creation, synchronization overhead, memory contention, and load
imbalance can reduce or even eliminate the benefit of adding more threads.
```

#### 2. Why can multiple threads updating the same `sum` variable simultaneously produce incorrect results?

**Answer:**

```text
If multiple threads update the same sum variable at the same time, their read,
modify, and write operations can overlap. This race condition can cause lost
updates and produce an incorrect final value.
```

#### 3. Why is the final accumulation performed outside the parallel region?

**Answer:**

```text
The final accumulation is performed outside the parallel region so each thread
can safely build its own partial sum first. After the parallel work is done,
the partial sums are combined once in a controlled way without a race
condition.
```

---

## Exercise 4: Introduce OpenMP Reduction (Optional Discussion)

OpenMP also provides a reduction clause that automatically combines partial results:

```cpp
#pragma omp parallel for reduction(+:sum)
```

Discuss:

- How reduction works.
- Why it avoids race conditions.
- Why this lab asks you to implement the manual approaches before using OpenMP's reduction clause.

**Answer:**

```text
The reduction clause gives each thread its own private copy of sum during the
parallel loop. At the end of the loop, OpenMP combines all private copies using
the specified operator, such as +. This avoids race conditions because threads
are not updating the same shared sum at the same time. The lab asks for the
manual approach first so students understand the underlying idea of thread-
local partial results before relying on OpenMP to automate the combination.
```

---

## Deliverables

Submit the following through the Blackboard submission link:

- Completed guided lab worksheet.
- Source code developed during the lab session.

---

**☆★☆★☆★☆★☆★☆★☆★☆★☆★☆**

## Good Luck!

**☆★☆★☆★☆★☆★☆★☆★☆★☆★☆**
