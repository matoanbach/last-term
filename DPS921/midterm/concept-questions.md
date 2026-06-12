## Midterm Concept Questions

*The problems below are not an indication of the midterm test question-types or difficulty.*

## Week 1 Topics

Parallel Platforms, Complexity/Performance Measures

### Question 1

Explain what is meant by the era of multicore machines. Why did computer architecture shift from increasing clock speed to increasing the number of cores? Discuss the implications of this shift for software development.

**Sample answer:** The era of multicore machines refers to the period in computer architecture when performance improvements began to come primarily from increasing the number of processing cores on a chip rather than continually increasing processor clock speeds. Earlier generations of processors achieved higher performance by running at faster clock frequencies, but this approach eventually encountered physical limitations such as excessive power consumption, heat generation, and diminishing performance gains. To continue improving computational performance, manufacturers began designing processors with multiple cores capable of executing tasks simultaneously.

This shift had significant implications for software development. Programs that were written for single-core processors could not automatically take advantage of additional cores, since only one core might be actively performing useful work. As a result, developers increasingly needed to design software that exposes parallelism through techniques such as multithreading, multiprocessing, and task decomposition. The multicore era therefore made parallel programming an essential skill, requiring programmers to address challenges such as synchronization, communication, load balancing, and scalability in order to fully utilize modern hardware.

### Question 2

Describe the taxonomy of parallel computing systems. How do shared-memory and distributed-memory systems differ in structure and programming model? Explain why this classification is important when designing parallel algorithms.

**Sample answer:** The taxonomy of parallel computing systems is a way of classifying parallel machines based on how processors are organized and how they access memory. At a high level, parallel systems differ by the number of processors, whether memory is shared or separate, how processors communicate, and how scalable the system is. In practice, one of the most important distinctions is between shared-memory systems and distributed-memory systems.

In a shared-memory system, multiple processors or threads access the same global memory space, so communication happens by reading and writing shared variables. This leads to a programming model based on threads, critical sections, mutexes, atomics, and synchronization. In a distributed-memory system, each process has its own private memory, so communication must happen explicitly through message passing, as in MPI. This classification is important because the structure of the machine affects how algorithms should be decomposed, how data should be partitioned, how communication should be organized, and where performance bottlenecks are likely to appear. A design that works well for shared memory may be inefficient or even impractical on distributed memory, so matching the algorithm to the machine model is a key part of parallel program design.

### Question 3

Explain Gustafson-Barsis Law and how it differs from Amdahl's Law. Why does Gustafson's perspective provide a more optimistic view of parallel computing performance in real-world applications?

**Sample answer:** Gustafson-Barsis Law explains parallel performance from the perspective of scaling the problem size as more processors are added. Instead of assuming that we keep the same fixed problem and only try to make it run faster, it assumes that larger systems are often used to solve larger problems in about the same amount of time. In this view, the parallel portion of the work grows with the problem size, so the effect of the serial portion becomes less limiting.

This differs from Amdahl's Law, which assumes a fixed-size problem and shows that the serial part places a hard limit on the maximum possible speedup. Amdahl therefore gives a more pessimistic view, especially when the sequential portion is nontrivial. Gustafson's perspective is more optimistic because real-world high-performance computing often uses extra processors to handle more data, larger simulations, or higher resolution rather than only to reduce the runtime of a small fixed task. As a result, Gustafson-Barsis better reflects how parallel computers are often used in practice.

## Week 2 Topics

Threads and Concurrency

### Question 1

Explain what a thread is and how it differs from a process. Why are threads commonly used in parallel programming?

**Sample answer:** A thread is the smallest unit of execution within a program that can be scheduled independently by the operating system. Threads exist inside a process and share the same memory space, including code, data, and open resources. In contrast, a process is an independent program in execution with its own separate memory space. This means that while processes are isolated from each other, threads within the same process can communicate more easily because they operate on shared memory.

