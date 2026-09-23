## Week 8 - Thrust - high-level GPU programming
- Question 1: Thrust provides many high-level algorithms such as transform, sort, and reduce. Explain how these algorithms simplify GPU programming compared to writing custom CUDA kernels. Discuss both the advantages and possible limitations of using library-based algorithms.
    - Thrust provides ready-made GPU algorithms like transform, sort, and reduce.
    - It simplifies GPU programming because you do not need to write custom CUDA kernels, thread indexing, or lauch configuration manually.
    - Advantages:
        - shorter and cleaner code
        - faster development
        - easier debugging and maintenance
        - optimized implementations for common parallel tasks
    - Disadvantages:
        - less low-level control tran custom kernels
        - may use extra temporary memory or add overhead
        - not ideal for highly specialized algorithms or fine-tuned optimizations

- Question 2: Sorting is often performed before searching or grouping data. Explain why sorting can improve the efficiency of many parallel algorithms. Discuss how Thrust's sorting and searching algorithms can be used together in data processing applications.
    - Sorting improves efficiency because ordered data is easier to search, compare, and group.
    - After sorting, parallel algorithms can use faster methods such as binary search instead of checking every element.
    - Sorting also helps bring equal or related values together, which makes grouping, counting, duplicate removal, and range queries more efficient.
    - In Thrust, `thrust::sort` can first organize the data.
    - Then searching algorithms such as `thrust::binary_search`, `thrust::lower_bound`, and `thrust::upper_bound` can quickly find values or ranges in the sorted data.
    - These algoritms work well together in data processing tasks such as:
        - finding whether a value exists
        - locating all records with the same key
        - grouping similar items
        - preparing data for reduction or aggregation

- Question 3: A prefix-sum (scan) operation is considered one of the fundamental building blocks of parallel algorithms. Explain what a scan operation produces and describe at least two applications where prefix-sums are useful in parallel programming.
    - A prefix-sum, or scan, produces running totals from an input array.
    - Example:
        - input: [2, 4, 3, 1]
        - output: [2, 6, 9, 10]
    - Prefix-sums are useful in parallel programming because they help compute positions, offsets, and cumulative results efficiently.
    - Applications:
        - Range sums: Once prefix-sums are computed, sums over a range can be found quickly without adding every element again.
        - Image processing: Scan can help compute cumulative counts, pixels offsets, or output positions in parallel image operations.

## Week 9 - CUDA Memory and Optimization
- Question 1: Explain the roles of threads, thread blocks, and grids in CUDA execution. Why is choosing an appropriate block size important for GPU performance? Discuss how block and grid configuration can influence hardware utilization and execution efficiency.
    - In CUDA, a thread is the smallest execution unit. Each thread usually works on one data element, such as one array index or one pixel.
    - Threads are grouped into thread blocks. Threads in the same block can:
        - cooperate using shared memory
        - synchronize with `__synthreads()`
    - Threads blocks are grouped into a grid. The grid represent the full kernel launch and allows the GPU to process large problems using many blocks.
    - Block size is important because GPU hardware executes threads in warps of 32.
    - If the block size is chosen well, the GPU can schedule warps efficiently and keep more cores busy.
    - Common block sizes such as 128, 256, or 512 are often good because they are multiples of 32.
    - Block and grid configuration affects performance in several ways:
        - too few blocks can leave GPU resources idle
        - very small blocks can increase scheduling overhead
        - poorly chosen block sizes can reduce occupancy
        - good configurations improve hardware utilization and execution efficiency


- Question 2: Global memory is large but relatively slow, whereas shared memory is smaller but much faster. Explain the differences between these two memory types and describe a situation where using shared memory would significantly improve the performance of a CUDA kernel.
    - Global memory is large and can be accessed by all threads, but it is relatively slow.
    - Shared memory is much smaller, but it is on-chip and much faster.
    - Global memory is used for large datasets, while shared memory is useful for data that threads in the same block need to reuse.
    - Using shared memory improves performance when the same data would otherwise be read from global memory many times.
    - Examples:
        - in matrix multiplication or convolution, threads in a block can first load data into shared memory
        - then they reuse that data for multiple calculations
        - this reduces slow global memory accesses and makes the kernel faster.

