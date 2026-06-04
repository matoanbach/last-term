# Focus Guide: Week 1 / Intro to Parallel Computing

## Purpose of This Summary

This markdown summarizes what to focus on based on the lecturer transcript and the lecture summary notes. The agenda topics are:

- 1.1 The era of multicore machines
- 1.2 Taxonomy of parallel machines
- 1.3 A glimpse of influential computing machines
- 1.4 Performance metrics
- 1.5 Performance prediction
- 1.5.1 Amdahl’s Law
- 1.5.2 Gustafson–Barsis Law

The strongest focus should be on **performance metrics**, **speedup**, **efficiency**, **Amdahl’s Law**, and **Gustafson’s Law**, because the lecturer spent time calculating speedup and efficiency and said the laws are related to these metrics.

---

## 1. High-Priority Topics

Focus most on these topics:

1. Speedup
2. Efficiency
3. Amdahl’s Law
4. Gustafson–Barsis Law
5. Performance prediction
6. Processor utilization
7. Basic idea of multicore and parallel machines
8. Basic overview of influential computing machines

The lecturer specifically gave practice calculations using:

```text
Ts = 100 seconds
Tp = 25 seconds
N = 4
```

and asked for:

```text
speedup
efficiency
```

So calculation-based questions are likely important.

---

## 2. The Era of Multicore Machines

### Main idea

Modern computers often contain multiple cores/processors. Instead of relying only on one fast processor, performance can be improved by dividing work across multiple processing units.

### What to understand

You should know:

- Why multicore machines became important
- Why parallel programming is needed
- Why using more processors does not always mean perfect speedup
- Why some processors may sit idle if the program is not parallelized well

### Simple explanation

If one worker takes 100 seconds to finish a job, then four workers might finish faster. But this only works well if the job can actually be divided among them.

---

## 3. Taxonomy of Parallel Machines

### Main idea

Taxonomy means classification. In this section, you should understand that parallel machines can be classified by how processors and memory are organized.

### What to focus on

At a high level, know that parallel machines differ based on:

- Number of processors
- Whether memory is shared or distributed
- How processors communicate
- How scalable the architecture is

### Important connection

This topic connects to later MPI content. MPI is commonly used when processes have separate memory and communicate by passing messages.

---

## 4. Influential Computing Machines

### Main idea

This section is mostly an overview. You do not need to memorize every machine in deep detail unless the instructor gives specific examples.

### What to focus on

Know that the course connects parallel computing to real-world high-performance systems such as:

- supercomputers
- clusters
- multicore systems
- GPU-based systems

### Study priority

This is lower priority than speedup, efficiency, Amdahl’s Law, and Gustafson’s Law.

---

## 5. Performance Metrics

Performance metrics are used to measure how good a parallel program is.

The most important metrics from the transcript and notes are:

1. Speedup
2. Efficiency

---

## 6. Speedup

### Definition

Speedup tells how much faster a parallel program is compared to a serial program.

### Formula

```text
S(N) = T1 / TN
```

Where:

```text
T1 = execution time using 1 processor
TN = execution time using N processors
N  = number of processors
```

### Example

If:

```text
T1 = 100 seconds
TN = 25 seconds
N = 4
```

Then:

```text
S(4) = 100 / 25 = 4
```

So the parallel program is:

```text
4 times faster
```

### What speedup tells you

Speedup tells you how much performance improved.

---

## 7. Efficiency

### Definition

Efficiency tells how well the processors are being used.

### Formula

```text
E(N) = S(N) / N
```

Where:

```text
S(N) = speedup
N = number of processors
```

### Example 1: Perfect efficiency

If:

```text
T1 = 100 seconds
TN = 25 seconds
N = 4
```

Then:

```text
Speedup = 100 / 25 = 4
Efficiency = 4 / 4 = 1 = 100%
```

Meaning:

```text
All processors are being used very well.
```

### Example 2: Lower efficiency

If:

```text
T1 = 100 seconds
TN = 40 seconds
N = 4
```

Then:

```text
Speedup = 100 / 40 = 2.5
Efficiency = 2.5 / 4 = 0.625 = 62.5%
```

Meaning:

```text
The program is faster than serial, but the processors are not fully utilized.
```

### What efficiency tells you

Efficiency helps identify whether processors are sitting idle or being wasted.

The lecturer emphasized that low efficiency means the available computing power is not being fully used.

---

## 8. Speedup vs Efficiency

### Speedup answers:

```text
How much faster is the parallel program?
```

### Efficiency answers:

```text
How well are the processors being used?
```

### Example

If 8 processors produce a speedup of 4:

```text
Efficiency = 4 / 8 = 0.5 = 50%
```

This means:

```text
The program is faster, but only half of the processor power is effectively used.
```

---

## 9. Performance Prediction

Performance prediction means estimating how much improvement we can get before or after using more processors.

The two main laws are:

1. Amdahl’s Law
2. Gustafson–Barsis Law

These are important because they explain why parallel programs do not always scale perfectly.

---

## 10. Amdahl’s Law

### Main idea

Amdahl’s Law predicts the maximum speedup for a fixed-size problem.

It says that the serial part of a program limits the total speedup.

### Formula

```text
S(N) = 1 / ((1 - P) + (P / N))
```

