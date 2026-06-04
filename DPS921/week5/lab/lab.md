# DPS921 Parallel Algorithms and Programming Techniques

## Week 5 Guided Lab Worksheet (1% for Lab 2 marks)

### MPI Collective Communication, Timing, and Scalability

## Learning Goals

By the end of this guided lab session, students should be able to:

- distribute data using MPI collective communication
- collect data using MPI collective communication
- implement local computation on distributed data
- measure execution time using MPI timing functions
- compare sequential and parallel performance
- observe performance behaviour with different process counts
- discuss communication overhead and synchronization behavior

## Student Information

Student Name: ___________________________________________________

Student's Seneca email: ____________________________________________

Sudent ID: _______________________________________________________

Section: NAA

Submission Date: _________________________________________________

## Important Assumptions

- All arrays used in this lab must satisfy:

```text
n % number_of_processes == 0
```

- Each process works on an equal-sized chunk:

```text
chunk_size = n / number_of_processes
```

- All programs must be executed using `mpiexec`.

## Part 1: Extending Point-to-Point Communication (35-40 minutes)

Start from Week#4 Task 3.3.

Students modify their existing MPI program from Week#4.

### Task 1.1 – Send Arrays Instead of Single Values

**Rank 0:**

- creates array
- sends portions to workers using `MPI_Send`

**Workers:**

- receive portions using `MPI_Recv`

**Concepts:**

- buffers
- array communication
- message size
- datatypes

### Task 1.2 – Perform Local Computation

**Workers:**

- process received values
- compute local results

**Concepts:**

- local work
- distributed memory

### Task 1.3 – Return Results to Root

**Workers:**

- send processed arrays back

**Root:**

- reconstructs full result

**Concepts:**

- gather-like behavior
- manual coordination

### Part 1 Explanation / Code Link

For Part 1, the manual point-to-point version is shown in `part1_manual_send_recv.cpp`.

- Task 1.1: Rank 0 creates the full input array and sends one chunk to each worker using `MPI_Send`. The workers receive their assigned chunk using `MPI_Recv`.
- Task 1.2: After receiving its chunk, each process performs local computation on its own local buffer only. In this example, each value is incremented by 1.
- Task 1.3: After local processing, each worker sends its processed chunk back to rank 0 using `MPI_Send`. Rank 0 receives all processed chunks using `MPI_Recv` and reconstructs the final result array.

This version demonstrates the communication pattern clearly, but it requires more manual coordination because the root process must explicitly manage every send and receive.

## Part 2: Collective Communication (45-50 minutes)

### Task 2.1 – Replace Manual Distribution with MPI_Scatter

Replace:

```text
MPI_Send
MPI_Recv
```

with:

```text
MPI_Scatter
```

**Discussion:**

- fewer lines
- easier coordination
- collective participation

### Task 2.2 – Replace Manual Collection with MPI_Gather

Students replace manual returns with:

```text
MPI_Gather
```

**Concepts:**

- root collection
- structured communication

### Task 2.3 – Compare Manual vs Collective Versions

Students discuss:

- code complexity
- readability
- scalability
- synchronization

This is extremely valuable conceptually.

### Part 2 Explanation / Code Link

For Part 2, the collective communication version is shown in `part2_scatter_gather.cpp`.

- Task 2.1: The manual distribution logic is replaced with `MPI_Scatter`, which automatically sends equal-sized chunks from the root process to all processes.
- Task 2.2: The manual collection logic is replaced with `MPI_Gather`, which automatically collects the processed local chunks back to rank 0.
- Task 2.3: Compared with the manual version, the collective version uses fewer lines of code, is easier to read, and is easier to scale because the communication pattern is expressed directly through MPI collectives instead of many explicit sends and receives.

In both versions, every process still participates in the computation, but the collective version is cleaner and reduces the chance of mismatched communication logic.

## Part 3: MPI Program Structure Analysis (15 minutes)

### Task 3.1 – Read and Analyze the Code

Open `q2parallel.c` and carefully review the program structure.

Answer the following:

**Q1. What is the role of the root process (rank 0)?**

____________________________________

**Q2. What is the role of the worker process (rank > 0)?**

_________________________________________

**Q3. What is stored in:**

**data (on root only)?**

____________________________________________

**local (on all processes)?**

______________________________________________

**result (on root only)?**

_____________________________________________________

---

☆★☆★☆★☆★☆★☆★☆★☆★☆★☆

Good Luck!

☆★☆★☆★☆★☆★☆★☆★☆★☆★☆
