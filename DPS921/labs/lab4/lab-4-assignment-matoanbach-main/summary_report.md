# DPS921 Lab 4 Summary Report

## Environment

- Platform: macOS
- Compiler: `clang++`
- OpenMP runtime: `libomp`
- Logical CPUs tested: `8`
- Input size: `n = 1000000000`

## Parallelizable Loop

The loop in `pi_serial.cpp` that can be parallelized is:

```cpp
for (int i = 0; i < n; ++i) {
    x = ((double)i + 0.5) * stepSize;
    sum += 1.0 / (1.0 + x * x);
}
```

Each iteration computes one independent rectangle contribution to the numerical
integration. Iteration `i` does not depend on iteration `i - 1`, so the work
can be split across threads. The main challenge is accumulating into `sum`
without introducing race conditions or excessive contention.

## Implementations

### 1. Naive Version

Each thread updates its own element in a shared one-dimensional array. The
array elements are adjacent in memory, so different threads may invalidate the
same cache line while updating nearby elements. This can lead to false sharing.

### 2. Padded Version

This version uses a padded shared array so each thread writes to a slot spaced
farther apart in memory. The goal is to reduce false sharing by preventing
multiple thread-local accumulators from occupying the same cache line.

### 3. Synchronized Version

This version uses a single shared accumulator protected by `#pragma omp atomic`.
It is correct, but all threads contend for the same variable, which introduces
significant synchronization overhead.

## Timing Results

Graphs generated from the benchmark data are included in:

- `graphs/time_O0.png`
- `graphs/time_O3.png`
- `graphs/speedup_O0.png`
- `graphs/speedup_O3.png`

### Serial Baseline

| Optimization | Threads | Time (ms) |
|-------------:|--------:|----------:|
| O0 | 1 | 3577 |
| O3 | 1 | 977 |

### Naive OpenMP

| Optimization | Threads | Time (ms) | Speedup vs serial |
|-------------:|--------:|----------:|------------------:|
| O0 | 1 | 3629 | 0.99x |
| O0 | 2 | 2099 | 1.70x |
| O0 | 4 | 1334 | 2.68x |
| O0 | 8 | 1221 | 2.93x |
| O3 | 1 | 1018 | 0.96x |
| O3 | 2 | 533 | 1.83x |
| O3 | 4 | 279 | 3.50x |
| O3 | 8 | 206 | 4.74x |

### Padded OpenMP

| Optimization | Threads | Time (ms) | Speedup vs serial |
|-------------:|--------:|----------:|------------------:|
| O0 | 1 | 3764 | 0.95x |
| O0 | 2 | 1855 | 1.93x |
| O0 | 4 | 1120 | 3.19x |
| O0 | 8 | 948 | 3.77x |
| O3 | 1 | 1043 | 0.94x |
| O3 | 2 | 531 | 1.84x |
| O3 | 4 | 273 | 3.58x |
| O3 | 8 | 211 | 4.63x |

### Synchronized OpenMP

| Optimization | Threads | Time (ms) | Speedup vs serial |
|-------------:|--------:|----------:|------------------:|
| O0 | 1 | 6250 | 0.57x |
| O0 | 2 | 9040 | 0.40x |
| O0 | 4 | 39812 | 0.09x |
| O0 | 8 | 75812 | 0.05x |
| O3 | 1 | 4711 | 0.21x |
| O3 | 2 | 4597 | 0.21x |
| O3 | 4 | 32628 | 0.03x |
| O3 | 8 | 36564 | 0.03x |

## Discussion

### Effect of Compiler Optimization

Compiler optimization had a major effect. The serial `O3` binary ran in `977 ms`
compared with `3577 ms` for `O0`, which is about `3.66x` faster. The optimized
OpenMP versions also benefited substantially from `O3`.

### Effect of Synchronization

The synchronized version performed the worst by a large margin. Even though the
program is correct, every thread repeatedly contends for the same shared `sum`
variable. This makes the atomic update a bottleneck and destroys scalability.

### Effect of False Sharing

The padded version generally outperformed the naive version, especially in the
`O0` tests at `2`, `4`, and `8` threads. This suggests that spacing out the
per-thread accumulators reduced cache-line interference. The difference was
smaller under `O3`, which indicates the optimization level and hardware effects
also influence how visible false sharing is.

### Effect of Thread Count

The best overall result in this test set was the padded `O0` version at `8`
threads (`948 ms`) and the naive `O3` version at `8` threads (`206 ms`). In the
naive and padded versions, increasing threads generally improved performance,
although the scaling was not perfectly linear. In the synchronized version,
adding threads made the program dramatically slower.

## Conclusion

This lab showed that OpenMP can significantly improve performance for a
numerical integration problem when the algorithm is parallelized carefully.
Using per-thread partial sums is much better than synchronizing every update to
a shared variable. Padding helps reduce false sharing, although the size of the
benefit depends on the optimization level and machine behavior. The overall
best strategy in this lab was to combine compiler optimization with a design
that avoids synchronization bottlenecks.

## Files Included In Repository

- `pi_serial.cpp`
- `pi_naive.cpp`
- `pi_padded.cpp`
- `pi_synchronized.cpp`
- `timing_data.csv`
- `plot_timings.py`
- `graphs/time_O0.png`
- `graphs/time_O3.png`
- `graphs/speedup_O0.png`
- `graphs/speedup_O3.png`
- `summary_report.md`
