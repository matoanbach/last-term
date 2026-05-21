## How we design parallel programs
1. Partitioning
2. Communication
3. Agglomeration
4. Mapping

## Task Parallelism
- In both cases, the tasks are independent.
    - In parameter-driven design: same function, different inputs (Download File, Play Music as arguments)
    - In function-driven design: different functions for different tasks.
- Since tasks are independent, no communication between threads is needed here.

## Divide-and-conquer
- Devide = split the problem
- Conquer = solve the smaller problems
- Combine = merge the results
```text

                 [ BIG PROBLEM ]
                       |
        ---------------------------------
        |                               |
 [ Subproblem A ]                [ Subproblem B ]
        |                               |
   -----------                     -----------
   |         |                     |         |
  A1        A2                    B1        B2
```

## Geometric Decomposition
### Data-driven Parallelism
- Instead of splitting tasks, we split the data across processors.
```txt
                    Same Operation
                          |
        ---------------------------------------
        |                  |                  |
        v                  v                  v
   Data Chunk 1       Data Chunk 2       Data Chunk 3
        |                  |                  |
        v                  v                  v
      Core 1             Core 2             Core 3
        |                  |                  |
        v                  v                  v
     Process            Process            Process
```
## Decomposition
### 1D Decomposition
    - SPlit in ONE direction only (rows and colums)
### 2D Decomposition
    - Split in both directions (rows and columns)
### Pipeline decomposition
- Task flow (sequential view): input -> stage 1 -> stage 2 -> stage 3 -> output
- Each item must pass through all stages.
### Master-Worker decomposition
- Master -> task distribution -> workers -> results aggregation
- Parallel execution across workers
### Map-Reduce
- Map-Reduce is a parallel programming model where data is first mapped into key-value pairs, then shuffled/grouped by key, and finally reduced by aggregating the values.
- Map-Reduce parallel model
```
                 Map-Reduce Parallel Model

                       INPUT DATA
                 [D1] [D2] [D3] [D4] [D5]
                            |
                            v
                       MAP STAGE
                  (parallel processing)
          M1        M2        M3        M4        M5
          |         |         |         |         |
          v         v         v         v         v
              Intermediate key-value pairs
```
- Reduce Phase
```
              Reduce Phase: Aggregating Results

                    INTERMEDIATE DATA
                     (key-value pairs)

              (A,1) (B,1) (A,1) (C,1) (B,1)
                            |
                            v
                       REDUCE STAGE
                    (group + aggregate)

                         A -> 2
                         B -> 2
                         C -> 1
```
- Full Map-Reduce Workflow
```
INPUT  ->  MAP  ->  SHUFFLE  ->  REDUCE  ->  OUTPUT
           |          |            |
           v          v            v
        Parallel    Grouping    Aggregation
       processing    phase        phase
```
### Fork-Join Decomposition
- Fork/Join is a parallel programming model where a main task is split into multiple subtasks that run in parallel, then the program waits for all subtasks to finish and combines their results.
- Simpler idea:
    - Fork = split work into parallel tasks
    - Join = wait for all tasks to finish
```txt
                 Fork/Join Parallel Decomposition

                         MAIN TASK
                             |
                             v
                           FORK
                             |
        ---------------------------------------------
        |                    |                      |
        v                    v                      v
     Task A               Task B                 Task C
        |                    |                      |
        ---------------------------------------------
                             |
                             v
                           JOIN
                             |
                             v
                       Final Result
```
- How Fork and Join Work
```txt
### Step 1
Main thread starts.

### Step 2: Fork
The main thread creates multiple worker threads.

- Thread 1 → Task A
- Thread 2 → Task B
- Thread 3 → Task C

### Step 3: Join
The main thread waits for all worker threads to finish.

### Step 4
The program continues execution and combines the results.
```
- Features of the Fork/Join Model
```
              Large Problem
                   |
                   v
                 Divide
                   |
                   v
            Parallel Subtasks
                   |
                   v
            Combine Results
```