Threads are commonly used in parallel programming because they provide a lightweight and efficient way to achieve concurrency. Creating and managing threads requires less overhead compared to processes, making them faster to spawn and switch between. Since threads share memory, they can exchange data quickly without expensive inter-process communication mechanisms. This makes threads especially suitable for fine-grained parallelism, where multiple parts of a program can execute simultaneously while working on shared data. However, this shared memory model also introduces challenges such as race conditions and the need for synchronization mechanisms.

### Question 2

What are atomic data types or atomic operations? Explain how they help prevent race conditions in concurrent programs.

**Sample answer:** Atomic data types support operations that appear to happen as one indivisible step, even though they may involve several low-level actions internally. For example, an atomic increment should behave as a single safe update from the outside. This is useful for simple shared variables such as counters or flags, where multiple threads may read and modify the same value.

Atomic operations help prevent race conditions because they remove unsafe interleavings for simple updates. Without synchronization, an expression like `counter++` is really a read, a modification, and a write, so two threads can interfere with each other and lose updates. An atomic operation ensures that this shared update happens safely, so threads do not observe a partially completed change. However, atomic variables are most suitable for simple single-variable operations; for larger multi-step critical sections, a mutex is usually the better tool.

### Question 3

Compare a semaphore-based solution and a monitor-based solution to the producer-consumer problem. What advantages does the monitor approach provide?

**Sample answer:** In a semaphore-based solution to the producer-consumer problem, synchronization is managed explicitly using semaphore counters and usually a mutex. The semaphores track conditions such as how many buffer slots are available and how many resources are ready to be consumed, while the mutex protects the shared buffer itself. This approach works well, but the programmer must manually coordinate the order of acquire and release operations and ensure that all shared-state updates are protected correctly.

A monitor-based solution is a higher-level design approach that groups the shared data and the synchronized operations into one controlled structure. Instead of letting all threads directly manipulate the buffer, threads interact through methods such as `add()` and `remove()`, and the monitor handles the internal synchronization. The monitor approach provides better encapsulation, improves readability, and reduces the chance of synchronization mistakes. In practice, it makes producer-consumer code easier to reason about because the data and the rules for accessing that data are kept together.

## Week 3 Topics

Parallel Patterns and Introduction to Design Patterns

### Question 1

Explain the divide-and-conquer approach to parallel algorithm design. Why is this strategy often effective for recursive problems?

**Sample answer:** The divide-and-conquer approach is a parallel algorithm design strategy in which a problem is broken into smaller subproblems, each subproblem is solved independently (often in parallel), and the partial results are then combined to produce the final solution. The key idea is to repeatedly "divide" a large problem into smaller pieces until they become simple enough to solve directly, and then "conquer" the problem by merging those solutions in a structured way.

This strategy is particularly effective for recursive problems because many recursive algorithms naturally exhibit independent subproblems at each level of recursion. Since these subproblems often do not depend on each other, they can be executed concurrently on different processors or threads, improving performance. Examples include merge sort, quicksort, and tree-based computations. However, the effectiveness depends on balancing the workload and minimizing the overhead of task creation and result merging, since excessive decomposition can reduce performance gains.

### Question 2

Describe the master-worker pattern. What responsibilities are assigned to the master and worker components, and what types of applications commonly use this pattern?

**Sample answer:** The master-worker pattern is a program structure in which one component, the master, is responsible for assigning work, and multiple worker components perform the assigned tasks. The master breaks the problem into units of work, distributes those tasks to workers, keeps track of progress, and collects the results. Each worker receives a task, performs the computation, and returns its result to the master.

This pattern is commonly used when many tasks are independent or only loosely related, such as job queues, batch processing, image processing, data analysis, and other workloads where the same kind of computation must be applied repeatedly to different inputs. Its main advantage is simplicity of coordination, but the notes also emphasize that the master can become a bottleneck because all workers may depend on it for task assignment and result collection.

### Question 3

Why is it important to select a parallel pattern that matches the structure of a problem? Discuss the potential consequences of choosing an inappropriate pattern.

**Sample answer:** It is important to select a parallel pattern that matches the structure of the problem because different problems have different forms of decomposition, communication, and coordination. Some problems naturally fit divide-and-conquer, some fit geometric decomposition, some fit pipeline processing, and others fit master-worker or map-reduce. The goal is to choose a pattern that matches the problem's task dependencies and data layout so that work can be divided naturally and communication overhead stays manageable.

