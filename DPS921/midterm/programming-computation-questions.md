## Midterm Programming and Computation Questions

## Week 1 Topics

Parallel Platforms, Complexity, and Performance Measures

### Question 1

A sequential program takes `120` seconds to execute. A parallel version takes `30` seconds on `8` cores.

Tasks:
- Compute speedup
- Compute efficiency
- Interpret the result

**Sample answer:**

Formulas:

```text
Speedup S = Tseq / Tpar
Efficiency E = S / p
```

Calculations:

```text
S = 120 / 30 = 4
E = 4 / 8 = 0.5 = 50%
```

Result:

| Quantity | Value |
|---|---:|
| Sequential time | 120 s |
| Parallel time | 30 s |
| Cores | 8 |
| Speedup | 4.0 |
| Efficiency | 50.0% |

Interpretation:

The parallel version is 4 times faster than the sequential one, but it does not achieve ideal speedup on 8 cores. Since ideal speedup would be 8, an efficiency of 50% means the available cores are only being used moderately well. This suggests overhead such as synchronization, memory contention, or a non-parallelizable serial fraction.

### Question 2

Given the following data:

| Cores | Speedup |
|---|---:|
| 1 | 1.0 |
| 2 | 1.8 |
| 4 | 3.2 |
| 8 | 5.0 |

Tasks:
- Compute efficiency for each case
- Identify where diminishing returns begin
- Interpret scalability behavior

**Sample answer:**

Formula:

```text
Efficiency E = Speedup / Cores
```

| Cores | Speedup | Efficiency Calculation | Efficiency |
|---|---:|---|---:|
| 1 | 1.0 | `1.0 / 1` | 1.00 = 100% |
| 2 | 1.8 | `1.8 / 2` | 0.90 = 90% |
| 4 | 3.2 | `3.2 / 4` | 0.80 = 80% |
| 8 | 5.0 | `5.0 / 8` | 0.625 = 62.5% |

Interpretation:

Efficiency drops as the number of cores increases, so the scaling is sublinear. Diminishing returns clearly begin by 4 to 8 cores, because the speedup increase is much smaller relative to the increase in hardware resources. The program still benefits from more cores, but overhead and serial work are becoming more significant.

### Question 3

Write pseudo-code to:
- accept execution time of sequential program
- accept execution time of parallel program
- accept number of cores
- compute speedup and efficiency
- print results in formatted output

**Sample answer:**

```text
START

INPUT Tseq
INPUT Tpar
INPUT cores

speedup = Tseq / Tpar
efficiency = speedup / cores

PRINT "Sequential time:", Tseq
PRINT "Parallel time:", Tpar
PRINT "Cores:", cores
PRINT "Speedup:", speedup
PRINT "Efficiency:", efficiency

END
```

## Week 2 Topics

Threads and Concurrency

### Question 1

Write a multithreaded C++ program where multiple threads increment a shared counter. Then modify the program to correctly synchronize access to the counter.

**Sample answer:**

```cpp
#include <iostream>
#include <mutex>
#include <thread>
#include <vector>

int counter = 0;
std::mutex mtx;

void unsafeIncrement(int times) {
    for (int i = 0; i < times; i++)
        counter++;
}

void safeIncrement(int times) {
    for (int i = 0; i < times; i++) {
        std::lock_guard<std::mutex> lock(mtx);
        counter++;
    }
}

int main() {
    const int numThreads = 4;
    const int increments = 100000;

    {
        counter = 0;
        std::vector<std::thread> threads;
        for (int i = 0; i < numThreads; i++)
            threads.emplace_back(unsafeIncrement, increments);
        for (auto& t : threads)
            t.join();
        std::cout << "Unsafe counter = " << counter << '\n';
    }

    {
        counter = 0;
        std::vector<std::thread> threads;
        for (int i = 0; i < numThreads; i++)
            threads.emplace_back(safeIncrement, increments);
        for (auto& t : threads)
            t.join();
        std::cout << "Safe counter = " << counter << '\n';
    }

    return 0;
}
```

The unsafe version may produce the wrong final count because `counter++` is not atomic. The safe version protects the critical section with a mutex.

### Question 2

Implement the producer-consumer problem using a monitor (or monitor-like construct such as condition variables and mutexes).

**Sample answer:**

```cpp
#include <condition_variable>
#include <iostream>
#include <mutex>
#include <queue>
#include <thread>

class BoundedBuffer {
private:
    std::queue<int> q;
    std::mutex mtx;
    std::condition_variable notFull;
    std::condition_variable notEmpty;
    const size_t capacity;

public:
    explicit BoundedBuffer(size_t cap) : capacity(cap) {}

    void produce(int item) {
        std::unique_lock<std::mutex> lock(mtx);
        notFull.wait(lock, [this] { return q.size() < capacity; });
        q.push(item);
        notEmpty.notify_one();
    }

    int consume() {
        std::unique_lock<std::mutex> lock(mtx);
        notEmpty.wait(lock, [this] { return !q.empty(); });
        int item = q.front();
        q.pop();
        notFull.notify_one();
        return item;
    }
};

int main() {
    BoundedBuffer buffer(5);

    std::thread producer([&] {
        for (int i = 1; i <= 10; i++)
            buffer.produce(i);
    });

    std::thread consumer([&] {
        for (int i = 1; i <= 10; i++)
            std::cout << "Consumed " << buffer.consume() << '\n';
    });

    producer.join();
    consumer.join();
    return 0;
}
```

