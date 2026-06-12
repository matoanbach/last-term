## Midterm Analysis and Problem-Solving Questions

*The problems below are not an indication of the midterm test question-types or difficulty.*

## Week 1 Topics

Parallel Platforms, Complexity, and Performance Measures

### Question 1

A software application designed for single-core CPUs shows only limited performance improvement when run on a modern multicore processor. Analyze possible architectural and software-related reasons for this behavior.

**Sample answer:**

| Factor | Impact on Scalability and Performance |
|---|---|
| Limited parallelism | Large parts of the application may still execute sequentially, so extra cores cannot be used effectively. |
| Serial fraction | By Amdahl's Law, the sequential part limits the maximum possible speedup no matter how many cores are available. |
| Synchronization overhead | Threads may spend time waiting on locks, barriers, or shared resources instead of doing useful work. |
| Load imbalance | Some cores may finish early while others continue working, leaving hardware underused. |
| Data dependencies | Parts of the computation may depend on earlier results, reducing the amount of work that can safely run in parallel. |
| Thread management overhead | Creating, scheduling, and coordinating threads adds runtime cost that can offset the gains from parallelism. |
| Memory bandwidth limits | Multiple cores may compete for memory access, causing stalls and reducing performance growth. |
| Cache contention | Threads can interfere with each other's use of shared caches, lowering efficiency. |

**Analysis:** The limited improvement suggests that the application is not exposing enough useful parallel work to match the multicore hardware. Even if more cores are available, sequential code, synchronization, data dependencies, and memory-system bottlenecks can all prevent near-linear speedup. In practice, software that was originally designed for one core often needs algorithmic changes, not just recompilation, to benefit from multiple cores.

A strong recommendation is to profile the program and identify the hottest sequential sections and the major contention points. Developers can then refactor those parts to expose more task-level or data-level parallelism, reduce synchronization, and improve load balance. Memory access patterns should also be optimized so that the multicore processor is not bottlenecked by bandwidth or cache contention.

### Question 2

A researcher claims that a program with a large serial fraction can still scale efficiently on thousands of processor cores. Analyze whether this claim is consistent with the predictions of Amdahl's Law and Gustafson-Barsis Law. Compare how the two laws interpret scalability and explain under what conditions the researcher's claim may be valid.

**Sample answer:**

| Aspect | Amdahl's Law | Gustafson-Barsis Law |
|---|---|---|
| Assumption about problem size | Assumes a fixed problem size. | Assumes the problem size grows with the number of processors. |
| View of serial fraction | The serial portion stays a hard limit on speedup. | The serial portion becomes a smaller fraction of the total execution time as workload scales. |
| Impact of increasing cores | Speedup eventually levels off because the serial fraction cannot be parallelized. | Speedup can continue to grow if the extra processors are used to solve a larger problem. |
| Scalability prediction | Predicts diminishing returns as more cores are added. | Predicts much better scalability for large, growing workloads. |
| Support for the claim | Generally does not support the claim if the serial fraction is large. | May support the claim if workload size scales with processor count. |

**Analysis:** Amdahl's Law suggests that the claim is weak if the program truly has a large serial fraction and the problem size is fixed. In that model, even thousands of cores cannot overcome the sequential bottleneck, so speedup saturates early. From Amdahl's perspective, a large serial fraction is fundamentally bad for scalability.

Gustafson-Barsis Law gives a more optimistic interpretation because it assumes that larger parallel systems are used to solve larger problems. Under that assumption, the parallel portion grows while the serial part becomes relatively less important. Therefore, the researcher's claim may be valid under Gustafson-Barsis Law for scaled workloads, but it is generally not supported by Amdahl's Law for fixed-size workloads.

## Week 2 Topics

Threads and Concurrency

### Question 1

A program launches eight threads that all update the same global counter variable. Analyze the potential problems that may occur and explain how they could affect program correctness.

**Sample answer:**

| Problem | How It Occurs | Impact on Correctness |
|---|---|---|
| Race condition | Multiple threads access and update the same counter at the same time without synchronization. | The final result depends on timing and may change across runs. |
| Lost updates | Two or more threads read the same old value before either writes back the incremented result. | Some increments disappear, so the counter ends up smaller than expected. |
| Non-atomic operation | An expression like `counter++` is really a read, add, and write sequence, not one indivisible step. | Partial interleavings can produce incorrect results. |
| Memory visibility issue | One thread may update the counter, but another may not immediately observe the newest value without synchronization. | Threads may read stale values and make decisions based on outdated state. |

**Analysis:** The overall problem is that the shared counter is being modified concurrently without protection. This creates nondeterministic behavior, so the program may produce a different final count each time even if the same work is performed. The core correctness issue is that shared updates are not coordinated safely.

The standard fix is to protect the counter with a synchronization mechanism such as a mutex or to replace it with an atomic variable if the update is simple enough. Either approach ensures that each increment is applied safely and that the final count is correct.

### Question 2

The following table shows the execution time of a program as the number of threads increases:

