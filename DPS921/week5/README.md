# Week 5 README: MPI Collective Communication Patterns

## Overview

Week 5 continues MPI, but the focus moves from basic point-to-point communication to **collective communication patterns**.

The main idea is:

> Instead of only one process sending to one other process, many MPI processes communicate together using collective operations.

These patterns are important in **high performance computing (HPC)** systems, where many processes run across a cluster or supercomputer.

---

## What to Focus On

Based on the week material, focus on these topics:

1. MPI collective communication
2. Common MPI patterns
3. `MPI_Barrier`
4. `MPI_Bcast`
5. `MPI_Scatter`
6. `MPI_Gather`
7. `MPI_Reduce`
8. `MPI_Alltoall`
9. Pipeline model
10. HPC systems and supercomputer-style programming

---

## Background: Why Collective Communication Matters

In MPI, each process has its own rank and memory. To solve a large problem, the work is usually divided among many processes.

Collective communication helps processes:

- share common data
- split work
- synchronize
- combine results
- exchange data with all other processes

This is useful for problems like:

- image processing
- array computation
- simulations
- statistics
- step-by-step stream processing
- high performance computing workloads

---

## Pattern 1: Scatter → Compute → Gather

### Main Idea

This pattern is used when one process has a large dataset and wants to divide it among multiple processes.

```text
Root process
    |
    | Scatter
    v
Multiple processes compute their own part
    |
    | Gather
    v
Root process collects final results
```

### Use Cases

- Image processing
- Array computation
- Data-parallel tasks

### MPI Functions

| Function | Purpose |
|---|---|
| `MPI_Scatter` | Splits data from the root process and sends chunks to all processes |
| Local computation | Each process works on its own chunk |
| `MPI_Gather` | Collects processed chunks back to the root process |

### Example Concept

If rank 0 has:

```text
[10, 20, 30, 40, 50, 60, 70, 80]
```

With 4 processes, each process receives 2 values:

```text
Rank 0: [10, 20]
Rank 1: [30, 40]
Rank 2: [50, 60]
Rank 3: [70, 80]
```

Each process can compute on its local values. Then `MPI_Gather` brings the results back to rank 0.

---

## Pattern 2: Broadcast → Compute → Reduce

### Main Idea

This pattern is used when all processes need the same input data, but each process computes a partial result.

```text
Root process broadcasts shared data
    |
    v
All processes compute partial results
    |
    v
Reduce combines partial results into one final result
```

### Use Cases

- Simulations
- Statistics
- Summation
- Maximum/minimum calculation
- Scientific computing

### MPI Functions

| Function | Purpose |
|---|---|
| `MPI_Bcast` | Sends the same data from one root process to all processes |
| Local computation | Each process computes a partial result |
| `MPI_Reduce` | Combines all partial results into one result |

### Example

Each process has a local value:

```text
Rank 0: 1
Rank 1: 2
Rank 2: 3
Rank 3: 4
```

Using `MPI_Reduce` with `MPI_SUM`, rank 0 can receive:

```text
1 + 2 + 3 + 4 = 10
```

Other common reduce operations:

| Operation | Meaning |
|---|---|
| `MPI_SUM` | Sum values |
| `MPI_PROD` | Multiply values |
| `MPI_MAX` | Find maximum value |
| `MPI_MIN` | Find minimum value |

---

## Pattern 3: Pipeline Model

### Main Idea

The pipeline model is used when computation happens in steps.

```text
P1 → P2 → P3 → P4
```

Each process performs one stage of the work, then passes the result to the next process.

### Use Cases

- Streaming
- Step-by-step computation
- Data processing pipelines

### Simple Example

```text
Process 1 reads data
Process 2 filters data
Process 3 transforms data
Process 4 stores or outputs data
```

This is similar to an assembly line.

---

## Pattern 4: Broadcast + Scatter + Compute + Gather + Reduce

### Main Idea

This is a more complex HPC pattern. It combines multiple collective operations in one algorithm.

```text
Broadcast shared information
        |
Scatter input data
        |
Each process computes
        |
Gather results
        |
Reduce final answer
```

### Why It Matters

In real HPC systems, algorithms often need more than one communication operation. For example:

- Some information must be shared with everyone using broadcast.
- Large data must be divided using scatter.
- Each process computes locally.
- Results are collected using gather.
- Final values may be combined using reduce.

This kind of pattern appears in large cluster and supercomputer environments.

---

## MPI_Barrier

### Purpose

`MPI_Barrier` is used to make all processes wait until everyone reaches the same point.

```text
Process 0 ----|
Process 1 ----|---- MPI_Barrier ----> continue together
Process 2 ----|
Process 3 ----|
```

No process continues past the barrier until all processes have arrived.

### Correct Usage

```cpp
MPI_Barrier(MPI_COMM_WORLD);
```

### Important Note

A complete MPI program should still call:

```cpp
MPI_Init(&argc, &argv);
MPI_Finalize();
```

The barrier example from the material shows the concept, but a full working version needs the communicator argument and MPI initialization/finalization.

---

