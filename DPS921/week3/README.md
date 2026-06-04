# Focus Guide: Chapter 02 — Multicore Program Design

## Purpose of This Summary

This markdown summarizes what to focus on for Chapter 02 based on the provided agenda and lecture slides.

Agenda:

- 2.1 Introduction
- 2.2 PCAM Methodology
- 2.3.1 Task Parallelism
- 2.3.2 Divide-and-Conquer
- 2.3.3 Geometric Decomposition
- 2.3.5 Pipeline Decomposition
- 2.4.3 Master–Worker
- 2.4.4 Map-Reduce
- 2.4.5 Fork/Join
- 2.5 Matching Patterns with Program Structure

The strongest focus should be on **PCAM**, **decomposition patterns**, **program structure patterns**, and how to match a decomposition pattern with a program structure pattern.

---

## 1. What to Focus On

Focus most on these topics:

1. PCAM methodology
2. Task dependency graphs
3. Decomposition patterns
4. Task parallelism
5. Divide-and-conquer
6. Geometric decomposition
7. Pipeline decomposition
8. Program structure patterns
9. Master-worker
10. Map-reduce
11. Fork/join
12. Matching decomposition patterns with program structures

Lower priority, but still useful:

- Image convolution PCAM example
- Pipeline performance analysis
- Prefix-sum / Blelloch prefix-sum details
- Loop parallelism
- SPMD and MPMD

---

## 2. Big Picture

Chapter 02 is about **how to design parallel programs**.

The main question is:

> Given a problem, how do we break it into pieces that can run at the same time?

There are two major ideas:

1. **Decomposition pattern**  
   How we split the problem.

2. **Program structure pattern**  
   How we organize the parallel program.

Example:

```text
Problem: process a large image

Decomposition pattern:
Split the image into pieces.

Program structure pattern:
Use master-worker or SPMD to assign pieces to workers.
```

---

## 3. PCAM Methodology

PCAM stands for:

```text
Partitioning
Communication
Agglomeration
Mapping
```

PCAM is a method for designing parallel programs.

---

### 3.1 Partitioning

Partitioning means:

```text
Break the computation into as many small pieces as possible.
```

There are two common types:

| Type | Meaning |
|---|---|
| Functional decomposition | Split by functions/tasks |
| Data/domain decomposition | Split by data |

Example:

```text
Functional decomposition:
read input, process data, render output

Data decomposition:
split an image into regions
```

---

### 3.2 Communication

Communication means identifying:

```text
Which tasks need to exchange data?
How much data must move between tasks?
```

This creates a **task dependency graph**:

```text
Nodes = tasks
Edges = communication/dependencies between tasks
```

Important idea:

> Communication slows down parallel programs, so we want to reduce unnecessary communication.

---

### 3.3 Agglomeration

Agglomeration means:

```text
Group smaller tasks together into bigger tasks.
```

Why?

Because too many tiny tasks can create too much communication overhead.

The slides mention a rule of thumb:

```text
The number of task groups should be about one order of magnitude larger than the number of compute nodes.
```

Example:

```text
If you have 8 compute nodes,
you might want around 80 task groups.
```

This gives enough tasks for load balancing without creating too much overhead.

---

### 3.4 Mapping

Mapping means:

```text
Assign task groups to processors/compute nodes.
```

The goals are:

1. Load balance the nodes
2. Reduce communication overhead

Simple idea:

```text
Give each processor about the same amount of work.
Keep communicating tasks close together if possible.
```

---

## 4. PCAM Example: Image Convolution

The slides use **image convolution** as an example.

Image convolution is used for:

- blur effects
- noise filtering
- edge detection
- image processing

A kernel is a small matrix of weights applied to pixels.

High-level idea:

```text
For each pixel:
look at neighboring pixels
apply kernel weights
produce a new pixel value
```

Why this is useful for PCAM:

- Each pixel calculation can become a task.
- Neighboring pixels may need to communicate.
- Tasks can be grouped into image regions.
- Regions can be mapped to processors.

Focus on the design idea, not the full formula.

---

## 5. Decomposition Patterns

PCAM is general but can be time-consuming. Decomposition patterns are reusable ways to split problems.

The important decomposition patterns from the agenda are:

1. Task parallelism
2. Divide-and-conquer
3. Geometric decomposition
4. Pipeline decomposition

---

## 6. Task Parallelism

### Main Idea

Task parallelism means:

```text
Break the application into separate tasks/functions.
```

Each task may run at the same time as other tasks.

Example from the slides: game loop

```text
readUserInput()
drawScreen()
playSounds()
strategize()
```

Each function can become its own task.

---

### When to Use

Use task parallelism when:

- the program naturally has different independent tasks
- different functions can run at the same time
- tasks are known ahead of time

---

### Important Limitation

