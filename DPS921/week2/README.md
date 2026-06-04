# Focus Guide: Week 2 / Threads and Synchronization

## Purpose of This Summary

This markdown summarizes the topics to review for the Week 2 material on threads, shared data, synchronization, semaphores, atomic data types, producer-consumer, and monitors.

The strongest focus should be on:

- Sharing data between threads
- Critical sections
- Mutex and `std::lock_guard`
- Data race vs race condition
- Sequential consistency
- Linearizability
- Atomic data types
- Semaphores
- Producer-consumer problem
- Monitors

---

## 1. High-Priority Topics

Focus most on these topics:

1. Sharing data between threads
2. Critical sections
3. Mutexes
4. `std::lock_guard`
5. Data race vs race condition
6. Sequential consistency model
7. Linearizability
8. Atomic data types
9. Semaphores
10. Producer-consumer problem
11. Monitors

The code examples from class use:

- Two threads incrementing a shared counter
- Mutex protection using `std::lock_guard`
- Producer-consumer using semaphores, mutex, and a shared buffer

---

## 2. Review Topics

Before moving into the new material, review:

### 3.1 Introduction

Understand why threads are used.

Threads allow a program to do multiple tasks at the same time. They are useful for performance, responsiveness, and parallelism.

### 3.2 Threads

A thread is a lightweight unit of execution inside a process.

Multiple threads in the same process share memory, which means they can access the same variables.

### 3.3 Thread Creation and Initialization

In C++, a thread can be created using `std::thread`.

Example:

```cpp
std::thread t1(increment);
std::thread t2(increment);

t1.join();
t2.join();
```

The `join()` function waits for the thread to finish before the main program continues.

---

## 3. Sharing Data Between Threads

Threads in the same process can access shared variables.

Example:

```cpp
int counter = 0;
```

If two threads both modify `counter`, then the variable must be protected.

Without protection, both threads may read and write the same value at the same time, causing incorrect results.

---

## 4. Critical Section

A critical section is a section of code that accesses shared data and must not be executed by multiple threads at the same time.

Example:

```cpp
std::lock_guard<std::mutex> lock(mtx);
counter++;
```

Here, `counter++` is the critical section because `counter` is shared by multiple threads.

Main idea:

```text
Shared data + multiple threads + at least one write = needs protection
```

---

## 5. Mutex

A mutex is used to protect shared data.

Only one thread can hold the mutex at a time.

Simple idea:

```text
A mutex is like a key.
Only the thread with the key can enter the critical section.
```

Example:

```cpp
std::mutex mtx;
```

---

## 6. `std::lock_guard`

`std::lock_guard` automatically locks and unlocks a mutex.

Example:

```cpp
std::lock_guard<std::mutex> lock(mtx);
counter++;
```

It locks the mutex when the `lock_guard` object is created.

It unlocks the mutex automatically when the scope ends.

This is safer than manually writing:

```cpp
mtx.lock();
counter++;
mtx.unlock();
```

because manual locking can cause problems if the programmer forgets to unlock.

---

## 7. Data Race

A data race happens when:

```text
Two or more threads access the same memory location at the same time,
and at least one thread writes,
without proper synchronization.
```

Example problem:

```cpp
counter++;
```

This looks simple, but it is really multiple steps:

```text
read counter
add 1
write counter back
```

If two threads do this at the same time, the final value may be wrong.

---

## 8. Race Condition

A race condition happens when:

```text
The correctness of the program depends on the timing or order of thread execution.
```

A program may have a race condition even if there is no data race.

Important distinction:

```text
Data race = unsafe shared memory access
Race condition = incorrect behavior caused by timing/order
```

---

## 9. Data Race vs Race Condition

| Concept | Meaning |
|---|---|
| Data race | Multiple threads access the same memory, at least one writes, without proper synchronization |
| Race condition | Program correctness depends on timing/order of execution |
| Main issue | Unsafe memory access |
| Main result | Wrong behavior depending on interleaving |
| Fixed by | Mutex, atomic, synchronization |
| Example | Two threads doing `counter++` without lock |

Key idea:

```text
A data race is about memory safety.
A race condition is about program logic and timing.
```

---

## 10. Sequential Consistency Model

Sequential consistency means the result of execution should look like all thread operations happened in some valid sequential order.

The operations of different threads may be interleaved, but each individual thread’s order should still be preserved.

Example:

```text
Student 1: ABC, DEF, GHI
Student 2: MNO, PQR, STU
Student 3: GHI, LMN, XYZ
```

Possible interleaving:

```text
ABC MNO PQR GHI LMN XYZ STU DEF GHI
```

The steps are mixed together, but each student’s own order still makes sense.

Main idea:

```text
Thread operations may interleave, but each thread's internal order is preserved.
```

---

## 11. Linearizability

Linearizability means each operation appears to happen instantly at one point in time.