This is monitor-like because the shared buffer and synchronization logic are wrapped in one protected class.

## Week 3 Topics

Parallel Patterns and Introduction to Design Patterns

### Question 1

Implement a three-stage pipeline:
- Read data
- Process data
- Store results

Use separate threads for each stage and communicate using thread-safe queues.

**Sample answer:**

```cpp
#include <condition_variable>
#include <iostream>
#include <mutex>
#include <optional>
#include <queue>
#include <thread>

template <typename T>
class SafeQueue {
private:
    std::queue<T> q;
    std::mutex mtx;
    std::condition_variable cv;

public:
    void push(T value) {
        {
            std::lock_guard<std::mutex> lock(mtx);
            q.push(std::move(value));
        }
        cv.notify_one();
    }

    T pop() {
        std::unique_lock<std::mutex> lock(mtx);
        cv.wait(lock, [this] { return !q.empty(); });
        T value = std::move(q.front());
        q.pop();
        return value;
    }
};

int main() {
    SafeQueue<int> q1;
    SafeQueue<int> q2;

    std::thread reader([&] {
        for (int i = 1; i <= 5; i++)
            q1.push(i);
        q1.push(-1);
    });

    std::thread processor([&] {
        while (true) {
            int x = q1.pop();
            if (x == -1) {
                q2.push(-1);
                break;
            }
            q2.push(x * x);
        }
    });

    std::thread writer([&] {
        while (true) {
            int x = q2.pop();
            if (x == -1)
                break;
            std::cout << "Stored " << x << '\n';
        }
    });

    reader.join();
    processor.join();
    writer.join();
    return 0;
}
```

### Question 2

Implement a master-worker application where:
- the master generates tasks
- workers process tasks
- results are returned to the master

**Sample answer:**

```cpp
#include <condition_variable>
#include <iostream>
#include <mutex>
#include <queue>
#include <thread>
#include <vector>

struct Task {
    int value;
};

std::queue<Task> tasks;
std::vector<int> results;
std::mutex taskMtx;
std::mutex resultMtx;
std::condition_variable taskCv;
bool done = false;

void worker() {
    while (true) {
        Task task;
        {
            std::unique_lock<std::mutex> lock(taskMtx);
            taskCv.wait(lock, [] { return done || !tasks.empty(); });
            if (done && tasks.empty())
                return;
            task = tasks.front();
            tasks.pop();
        }

        int result = task.value * 2;

        std::lock_guard<std::mutex> lock(resultMtx);
        results.push_back(result);
    }
}

int main() {
    const int workerCount = 3;
    std::vector<std::thread> workers;
    for (int i = 0; i < workerCount; i++)
        workers.emplace_back(worker);

    for (int i = 1; i <= 10; i++) {
        {
            std::lock_guard<std::mutex> lock(taskMtx);
            tasks.push({i});
        }
        taskCv.notify_one();
    }

    {
        std::lock_guard<std::mutex> lock(taskMtx);
        done = true;
    }
    taskCv.notify_all();

    for (auto& t : workers)
        t.join();

    for (int x : results)
        std::cout << x << ' ';
    std::cout << '\n';
    return 0;
}
```

## Week 4 Topics

MPI Fundamentals and Point-to-Point Communications

### Question 1

Write an MPI program that:
- initializes MPI
- obtains process rank and communicator size
- prints a greeting from each process
- finalizes MPI

**Sample answer:**

```cpp
#include <mpi.h>
#include <iostream>

int main(int argc, char** argv) {
    MPI_Init(&argc, &argv);

    int rank = 0;
    int size = 0;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    std::cout << "Hello from rank " << rank << " of " << size << '\n';

    MPI_Finalize();
    return 0;
}
```

### Question 2

Create an MPI program where Process 0 initializes an integer array of size `N` and sends it to Process 1 using blocking communication (`MPI_Send`). Then analyze and describe the changes required to modify this program to use buffered communication instead.

**Sample answer:**

Blocking version:

```cpp
#include <mpi.h>
#include <iostream>

int main(int argc, char** argv) {
    MPI_Init(&argc, &argv);

    int rank = 0;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);

    const int N = 10;
    int data[N];

    if (rank == 0) {
        for (int i = 0; i < N; i++)
            data[i] = i + 1;
        MPI_Send(data, N, MPI_INT, 1, 0, MPI_COMM_WORLD);
    } else if (rank == 1) {
        MPI_Recv(data, N, MPI_INT, 0, 0, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
        for (int i = 0; i < N; i++)
            std::cout << data[i] << ' ';
        std::cout << '\n';
    }

    MPI_Finalize();
    return 0;
}
```

Changes for buffered communication:

1. Attach a user buffer with `MPI_Buffer_attach()`.
2. Replace `MPI_Send()` with `MPI_Bsend()`.
3. Detach the buffer with `MPI_Buffer_detach()` before program end.

Buffered-send version on rank 0:

```cpp
int bufferSize = MPI_BSEND_OVERHEAD + N * sizeof(int);
char* buffer = new char[bufferSize];
MPI_Buffer_attach(buffer, bufferSize);

MPI_Bsend(data, N, MPI_INT, 1, 0, MPI_COMM_WORLD);

void* detached = nullptr;
int detachedSize = 0;
MPI_Buffer_detach(&detached, &detachedSize);
delete[] static_cast<char*>(detached);
```

## Week 5 Topics

MPI Collectives and Practical Patterns

### Question 1

Write a program that:
- creates an array on Process 0
- uses `MPI_Scatter()` to distribute elements among processes
- displays the received values

**Sample answer:**

```cpp
#include <mpi.h>
#include <iostream>

int main(int argc, char** argv) {
    MPI_Init(&argc, &argv);

    int rank = 0;
    int size = 0;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    const int valuesPerProcess = 2;
    int recvbuf[valuesPerProcess];
    int* sendbuf = nullptr;

    if (rank == 0) {
        sendbuf = new int[size * valuesPerProcess];
        for (int i = 0; i < size * valuesPerProcess; i++)
            sendbuf[i] = i + 1;
    }

    MPI_Scatter(sendbuf,
                valuesPerProcess,
                MPI_INT,
                recvbuf,
                valuesPerProcess,
                MPI_INT,
                0,
                MPI_COMM_WORLD);

    std::cout << "Rank " << rank << " received: ";
    for (int i = 0; i < valuesPerProcess; i++)
        std::cout << recvbuf[i] << ' ';
    std::cout << '\n';

    delete[] sendbuf;
    MPI_Finalize();
    return 0;
}
```

### Question 2

Implement a parallel program that:
- scatters an array
- computes local sums
- reduces local sums into a global sum
- computes the overall average

**Sample answer:**

```cpp
#include <mpi.h>
#include <iostream>

int main(int argc, char** argv) {
    MPI_Init(&argc, &argv);

    int rank = 0;
    int size = 0;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    const int valuesPerProcess = 2;
    const int N = valuesPerProcess * size;
    int recvbuf[valuesPerProcess];
    int* sendbuf = nullptr;

    if (rank == 0) {
        sendbuf = new int[N];
        for (int i = 0; i < N; i++)
            sendbuf[i] = i + 1;
    }

    MPI_Scatter(sendbuf,
                valuesPerProcess,
                MPI_INT,
                recvbuf,
                valuesPerProcess,
                MPI_INT,
                0,
                MPI_COMM_WORLD);

    int localSum = 0;
    for (int i = 0; i < valuesPerProcess; i++)
        localSum += recvbuf[i];

    int globalSum = 0;
    MPI_Reduce(&localSum, &globalSum, 1, MPI_INT, MPI_SUM, 0, MPI_COMM_WORLD);

    if (rank == 0) {
        double average = static_cast<double>(globalSum) / N;
        std::cout << "Global sum = " << globalSum << '\n';
        std::cout << "Average = " << average << '\n';
    }

    delete[] sendbuf;
    MPI_Finalize();
    return 0;
}
```

## Week 6 Topics

CUDA Fundamentals and Introduction to Thrust

### Question 1

Write a CUDA program that launches a kernel and prints a message from the GPU.

**Sample answer:**

```cpp
#include <cuda_runtime.h>
#include <iostream>

__global__ void helloKernel() {
    printf("Hello from GPU thread %d\n", threadIdx.x);
}

int main() {
    helloKernel<<<1, 4>>>();
    cudaDeviceSynchronize();
    return 0;
}
```

### Question 2

Implement vector addition using:
- a custom CUDA kernel
- a Thrust-based solution
- compare the complexity of the two approaches

**Sample answer:**

Custom CUDA kernel:

```cpp
#include <cuda_runtime.h>
#include <iostream>

__global__ void addKernel(const int* A, const int* B, int* C, int N) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    if (i < N)
        C[i] = A[i] + B[i];
}
```

Thrust-based solution:

```cpp
#include <thrust/device_vector.h>
#include <thrust/transform.h>
#include <thrust/functional.h>

int main() {
    thrust::device_vector<int> A{1, 2, 3, 4};
    thrust::device_vector<int> B{10, 20, 30, 40};
    thrust::device_vector<int> C(4);

    thrust::transform(A.begin(), B.begin(), C.begin(), thrust::plus<int>());
    return 0;
}
```

Comparison:

| Approach | Complexity of Code | Control | Best Use |
|---|---|---|---|
| Custom CUDA kernel | Higher | Full control over grid, block, memory, and indexing | Best when low-level tuning is needed |
| Thrust | Lower | Less low-level control | Best for common data-parallel operations with simpler code |

The custom kernel gives more control and is closer to the hardware, but it requires manual memory management and indexing logic. The Thrust version is shorter and easier to write for common operations like vector addition, reduction, and transform.
