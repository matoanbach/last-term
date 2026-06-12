## Debugging Questions

### Question 1

The program produces incorrect results. Identify the line number causing the problem, describe the problem, and provide fixes.

```cpp
01. #include <thread>
02. #include <vector>
03.
04. int counter = 0;
05.
06. void increment() {
07.    for (int i = 0; i < 1000; i++) {
08.        counter++;
09.    }
10. }
11.
12. int main() {
13.     std::vector<std::thread> threads;
14.
15.     for (int i = 0; i < 4; i++) {
16.         threads.push_back(std::thread(increment));
17.     }
18.
19.     for (auto &t : threads) {
20.         t.join();
21.     }
22. }
```

**Line number:** `08`

**Problem:**
- `counter++` updates a shared global variable from multiple threads without synchronization.
- This creates a race condition because the increment is not atomic.
- Updates can be lost, so the final counter value may be smaller than expected.

**Fix 1: Use a mutex**

```cpp
#include <mutex>

std::mutex mtx;

void increment() {
    for (int i = 0; i < 1000; i++) {
        std::lock_guard<std::mutex> lock(mtx);
        counter++;
    }
}
```

**Fix 2: Use an atomic variable**

```cpp
#include <atomic>

std::atomic<int> counter = 0;
```

Then `counter++` becomes safe for this simple shared update.

---

### Question 2

Consider the following MPI program, which is intended to send an integer from Process 0 to Process 1. However, Process 1 does not correctly receive the data. Identify the line number causing the problem, describe the problem, and explain how to fix it.

```cpp
01. #include <mpi.h>
02. #include <stdio.h>
03.
04. int main(int argc, char *argv[]) {
05.     MPI_Init(&argc,&argv);
06.
07.     int rank, value;
08.     MPI_Comm_rank(MPI_COMM_WORLD, &rank);
09.
10.    if (rank == 0) {
11.         value = 100;
12.         MPI_Send(&value, 1, MPI_INT, 1, 0, MPI_COMM_WORLD);
13.         printf("Process 0 sent value %d\n", value);
14.     }
15.
16.     if (rank == 1) {
17.         MPI_Recv(&value, 1, MPI_INT, 0, 1, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
18.         printf("Process 1 received value %d\n", value);
19.     }
20.     MPI_Finalize();
21.     return 0;
22. }
```

**Line number:** `17`

**Problem:**
- There is a tag mismatch in `MPI_Recv`.
- Process 0 sends with tag `0` on line `12`.
- Process 1 tries to receive with tag `1` on line `17`.
- Since sender and receiver tags must match, Process 1 will not correctly receive the intended message.

**Fix:**
- Use the same tag in both calls.

```cpp
MPI_Send(&value, 1, MPI_INT, 1, 0, MPI_COMM_WORLD);
MPI_Recv(&value, 1, MPI_INT, 0, 0, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
```

The receive tag on line `17` should be changed from `1` to `0`.

---

### Question 3

Consider the following CUDA program, which is intended to increment each element of an array by 1 using a GPU kernel. It has at least two errors. Identify them by line number, describe the problems, and provide fixes.

```cpp
01. #include <stdio.h>
02. #include <cuda_runtime.h>
03.
04. __global__ void addKernel(int *arr) {
05.     int i = threadIdx.x;
06.     arr[i] = arr[i] + 1;
07. }
08.
09. int main() {
10.     int h_arr[5] = {1, 2, 3, 4, 5};
11.     int *d_arr;
12.
13.     cudaMalloc((void**)&d_arr, 5 * sizeof(int));
14.
15.     cudaMemcpy(d_arr, h_arr, 5 * sizeof(int), cudaMemcpyDeviceToHost);
16.
17.     addKernel<<<1, 5>>>(d_arr);
18.
19.     cudaMemcpy(h_arr, d_arr, 5 * sizeof(int), cudaMemcpyHostToDevice);
20.
21.    for (int i = 0; i < 5; i++) {
22.        printf("%d ", h_arr[i]);
23.    }
24.
25.    cudaFree(d_arr);
26.    return 0;
27. }
```

**Problem 1**

**Line number:** `15`

**Description:**
- Wrong `cudaMemcpy` direction.
- The program is copying data from host array `h_arr` to device array `d_arr`.
- It incorrectly uses `cudaMemcpyDeviceToHost`, which is the reverse direction.

**Fix:**

```cpp
cudaMemcpy(d_arr, h_arr, 5 * sizeof(int), cudaMemcpyHostToDevice);
```

**Problem 2**

**Line number:** `19`

**Description:**
- Wrong `cudaMemcpy` direction again.
- After the kernel runs, the results must be copied from device memory back to host memory.
- The code incorrectly uses `cudaMemcpyHostToDevice`.

**Fix:**

```cpp
cudaMemcpy(h_arr, d_arr, 5 * sizeof(int), cudaMemcpyDeviceToHost);
```

**Optional good practice:**

Call `cudaDeviceSynchronize();` after launching the kernel and before copying the result back.

```cpp
addKernel<<<1, 5>>>(d_arr);
cudaDeviceSynchronize();
cudaMemcpy(h_arr, d_arr, 5 * sizeof(int), cudaMemcpyDeviceToHost);
```