This point is called the linearization point.

Example:

```cpp
temp = this->balance;
temp += amount;
this->balance = temp;
```

Even though the operation has multiple internal steps, it should appear as one atomic operation from the outside.

Simple example:

```text
Person 1 deposits $100 from 10:00:01 to 10:00:03
Person 2 deposits $200 from 10:00:02 to 10:00:04
```

Linearizability says each deposit should appear to happen at one instant during its execution time.

Main idea:

```text
Each operation should look instantaneous.
```

---

## 12. Sequential Consistency vs Linearizability

| Concept | Main idea |
|---|---|
| Sequential consistency | Operations appear in some valid sequential order |
| Linearizability | Operations appear instantaneous and respect real-time order |
| Strength | Weaker |
| Strength | Stronger |

Simple difference:

```text
Sequential consistency cares about a valid order.
Linearizability cares about a valid order that also respects real time.
```

---

## 13. Atomic Data Types

Atomic data types allow safe operations on shared variables without using a mutex for simple cases.

Example:

```cpp
std::atomic<int> counter;
```

Atomic operations are useful for simple shared variables like counters or flags.

Example use cases:

```text
counter++
modified = true
flag = false
```

But atomic variables are not always enough.

Use a mutex when protecting multiple related operations.

---

## 14. Atomic vs Mutex

| Atomic | Mutex |
|---|---|
| Good for simple variables | Good for larger critical sections |
| Usually faster | More flexible |
| Protects one operation | Protects multiple statements |
| Example: counter | Example: updating balance and transaction history |

Simple rule:

```text
Use atomic for simple single-variable operations.
Use mutex for multi-step shared logic.
```

---

## 15. Semaphores

A semaphore is a synchronization tool that uses a counter.

It helps manage access to resources.

A semaphore supports two main operations:

```text
P / wait / acquire
V / signal / release
```

### acquire

```text
Try to take one resource.
If no resource is available, wait.
```

### release

```text
Return one resource.
Possibly wake up a waiting thread.
```

In C++:

```cpp
slotsAvailable.acquire();
slotsAvailable.release();
```

---

## 16. Producer-Consumer Problem

The producer-consumer problem is a classic synchronization problem.

There are:

```text
Producers → create items
Consumers → use/remove items
Buffer → shared storage between them
```

Simple picture:

```text
Producer → [ shared buffer ] → Consumer
```

Problems to solve:

```text
Producer must wait if the buffer is full.
Consumer must wait if the buffer is empty.
Both must not access the buffer incorrectly at the same time.
```

---

## 17. Producer-Consumer Using Semaphores

From the class code, there are two semaphores:

```cpp
std::counting_semaphore<BUFFSIZE> slotsAvailable(BUFFSIZE);
std::counting_semaphore<BUFFSIZE> resAvailable(0);
```

Meaning:

```text
slotsAvailable = number of empty slots in the buffer
resAvailable = number of produced resources available
```

At the beginning:

```text
slotsAvailable = BUFFSIZE
resAvailable = 0
```

This means:

```text
The buffer is empty.
All slots are available.
No resources are ready to consume.
```

---

## 18. Producer Logic

The producer does this:

```cpp
Resource item = produce(resourceId++);

slotsAvailable.acquire();

{
    std::lock_guard<std::mutex> lock(mutobj);
    buffer[in] = item;
    in = (in + 1) % BUFFSIZE;
}

resAvailable.release();
```

Meaning:

```text
1. Produce an item
2. Wait for an empty slot
3. Lock the buffer
4. Insert the item
5. Move the input index
6. Unlock automatically
7. Signal that one resource is available
```

---

## 19. Consumer Logic

The consumer does this:

```cpp
resAvailable.acquire();

{
    std::lock_guard<std::mutex> lock(mutobj);
    item = buffer[out];
    out = (out + 1) % BUFFSIZE;
}

slotsAvailable.release();

consume(item);
```

Meaning:

```text
1. Wait for an available resource
2. Lock the buffer
3. Remove the item
4. Move the output index
5. Unlock automatically
6. Signal that one slot is now free
7. Consume the item
```

---

## 20. Why Producer-Consumer Needs Both Mutex and Semaphores

The semaphores control availability:

```text
Is there an empty slot?
Is there an item to consume?
```

The mutex protects the shared buffer:

```text
Only one thread should update buffer, in, or out at a time.
```

Important:

```text
Semaphore = coordination
Mutex = protection
```

---

## 21. Circular Buffer

The producer-consumer code uses a circular buffer.

Example:

```cpp
in = (in + 1) % BUFFSIZE;
out = (out + 1) % BUFFSIZE;
```

The modulo operator `%` makes the index wrap around when it reaches the end.

Example with buffer size 5:

```text
0 → 1 → 2 → 3 → 4 → 0 → 1 ...
```

This allows the buffer to be reused.

