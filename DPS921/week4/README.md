# Chapter 05 Refined Focused Summary: MPI

> Refined using the lecture transcript and **InClass_Notes.txt**.  
> Main focus: MPI basics, process identity, communicators, program architecture, point-to-point communication, deadlock, non-blocking communication, and basic debugging/error handling.

---

## 1. Why MPI matters

Before MPI, the notes compare three related ideas:

| Concept | Simple meaning |
|---|---|
| `fork()` | Creates another process |
| Multithreading | Multiple threads run inside the same process and can share memory |
| Multiprocessing | Multiple processes run separately, usually with separate memory |

### Threads vs processes

In multithreading:

```text
thread1   thread2   thread3
      shared memory
```

Threads can usually share the same memory space.

In multiprocessing:

```text
process1       process2       process3
 memory         memory         memory
```

Each process has its own memory. This makes communication harder because one process cannot directly access another process's memory.

This is where **MPI** becomes useful.

MPI helps separate processes communicate with each other by sending messages.

MPI is important for scalable computing, especially on clusters or supercomputers such as **Niagara** or systems connected through **WestGrid**.

---

## 2. What is MPI?

**MPI** stands for **Message Passing Interface**.

MPI is **not a programming language**.

It is a **set of functions** used to create software that runs as multiple processes.

Simple definition:

> MPI lets multiple processes communicate by passing messages.

MPI is commonly used when a program runs on multiple CPU cores, multiple machines, or a distributed-memory system.

---

## 3. MPI software stack

The notes describe MPI as sitting between your program and the lower-level system.

```text
MPI Program
    |
    v
MPI Library
(OpenMPI / MPICH)
    |
    v
Operating System + Network APIs
    |
    v
Hardware / Network
```

This means your program calls MPI functions, and the MPI library handles the communication details through the operating system and network.

Example MPI implementations:

- OpenMPI
- MPICH

---

## 4. Analogy: MPI as a delivery system

A simple analogy is **Canada Post**.

You do not personally carry every package to the destination. Instead, you give the package to the delivery system with an address.

MPI works similarly:

- Your process gives MPI a message.
- MPI uses the destination rank and communicator.
- MPI delivers the message to the correct process.

---

## 5. Rank

A **rank** is the ID number of a process inside an MPI communicator.

Each process has a unique rank.

Example:

```text
rank 0
rank 1
rank 2
rank 3
```

Ranks are important because they let processes identify each other.

For example, process 0 can send a message to process 1 by using rank 1 as the destination.

### Getting the rank

```c
int rank;
MPI_Comm_rank(MPI_COMM_WORLD, &rank);
```

### Using rank to create different behavior

MPI programs often use rank to decide what each process should do.

```c
if (rank == 0) {
    // manager / main process behavior
} else {
    // worker process behavior
}
```

### Train analogy

The notes use a train analogy:

```text
Seat 0 = driver
Seat 1 = fare inspector
Other seats = passengers
```

Even though everyone is on the same train, different seats have different roles.

Similarly, in MPI:

```c
if (rank == 0) {
    // driver's behavior
} else if (rank == 1) {
    // inspector's behavior
} else {
    // passenger / worker behavior
}
```

---

## 6. Size

**Size** means the total number of MPI processes in the communicator.

### Getting the size

```c
int size;
MPI_Comm_size(MPI_COMM_WORLD, &size);
```

If you run:

```bash
mpiexec -np 4 ./program
```

Then:

```text
size = 4
```

The ranks would usually be:

```text
0, 1, 2, 3
```

---

## 7. Communicator

A **communicator** defines a group of processes that can communicate with each other.

The default communicator is:

```c
MPI_COMM_WORLD
```

`MPI_COMM_WORLD` contains all processes launched for the MPI program.

Example:

```text
MPI_COMM_WORLD

rank0    rank1    rank2    rank3
```

A communicator answers questions like:

- Who can communicate?
- How many processes are in the group?
- What are the members of the group?
- What rank does each process have inside that group?

The two common functions used with a communicator are:

```c
MPI_Comm_rank(MPI_COMM_WORLD, &rank);
MPI_Comm_size(MPI_COMM_WORLD, &size);
```

