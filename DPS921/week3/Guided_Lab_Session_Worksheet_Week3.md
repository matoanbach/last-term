# DPS921 Parallel Algorithms and Programming Techniques

## Week 3 Guided Lab Worksheet

**Weight:** 0.7% for Lab 1 marks  
**Topic:** Multithreaded Programming: Execution, Speedup, and Performance Analysis

---

## Learning Goals

By the end of this lab, you should be able to:

- Run multithreaded programs with different configurations
- Apply basic parallel decomposition strategies
- Understand data parallel vs. task parallel execution
- Measure and interpret speedup and efficiency
- Identify overheads and scalability limits in multithreaded systems

---

## Student Information

**Student Name:** ___________________________________________________  
**Student's Seneca email:** ____________________________________________  
**Sudent ID:** _______________________________________________________  
**Section:** NAA  
**Submission Date:** _________________________________________________

---

## Part 1: Observing Parallel Execution (25-30 min)

### Task 1.1: Run your Week #2's program using 1 thread configuration

Run your Week #2's program using **1 thread configuration** as the baseline case with the same input size (`n`) as Week #2.

**Write recorded runtime:**


**Note:** Running with 1 thread provides a baseline for comparison with multi-threaded configurations.

### Task 1.2: Run with multiple threads

Try:

- 1 thread
- 2 threads
- 4 threads
- 8 threads

Record results.

| Threads | Time (ms/sec) |
|---:|---|
| 1 |  |
| 2 |  |
| 4 |  |
| 8 |  |

---

## Part 2: Speedup and Efficiency Analysis (25-30 min)

### Task 2.1: Compute speedup

```text
Speedup = T1 / Tp
```

where:

- `T1` = time with 1 thread
- `Tp` = time with `p` threads

Fill the table using your measured 1-thread runtime as `T1`.

| Threads | Time | Speedup | Efficiency |
|---:|---|---:|---:|
| 1 |  | 1.0 | 1.0 |
| 2 |  |  |  |
| 4 |  |  |  |
| 8 |  |  |  |

**Important:** Use `T1` = runtime with 1 thread as baseline.

### Task 2.2: Efficiency

```text
Efficiency = Sp / p
```

where:

- `Sp` = speedup
- `p` = number of threads

Update the above table including efficiency in the last column.

**Note:** Efficiency values range from 0 to 1, or equivalently 0% to 100%.

---

## Part 3: Parallel Patterns (30-40 min)

Parallel programs can be designed using different decomposition strategies depending on how work is divided among threads. In this part, you will relate these patterns to your Week #2 multithreaded program.

Insert below the key function from Week #2 responsible for parallel execution. This is the function where threads are created and the workload is divided among them.

**Your Week #2's code goes here:**

```cpp

```

### Task 3.1: Data Parallel Pattern

Run your Week #2 threaded program and answer:

**Where in your program is the input data divided among threads?**  
Answer:


**What is each thread processing?**  
Answer:


**Are threads performing the same operation?**  
Answer:


**Key idea:**  
“Each thread performs the same computation on different chunks of data.”

### Task 3.2: Task Parallel Pattern

Consider the following scenario:

A program has three threads:

- "Thread 1 reads input"
- "Thread 2 performs computation"
- "Thread 3 logs results"

Compare this design with your Week #2 implementation and answer the following with reasons:

**Is this the same as your Week #2 program?**  
Answer:


**What is different about how work is divided?**  
Answer:


**Key idea:**  
“Work is divided by function instead of data.”

### Task 3.3: Master-Worker Model

In your Week #2 program:

**Which thread acts as the "master"?**  
Answer:


**Which tasks does it coordinate or manage?**  
Answer:


**What do worker threads do?**  
Answer:


Now consider:

**Does your Week #2 program implementation follow this model fully or partially?**  
Answer:


**Hint:** Think about main thread vs. worker threads.

These patterns describe different ways of organizing work in parallel programs and help explain why some programs scale better than others.

---

## Part 4: Understanding Parallel Limits (30-40 min)

### 1. Why does increasing the number of threads, for example 8 threads, not result in proportional 8x speedup?

Answer:


### 2. What is thread overhead?

Answer:


### 3. What is the role of memory bandwidth?

Answer:


### 4. What happens when threads outnumber CPU cores?

Answer:


### 5. What is load imbalance, and how can uneven workload distribution among threads reduce performance?

Answer:


### 6. Based on this lab, what factors determine whether a multithreaded program will scale well?

Answer:


---

☆★☆★☆★☆★☆★☆★☆★☆★☆★☆

**Good Luck!**

☆★☆★☆★☆★☆★☆★☆★☆★☆★☆