The slides say task parallelism usually does **not** have strong scalability.

Why?

Because the number of tasks may be limited.

Example:

```text
If the program only has 4 major tasks,
adding 64 processors will not help much.
```

---

### Barrier Concept

In the task parallelism example, tasks use barriers.

A barrier means:

```text
All tasks wait until everyone reaches the same point.
```

This keeps tasks synchronized between iterations.

---

## 7. Divide-and-Conquer

### Main Idea

Divide-and-conquer means:

```text
Split a big problem into smaller subproblems,
solve the subproblems,
then merge the solutions.
```

General structure:

```text
if problem is small:
    solve directly
else:
    split problem
    solve subproblems
    merge results
```

---

### Parallel Version

In a parallel version:

```text
Subproblems can run at the same time.
```

Example:

```text
Task 1 solves left half
Task 2 solves right half
Then merge the results
```

---

### Example: Merge Sort

Merge sort is a classic divide-and-conquer algorithm:

```text
Split array into halves
Sort each half
Merge sorted halves
```

Why it is parallelizable:

```text
The left half and right half can be sorted independently.
```

---

### What to Focus On

Know:

- base case
- splitting
- recursive subproblems
- merging
- why subproblems can run in parallel

---

## 8. Geometric Decomposition

### Main Idea

Geometric decomposition means:

```text
Split data based on its shape or dimensions.
```

This works well when data is organized as:

- arrays
- matrices
- grids
- images
- 2D/3D spaces

---

### Example

The slides use heat diffusion on a 2D surface.

A 2D grid can be split into regions:

```text
1D decomposition:
split into vertical or horizontal strips

2D decomposition:
split into blocks
```

---

### Why Communication Happens

Each region may need values from neighboring regions.

Example:

```text
A cell near the border of one block may need data from the neighboring block.
```

This creates communication between tasks.

---

### 1D vs 2D Decomposition

The slides compare 1D and 2D decomposition.

High-level idea:

- 1D decomposition is simpler.
- 2D decomposition can reduce communication for large grids.
- The better choice depends on communication cost, startup latency, problem size, and number of processors.

For this course, focus on the concept more than the formula.

---

## 9. Pipeline Decomposition

### Main Idea

Pipeline decomposition is like an assembly line.

```text
Stage 1 → Stage 2 → Stage 3 → Stage 4
```

Each stage performs a specific operation and passes data to the next stage.

---

### Pipeline Stage Structure

A pipeline stage usually does:

```text
initialize

while more data:
    read data from previous stage
    process data
    send data to next stage
```

---

### Examples

Pipeline decomposition appears in:

- CPU instruction pipelines
- signal processing
- graphics rendering
- shell command pipelines
- streaming systems

Example shell pipeline:

```bash
cat file.txt | grep "error" | sort
```

---

### Important Performance Idea

The slides say:

```text
Overall time is dominated by the slowest stage.
```

This means if one stage is much slower than the others, the whole pipeline slows down.

---

### Pipeline Terms

| Term | Meaning |
|---|---|
| Stage | One step in the pipeline |
| Latency | Time for one item to pass through the full pipeline |
| Rate/throughput | How many items are processed over time |
| Slowest stage | The bottleneck stage that limits performance |

---

## 10. Program Structure Patterns

Program structure patterns describe how the whole parallel program is organized.

The slides divide them into two categories:

---

### 10.1 Globally Parallel, Locally Sequential (GPLS)

Meaning:

```text
The whole application runs many tasks concurrently,
but each task itself runs sequentially.
```

Examples:

- SPMD
- MPMD
- Master-worker
- Map-reduce

---

### 10.2 Globally Sequential, Locally Parallel (GSLP)

Meaning:

```text
The main program looks sequential,
but some parts run in parallel when needed.
```

Examples:

- Fork/join
- Loop parallelism

---

## 11. Master-Worker

### Main Idea

Master-worker has two roles:

```text
Master:
    gives work to workers
    collects results
    may handle I/O or user interaction

Workers:
    receive work
    compute results
    send results back
```

---

### Why Use It

Master-worker is good for:

- dynamic work distribution
- implicit load balancing
- cases where tasks may take different amounts of time

---

### Weakness

The master can become a bottleneck.

Why?

Because all workers may depend on the master for work and result collection.

---

### Simple Example

```text
Master has 100 tasks.

Worker 1 finishes task → asks for another
Worker 2 finishes task → asks for another
Worker 3 finishes task → asks for another

Master keeps distributing tasks until done.
```

---

## 12. Map-Reduce

### Main Idea

Map-reduce is a variation of master-worker.

It has two main phases:

```text
Map phase
Reduce phase
```

---

### Map Phase

The map phase applies a function to input data and produces partial results.

Example:

```text
Input: documents
Map: count words in each document
Output: partial word counts
```

---