If an inappropriate pattern is chosen, the program may become harder to implement, harder to reason about, and less efficient. It can create unnecessary communication, poor load balancing, excessive synchronization, idle processors, and weak scalability. In the worst case, the program may be parallel in name only, with most of the available hardware underused because the chosen structure does not align with the actual work. Matching the pattern to the problem is therefore a major part of good parallel design.

## Week 4 Topics

MPI Fundamentals and Point-to-Point Communications

### Question 1

Explain the purpose of MPI in parallel computing. Why is MPI commonly used on distributed-memory systems?

**Sample answer:** Message Passing Interface (MPI) is a standardized programming model and library used to enable communication between processes in parallel computing. Its main purpose is to allow multiple processes to work together on a problem by explicitly exchanging data through message passing. Unlike shared-memory models, MPI does not assume that processes can directly access each other's memory, so all communication must be explicitly defined by the programmer.

MPI is commonly used on distributed-memory systems because each processor (or compute node) has its own private memory, and there is no shared address space. In such systems, data must be transferred between nodes over a network, making message passing the natural communication mechanism. MPI is designed to efficiently manage this communication, supporting both point-to-point and collective operations while scaling to thousands or even millions of processes in high-performance computing environments.

### Question 2

What are `MPI_Comm_rank()` and `MPI_Comm_size()`? Explain how they are used in an MPI program and why process identification is important.

**Sample answer:** `MPI_Comm_rank()` and `MPI_Comm_size()` are fundamental MPI functions used with a communicator such as `MPI_COMM_WORLD`. `MPI_Comm_rank()` gives the rank, or ID number, of the current process within the communicator. `MPI_Comm_size()` gives the total number of processes in that communicator. Together, they let each process know who it is and how many other processes are participating.

These functions are used early in almost every MPI program so that processes can decide their roles and coordinate communication correctly. For example, rank 0 often acts as the main or manager process, while the other ranks act as workers. Process identification is important because MPI programs usually assign different work to different ranks, send messages to specific destination ranks, and use the total process count to divide the data evenly. Without rank and size, the processes would not know how to cooperate correctly.

### Question 3

What is buffered communication in MPI? How does it differ from standard blocking communication?

**Sample answer:** Buffered communication in MPI is a send mode in which the outgoing message is first copied into a buffer, allowing the sending process to continue once that copy has completed. The main idea is that the sender does not have to wait for the receiver to immediately accept the message, because the message can be held temporarily in the buffer.

This differs from standard blocking communication, such as `MPI_Send`, where MPI decides how the message is handled and the sender may have to wait before it is safe to reuse the send buffer. In other words, blocking communication may stop the process at the send call, while buffered communication gives the sender more independence at the cost of extra buffer memory and buffer management. Buffered communication therefore trades memory usage for potentially reduced waiting.

## Week 5 Topics

MPI Collectives and Practical Patterns

### Question 1

Explain what collective communication is in MPI. How does collective communication differ from point-to-point communication?

**Sample answer:** Collective communication in MPI refers to communication operations that involve a group of processes within a communicator, rather than just two individual processes. In collective operations, all participating processes contribute to the communication in a coordinated way. Examples include broadcast (one process sends data to all others), scatter (one process distributes data), gather (one process collects data), and reduction (combining values from all processes into a single result).

This differs from point-to-point communication, where data is exchanged directly between exactly two processes using operations like `MPI_Send` and `MPI_Recv`. In point-to-point communication, the programmer must explicitly manage each sender-receiver pair, which can become complex in large systems. Collective communication, on the other hand, provides higher-level, optimized patterns that are typically implemented efficiently by MPI libraries, reducing programming complexity and often improving performance through optimized internal communication strategies.

### Question 2

What is `MPI_Gather()`? Explain how it collects data from multiple processes and why this operation is commonly used in parallel applications.