---

## 22. Design Concerns

When designing threaded programs, think about:

```text
1. What data is shared?
2. Which thread reads the data?
3. Which thread writes the data?
4. What code is the critical section?
5. Do we need a mutex?
6. Do we need a semaphore?
7. Can atomic variables solve it?
8. Could deadlock happen?
9. Could starvation happen?
10. Is the design easy to reason about?
```

---

## 23. Deadlock

Deadlock happens when threads wait forever for each other.

Simple example:

```text
Thread 1 holds Lock A and waits for Lock B.
Thread 2 holds Lock B and waits for Lock A.
```

Neither thread can continue.

Main idea:

```text
Deadlock = threads stuck forever waiting for resources.
```

---

## 24. Starvation

Starvation happens when a thread keeps waiting and never gets a chance to run or access a resource.

Main idea:

```text
Starvation = one thread is always skipped or delayed.
```

---

## 25. Monitors

A monitor is a higher-level synchronization structure.

It combines:

```text
shared data
mutex/synchronization
safe functions for accessing the data
```

Simple idea:

```text
A monitor protects shared data by only allowing access through controlled methods.
```

For producer-consumer, a monitor may contain:

```text
buffer
mutex
condition variables or semaphores
produce/add function
consume/remove function
```

---

## 26. Monitor Design Approach

A monitor design should:

```text
1. Keep shared data private
2. Provide safe public methods
3. Lock internally
4. Prevent incorrect access
5. Coordinate waiting and signaling
```

Instead of letting every thread directly touch shared variables, the monitor controls access.

Simple example:

```text
Threads should not directly modify the buffer.
Threads should call monitor.add() or monitor.remove().
```

---

## 27. Producer-Consumer Revisited With Monitors

Producer-consumer can be redesigned as a monitor.

Instead of having producer and consumer directly manage all synchronization, the buffer class handles it internally.

Example structure:

```cpp
class BoundedBuffer {
private:
    buffer;
    mutex;
    semaphores or condition variables;

public:
    void add(Resource item);
    Resource remove();
};
```

Main idea:

```text
The synchronization logic is hidden inside the buffer object.
```

This makes the code cleaner and safer.

---

## 28. What to Practice

Practice answering these questions:

```text
1. What is a thread?
2. Why do threads share memory?
3. What is a critical section?
4. What is a mutex?
5. What does std::lock_guard do?
6. What is a data race?
7. What is a race condition?
8. What is the difference between data race and race condition?
9. What is sequential consistency?
10. What is linearizability?
11. What is an atomic operation?
12. When should we use atomic instead of mutex?
13. What is a semaphore?
14. What do acquire and release do?
15. What is the producer-consumer problem?
16. Why does producer-consumer need semaphores?
17. Why does producer-consumer still need a mutex?
18. What is a circular buffer?
19. What is a monitor?
20. How can producer-consumer be designed using a monitor?
```

---

## 29. Most Likely Test/Review Questions

Focus on being able to explain:

```text
What happens if two threads increment the same counter without a mutex?
```

```text
Why is counter++ not automatically safe?
```

```text
What is the difference between a data race and a race condition?
```

```text
Why is std::lock_guard safer than manual lock/unlock?
```

```text
What does a semaphore counter represent?
```

```text
In producer-consumer, what does slotsAvailable mean?
```

```text
In producer-consumer, what does resAvailable mean?
```

```text
Why do we need both mutex and semaphore?
```

```text
What does linearizability mean?
```

```text
What is the difference between sequential consistency and linearizability?
```

---

## 30. One-Page Summary

This week focuses on thread synchronization. Threads in the same process share memory, which means they can access the same variables. This is useful, but it can create problems when multiple threads read and write shared data at the same time.

The most important concept is the critical section, which is the part of code that accesses shared data. A mutex protects the critical section so only one thread can execute it at a time. In C++, `std::lock_guard` is commonly used because it automatically locks and unlocks the mutex.

A data race happens when multiple threads access the same memory location concurrently and at least one writes without proper synchronization. A race condition happens when the correctness of the program depends on timing or execution order. These ideas are related but not exactly the same.

Sequential consistency means thread operations appear in some valid sequential order. Linearizability is stronger: each operation should appear to happen instantly at one point in time.

Atomic data types are useful for simple shared variables, but mutexes are better for larger multi-step critical sections.

Semaphores are synchronization tools based on counters. They are important in the producer-consumer problem. In producer-consumer, producers create items, consumers remove items, and both share a buffer. Semaphores track empty slots and available resources, while a mutex protects the shared buffer itself.

Monitors are a higher-level design approach that groups shared data and synchronized methods together. They make threaded programs safer and easier to organize.

The highest-priority topics are mutexes, critical sections, data race vs race condition, semaphores, producer-consumer, atomic data types, sequential consistency, linearizability, and monitors.
