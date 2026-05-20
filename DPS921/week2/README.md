# Shared-Memory Programming: Threads

Extracted from **Multicore & GPU Programming: An Integrated Approach** by G. Barlas, Chapter 3 slides.

## Objectives

- Understand what threads are and how to create them.
- Learn how to initialize threads to perform a desired task.
- Learn techniques for terminating multi-threaded programs.
- Understand shared-resource problems such as race conditions and deadlocks.
- Learn what semaphores and monitors are and how to use them.
- Become familiar with classical synchronization problems and solutions.
- Learn how to create and use a thread pool.
- Learn debugging techniques for multi-threaded programs.

## Introduction to Threads

A **thread** is an execution path: a sequence of instructions managed separately by the operating system scheduler. A single process can contain multiple threads.

Threads are useful for:

- Improving performance
- Running background tasks
- Supporting asynchronous processing
- Improving program structure

## Thread Creation

Traditional thread libraries include:

- POSIX Threads, also called **pThreads**
- **winThreads**, a Windows-only C++ based library
- **Qt threads**, part of the Qt cross-platform C++ toolkit

C++11 introduced a built-in standard thread library, and later C++ versions expanded these facilities.

## Threads in C++11

Basic example:

```cpp
#include <thread>
#include <iostream>

using namespace std;

void f()
{
    cout << "Hello from thread " << this_thread::get_id() << "\n";
    this_thread::sleep_for(1s);
}

int main(int argc, char **argv)
{
    thread t(f);
    cout << "Main thread waiting...\n";
    t.join();
    return 0;
}
```

The `join()` call blocks the main thread until the child thread finishes. Without `join()`, the main program may terminate before the child thread completes.

To compile:

```bash
g++ hello.cpp -lpthread -o hello
./hello
```

The `-lpthread` option indicates that pThreads are used as the underlying implementation.

## Passing Parameters to Threads

There are several ways to pass data to threads:

1. **Global variables**
   - Possible, but generally not recommended.
   - Threads may use explicit IDs to access their own data in arrays.

2. **Function parameter lists**
   - Pass parameters directly through the thread constructor.

3. **Functors**
   - Use an object of a class that implements `operator()`.
   - Often the cleanest and most elegant approach.

Important note: parameters passed to a thread constructor are passed **by value** by default. To pass by reference, use `std::ref()` or `std::cref()`.

## Example: Parallel Average Calculation

A vector can be split into chunks, where each thread computes a partial sum. After all threads finish, the main thread joins them and combines the partial results.

Conceptually:

```cpp
void partialSum(vector<double>::iterator start,
                vector<double>::iterator end,
                double *res)
{
    *res = 0;
    for (auto i = start; i < end; i++)
        *res += *i;
}
```

Each thread receives a start iterator, end iterator, and a pointer to store its result.

## Using a Functor

A functor-based version stores the thread data inside an object:

```cpp
struct PartialSumFunctor
{
    vector<double>::iterator start;
    vector<double>::iterator end;
    double res = 0;

    void operator()()
    {
        for (auto i = start; i < end; i++)
            res += *i;
    }
};
```

The main thread can also process one chunk directly while child threads process the remaining chunks.

## Data Sharing Between Threads

A **data race** occurs when two or more threads access the same memory location and at least one access is a write.

A **race condition** is abnormal program behavior where the result depends on the relative timing of events.

Data races and race conditions are related, but they are not the same:

- A program may have no data race but still have a race condition.
- A program may have a data race but no visible race condition.
- Race conditions are usually harder to find and fix.
- Data races can often be removed using critical sections.

## Race Condition Example

If multiple threads update a shared variable such as `res` at the same time, the final result may be incorrect.

Example issue:

```cpp
double res = 0;

for (int i = 0; i < numThr; i++)
{
    thr[i] = new thread(partialSum, localStart, localEnd, &res);
}
```

Because all threads write to the same `res`, updates may overwrite each other. The expected average may be `500.5`, but actual outputs can vary between runs.

## Consistency Models

A **consistency model** defines rules for how operations on shared data take effect.

### Sequential Consistency

Sequential consistency means shared-object events appear as if they happened one at a time, in program order for each thread.

However, combining software modules that are individually sequentially consistent does not always produce a sequentially consistent system.

### Linearizability

Linearizability requires operations to appear as if they occur instantaneously at some point during the method call. That instant is called a **linearization point**.

Key ideas:

- Methods can be totally ordered by their linearization points.
- Locking an object during a method call can make the operation appear instantaneous.
- Every linearizable execution is sequentially consistent.
- Not every sequentially consistent execution is linearizable.

## Semaphores

A **semaphore** is a synchronization abstraction proposed by Edsger Dijkstra. It supports two atomic operations:

