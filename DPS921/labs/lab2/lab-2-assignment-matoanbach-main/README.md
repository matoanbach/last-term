[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/xtuHTDgp)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=24029038&assignment_repo_type=AssignmentRepo)
# Lab Activity 2 (5%)

## Due Date - Sunday July 7, 2026 (Late Policy: 10% per day)

## Learning Outcomes

* compile and execute MPI programs on Windows
* use MPI collective communication routines
* partition data among processes
* measure execution time using MPI timing functions
* verify correctness of distributed computations



## Environment Setup

This lab uses Microsoft MPI with Microsoft Visual Studio on Windows systems.

This lab must be executed on either:

* the assigned laboratory computer, or
* a personal laptop/desktop system with sufficient multicore CPU capability and logical processors to support MPI experimentation.

  * In case if your personal system uses an alternate operating systems such as macOS or Linux, you may use a compatible MPI implementation such as Open MPI or MPICH, provided that your program supports standard MPI functionality and can be compiled and executed using mpiexec or mpirun.

The system used for this lab should provide sufficient physical CPU cores and logical processors to support experiments using multiple MPI processes (for example: 4, 8, 16, and 32 processes).

Verify MPI installation and development tool availability before beginning the exercises. Refer to the Guided Lab sessions (Week #4 and Week #5) for instructions on:

* verifying MPI installation,
* configuring MPI with Visual Studio,
* compiling MPI programs,
* and executing MPI applications using mpiexec.

## Question 1: Sequential Baseline and Execution Profiling (20%)

The given program (q1sequential.c) generates an array of random values, discretizes each value into either 0 or 1, and reports the number of zeros and ones.



### Execution Requirements

Execute the program on your laboratory computer or a personal system with sufficient multicore processing capability, using different array sizes and collect timing data.

Run the program with at least the following array sizes:

* 1,000,000
* 5,000,000
* 10,000,000
* 50,000,000 (if system resources allow)

### Experimental Procedure

For each array size:

* record execution time,
* verify correctness of output,
* repeat the experiment at least **3 times**
* compute and report the **average execution time**

### Analysis

Briefly explain:

* why the sequential version is required as a baseline for MPI performance evaluation and speedup computation
* how execution time changes with increasing input size, and whether the trend appears linear or nonlinear
* what this baseline implies about the **limits of parallel performance improvement**.



## Question 2: MPI Parallel Implementation (45%)

Complete the partial MPI implementation provided (q2parallel.c) to create a correct distributed-memory parallel program using MPI.

Your task is to transform the given sequential logic into a parallel implementation using MPI, without changing the core algorithm.

### Required MPI Operations

Your implementation must correctly use the following MPI functions:

* MPI\_Scatter - to distribute portions of the input array across processes
* local computation - each process performs discretization and counting on its assigned data only
* MPI\_Reduce - to combine partial results into a global count
* MPI\_Wtime() - to measure execution time of the parallel region

### Implementation Constraints

* You are not allowed to change the algorithm, only parallelize it.
* Each process must operate only on its assigned portion of the array
* No process should access or modify data outside its allocated segment
* The final result must be computed using MPI collective communication (no manual aggregation)

### Correctness Requirements

Your MPI program must satisfy all of the following:

* The output must match the sequential implementation exactly
* The global count must equal the sum of all local process counts
* Each process must correctly compute results independently on its data segment

### Process Responsibilities

In your report, clearly describe:

* the role of each MPI process in the computation
* how the input array is partitioned across processes
* what data is communicated between processes (and why)
* how MPI collectives replace manual communication in your design

### Experimental Requirements

Run your MPI program using:

* 2, 4, 8, 16, and 32 processes
For each configuration:
* verify correctness of output against the sequential version
* record execution time using MPI\_Wtime()
* ensure consistent input size across all tests

### Performance Observation

Briefly comment on:

* how execution time changes as the number of processes increases
* whether the performance scales proportionally
* any noticeable overhead from communication and synchronization



## Question 3: Scalability and Performance Analysis (35%)

In this question, you will evaluate the performance of your MPI implementation by studying how it scales with increasing problem size and number of processes.

### Strong scaling study

In this experiment, the total problem size remains fixed, while the number of processes increases.

Choose one fixed problem size:

* 10,000,000 elements or
* 50,000,000 elements

Run your MPI program using:

* 1, 2, 4, 8, 16, 32 processes

For each run:

* record execution time using MPI\_Wtime()
* ensure all runs use the same input dataset to ensure fair comparison



### Weak scaling study

In this experiment, the problem size increases proportionally with the number of processes, keeping the workload per process approximately constant.

Use the following configuration:

|Processes|Problem Size|
|-|-|
|1|1M|
|2|2M|
|4|4M|
|8|8M|
|16|16M|
|32|32M|

For each configuration:

* record execution time
* ensure the per-process workload remains consistent

### Performance Metrics

Using your collected data, compute:

* Speedup
* Parallel efficiency

(Use the sequential execution time from Question 1 as the baseline for speedup calculation)



### MPI Communication Behavior Analysis

Provide a technical explanation of your observations. In particular, discuss:

* why increasing the number of processes does not always reduce execution time
* how data distribution using MPI\_Scatter introduces communication overhead
* how result aggregation using MPI\_Reduce introduces synchronization cost
* why performance improvement eventually saturates despite adding more processes

Your explanation should relate performance behavior to MPI communication and computation balance.

### Visualization Requirements

You must include graphs for both strong and weak scaling:

#### Required plots:

* Execution time vs number of processes
* Speedup vs number of processes
* Efficiency vs number of processes

#### Separate analysis must be provided for:

* strong scaling results
* weak scaling results

All graphs must include:

* axis labels
* units where applicable
* clear legends

### Optimal Configuration Analysis

Based on your results, identify and justify:

* the optimal number of processes for each problem size
* cases where increasing process count leads to degraded performance
* the balance point between computation and communication overhead

Your justification must be based on experimental evidence, not assumptions.



## Deliverables

* MPI modified source code, summary report
* Report

Report must include:

* description of MPI implementation
* explanation of Scatter/Reduce usage
* strong scaling analysis
* weak scaling analysis
* performance discussion
* conclusion on MPI efficiency



The reports are to be submitted in a single file (Section 1 - Question 1, Section 2 - Question 2, Section 3 - Question 3) on **Blackboard**.  Code, files containing the raw data collected and files used to generate visualizations should be uploaded to **your assigned GitHub repository**.



Note that you will explain your work in a discussion with the professor.  This discussion will be worth 25% of your grade.