---

## 8. Basic MPI program structure

A typical MPI program looks like this:

```c
#include <mpi.h>

int main(int argc, char **argv) {
    MPI_Init(&argc, &argv);

    int rank;
    int size;

    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    // MPI work goes here

    MPI_Finalize();
    return 0;
}
```

Important functions:

| Function | Meaning |
|---|---|
| `MPI_Init` | Starts the MPI environment |
| `MPI_Finalize` | Ends the MPI environment |
| `MPI_Comm_rank` | Gets the current process rank |
| `MPI_Comm_size` | Gets the total number of processes |

---

## 9. Program architecture: SPMD and MPMD

The notes mention two MPI program architectures:

| Architecture | Meaning |
|---|---|
| SPMD | Single Program, Multiple Data |
| MPMD | Multiple Program, Multiple Data |

### SPMD

In **SPMD**, every process runs the same executable, but each process may behave differently based on its rank.

Example:

```bash
mpiexec -np 4 ./program
```

All four processes run `./program`.

Inside the program, you can use:

```c
if (rank == 0) {
    // manager behavior
} else {
    // worker behavior
}
```

### MPMD

In **MPMD**, different executables run at the same time.

Example from the notes:

```bash
mpiexec -np 1 ./manager : -np 4 ./worker
```

This launches:

```text
1 manager process
4 worker processes
```

This is useful when different processes need completely different program logic.

---

## 10. Communication in MPI

The lecture focuses on **point-to-point communication**.

Point-to-point communication means exactly two processes are involved:

```text
sender process  --->  receiver process
```

The notes also mention **collective communication**, but mark it as a topic for next week.

So for this summary, the main focus is point-to-point communication.

---

## 11. `MPI_Send`

`MPI_Send` is a blocking communication function used to send a message from one MPI process to another.

General idea:

```c
MPI_Send(data, count, datatype, destination_rank, tag, MPI_COMM_WORLD);
```

Example:

```c
int value = 10;

MPI_Send(&value, 1, MPI_INT, 1, 0, MPI_COMM_WORLD);
```

Meaning:

```text
Send 1 integer from the current process to process rank 1.
```

Important parameters:

| Parameter | Meaning |
|---|---|
| `data` | Address of the data being sent |
| `count` | Number of items to send |
| `datatype` | MPI datatype, such as `MPI_INT` |
| `destination_rank` | Rank of the receiving process |
| `tag` | Message label |
| `MPI_COMM_WORLD` | Communicator |

---

## 12. `MPI_Recv`

`MPI_Recv` is a blocking communication function used to receive a message from another MPI process.

General idea:

```c
MPI_Recv(buffer, count, datatype, source_rank, tag, MPI_COMM_WORLD, &status);
```

Example:

```c
int value;
MPI_Status status;

MPI_Recv(&value, 1, MPI_INT, 0, 0, MPI_COMM_WORLD, &status);
```

Meaning:

```text
Receive 1 integer from process rank 0.
```

Important parameters:

| Parameter | Meaning |
|---|---|
| `buffer` | Address where received data will be stored |
| `count` | Number of items to receive |
| `datatype` | MPI datatype, such as `MPI_INT` |
| `source_rank` | Rank of the sending process |
| `tag` | Message label |
| `MPI_COMM_WORLD` | Communicator |
| `status` | Information about the received message |

---

## 13. Blocking communication

`MPI_Send` and `MPI_Recv` are blocking communication functions.

Blocking means the function may wait until the communication can safely continue.

The most important blocking issue from the lecture is with `MPI_Recv`.

If a process calls `MPI_Recv`, it may wait until the expected message arrives.

This can create problems if no process sends the expected message.

---

## 14. Deadlock situation

A **deadlock** happens when processes are waiting for each other, but no process can move forward.

The notes describe this situation:

```text
Process 0 is waiting for receive to complete.
Process 1 is waiting for receive to complete.
```

If both processes are waiting to receive, but neither process sends, the entire program can freeze.

### Deadlock example