- Question 3: CUDA streams enable asynchronous execution of operations such as kernel launches and memory transfers. Explain what asynchronous execution means in CUDA and discuss how overlapping computation with memory transfers can improve overall application performance. Why might asynchronous execution not always lead to significant performance gains?
    - In CUDA, asynchronous execution means operations can start without waiting for ealier ones to fully finish on the CPU side.
    - For example, a memory copy and a kernel launch can be placed in different streams so the GPU can work on them at the same time.
    - This can improve performance because:
        - the GPU can compute while data is being transferred.
        - less time is wasted waiting between steps
        - hardware resources are used more efficiently.
    - Example:
        - while one chunk of data is being copied to the GPU, another chunk can already be processed by a kernel
    - However, asynchronous execution does not always give big speedups because:
        - the work may not be large enough
        - transfers and kernels may depend on each other
        - the GPU may not have enough resources to overlap both operations well
        - the overhead of managing streams may reduce the benefit

## Week#10 - OpenMP and preventing race conditions
- Question 1: A simple OpenMP program uses the #pragma omp parallel directive to create multiple threads. Explain what happens when the program enters and exits a parallel region. Describe how OpenMP manages thread creation and synchronization automatically.
    - When the program enters a `#pragma omp parallel` region, the main thread creates a team of threads.
    - These threads run the code inside the parallel region at the same time.
    - When the parallel region ends, the threads are synchronized automatically, and the extra threads finish.
    - After that, the program continues with a single thread again.
    - OpenMP manages this automatically:
        - it creates the threads
        - assigns the work
        - waits for all threads to finish before leaving the parallel region

- Question 2: OpenMP variables can be shared or private. Explain the difference between shared and private variables. Why is understanding variable scope important for both program correctness and performance? Provide an example where using the wrong variable scope could produce incorrect results.
    - Shared variables are used by all threads, so every thread can read or change the same value.
    - Private variables give each thread its own separate copy.
    - Variable scope is important because:
        - for correctness, the wrong scope can cause race conditions and wrong answers
        - for performance, too much sharing can require extra synchronization and slow the program down
    ```cpp
    int sum = 0;
    #pragram omp parallel for
    for (int i = 0; i < 100; i++) {
        sum += i;
    }
    ```
    - Here, `sum` is shared by all threads.
    - Multiple threads may update sum at the same time, so the result can be incorrect.

- Question 3: Compare manual partitioning and implicit partitioning in OpenMP. Explain how work is divided among threads in each approach and discuss the advantages and disadvantages of allowing OpenMP to perform automatic work sharing using #pragma omp parallel for.
    - Manual parititioning means the programmer divides the work by hand.
    - Each thread is assigned a specific part of the loop or data.
    - Example:
        - thread 0 handles one range
        - thread 1 handles another range
    - Implicit partitioning means OpenMP divides the work automatically.
    - This is usually don ewith `#pragma omp parallel for`
    - In this case, OpenMP decides how to split the loop iterations among threads.
    - Advantages of manual partitioning:
        - full control over how work is divided
        - useful for special cases
    - Disvantages of manual partitioning:
        - more code to write
        - easier to make mistakes
        - harder to maintain
    - Advantages of implicit partitioning:
        - simpler to write
        - less error-prone
        - OpenMP handles thread management automatically
    - Disadvantages of implicit partitioning:
        - less control over exact work distribution
        - may not be ideal for every problem

## Week#11 - OpenMP - Loop Parallelism and Performance awareness
- Question 1: Data dependencies limit the amount of parallelism that can be extracted from a loop. Explain the different types of dependencies that can exist between loop iterations and why these dependencies prevent direct parallel execution. Provide an example of a loop that cannot be parallelized due to dependency.
    - A dependency happens when one loop iteration needs data from another iteration.
    - Common types are:
        - true dependency: a later iteration reads a value written by an ealier one
        - an-dependency: a later iteration writes to a location that an earlier iteraetion still needs to read
        - output dependency: two iterations write to the same location
    - These dependencies prevent direct parallel execution because iteraions are no longer independent.
    - If iterations run at the same time, on read may use a value before another thread has correctly produced it.
    - Example of a loop that cannot be parallelized directly:
    ```cpp
    for (int i = 1; i < n; i++) {
        A[i] = A[i - 1] + 5;
    }
    ```
    - This loop has a true dependency because each iteration needs the result from the previous iteration.
    - So iterations must run in order, not all at once.