| Threads | Execution Time (seconds) |
|---|---:|
| 1 | 100 |
| 2 | 55 |
| 4 | 30 |
| 8 | 18 |
| 16 | 15 |

Analyze the performance behavior shown in the table. Explain why speedup is not linear and identify possible architectural or software-related reasons for the observed trend.

**Sample answer:**

| Performance Factor | Analysis of Effect |
|---|---|
| Serial fraction | Some part of the program likely remains sequential, which limits maximum speedup as predicted by Amdahl's Law. |
| Synchronization overhead | Threads may spend time waiting for locks, barriers, or joins instead of computing. |
| Memory bandwidth limits | As more threads run, they may compete for memory access, reducing the benefit of extra parallelism. |
| Load imbalance | Some threads may have more work than others, so processors are not all busy for the same amount of time. |
| Thread management overhead | Creating and coordinating more threads adds software overhead that becomes more visible at higher thread counts. |
| Diminishing returns | The improvement from 8 to 16 threads is small, showing that the program is nearing scalability saturation. |

**Analysis:** The table shows clear speedup as the thread count increases, but the speedup is sublinear. If scaling were ideal, doubling the threads would roughly halve the execution time, but that trend does not continue. The biggest sign of diminishing returns appears between 8 and 16 threads, where the time improves only from 18 seconds to 15 seconds.

This trend is consistent with a combination of serial work, synchronization overhead, memory-system contention, and load imbalance. A reasonable optimization would be to reduce synchronization and improve data locality, since both changes can lower overhead and help the program make better use of additional threads.

## Week 3 Topics

Parallel Patterns and Introduction to Design Patterns

### Question 1

Explain why designing a parallel program is often more difficult than designing a sequential program. What factors must be considered when exposing parallelism?

**Sample answer:**

| Challenge | Why it is Difficult in Parallel Programming | Impact on Design |
|---|---|---|
| Task decomposition | The work must be broken into pieces that can run concurrently, which is not always natural for the problem. | The programmer must choose a good decomposition strategy and avoid excessive overhead. |
| Data dependencies | Some tasks depend on the results of other tasks, so they cannot run freely in parallel. | Dependencies reduce available concurrency and may force ordering constraints. |
| Synchronization overhead | Threads or processes often need locks, barriers, or message coordination to remain correct. | Too much synchronization can reduce or cancel performance gains. |
| Load balancing | Different processors or threads may receive unequal amounts of work. | Poor balance leaves some hardware idle while other units stay busy. |
| Memory consistency | Shared-memory systems can suffer from races, stale values, and inconsistent views of memory. | Shared data must be protected carefully with mutexes, atomics, or other coordination tools. |
| Scalability limits | More processors do not guarantee proportional speedup because of serial code and overhead. | The design must minimize bottlenecks if it is expected to scale. |
| Task granularity | Tasks that are too small create too much overhead; tasks that are too large may underuse the hardware. | Granularity must be chosen so the cost of coordination does not dominate useful work. |

**Analysis:** Parallel program design is harder because the programmer must think about both correctness and performance at the same time. In a sequential program, the control flow is usually straightforward, but in a parallel program the work must be split carefully, dependencies must be respected, and shared resources must be coordinated safely.

When exposing parallelism, it is not enough to simply create more threads or tasks. The design must also ensure that enough independent work exists, that the work is balanced, and that synchronization and communication costs do not overwhelm the potential speedup. A parallel design succeeds only when it preserves correctness and delivers enough useful concurrency to justify the added complexity.

### Question 2

A company wants to parallelize a large image-processing application. Analyze how the PCAM methodology could be applied to this problem. Discuss possible tasks, communication requirements, aggregation opportunities, and task mapping decisions.

**Sample answer:**

| PCAM Stage | Application to Image Processing | Analysis of Design Impact |
|---|---|---|
| Partitioning | Split the image into rows, tiles, or rectangular regions so each task processes a subset of pixels. | This exposes data parallelism naturally because many pixel operations are independent. |
| Communication | Neighboring regions may need to exchange boundary or halo pixels for operations such as blur, convolution, or edge detection. | Communication is necessary for correctness, but too much boundary exchange can reduce speedup. |
| Agglomeration | Combine tiny pixel-level tasks into larger tiles or blocks before assigning work. | This reduces scheduling and communication overhead while still preserving useful parallelism. |
| Mapping | Assign tiles to processors or threads so each gets roughly the same amount of work, possibly using static or dynamic assignment. | Good mapping improves load balance and helps the program scale across processors. |

**Analysis:** PCAM provides a structured way to design the image-processing solution. Partitioning identifies the available parallel work, communication identifies the data exchange that must happen across boundaries, agglomeration reduces overhead by combining small tasks into larger ones, and mapping places those tasks onto processors in a balanced way.

For large image workloads, PCAM helps the designer manage the key trade-off between granularity and communication cost. A tile-based design with limited boundary exchange and balanced mapping is usually a strong choice because it exposes substantial parallelism while keeping overhead under control.