```c
if (rank == 0) {
    MPI_Recv(&x, 1, MPI_INT, 1, 0, MPI_COMM_WORLD, &status);
    MPI_Send(&y, 1, MPI_INT, 1, 0, MPI_COMM_WORLD);
}

if (rank == 1) {
    MPI_Recv(&y, 1, MPI_INT, 0, 0, MPI_COMM_WORLD, &status);
    MPI_Send(&x, 1, MPI_INT, 0, 0, MPI_COMM_WORLD);
}
```

Problem:

```text
rank 0 waits to receive from rank 1
rank 1 waits to receive from rank 0
nobody sends first
program freezes
```

### Simple fix

Make one process send first.

```c
if (rank == 0) {
    MPI_Send(&x, 1, MPI_INT, 1, 0, MPI_COMM_WORLD);
    MPI_Recv(&y, 1, MPI_INT, 1, 0, MPI_COMM_WORLD, &status);
}

if (rank == 1) {
    MPI_Recv(&x, 1, MPI_INT, 0, 0, MPI_COMM_WORLD, &status);
    MPI_Send(&y, 1, MPI_INT, 0, 0, MPI_COMM_WORLD);
}
```

---

## 15. Non-blocking communication

The notes say to read from the textbook about non-blocking communication.

The important functions are:

```c
MPI_Isend
MPI_Irecv
MPI_Wait
```

### Main idea

Blocking communication waits immediately.

Non-blocking communication starts the communication and allows the program to continue.

Later, you call `MPI_Wait` to make sure the communication is complete.

| Function | Meaning |
|---|---|
| `MPI_Isend` | Starts a send operation without waiting immediately |
| `MPI_Irecv` | Starts a receive operation without waiting immediately |
| `MPI_Wait` | Waits for a non-blocking operation to finish |

### Non-blocking send example

```c
MPI_Request request;

MPI_Isend(&value, 1, MPI_INT, 1, 0, MPI_COMM_WORLD, &request);

// other work can happen here

MPI_Wait(&request, MPI_STATUS_IGNORE);
```

### Non-blocking receive example

```c
MPI_Request request;
MPI_Status status;

MPI_Irecv(&value, 1, MPI_INT, 0, 0, MPI_COMM_WORLD, &request);

// other work can happen here

MPI_Wait(&request, &status);
```

### Why non-blocking communication helps

Non-blocking communication can help avoid some waiting problems because processes do not have to stop immediately at the send or receive call.

It can also improve performance because communication and computation may overlap.

---

## 16. MPI datatypes to practice

The transcript says to practice sending different data types.

Useful MPI datatypes:

| C type | MPI datatype |
|---|---|
| `int` | `MPI_INT` |
| `double` | `MPI_DOUBLE` |
| `char` | `MPI_CHAR` |
| string / character array | `MPI_CHAR` with count greater than 1 |

### Send an integer

```c
int value = 10;
MPI_Send(&value, 1, MPI_INT, 1, 0, MPI_COMM_WORLD);
```

### Send a double

```c
double value = 3.14;
MPI_Send(&value, 1, MPI_DOUBLE, 1, 0, MPI_COMM_WORLD);
```

### Send a character

```c
char c = 'A';
MPI_Send(&c, 1, MPI_CHAR, 1, 0, MPI_COMM_WORLD);
```

### Send a string

```c
char msg[] = "hello";
MPI_Send(msg, 6, MPI_CHAR, 1, 0, MPI_COMM_WORLD);
```

The count is `6` because `"hello"` has five visible characters plus the null character `\0`.

---

## 17. Error reporting and handling

The notes mention **error reporting and handling**.

The transcript also says MPI debugging can be different from normal debugging.

Most MPI functions return an integer.

You can check whether the function succeeded by comparing the return value with:

```c
MPI_SUCCESS
```

Example:

```c
int result;

result = MPI_Send(&value, 1, MPI_INT, 1, 0, MPI_COMM_WORLD);

if (result != MPI_SUCCESS) {
    printf("MPI_Send failed on process %d\n", rank);
}
```

### Debugging tips

Print the rank so you know which process is producing the output.

```c
printf("Process %d reached this point\n", rank);
```

Print before and after communication calls.