Where:

```text
P = parallel portion of the program
1 - P = serial portion
N = number of processors
```

### Key idea

Even if you add many processors, the serial part still has to run sequentially.

So:

```text
A small serial portion can limit total speedup.
```

### Example

If a program is:

```text
95% parallel
5% serial
```

Then the maximum possible speedup is:

```text
1 / 0.05 = 20
```

Even with unlimited processors, the speedup cannot go beyond 20x.

### When to use Amdahl’s Law

Use Amdahl’s Law when:

- the problem size is fixed
- you want to know the maximum possible speedup
- you want to understand the effect of the serial part

---

## 11. Gustafson–Barsis Law

### Main idea

Gustafson–Barsis Law says that parallel systems can scale well if the problem size grows as the number of processors grows.

### Formula

```text
S(N) = N - (1 - P)(N - 1)
```

Where:

```text
P = parallel portion
N = number of processors
```

### Key idea

Instead of keeping the workload fixed, we increase the workload to use more processors.

This helps explain why large parallel systems and supercomputers are useful.

### When to use Gustafson–Barsis Law

Use Gustafson–Barsis Law when:

- the problem size can grow
- more processors allow us to solve a bigger problem
- we care about scalability

---

## 12. Amdahl’s Law vs Gustafson–Barsis Law

| Topic | Amdahl’s Law | Gustafson–Barsis Law |
|---|---|---|
| Problem size | Fixed | Grows with processors |
| Main concern | Serial bottleneck | Scalability |
| Result | Speedup eventually plateaus | Near-linear scaling may be possible |
| Viewpoint | “How fast can this same problem run?” | “How much bigger a problem can we solve?” |

### Simple comparison

Amdahl’s Law says:

```text
Adding more processors has a limit because some code is serial.
```

Gustafson–Barsis Law says:

```text
If we increase the workload, more processors can still be useful.
```

---

## 13. Profiling

The lecturer mentioned profiling as something to discuss later, and the lecture summary includes profiling notes. Treat profiling as a supporting topic.

### What is profiling?

Profiling is the process of analyzing a program’s performance to find:

- slow functions
- CPU bottlenecks
- memory problems
- excessive I/O
- threading issues
- resource usage problems

### Why profiling matters

Profiling helps you find where the program is slow before you try to optimize it.

### Important profiling terms

| Term | Meaning |
|---|---|
| CPU profiling | Finds functions using the most CPU time |
| Memory profiling | Finds memory leaks and excessive allocations |
| Thread profiling | Finds synchronization delays and parallel bottlenecks |
| Hot path | Function-call path consuming the most time |
| Inclusive time | Time inside a function plus its child function calls |
| Exclusive time | Time spent only inside that function |
| Call count | Number of times a function runs |

### Study priority

Profiling is useful, but based on the transcript, performance metrics and laws are more important for this session.

---

## 14. What to Practice

Practice these calculation questions.

### Practice 1

```text
T1 = 100 seconds
TN = 25 seconds
N = 4
```

Find:

```text
Speedup = ?
Efficiency = ?
```

Answer:

```text
Speedup = 100 / 25 = 4
Efficiency = 4 / 4 = 1 = 100%
```

### Practice 2

```text
T1 = 100 seconds
TN = 40 seconds
N = 4
```

Find:

```text
Speedup = ?
Efficiency = ?
```

Answer:

```text
Speedup = 100 / 40 = 2.5
Efficiency = 2.5 / 4 = 0.625 = 62.5%
```

### Practice 3

If a program has:

```text
P = 0.95
serial part = 0.05
```

Maximum speedup with infinite processors:

```text
1 / 0.05 = 20
```

---

## 15. What Is Most Likely Important for Test/Review

Focus on being able to answer:

- What is speedup?
- What is efficiency?
- How do you calculate speedup?
- How do you calculate efficiency?
- What does low efficiency mean?
- What does 100% efficiency mean?
- What is Amdahl’s Law?
- What does the serial part of a program do to speedup?
- What is Gustafson–Barsis Law?
- How is Gustafson–Barsis different from Amdahl’s Law?
- Why are multicore machines important?
- What is profiling used for?

---

## 16. One-Page Summary

This week introduces parallel computing and performance measurement. The main idea is that modern machines have multiple cores or processors, so programs can run faster if their work is divided across processors. However, adding processors does not automatically guarantee perfect performance.

The most important metrics are **speedup** and **efficiency**. Speedup measures how much faster the parallel version is compared to the serial version. Efficiency measures how well the processors are being used. If speedup is 4 using 4 processors, efficiency is 100%. If speedup is 2.5 using 4 processors, efficiency is 62.5%, meaning some processor power is not fully used.

For performance prediction, focus on **Amdahl’s Law** and **Gustafson–Barsis Law**. Amdahl’s Law applies to fixed-size problems and shows that the serial part limits maximum speedup. Gustafson–Barsis Law applies when the problem size grows with the number of processors and explains why large workloads can scale well on parallel systems.

Also know that profiling is used to find performance bottlenecks such as slow functions, memory issues, I/O delays, and thread problems. But the highest priority for this material is speedup, efficiency, Amdahl’s Law, and Gustafson–Barsis Law.