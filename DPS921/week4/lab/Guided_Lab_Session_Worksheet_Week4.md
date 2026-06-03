# DPS921 Parallel Algorithms and Programming Techniques

## Week 4 Guided Lab Worksheet

**Weight:** 1% for Lab 2 marks  
**Topic:** MPI Setup, Visual Studio Integration, and Basic MPI Programming (Windows + MS-MPI)

## Learning Goals

By the end of this guided lab session, students should be able to:

- Verify Microsoft MPI installation
- Configure MPI projects in Visual Studio
- Compile and link MPI programs in Visual Studio
- Execute MPI applications using `mpiexec` with multiple processes
- Understand the MPI process model
- Identify MPI process rank and process count
- Write a basic MPI program using standard MPI functions
- Distinguish sequential execution from MPI parallel execution

## Student Information

**Student Name:** _________________________________________________

**Student's Seneca email:** ____________________________________________

**Student ID:** _______________________________________________________

**Section:** NAA

**Submission Date:** _________________________________________________

## Environment / Platform Notes

This lab is designed primarily for Windows systems using Microsoft MPI (MS-MPI) with Visual Studio. However, if a Windows environment is not available, students may complete the lab using an alternative operating system such as Linux or macOS, provided that:

- A compatible MPI implementation is used, such as Open MPI or MPICH
- Programs are compiled using standard MPI compilers, such as `mpicc` or `mpicxx`
- Execution is performed using `mpiexec` or `mpirun`

### Document Requirement

Students using non-Windows systems must clearly document:

- The operating system used
- The MPI implementation used
- Any differences in compilation commands
- Any differences in execution commands

> **Important Note:** Non-Windows submissions must reproduce equivalent functionality using standard MPI, such as Open MPI or MPICH. All deviations in commands or environment setup must be clearly documented.

# Part 1: Verifying MPI Installation

**Time:** 25 minutes

## Task 1.1: Verify MPI Runtime (`mpiexec`)

### Step 1

Open one of the following:

- Developer Command Prompt for Visual Studio
- Windows Command Prompt

### Step 2

Run:

```bash
mpiexec
```

**Expected output:** Students should see MS-MPI usage/help information, such as:

```text
Microsoft MPI Process Manager
```

**[Answer] Command executed:**

____________________________________________

**[Answer] What did the terminal show? Copy or summarize.**

______________________________________________

_______________________________________________

## Task 1.2: Verify MPI Compilation Test: Visual Studio Build Test

### Step 1

Create a simple MPI program in Visual Studio, such as:

```c
#include <mpi.h>

int main(int argc, char** argv) {
    MPI_Init(&argc, &argv);
    MPI_Finalize();
    return 0;
}
```

### Step 2

Build the program in Visual Studio:

```text
Build -> Build Solution
```

**[Answer] Write the name of the file you wrote your program in:**

____________________________________________

**[Answer] Did you modify the MPI test program provided? (yes/no):**

____________________________________________

**If yes, briefly describe the changes made:**

____________________________________________

**[Answer] Include screenshot of the output observed:**

____________________________________________

## Task 1.3: Verify MPI Execution

### Step 1

Run the program using:

```bash
mpiexec -n <number_of_processes> <executable_name>
```

**[Answer] Execution command used:**

______________________________________

**[Answer] Number of processes used:**

_________________________________________

**[Answer] Output observed:**

_________________________________________

# Part 2: Sequential Baseline Execution

**Time:** 35 minutes

## Task 2.1: Compile and Execute the Sequential Program

Students compile and execute the sequential program `q1sequential.c` provided for Lab 2 in GitHub Classroom.

Students should:

- Compile the sequential program
- Execute with different input sizes and record timing results
- Observe runtime changes
- Verify correctness results

### Suggested runs

```bash
q1sequential.exe 1000000
q1sequential.exe 5000000
q1sequential.exe 10000000
```

For Windows.

### Record results

| Array Size | Initialization Time | Computation Time | Total Time |
|---|---|---|---|
| 1M |  |  |  |
| 5M |  |  |  |
| 10M |  |  |  |
| 50M (if system allows) |  |  |  |

**[Answer] Does execution time increase with input size? Explain briefly:**

_________

**[Answer] In the sequential program used, what is the range of values stored in the array in the beginning?**

______

**[Answer] What computation is applied to each element of the received array by the process function in the program?**

_______

# Part 3: Writing a Basic MPI Program

**Time:** 40 minutes

## Task 3.1: Create an MPI Program

Students must write a basic MPI program from scratch.

### Requirements

The program must:

- Initialize MPI
- Determine process rank
- Determine total number of processes
- Print process information
  - Example: `Hello from rank 2 of 4`
- Finalize MPI

### Required MPI Functions

Students must use:

- `MPI_Init`
- `MPI_Comm_rank`
- `MPI_Comm_size`
- `MPI_Finalize`

## Task 3.2: Execute with Different Process Counts

Students must run their MPI program using:

- 1 process
- 2 processes
- 4 processes
- 8 processes

**[Answer] Execution command used:**

__________________________

**[Answer] Execution command used:**

__________________________

**[Answer] Execution command used:**

__________________________

**[Answer] Execution command used:**

__________________________

**[Answer] For 4 processes' observation, summarize processes, rank, execution order, and its difference from sequential execution:**

____________________________________________

## Task 3.3: Simple Point-to-Point Communication: Rank 0 -> Rank 1

Modify your program so that:

### Rank 0

- Sends integer value `42` to rank 1 using `MPI_Send`

### Rank 1

- Receives the value using `MPI_Recv`
- Prints the received value

### All other ranks

- Print only their rank

### Requirements

- Use `MPI_INT`
- Use `tag = 0`
- Use `MPI_COMM_WORLD`

---

☆★☆★☆★☆★☆★☆★☆★☆★☆★☆

**Good Luck!**

☆★☆★☆★☆★☆★☆★☆★☆★☆★☆