**Sample answer:** `MPI_Gather()` is a collective communication operation that collects data from all processes in a communicator and stores the combined result on one root process. Each process sends its local data chunk, and the root process receives those chunks in rank order into a larger output buffer. This makes it a natural partner for scatter-based computations where a large dataset is first divided among processes and then rebuilt after local computation.

`MPI_Gather()` is commonly used in parallel applications because many data-parallel problems follow the pattern Scatter -> Compute -> Gather. Each process works independently on its own portion of the data, and then the root process needs the full result for output, further processing, or storage. This is common in image processing, array computation, and other high-performance computing workloads where partial results must be collected into one final structure.

### Question 3

Explain the concept of all-to-all communication. Why is this communication pattern potentially more expensive than scatter or gather operations?

**Sample answer:** All-to-all communication means that every process sends data to every other process and also receives data from every other process. In MPI, this is the role of `MPI_Alltoall`. Unlike scatter, where one root distributes data, or gather, where one root collects it, all-to-all requires a many-to-many exchange across the entire communicator.

This pattern is potentially more expensive because it creates much more communication traffic and coordination. Instead of one process communicating with all others, all processes are involved in simultaneous exchanges, which increases the total amount of data movement and the possibility of network contention. It is still useful when data must be redistributed among all processes, but it is usually more communication-intensive than scatter or gather.

## Week 6 Topics

CUDA Fundamentals and Introduction to Thrust

### Question 1

Explain what CUDA is and discuss its role in GPU computing. Why has CUDA become important in parallel programming?

**Sample answer:** CUDA (Compute Unified Device Architecture) is a parallel computing platform and programming model developed by NVIDIA that allows developers to use a GPU (Graphics Processing Unit) for general-purpose computation, not just graphics rendering. In CUDA, a program is divided into a host part (CPU) and a device part (GPU), where computationally intensive tasks are executed as parallel kernels on the GPU. These kernels run across thousands of lightweight threads, enabling massive data parallelism.

CUDA has become important in parallel programming because it provides a practical and widely adopted way to exploit GPU hardware for high-performance computing. GPUs are highly efficient for workloads that involve performing the same operation on large datasets, such as scientific simulations, image processing, and machine learning. CUDA exposes the GPU's parallel architecture in a relatively structured programming model, allowing developers to control thread organization, memory hierarchy, and execution behavior. As a result, it enables significant performance improvements compared to traditional CPU-based execution for suitable problems.

### Question 2

What is a warp in CUDA? Explain its significance in GPU execution and how warps contribute to efficient parallel processing.

**Sample answer:** A warp in CUDA is a group of 32 threads that the GPU schedules together. CUDA uses a SIMT execution model, meaning many threads execute the same instruction stream on different data elements, and the hardware mainly schedules work at the warp level rather than one thread at a time.

Warps are important because they are the basic execution unit that helps the GPU achieve high throughput. When threads in a warp follow the same control flow, the hardware can use its resources efficiently and keep many operations in flight. Warps also help hide latency, because while one warp is waiting on memory, another can run. However, if threads in the same warp take different branches, warp divergence occurs, and the GPU must execute those paths separately, which reduces efficiency.

### Question 3

Discuss the role of algorithms in the Thrust library. Describe two commonly used Thrust algorithms and provide an example of how each might be applied to GPU data processing.

**Sample answer:** In the Thrust library, algorithms provide a high-level way to express common GPU data-processing tasks without writing low-level CUDA kernels for everything. Thrust is designed to feel similar to the C++ STL, but it works with GPU containers such as `device_vector` and provides ready-made operations like sorting, reducing, and transforming data. Its role is to let the programmer describe what operation is needed while Thrust handles much of the lower-level GPU execution detail.

Two commonly used Thrust algorithms are `thrust::transform` and `thrust::reduce`. `thrust::transform` applies an operation to each element in a range, so it could be used to square every value in a device vector or apply the same image filter operation to many pixels. `thrust::reduce` combines many values into one result, so it could be used to sum a large vector of GPU data, compute total brightness in an image, or aggregate partial numerical results from a scientific computation. These algorithms are useful because they make common parallel operations shorter, clearer, and easier to implement than writing raw CUDA kernels by hand.