```c
printf("Process %d before receive\n", rank);
MPI_Recv(&value, 1, MPI_INT, 0, 0, MPI_COMM_WORLD, &status);
printf("Process %d after receive\n", rank);
```

If the second message never prints, that process is probably stuck in the receive call.

---

## 18. Function signatures matter

The instructor emphasized looking at function signatures.

This means you should know:

- what the function returns
- what arguments the function takes
- which arguments are input values
- which arguments are output values
- what datatype should be used
- how many items are being sent or received

Example signature for `MPI_Send`:

```c
int MPI_Send(
    const void *buf,
    int count,
    MPI_Datatype datatype,
    int dest,
    int tag,
    MPI_Comm comm
);
```

Important point:

```text
The return type is int.
```

That means you can store the return value and check for errors.

---

## 19. Homework / practice ideas

Based on the lecture transcript and notes, practice these:

### Practice 1: Send from process 0 to process 1

- Run with 2 processes.
- Rank 0 sends an integer.
- Rank 1 receives and prints it.

### Practice 2: Reverse sender and receiver

- Rank 1 sends.
- Rank 0 receives.

### Practice 3: Use more than 2 processes

Use rank to give each process different behavior.

Example:

```c
if (rank == 0) {
    // manager
} else {
    // worker
}
```

### Practice 4: Send a double

Use:

```c
MPI_DOUBLE
```

### Practice 5: Send a character

Use:

```c
MPI_CHAR
```

### Practice 6: Send a string

Use:

```c
MPI_CHAR
```

with count greater than 1.

### Practice 7: Create a deadlock, then fix it

First make both processes call `MPI_Recv` first.

Then fix it by making one process send first.

### Practice 8: Try non-blocking communication

Use:

```c
MPI_Isend
MPI_Irecv
MPI_Wait
```

---

## 20. What to focus on for this lecture

Focus most on:

- MPI meaning
- MPI as a set of functions, not a programming language
- why MPI is useful for multiprocessing and scalability
- rank
- size
- communicator
- `MPI_COMM_WORLD`
- SPMD and MPMD
- `mpiexec -np`
- point-to-point communication
- `MPI_Send`
- `MPI_Recv`
- blocking communication
- deadlock
- non-blocking communication basics
- error reporting and debugging

Do **not** spend too much time yet on:

- collective communication details
- bucket sort
- one-sided communication / RMA
- MPI file I/O
- profiling tools
- persistent communication
- derived datatypes

Collective communication is mentioned as a next-week topic, so it is not the main focus here.

---

## 21. One-page version

MPI stands for **Message Passing Interface**. It is not a programming language. It is a set of functions used to write programs that run as multiple processes.

MPI is useful because processes usually have separate memory. Unlike threads, processes cannot simply share variables directly. MPI lets these processes communicate by sending messages.

Each MPI process has a **rank**, which is its ID inside a communicator. The total number of processes is called the **size**. The default communicator is `MPI_COMM_WORLD`, which contains all processes in the MPI program.

A basic MPI program starts with `MPI_Init` and ends with `MPI_Finalize`. You can get the current process ID using `MPI_Comm_rank`, and the total number of processes using `MPI_Comm_size`.

MPI programs can use **SPMD** or **MPMD** architecture. In SPMD, all processes run the same executable but behave differently based on rank. In MPMD, different executables run at the same time, such as one manager and multiple workers.

The main communication topic is **point-to-point communication**, where one process sends data and another process receives it. The important functions are `MPI_Send` and `MPI_Recv`.

`MPI_Send` sends a message. `MPI_Recv` receives a message. These are blocking functions, meaning they may wait before continuing. A deadlock can happen if two processes are both waiting to receive and neither sends first. This can freeze the entire program.

To reduce waiting problems, MPI provides non-blocking functions such as `MPI_Isend`, `MPI_Irecv`, and `MPI_Wait`. These allow communication to start first, then completion is checked later.

For debugging, MPI functions return integer status values. You can compare the result with `MPI_SUCCESS`. It is also helpful to print the process rank in debugging messages so you know which process is stuck.

For practice, send data between different ranks. Try sending an integer, a double, a character, and a string. Then create a simple deadlock and fix it. Finally, try non-blocking communication.