- Question 2: Nested loops are common in scientific and engineering applications. Explain different approaches for parallelizing nested loops in OpenMP. Discuss the advantages and disadvantages of parallelizing the outer loop versus the inner loop.
    - OpenMP can parallelize nested loops in three main ways:
        - outer loop
        - inner loop
        - collapse(2)
    - Outer loop paralleliziation is most common:
        - Each thread handles one or more rows
        - Advantage: lower overhead and usually better performance
        - disadvantage: if there are only a few outer-loop iterations, there may not be enough work
    - Inner loop parallelization:
        - Each thread handles part of the inner loop
        - advantage: useful if the outer loop is very small
        - disadvantage: more overhead and usually less efficient
    - collapse(2):
        - combines both loops into one one larger set of iterations
        - advantage: better load balancing when the outer loop has two few iterations

- Question 3: OpenMP provides different scheduling strategies such as static, dynamic, and guided scheduling. Explain how these scheduling methods divide loop iterations among threads and discuss when each scheduling strategy is appropriate.
    - Static scheduling divides the loop into fixed parts before execution starts.
    - Each thread gets a set of iterations in advance
    - Best for:
        - loops where all iterations take about the same time
        - low-overhead, regular workloads

    - dynamic scheduling gives threads small chunks while the program is running
    - when a thread finished its chunk, it asks for more work
    - best for:
        - loops where some iterations take longer than others
        - irregular workfloads with ueven work

    - guided scheduling is similar to dynamic scheduling, but it starts with larger chunk and gradually gives smaller ones.
    - Best for:
        - large loops
        - workfloads that need a balance between good load sharing and lower overhead

## Week#12 - Design patterns and applied model comparison
- Question 1: Compare SPMD and MPMD execution models. Why is MPMD more naturally supported by MPI than OpenMP?
    - SPMD stands for Single Program, Multiple Data.
    - In SPMD, all processes or threads run the same program, but each works on different data.

    - MPMD stands for Multiple Program, Multiple Data.
    - In MPMD, different processes can run different programs, and each program can work on different data.

    - MPI supports MPMD more naturally because MPI is based on separate processes.
    - Each process can be launched as a different executable, so it is easy for different processes to do different roles

    - OpenMP is mainly designed for threads inside one shared-memory program.
    - All threads usually run within the same executable, so it is more natural for OpenMP to follow the SPMD style.

- Question 2: A matrix multiplication application can be implemented using OpenMP, MPI, or CUDA. Explain how the decomposition pattern remains the same while the implementation changes.
    - The decomposition pattern stays the same because the problem is still divided into smaller pieces of work.
    - In matrix multiplication, the work is usually split by:
        - rows
        - columns
        - or blocks of the output matrix
    
    - what changes is how that work is assigned and executed
    - OpenMP:
        - work is divided among threads on the same shared-memory machine
        - threads can access the same arrays directly
    
    - MPI:
        - work is divided among separate processes
        - each process handles part of the matrix and communincates data using message passing
    
    - CUDA:
        - work is divided among many GPU threads
        - each thread usually computes one element or one small tile of the result matrix
     
    - So the decomposition idea is the same:
        - split the matrix multiplication into independent subproblems
    - But the implementation changes based on the programming model:
        - OpenMP uses shared-memory threads
        - MPI uses distributed processes and communication
        - CUDA uses massive GPU parallelism

- Question 3: Explain how task parallelism is implemented differently using OpenMP tasks, MPI workers, and CUDA kernels.
    - OpenMP tasks use threads inside one shared-memory program.
    - The programmer creates tasks, and the OpenMP runtime schedules those tasks to available threads.
    - This works well when tasks are irregular or when different parts of a program can run independently.
    - MPI workers use separate processes.
    - A master process usually sends work to worker processes using message passing.
    - Each worker runs its assigned task and sends results back.
    - This is useful for distributed systems where memory is not shared.
    - CUDA kernels implement task parallelism on the GPU.
    - Work is launched as many GPU threads inside a kernel.
    - Each thread performs a small piece of the task in parallel.
    - This is best for tasks that can be broken into many similar operations.

## Week#13 - Load balancing, Scalability, Debugging
- Question 1: Why is load balancing important for achieving good parallel performance? Explain why dividing an equal number of tasks among processors does not always guarantee balanced execution.

- Question 2:  Explain why increasing the number of processors does not always improve the performance of a parallel program. Discuss the roles of communication overhead, synchronization, and load imbalance in limiting scalability.

- Question 3: Explain what a race condition is and why race conditions are difficult to detect and reproduce in parallel programs. Provide an example scenario and discuss possible solutions.