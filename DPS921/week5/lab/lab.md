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