## Week 4 Topics

MPI Fundamentals and Point-to-Point Communications

### Question 1

An MPI application uses the SPMD model with 32 processes. Analyze how the same executable can perform different tasks on different processes despite running identical code.

**Sample answer:**

| Mechanism in SPMD | How It Works in MPI | Analysis of Different Process Behavior |
|---|---|---|
| Process rank | Each process calls `MPI_Comm_rank()` to learn its unique rank within the communicator. | Rank gives each process an identity, which allows different roles to emerge from the same code. |
| Process count | Each process calls `MPI_Comm_size()` to learn how many processes are participating. | The total size affects data partitioning and determines how much work each process should do. |
| Conditional statements based on rank | The program uses `if (rank == 0)`, `else if`, or similar tests. | The same executable can branch into different logic paths, such as root behavior versus worker behavior. |
| Data distribution | Different ranks receive different chunks of the input data. | Even when the code is identical, different local data leads to different effective work. |
| Role assignment | Rank 0 often acts as a coordinator, while other ranks perform worker computations. | SPMD can still express master-worker style behavior through rank-based logic. |
| Communication patterns | Send/receive or collective operations connect processes with different roles and different data. | Communication is what allows the identical program image to behave as a coordinated parallel system. |

**Analysis:** In SPMD, all processes run the same executable, but they do not necessarily do the same work. Different behavior emerges because each process can identify its rank, determine the total number of processes, and branch based on those values. That means one program image can still implement root-worker coordination, data partitioning, and differentiated communication.

The key idea is that identical code does not imply identical behavior at runtime. Different ranks, different input partitions, and different control-flow decisions allow the SPMD model to support rich parallel structure while keeping deployment simple.

## Week 5 Topics

MPI Collectives and Practical Patterns

### Question 1

A large array stored on Process 0 must be divided equally among all processes for parallel processing. Analyze which collective communication operation should be used and justify your choice.

**Sample answer:**

| Communication Method | Suitability for Problem | Analysis of Use Case |
|---|---|---|
| `MPI_Scatter` | Most suitable | It is designed to split data from one root process into equal-sized chunks and distribute one chunk to each process. |
| `MPI_Bcast` | Unsuitable for equal partitioning | Broadcast sends the same full data to everyone, which wastes memory and communication when each process needs only one chunk. |
| `MPI_Gather` | Unsuitable | Gather moves data from all processes back to the root, which is the opposite of what this problem requires. |
| Point-to-point `MPI_Send`/`MPI_Recv` | Possible but less efficient and less convenient | Manual sends and receives can implement distribution, but they require more code and coordination than the collective designed for this exact pattern. |

**Analysis:** The best collective operation for this problem is `MPI_Scatter` because the communication pattern is exactly one-to-many distribution of equal-sized partitions. Process 0 owns the full array, and each process needs only its own local chunk for parallel work. Scatter expresses that intent directly and usually benefits from MPI library optimizations.

Compared with manual point-to-point communication, `MPI_Scatter` reduces code complexity and lowers the chance of mismatched sends and receives. Compared with `MPI_Bcast`, it avoids sending unnecessary data to every process. For this use case, scatter is the clearest and most efficient choice.

## Week 6 Topics

CUDA Fundamentals and Introduction to Thrust

### Question 1

A program processes millions of independent data elements using the same computation. Analyze whether the workload is a good candidate for CUDA acceleration and justify your reasoning.

**Sample answer:**

| Factor | Analysis of CUDA Suitability | Impact on Performance |
|---|---|---|
| Data parallelism | The same operation is applied to many elements, which matches CUDA's preferred workload style very well. | Strong positive impact because GPUs are designed for large-scale data-parallel work. |
| Task independence | Independent elements can be processed by separate GPU threads with little or no coordination. | High independence reduces synchronization overhead and improves scalability. |
| SIMT suitability | Repeating the same computation across many elements fits the SIMT execution model and warp-based scheduling. | Threads are more likely to stay efficient if they follow the same control flow. |
| Memory transfer cost | Input and output data must move between host and device memory. | If transfers dominate the total time, GPU gains may be reduced or lost. |
| Compute intensity | If each element requires enough useful computation, the GPU can amortize transfer and launch overhead. | Higher compute-to-memory ratio improves the chance of strong speedup. |
| GPU utilization | Millions of elements provide enough work to keep many GPU threads and warps active. | Good utilization helps the GPU hide latency and sustain high throughput. |

**Analysis:** This workload is generally an excellent candidate for CUDA acceleration because it has the two most important properties: large-scale data parallelism and task independence. Millions of elements provide enough work to fill the GPU, and the fact that the same computation is applied repeatedly aligns well with CUDA's SIMT model.

The main condition is that host-device transfer cost must not dominate the runtime. Performance gains are most likely when the per-element computation is large enough to justify copying the data to the GPU and launching kernels. Under those conditions, CUDA should provide substantial acceleration compared with a CPU-only implementation.
