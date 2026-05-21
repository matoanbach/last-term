# Shared-memory programming: Threads
## Thread
- It is a execution path, a sequence of instructions, that is managed separately by the operating system scheduler as a unit. There can be multiple threads per process.
- Threads are good for:
    - improving performance
    - background tasks
    - asynchronous processing
    - improving program structure

### Threads in C++11
```cpp
#include <thread>

using namespace std;
void f() {
    cout << "Hello from thread " << this_thread::get_id() << "\\n";
    this_thread::sleep_for(1s);
}

int main(int argc, char **argv) {
    thread t(f);
    cout << "Main thread waiting ... \n";
    t.join();
    return 0;
}
```

#### Passing parameters to threads
- Using `global variables` is one way:
    - By assigning an explicit ID to each thread (no the one returned by `get_id()`), we can have each thread look into its won dedicated data in specific arrays.
    - Generally not recommended.
- Using a list of parameters in the function called by the thread constructor.
- Using a functor: an instance of a class that implements the `operator()` method.
    - Most elegant solution
- Important node: all parameters in the thread constructor, are passed by value.
- Passing by reference requires the use of the `ref()` and `cref()` functions.

## Consistency models
- Consistency model are rules for how shared data changes are seen by threads.
### Sequential consistency model
- The sequential consistency model dictates that all events on shared objects should appear as if they were happening one-at-a-time. Events should appear to take place in program order as far as each thread is concerned.
### Linearizability model
- In the linearizability consistency model, events should appear to happen in one-at-a-time order, and should appear to take place instantaneously.

## Semaphore classes in C++
- A semaphore can be utilized in three distinct ways:
    - As a lock. Suitable semaphore type: binary or mutex
    - As a resource counter. Suitable semaphore type: general
    - As a signaling mechanism. Suitable semaphore type: binary or general depending on the application.

- C++ only supports a mutex clas
```cpp
#include <mutex>
std::mutex l;
l.lock();
l.unlock();
```
- C++ added support for a counting semaphore
```cpp
#include <semaphore>
std::counting_semaphore<10> resCount;
resCount.acquire();
resCount.release();
```
- because of the incomplete C++20 support in current compilers, in this we use a user-supplied class with similar functionality
```cpp
#include "semaphore"
semaphore resCount(10);
```

- A binary semaphore is just an instance of:
```cpp
std::counting_semaphore<1> lock;
```

| Sem. | Use | Initialization | Thread1 | Thread2 | Thread Relationship |
|---|---|---|---|---|---|
| S1 | Lock | `mutex l;` | `l.lock();`<br>`...`<br>`l.unlock();` | `l.lock();`<br>`...`<br>`l.unlock();` | Threads compete for acquiring the lock to a shared resource. |
| S2 | Resource Counter Scenario 1 | `semaphore s;` | `s.release();` | `s.acquire();` | One thread produces resources, Thread 1, and another consumes them, Thread 2. Initially there are no available ones. |
| S3 | Resource Counter Scenario 2 | `semaphore s(N);` | `s.acquire();`<br>`...`<br>`s.release();` | `s.acquire();`<br>`...`<br>`s.release();` | Threads compete for acquiring resources from a pool of `N` available ones. |
| S4 | Signaling Mechanism | `semaphore s;` | `s.release();` | `s.acquire();` | One thread, Thread 2, waits for a signal from the other, Thread 1. |
|

## Common problem patterns:
### producers-consumers
- It is that one ore more producers create data/items and put them into a shared buffer/queue, while one ore more consumers take data/items from that buffer and process them.
### Termination problem
- How can we stop the threads upon program termination in an orchestrated manner?
- If the main/parent thread exits, all children are terminated also by the O.S. But this is not the proper course of action.
- Two possibilities:
    - Shared data item
    - Messages