### Reduce Phase

The reduce phase combines partial results into a final result.

Example:

```text
Combine all partial word counts
Final output: total word counts
```

---

### Important Points

The slides mention:

- Map-reduce was made popular by Google’s search engine implementation.
- The master coordinates the work.
- Workers may run map tasks or reduce tasks.
- The number of map and reduce workers can be different.

---

## 13. Fork/Join

### Main Idea

Fork/join starts with one parent thread.

The parent creates child tasks at runtime.

```text
Parent
  ├── Child task 1
  └── Child task 2

Parent waits until children finish
Then parent continues
```

---

### Key Points

Fork/join has:

- one parent thread
- dynamic child task creation
- child tasks that run in parallel
- a join point where the parent waits

---

### Example: Parallel Quicksort

The slides use parallel quicksort.

High-level idea:

```text
If the array is small:
    sort sequentially
else:
    partition the array
    fork one task to sort one side
    sort the other side
    join/wait for the forked task
```

---

### OpenMP Connection

The slides say OpenMP uses this pattern.

So remember:

```text
Fork/join is important for OpenMP-style parallelism.
```

---

## 14. Matching Patterns with Program Structure

This section is about choosing which program structure fits each decomposition pattern.

The slide table shows that many decomposition patterns can work with multiple program structures.

High-level focus:

```text
Do not memorize every check mark.
Understand why some combinations make sense.
```

---

### Useful Matching Ideas

| Decomposition Pattern | Good Program Structure | Why |
|---|---|---|
| Task parallelism | Master-worker, fork/join, SPMD | Tasks can be assigned to workers or spawned dynamically |
| Divide-and-conquer | Fork/join | Recursive subproblems naturally fork and join |
| Geometric decomposition | SPMD, master-worker, map-reduce | Data regions can be assigned to processes |
| Pipeline decomposition | SPMD, MPMD, fork/join | Stages can run as different tasks/processes |
| Map-reduce style problems | Map-reduce | Natural map phase and reduce phase |

---

## 15. What Is Most Likely Important

Be able to answer these:

- What is PCAM?
- What are the four steps of PCAM?
- What is partitioning?
- What is communication?
- What is agglomeration?
- What is mapping?
- Why does communication overhead matter?
- What is a task dependency graph?
- What is task parallelism?
- Why does task parallelism have limited scalability?
- What is divide-and-conquer?
- Why is merge sort a divide-and-conquer example?
- What is geometric decomposition?
- What is the difference between 1D and 2D decomposition?
- What is pipeline decomposition?
- Why is the slowest pipeline stage important?
- What is master-worker?
- Why can the master become a bottleneck?
- What is map-reduce?
- What is fork/join?
- How do we match decomposition patterns with program structures?

---

## 16. Quick Comparison Table

| Topic | Simple Meaning | Example |
|---|---|---|
| PCAM | Method for designing parallel programs | Partition, communicate, group, map |
| Task parallelism | Split by independent tasks | game loop functions |
| Divide-and-conquer | Split problem recursively | merge sort, quicksort |
| Geometric decomposition | Split data by shape | image/grid regions |
| Pipeline decomposition | Split into stages | assembly line, signal pipeline |
| Master-worker | Master assigns tasks to workers | job queue |
| Map-reduce | Map partial results, reduce final result | word count |
| Fork/join | Parent spawns child tasks and waits | parallel quicksort |

---

## 17. One-Page Summary

Chapter 02 focuses on **parallel program design**. The main goal is to learn how to break a problem into parts that can run concurrently and then choose a good program structure for implementing it.

The most important design method is **PCAM**, which stands for **Partitioning, Communication, Agglomeration, and Mapping**. Partitioning breaks the problem into small tasks. Communication identifies data flow between tasks. Agglomeration groups tasks to reduce overhead. Mapping assigns task groups to processors while trying to balance load and reduce communication.

The key decomposition patterns are **task parallelism**, **divide-and-conquer**, **geometric decomposition**, and **pipeline decomposition**. Task parallelism splits work by function. Divide-and-conquer recursively splits a problem into smaller subproblems, such as merge sort. Geometric decomposition splits structured data such as arrays, images, and grids. Pipeline decomposition splits work into stages, like an assembly line, where the slowest stage controls overall performance.

The key program structure patterns are **master-worker**, **map-reduce**, and **fork/join**. Master-worker uses a master process to assign work and collect results from workers, but the master can become a bottleneck. Map-reduce uses a map phase to create partial results and a reduce phase to combine them. Fork/join creates child tasks dynamically and waits for them to finish before continuing; OpenMP uses this pattern.

The most important skill is being able to match a decomposition pattern with a program structure pattern. For example, divide-and-conquer often fits fork/join, geometric decomposition often fits SPMD or master-worker, and data aggregation problems often fit map-reduce.