## MPI_Bcast

### Purpose

`MPI_Bcast` broadcasts data from one root process to every process in the communicator.

```text
Rank 0 has data
    |
    v
Rank 0, Rank 1, Rank 2, Rank 3 all receive the same data
```

### Example Function Call

```cpp
MPI_Bcast(
    sendbuf,
    5,
    MPI_INT,
    0,
    MPI_COMM_WORLD
);
```

### Meaning of Parameters

| Parameter | Meaning |
|---|---|
| `sendbuf` | Data buffer |
| `5` | Number of items |
| `MPI_INT` | Data type |
| `0` | Root process |
| `MPI_COMM_WORLD` | Communicator |

### Key Point

Before broadcast, only the root process has valid data. After broadcast, every process has the same data.

---

## MPI_Scatter and MPI_Gather

### MPI_Scatter

`MPI_Scatter` divides data from the root process and sends one part to each process.

```cpp
MPI_Scatter(
    sendbuf,
    2,
    MPI_INT,
    recvbuf,
    2,
    MPI_INT,
    0,
    MPI_COMM_WORLD
);
```

### MPI_Gather

`MPI_Gather` collects data from every process and stores it on the root process.

```cpp
MPI_Gather(
    recvbuf,
    2,
    MPI_INT,
    gatherbuf,
    2,
    MPI_INT,
    0,
    MPI_COMM_WORLD
);
```

### Simple Flow

```text
Rank 0 scatters data
Each rank receives a chunk
Each rank modifies its chunk
Rank 0 gathers all modified chunks
```

---

## MPI_Reduce

### Purpose

`MPI_Reduce` combines values from all processes into one result.

Example:

```cpp
MPI_Reduce(
    &local_value,
    &global_result,
    1,
    MPI_INT,
    MPI_MAX,
    0,
    MPI_COMM_WORLD
);
```

### Meaning

Each process sends its `local_value`. MPI combines the values using the selected operation.

In the provided example, the operation is:

```cpp
MPI_MAX
```

So the result is the maximum value, not the sum.

### Important Note

If the code uses `MPI_MAX`, then a variable name like `global_sum` can be confusing. A clearer name would be:

```cpp
int global_max = 0;
```

---

## MPI_Alltoall

### Purpose

`MPI_Alltoall` lets every process send data to every other process.

```text
Every process sends something to every process
Every process receives something from every process
```

### Example

Each rank prepares a send buffer:

```cpp
sendbuf[i] = rank * 10 + i;
```

So with 4 processes:

```text
Rank 0 sends: 0 1 2 3
Rank 1 sends: 10 11 12 13
Rank 2 sends: 20 21 22 23
Rank 3 sends: 30 31 32 33
```

After `MPI_Alltoall`, each rank receives one item from every other rank.

### Use Case

`MPI_Alltoall` is useful when data must be redistributed among all processes.

---

## HPC Context

The lecture connects these MPI patterns to **HPC systems**.

HPC systems are large-scale computing systems made of many connected computers or servers. MPI is useful because work can be distributed across many processes running on many machines.

Examples mentioned in the material include:

- Niagara supercomputer
- WestGrid
- supercomputer clusters

These systems are potential areas for software development work, especially for people interested in parallel programming, distributed systems, and scientific computing.

---

## Common Compile and Run Commands

### Compile

```bash
mpic++ main.cpp -o main
```

or:

```bash
mpicxx main.cpp -o main
```

### Run with 4 processes

```bash
mpirun -np 4 ./main
```

or:

```bash
mpiexec -np 4 ./main
```

---

## Practice Checklist

You should be able to explain:

- What collective communication means
- The difference between point-to-point and collective communication
- What `MPI_Barrier` does
- What `MPI_Bcast` does
- What `MPI_Scatter` does
- What `MPI_Gather` does
- What `MPI_Reduce` does
- What `MPI_Alltoall` does
- When to use Scatter → Compute → Gather
- When to use Broadcast → Compute → Reduce
- What the pipeline model means
- Why MPI is useful in HPC systems

---

## Quick One-Page Summary

Week 5 focuses on MPI collective communication patterns. Unlike point-to-point communication, collective communication involves many processes at the same time.

The first major pattern is **Scatter → Compute → Gather**, where the root process splits data among processes, each process computes locally, and the root collects the results. This is useful for image processing and array computation.

The second pattern is **Broadcast → Compute → Reduce**, where the root process sends shared data to everyone, each process computes a partial result, and the results are combined. This is useful for simulations and statistics.

The third pattern is the **Pipeline Model**, where processes work in stages, such as `P1 → P2 → P3 → P4`. This is useful for streaming and step-by-step computation.

The fourth pattern combines multiple operations: **Broadcast + Scatter + Compute + Gather + Reduce**. This is common in high performance computing systems.

Important MPI functions for this week are `MPI_Barrier`, `MPI_Bcast`, `MPI_Scatter`, `MPI_Gather`, `MPI_Reduce`, and `MPI_Alltoall`. These functions are useful when building parallel programs for clusters and supercomputers.