# Loop-level parallelism

## Why loops
Most scientific and engineering programs spend the majority of execution time inside loops.

Examples include
- Matrix multiplication
- Image processing
- Numerical simulations
- AI computations
- Data analytics

Since iterations often perform similar work, loops are execellent candidates for parallelism

### Sequential Loop
```cpp
for(int i=0;i<1000000;i++) {
    A[i] = B[i] + C[i];
}
```

### Parallel Loop
```cpp
#pragma omp parallel for
for(int i=0;i<1000000;i++) {
    A[i] = B[i] + C[i];
}
```

OpenMP automatically divides iterations among threads.

Example using four threads.

When the compiler encounters `#pragma omp parallel for`, It performs the following steps:
1. Create worker threads
2. Divide loop iterations
3. Assign iterations
4. Execute simultaneously
5. Synchronize at loop end

## Requirements for Parallel Loops
OpenMP assumes
- Iterations are independent
- Orders does not matter
- Each iteraiton can execute simultaneously
Good example
```cpp
for(int i=0;i<n;i++)
    C[i] = A[i] + B[i];
```
Each iteration writes to a unique element. This is the perfect candidate for loop parallelization

Bad example
```cpp
for(int i=0;i<n;i++)
    A[i] = A[i - 1] + 5; 
```
Here, every iteration depends on the previous one, therefore, they cannot execute simultaneously.

## Exercise
- Sequential
```cpp
double sum = 0

for(int i=0;i<n;i++)
    sum+=A[i];
```

- Parallelizing directly
```cpp
#pragma omp parallel for
for(int i=0;i<n;i++)
    sum+=A[i];
```

## Nested Loop
```cpp
for(int i=0;i<n;i++)
{
    for(int j=0;j<m;j++)
    {
        C[i][j]=A[i][j]+B[i][j];
    }
}
```
Many algorithms use nested loops.

### Parallize Outer Loop
Example
```cpp
#pragma omp parallel for
for(int i=0;i<n;i++) {
    for(int i=0;i<n;i++) {
        ...
    }
}
```
Most command
Each thread processes complete rows
Advantages
- Less scheduling overhead
- Better Cache locality
- Fewer thread synchronizations

### Collapse Clause
```cpp
#pragma omp parallel for collapse(2)
for(int i=0;i<n;i++)
{
    for(int j=0;j<m;j++)
    {
        ...
    }
}
```
Now iterations become `n x m` instead of only n. It is useful when outer loop has few iterations. 

For example, we have 4 rows and 10000 columns. Without collapse, there are only four parallel tasks. With collapse, there are 40,000 tasks. It is much better load balancing.

# Scheduling
## Scheduling Comparison

| Schedule | Load Balance | Overhead | Best For |
|---|---|---|---|
| Static | Low | Very Low | Equal work |
| Dynamic | Excellent | Higher | Irregular work |
| Guided | Very Good | Medium | Large loops |
| Runtime | Depends | Depends | Benchmarking |

## Exercise
```cpp
#include <iostream>
#include <thread>
#include <chrono>
#include <omp.h>

using namespace std;

int main() {
    omp_set_num_threads(4);

    cout << "Number of threads = " << omp_get_max_threads() << endl;

    #pragma omp parallel for schedule(static)
    for(int i=0;i<16;i++) {
        int tid = omp_get_thread_num();

        //later iterations take longer
        int work = (i + 1) * 300;

        cout << "Thread " << tid
             << " starting iteration " << i
             << " (" << work << " ms)" << endl;

        this_thread::sleep_for(chrono::milliseconds(work));

        cout << "Thread " << tid
             << " finished iteration" << i << endl;
    }

    return 0
}
```

## Correctness and Optimization Issues
Common causes
- Thread contention: Multiple threads compete for the same shared resource, causing some threads to wait and reducing parallel performance.
- Synchronization overhead: The extra execution time spent coordinating threads (e.g., locks, barriers, or critical sections) instead of performing useful work.
- Cache contention: Multiple threads or CPU cores compete for cache resources or frequently replace each other's cached data, reducing cache efficiency.
- False sharing: Multiple threads modify different variables that reside in the same cache line, causing unnecessary cache invalidations and slowing execution.