- `P`: try to decrease the semaphore value; blocks if the value is non-positive.
- `V`: increment the semaphore value.

Semaphores can be:

- **Strong**, if blocked threads are held in FIFO order.
- **Weak**, if the queue is not FIFO.
- **Binary**, if they only have two states.
- **Mutex**, a restricted binary semaphore that can only be unlocked by the thread that locked it.

## Semaphore Support in C++

C++11 supports `std::mutex`:

```cpp
#include <mutex>

std::mutex l;
l.lock();
l.unlock();
```

C++20 added counting semaphores:

```cpp
#include <semaphore>

std::counting_semaphore<10> resCount(10);
resCount.acquire();
resCount.release();
```

A binary semaphore can be represented as:

```cpp
std::counting_semaphore<1> lock;
```

## Semaphore Use Cases

Semaphores can be used as:

1. **Locks**
   - Use a binary semaphore or mutex.

2. **Resource counters**
   - Use a general counting semaphore.

3. **Signaling mechanisms**
   - Use a binary or general semaphore depending on the situation.

## Producer-Consumer Pattern

The producer-consumer problem uses a shared buffer for communication between producer and consumer threads.

Typical shared state:

```cpp
const int BUFFSIZE = 100;

Resource buffer[BUFFSIZE];
int in = 0;
int out = 0;

semaphore slotsAvail(BUFFSIZE); // free slots
semaphore resAvail(0);          // available resources
mutex l1, l2;
```

Producer logic:

```cpp
while (true)
{
    Resource item = produce();

    slotsAvail.acquire();   // wait for empty slot
    l1.lock();

    buffer[in] = item;
    in = (in + 1) % BUFFSIZE;

    l1.unlock();
    resAvail.release();     // signal available item
}
```

Consumer logic:

```cpp
while (true)
{
    resAvail.acquire();     // wait for available item
    l2.lock();

    Resource item = buffer[out];
    out = (out + 1) % BUFFSIZE;

    l2.unlock();
    slotsAvail.release();   // signal empty slot

    consume(item);
}
```

## Termination Problem

A multi-threaded program should terminate threads in an organized way. Letting the main thread exit and allowing the operating system to kill child threads is not ideal.

Two common approaches:

1. **Shared data item**
2. **Messages**

### Termination Using a Shared Variable

If the number of iterations is known ahead of time, a counting semaphore can be used.

If the number of iterations is determined at run time, a shared termination flag may be used. The slides use a volatile shared variable for this case.

### Termination Using Messages

Another strategy is to send termination messages through the shared buffer.

For example, in a trapezoid-rule integration problem:

- The producer creates work slices.
- Consumers compute the area for each slice.
- A special message with `divisions = 0` tells consumers to stop.

## Atomic Data Types

C++11 introduced `std::atomic` types, which allow data-race-free access without explicit locks.

Examples include:

- `std::atomic_bool`
- `std::atomic_char`
- `std::atomic_int`
- `std::atomic_long`
- `std::atomic_size_t`

Common atomic methods:

- `store()`
- `load()`
- `fetch_add()`
- `fetch_sub()`
- `fetch_and()`
- `fetch_or()`
- `fetch_xor()`
- `exchange()`
- `compare_exchange_weak()`
- `compare_exchange_strong()`
- `is_lock_free()`

Atomic operators such as `++`, `--`, `+=`, and `-=` are also available for supported types.

## Atomic-Based Mutual Exclusion

Atomic variables can be used to build custom locks.

Example concept:

```cpp
atomic<bool> lock;

while (true)
{
    bool tmp = false;
    if (lock.compare_exchange_weak(tmp, true))
        break;

    this_thread::yield();
}

// critical section

lock.store(false);
```

## Memory Ordering

Memory ordering controls how memory operations in one thread are observed by other threads.

C++11 memory ordering options include:

- `memory_order_relaxed`
  - No synchronization or ordering constraints.

- `memory_order_acquire`
  - Used in load operations to ensure writes from other threads become visible.

- `memory_order_release`
  - Used in store operations to make current-thread changes visible to other threads.

- `memory_order_acq_rel`
  - Used in read-modify-write operations with both acquire and release behavior.

- `memory_order_seq_cst`
  - Sequentially consistent ordering.
  - This is the default and safest option for correctness.

## Monitors

A **monitor** is an object that encapsulates thread coordination logic.

Characteristics:

- Monitor methods are mutually exclusive.
- Data members are private.
- A mutex protects monitor methods.
- Condition variables are used to block and wake threads.

A **condition variable** supports:

- `wait`: blocks a thread and places it in a queue.
- `signal`: wakes one blocked thread, if any.

## Monitor Method Structure

Monitor methods usually contain:

1. **Entry section**
   - Check whether a thread may proceed.

2. **Middle section**
   - Modify monitor state and perform protected operations.

3. **Exit section**
   - Signal other waiting threads if needed.

## Condition Variables in C++11

C++11 provides `std::condition_variable`.

Important methods:

- `wait`
- `wait_for`
- `wait_until`
- `notify_one`
- `notify_all`

Because a woken thread may not immediately continue inside the monitor, conditions should be checked again. This means `while` should be used instead of `if`.

Example:

```cpp
while (balance < s)
{
    insufficientFunds.wait(lock);
}
```

## Locking a Monitor

Instead of manually locking and unlocking mutexes, C++ uses helper classes:

- `std::unique_lock`
- `std::lock_guard`

Both lock a mutex on construction and unlock it on destruction.

Difference:

- `unique_lock` supports unlocking and relocking, so it works with condition-variable waits.
- `lock_guard` is simpler and is used when no wait operation is needed.

## Monitor Skeleton

```cpp
class Monitor
{
private:
    mutex l;
    condition_variable cv;

public:
    void foo1()
    {
        unique_lock<mutex> ul(l);
        cv.wait(ul, [] { return someCondition; });
    }

    void foo2()
    {
        lock_guard<mutex> guard(l);
        cv.notify_one();
    }
};
```

## Account Monitor Example

A bank account monitor can use a condition variable to block withdrawals until enough balance is available.

```cpp
class AccountMonitor
{
private:
    condition_variable insufficientFunds;
    mutex m;
    double balance = 0;

public:
    void withdraw(double s)
    {
        unique_lock<mutex> ml(m);

        while (balance < s)
            insufficientFunds.wait(ml);

        balance -= s;
    }

    void deposit(double s)
    {
        lock_guard<mutex> ml(m);

        balance += s;
        insufficientFunds.notify_all();
    }
};
```

The slides note that the example is missing a check for whether `s` is positive.

## Monitor Design Approaches

### Design 1: Critical Section Inside Monitor

The monitor directly protects the entire critical section.

Example:

```cpp
class ConsoleMonitor
{
private:
    mutex m;

public:
    void printOut(string s)
    {
        lock_guard<mutex> g(m);
        cout << s;
    }
};
```

This can be inefficient if the critical section takes a long time.

### Design 2: Monitor Controls Entry to Critical Section

The monitor only controls access. The expensive operation can happen outside the monitor.

This is useful when buffer deposit or extraction is time-consuming, such as when deep-copying large objects.

## Static Thread Management

Creating threads every time work appears can be inefficient. A better approach is to create a fixed set of reusable threads called a **thread pool**.

Advantages:

- Avoids repeated thread creation overhead.
- Allows the number of threads to match the workload.
- Supports many tasks without creating thousands of OS threads.
- Reduces system resource usage.

Disadvantages:

- Tasks must be packaged so they can be queued.
- Task precedence is not easy to enforce.
- Cooperative tasks can be difficult to handle.

## Packaging Tasks

C++11 provides `std::packaged_task`, which wraps a callable target so it can be executed asynchronously.

The result is stored in a `std::future`.

Example:

```cpp
#include <future>

std::packaged_task<int(int, int)> t([](int a, int b)
{
    return a % b;
});

std::future<int> result = t.get_future();

t(1, 3);

std::cout << result.get() << endl;
```

## Custom Thread Pool

A custom thread pool can include two main components:

1. `CustomThreadPool`
   - A buffer for packaged tasks.

2. `CustomThread`
   - A worker thread that repeatedly takes tasks from the pool.

The user code acts as the producer, and worker threads act as consumers.

A shared atomic flag can be used to signal termination.

## Debugging Multi-Threaded Applications

Recommended tools and practices:

- Use a debugger that supports multi-threaded execution.
- Compile with debugging information:

```bash
-g
```

- Avoid compiler optimization during debugging.
- Add logging or tracing to the application.
- Limit or control the number of threads.
- Try a single-thread setting first to find algorithmic errors.

Debugging output can be sent to standard error and redirected:

```bash
myprog 2> trace.log
```

Good debugging output should:

- Be time-stamped.
- Be controllable with compiler directives.
- Clearly separate normal output from debugging output.

## Key Takeaways

- Threads allow multiple execution paths inside a process.
- `std::thread` and `join()` are core C++ threading tools.
- Shared data can cause data races and race conditions.
- Semaphores, mutexes, atomics, and monitors are common synchronization mechanisms.
- Producer-consumer is a classic synchronization pattern.
- Thread termination should be coordinated carefully.
- Thread pools reduce repeated thread creation overhead.
- Multi-threaded debugging requires logging, controlled thread counts, and careful instrumentation.
