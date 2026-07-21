[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/5Yej1RJo)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=24246350&assignment_repo_type=AssignmentRepo)
# Lab Activity 4 (5%)
## Due Date - Sunday July 26, 2025 (Late Policy: 10% per day)

## Learning Outcomes

Upon successful completion of this lab, students will be able to:

- Parallelize a computational algorithm using OpenMP.
- Compare different approaches to accumulating results in parallel.
- Identify the effects of false sharing on OpenMP performance.
- Evaluate the impact of compiler optimization and thread count on program performance.


## Environment Setup

Before starting this lab, review the following resources: 

- Course Text: Section 8.12.2 - False Sharing
- [Introduction of OpenMP YouTube Series - Tim Mattson - Modules 1-8](https://www.youtube.com/playlist?list=PLLX-Q6B8xqZ8n8bwjGdzBJ25X2utwnoEG)
- [Enabling OpenMP support in Visual Studio](https://learn.microsoft.com/en-us/cpp/build/reference/openmp-enable-openmp-2-0-support?view=msvc-170) 


## Question 1: Parallel Approximation of $$\pi$$ Using OpenMP

The [given program](pi_serial.cpp) implements the differentiation of the function below by approximating the area under its curve. 

$$ \int \frac{4}{1+x^2}~dx \approx \pi $$

Complete the following tasks:
1. Compile the [given code](pi_serial.cpp) using both "no-optimization" and "max optimization for speed" options to generate two different binaries.
2. Gather timing data when executing both versions on your computer (set the number of steps to 1000000000). 
3. Identify the loop that can be parallelized and explain why iterations of this loop can execute independently. 
4. Create three OpenMP implementations of the program.
    - **Naive Version:** Each thread accumulates its partial sum in a separate element of one-dimensional shared array.
    - **Padded Version:** Modify the shared array to reduce false sharing by padding each thread's partial sum.
    - **Synchronized Version:** Use a single shared accumulator protected by an OpenMP synchronization mechanism (e.g., 'critical' or 'atomic').
5. Create two binaries ("no-opt" and "max-opt") for each OpenMP implementation.    
6. Evaluate the performance of each implementation using different OpenMP thread counts.

   - Test each implementation using thread counts up to the maximum number of logical processors available on your machine (e.g., 1, 2, 4, 8, 16, 32, or 64 threads, where applicable).
   - Record the execution time for each configuration.
   - Present your results using appropriate tables and graphs.
   - Compare the performance of the three OpenMP implementations, and discuss the effects of compiler optimization, synchronization, and false sharing on performance.
   

### Deliverables

-  summary report

The report is to be submitted in a single file on **Blackboard**.  Code, files containing the raw data collected and files used to generate visualizations should be uploaded to **your assigned GitHub repository**.



