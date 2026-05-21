[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/mUI0u7yE)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=23917137&assignment_repo_type=AssignmentRepo)
# Lab Activity 1 (5%)
## Due Date - Sunday May 24, 2026 (Late Policy: 10% per day)

## Learning Outcomes

- use compiler options to optimize program performance
- compare program performance in different environments
- collect timing statistics using operating system and programming language support
- identify variables which affect execution time
- choose a decomposition pattern to parallelize an algorithm
- spawn threads in an application
- synchronize access to a shared data structure 

## Environment Setup

Ensure that you have the following compiler(s) installed on your computer:

Required:
- [Microsoft Visual Studio Community 2022](https://visualstudio.microsoft.com/downloads/)

Recommended (bonus / enrichment) - Try a second compiler, e.g.,
- [Intel oneAPI HPC](https://www.intel.com/content/www/us/en/developer/tools/oneapi/hpc-toolkit-download.html)
- [GNU g++ or equivalent](https://gcc.gnu.org/)

**Note:** Using multiple compilers is optional. If attemted, you may briefly compare results. 

## Important Notes
- All experiments will be conducted on your local machine
- Results will vary across systems - focus on trends, not absolute values
- Run each experiment at least 3 times and report the average. 
- Timing loops may be used to improve measurement stability

Example:
```cpp
int runs = 3;
for (int i = 0; i < runs; i++) {
    // timing-measurement code
}
```

### Question 1 - Code Optimization (40%)

**Step#1** Complete the provided source code by adding pre-defined preprocessor macros that report the compiler name, version, revision, and patch number of the host compiler. Your completed code must process the Microsoft Visual C++ (MSVC) compiler and optionally the other compilers listed above. You can find the pre-processor macros 
[here](https://sourceforge.net/p/predef/wiki/Compilers/). 

**Step#2** Once you have completed the code, compile it with optimization turned off.  
- Collect the timing results from executing using various values of n and record your statistics. Ensure that you select an appropriate range of n values. Run each configuration at least 3 times and compute the average.

**Step#3** Re-compile your code using the normal (standard) optimization option offered, execute the binary and record the timings for the sizes listed below.  

**Step#4** Finally, re-compile your code using a aggresive optimization level and repeat the experiments. Record the timing results for the same values of n.

**Provide a summary of your results**.  It should include information about hardware used (CPU model, number of cores/threads, RAM, operating system used, etc), methodology used (compiler used and optimization flags, timing method, number of runs per configuration). Just submitting a table of timing results is not sufficent at this level. Visualizations help the reader identify trends/relationships between variables. Discuss trends, comment on any variability in results, focus on explaining why performance changes, not just what happened. Provide visualizations to support insights that you have. Conduct regression analysis to see if a function can explain the results of your experiments. You may use tools such as Excel, Python (e.g., scikit-learn), or similar to explore trends. A simple linear or log-linear fit is sufficient. 

Example using Python and scikit-learn:

```python
import numpy as np
from sklearn.linear_model import LinearRegression

# Example data
n = np.array([1000, 2000, 4000, 8000]).reshape(-1, 1)
time = np.array([0.01, 0.04, 0.16, 0.64])

model = LinearRegression()
model.fit(n, time)

print("Slope:", model.coef_[0])
print("Intercept:", model.intercept_)
print("R^2:", model.score(n, time))
```


### Question 2 - parallelize Code (30%)

Estimate the speedup that parallelization *may* provide. Provide calculations and justification for your estimate.

Review the code from the question above and state which decomposition pattern is most appropriate for this application. Convert it into a parallel solution where the number of threads launched is configurable at the command line. Partition the data among threads appropriately. Recommended thread counts: 1, 2, 4, 8 (or up to hardware concurrency). Execute experiments on your local machine. Use the same values of n from Question 1.

**Note:** Results will vary across different hardware. Focus on trends, e.g., how performance changes with input size and optimization, not absolute values.

**Note:** Refer to Chapter 2 of textbook for Decomposition Patterns.

Collect statistics using runs with a variable amount of threads.

Provide a summary of your results, including, execution time vs number of threads (graph recommended), speedup and efficiency, comparison between theoretical speedup and observed results. Also provide discussion on scalability, diminishing returns, and overhead of parallelism. 

### Question 3 - Synchronize Data Access (30%)

A popular bakery has a baker that cooks a loaf of bread at a time and deposits it on a counter. Incoming customers pick up a loaf from the counter and exit the bakery. The counter can hold 20 loaves. If it is full the baker stops baking bread. If it is empty, a customer waits. 

Identify a pattern which can help us build a solution. State this pattern in a comment at the top of your source code. Also, provide justification.

Use semaphores to implement a solution, that addresses the coordination problem between the baker and the customers. Implement at least 1 baker thread, multiple customer threads, ensure the buffer size is strictly enforced (20 loaves maximum) and no race conditions occur.

### Deliverables

Each question emphasizes different aspects of parallel programming: performance analysis (Q1–Q2) and correctness/synchronization (Q3).

-  question 1 - summary report
-  question 2 - modified code, summary report
-  question 3 - code

The reports are to be submitted in a single file (Section 1 - Question 1, Section 2 - Question 2) on **Blackboard**.  Code, files containing the raw data collected and files used to generate visualizations should be uploaded to **your assigned GitHub repository**.


Note that you will explain your work in a discussion with the professor. This discussion will be worth 25% of your grade.

