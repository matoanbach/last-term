# WEEK 1 - Chapter 1
- GPUs offer distinct advantages:
    - Bulk computation powser
    - High FLOP/Watt ratio

## Flynn's taxonomy
- Flynn's taxonomy classifies computer architectures by how many instruction streams and data streams they handle:
    - Single instruction, single data (SISD): a simple sequential machine, that executes one instruction at a time, operating on a single data item. Surprisingly, the vast majority of contemporary CPUs, do not belong to this category.
    - Single instruction, multiple data (SIMD): a machine where each instruction is applied on a colleciton of items. Vector processors were the very first machines that followed this paradigm. GPUs also follow this design at the level of the Streaming Multiprocessor (SM for NVIDIA) or the SIMD unit (for AMD).
    - Multiple Instructions, Single data (MISD): this configuration seems like an oddity.
    - Multiple Instructions, Multiple data (MIMD): the most versatile machine category. Multicore machiines follow this paradigm, including GPUs.

## CPUs vs GPUs
- CPUs:
    - Large caches, repetitive use of data
    - Instruction decoding and prediction hardware
    - Pipelined execution
- GPUs:
    - Small caches, single-time use of data
    - Big data volume
    - Simple program logic, simple ALUs

## Measure performance
### Speedup
$$

\text{Speedup} = \frac{T_{\text{serial}}}{T_{\text{parallel}}}

$$

### Efficiency
$$

\text{Efficiency} = \frac{\text{Speedup}}{N}

$$

### Super-linear speedup
- It is possible for speedup to be bigger than N, which is so-called super-linear speedup.

### Scalability
- Scalability is the ability of a (software or hardware) system to efficient handle a growing amount of work.
- In the context of a parallel algoritm and/or platform, scalability translates to being able to
    - a. Solve bigger problems and/or
    - b. To incorporate more computing resources
- To measure (a), we use the weak scaling efficiency:
$$
\text{WeakScalingEfficiency}(N) = \frac{T_{\text{seq}}}{T'_{\text{par}}}
$$

- Strong Scaling Efficiency:
$$
\text{StrongScalingEfficiency}(N) = \frac{T_{\text{seq}}}{N \cdot T_{\text{par}}}
$$

## Predicting and Measuring parallel program performance.
- Once the sequential version is implemented, we can use a profiler to guide the design process.
- Profilers can be:
    - Instrumentation: modifies the code of the program that is being profiled, so that information can be collected (usually requires re-compilation).
    - Sampling: the execution of the target program is interrupted periodically, in order to query which function is being executed.

## Amdahl's law
- Amdahl's Law explains the limit of speeding up a program using parallel processing. Even if we add many cores, the part of the program that must run sequentially limites the total speedup.
- Formula:
$$
\text{speedup}
= \frac{t_{\text{seq}}}{t_{\text{par}}}
= \frac{T}{(1-\alpha)T + \frac{\alpha T}{N}}
= \frac{1}{1-\alpha+\frac{\alpha}{N}}
$$
- Notes:
- speedup: how many times faster the parallel program is compared to the sequential program

- t_seq: execution time of the sequential version

- t_par: execution time of the parallel version

- T: total execution time of the sequential program

- α: fraction of the program that can be parallelized

- 1 - α: fraction of the program that must remain sequential

- N: number of processors/cores

- αT / N: parallel part divided across N processors

- (1 - α)T: sequential part that cannot be parallelized

## Gustafson-Barsis rebuttal
- It is a response to Amdahl's Law.
- In real life, when we get more processors, we usually solve a bigger problem, not the same small problem.
- A sequential machine would require a total time:
$$

t_{\text{seq}} = (1-\alpha)T + N \cdot \alpha \cdot T

$$
- The speedup would then be:
$$

\text{speedup}

= \frac{t_{\text{seq}}}{t_{\text{par}}}

= \frac{(1-\alpha)T + N \cdot \alpha \cdot T}{T}

= (1-\alpha) + N\alpha

$$
- And the corresponding efficiency:
$$

\text{efficiency}

= \frac{\text{speedup}}{N}

= \frac{1-\alpha}{N} + \alpha

$$
- The efficiency has a lower bound of a, as N goes to infinitity