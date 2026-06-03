#!/usr/bin/env python3
"""Lab 2 experiment runner.

Runs sequential and MPI experiments, writes CSV files, and generates figures.

Examples, from this folder:
  python3 script.py q1
  python3 script.py q2 --processes 2,4,8
  python3 script.py q3 --processes 1,2,4,8
  python3 script.py all --processes 1,2,4,8
"""

from __future__ import annotations

import argparse
import csv
import re
import statistics
import subprocess
from dataclasses import dataclass
from pathlib import Path


ALLOC_RE = re.compile(r"allocation and initialization\s+- took -\s+([0-9.]+)\s+seconds")
CONV_RE = re.compile(r"conversion\s+- took -\s+([0-9.]+)\s+seconds", re.IGNORECASE)
WALL_RE = re.compile(r"parallel wall time\s+- took -\s+([0-9.]+)\s+seconds")
WORK_RE = re.compile(r"total process work time\s+- took -\s+([0-9.]+)\s+seconds")
RESULT_RE = re.compile(r"Result:\s+(\d+)\s+=\s+(\d+)\s+\(0s\)\s+\+\s+(\d+)\s+\(1s\)")


@dataclass(frozen=True)
class SeqRun:
    n: int
    run: int
    alloc_s: float
    conversion_s: float
    total_s: float
    zeroes: int
    ones: int


@dataclass(frozen=True)
class MpiRun:
    study: str
    n: int
    processes: int
    run: int
    wall_s: float
    work_s: float
    zeroes: int
    ones: int


def sh(cmd: list[str], cwd: Path | None = None) -> str:
    return subprocess.check_output(cmd, cwd=str(cwd) if cwd else None, text=True, stderr=subprocess.STDOUT)


def parse_int_list(csv_str: str) -> list[int]:
    values: list[int] = []
    for part in csv_str.split(","):
        part = part.strip()
        if part:
            values.append(int(part))
    return values


def compile_seq(compiler: str, opt: str, src: Path, out: Path) -> None:
    out.parent.mkdir(parents=True, exist_ok=True)
    subprocess.check_call([compiler, opt, "-std=c++17", str(src), "-o", str(out)])


def compile_mpi(compiler: str, opt: str, src: Path, out: Path) -> None:
    out.parent.mkdir(parents=True, exist_ok=True)
    subprocess.check_call([compiler, opt, str(src), "-lm", "-o", str(out)])


def parse_result(output: str) -> tuple[int, int, int]:
    match = RESULT_RE.search(output)
    if not match:
        raise RuntimeError(f"Failed to parse result line. Output was:\n{output}")
    return int(match.group(1)), int(match.group(2)), int(match.group(3))


def run_seq(exe: Path, n: int, run: int) -> SeqRun:
    output = sh([str(exe), str(n)])
    alloc = ALLOC_RE.search(output)
    conv = CONV_RE.search(output)
    if not alloc or not conv:
        raise RuntimeError(f"Failed to parse sequential timings. Output was:\n{output}")
    result_n, zeroes, ones = parse_result(output)
    alloc_s = float(alloc.group(1))
    conversion_s = float(conv.group(1))
    return SeqRun(result_n, run, alloc_s, conversion_s, alloc_s + conversion_s, zeroes, ones)


def run_mpi(mpi_runner: str, mpi_extra: list[str], exe: Path, n: int, processes: int, run: int, study: str) -> MpiRun:
    cmd = [mpi_runner, *mpi_extra, "-np", str(processes), str(exe), str(n)]
    output = sh(cmd)
    wall = WALL_RE.search(output)
    work = WORK_RE.search(output)
    if not wall or not work:
        raise RuntimeError(f"Failed to parse MPI timings. Command: {' '.join(cmd)}\nOutput was:\n{output}")
    result_n, zeroes, ones = parse_result(output)
    return MpiRun(study, result_n, processes, run, float(wall.group(1)), float(work.group(1)), zeroes, ones)


def write_seq_raw(path: Path, rows: list[SeqRun]) -> None:
    with path.open("w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["n", "run", "alloc_s", "conversion_s", "total_s", "zeroes", "ones"])
        for row in rows:
            writer.writerow([
                row.n,
                row.run,
                f"{row.alloc_s:.6f}",
                f"{row.conversion_s:.6f}",
                f"{row.total_s:.6f}",
                row.zeroes,
                row.ones,
            ])


def read_seq_raw(path: Path) -> list[SeqRun]:
    if not path.exists():
        return []
    rows: list[SeqRun] = []
    with path.open(newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            alloc_s = float(row["alloc_s"])
            conversion_s = float(row["conversion_s"])
            total_s = float(row.get("total_s") or (alloc_s + conversion_s))
            rows.append(
                SeqRun(
                    int(row["n"]),
                    int(row["run"]),
                    alloc_s,
                    conversion_s,
                    total_s,
                    int(row["zeroes"]),
                    int(row["ones"]),
                )
            )
    return rows


def write_seq_summary(path: Path, rows: list[SeqRun]) -> dict[int, float]:
    grouped: dict[int, list[SeqRun]] = {}
    for row in rows:
        grouped.setdefault(row.n, []).append(row)

    baseline: dict[int, float] = {}
    with path.open("w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["n", "alloc_avg_s", "conversion_avg_s", "total_avg_s", "zeroes", "ones"])
        for n in sorted(grouped):
            rs = grouped[n]
            alloc_avg = statistics.mean(r.alloc_s for r in rs)
            conv_avg = statistics.mean(r.conversion_s for r in rs)
            total_avg = statistics.mean(r.total_s for r in rs)
            baseline[n] = total_avg
            writer.writerow([n, f"{alloc_avg:.6f}", f"{conv_avg:.6f}", f"{total_avg:.6f}", rs[-1].zeroes, rs[-1].ones])
    return baseline


def write_mpi_raw(path: Path, rows: list[MpiRun]) -> None:
    with path.open("w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["study", "n", "processes", "run", "wall_s", "work_s", "zeroes", "ones"])
        for row in rows:
            writer.writerow([
                row.study,
                row.n,
                row.processes,
                row.run,
                f"{row.wall_s:.6f}",
                f"{row.work_s:.6f}",
                row.zeroes,
                row.ones,
            ])


def write_mpi_summary(path: Path, rows: list[MpiRun], seq_baseline: dict[int, float]) -> None:
    grouped: dict[tuple[str, int, int], list[MpiRun]] = {}
    for row in rows:
        grouped.setdefault((row.study, row.n, row.processes), []).append(row)

    with path.open("w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow([
            "study",
            "n",
            "processes",
            "wall_avg_s",
            "work_avg_s",
            "seq_baseline_s",
            "speedup",
            "efficiency",
            "zeroes",
            "ones",
        ])
        for study, n, p in sorted(grouped):
            rs = grouped[(study, n, p)]
            wall_avg = statistics.mean(r.wall_s for r in rs)
            work_avg = statistics.mean(r.work_s for r in rs)
            base = seq_baseline.get(n, 0.0)
            speedup = base / wall_avg if wall_avg > 0 and base > 0 else 0.0
            efficiency = speedup / p if p > 0 else 0.0
            writer.writerow([
                study,
                n,
                p,
                f"{wall_avg:.6f}",
                f"{work_avg:.6f}",
                f"{base:.6f}",
                f"{speedup:.6f}",
                f"{efficiency:.6f}",
                rs[-1].zeroes,
                rs[-1].ones,
            ])


def read_seq_summary(path: Path) -> dict[int, float]:
    if not path.exists():
        return {}
    with path.open(newline="") as f:
        reader = csv.DictReader(f)
        baseline: dict[int, float] = {}
        for row in reader:
            value = row.get("total_avg_s") or row["conversion_avg_s"]
            baseline[int(row["n"])] = float(value)
        return baseline


def _require_matplotlib():
    try:
        import matplotlib

        matplotlib.use("Agg")
        import matplotlib.pyplot as plt

        return plt
    except Exception as e:
        raise RuntimeError(f"matplotlib is required to generate figures: {e}")


def plot_seq(fig_dir: Path, rows: list[SeqRun]) -> None:
    plt = _require_matplotlib()
    fig_dir.mkdir(parents=True, exist_ok=True)
    grouped: dict[int, list[SeqRun]] = {}
    for row in rows:
        grouped.setdefault(row.n, []).append(row)
    ns = sorted(grouped)
    times = [statistics.mean(r.total_s for r in grouped[n]) for n in ns]

    plt.figure(figsize=(7.5, 4.5), dpi=160)
    plt.plot(ns, times, marker="o", linewidth=2, label="Sequential total time")
    plt.xlabel("n (elements)")
    plt.ylabel("Average execution time (seconds)")
    plt.title("Q1: Sequential Execution Time vs n")
    plt.grid(True, alpha=0.3)
    plt.legend()
    plt.tight_layout()
    plt.savefig(fig_dir / "q1_sequential_time_vs_n.png")
    plt.close()


def load_summary_rows(path: Path) -> list[dict[str, str]]:
    with path.open(newline="") as f:
        return list(csv.DictReader(f))


def plot_scaling(summary_path: Path, fig_dir: Path, study: str, prefix: str) -> None:
    plt = _require_matplotlib()
    fig_dir.mkdir(parents=True, exist_ok=True)
    rows = [r for r in load_summary_rows(summary_path) if r["study"] == study]
    if not rows:
        return

    rows.sort(key=lambda r: int(r["processes"]))
    processes = [int(r["processes"]) for r in rows]
    wall = [float(r["wall_avg_s"]) for r in rows]
    speedup = [float(r["speedup"]) for r in rows]
    efficiency = [float(r["efficiency"]) for r in rows]

    labels = [str(p) for p in processes]
    x = list(range(len(processes)))

    for name, values, ylabel, filename in [
        ("Execution Time", wall, "Average wall time (seconds)", f"{prefix}_time_vs_processes.png"),
        ("Speedup", speedup, "Speedup", f"{prefix}_speedup_vs_processes.png"),
        ("Efficiency", efficiency, "Efficiency", f"{prefix}_efficiency_vs_processes.png"),
    ]:
        plt.figure(figsize=(7.5, 4.5), dpi=160)
        plt.plot(x, values, marker="o", linewidth=2, label=study.title())
        plt.xticks(x, labels)
        plt.xlabel("MPI processes")
        plt.ylabel(ylabel)
        plt.title(f"{study.title()} Scaling: {name} vs Processes")
        plt.grid(True, alpha=0.3)
        plt.legend()
        plt.tight_layout()
        plt.savefig(fig_dir / filename)
        plt.close()


def run_q1(args: argparse.Namespace, here: Path) -> dict[int, float]:
    seq_exe = here / args.build_dir / "q2sequential"
    compile_seq(args.cxx, args.opt, here / args.seq_src, seq_exe)
    ns = parse_int_list(args.ns)

    rows: list[SeqRun] = []
    for n in ns:
        for run in range(1, args.runs + 1):
            rows.append(run_seq(seq_exe, n, run))

    write_seq_raw(here / args.q1_raw, rows)
    baseline = write_seq_summary(here / args.q1_summary, rows)
    if not args.no_plots:
        plot_seq(here / args.figures_dir, rows)
    return baseline


def ensure_seq_baseline(args: argparse.Namespace, here: Path, needed_ns: list[int]) -> dict[int, float]:
    existing = read_seq_summary(here / args.q1_summary)
    missing = [n for n in needed_ns if n not in existing]
    if not missing:
        return existing

    seq_exe = here / args.build_dir / "q2sequential"
    compile_seq(args.cxx, args.opt, here / args.seq_src, seq_exe)
    rows: list[SeqRun] = read_seq_raw(here / args.q1_raw)
    for n in sorted(set(needed_ns)):
        if n in existing:
            continue
        for run in range(1, args.runs + 1):
            rows.append(run_seq(seq_exe, n, run))
    write_seq_raw(here / args.q1_raw, rows)
    return write_seq_summary(here / args.q1_summary, rows)


def run_mpi_study(args: argparse.Namespace, here: Path, study: str, configs: list[tuple[int, int]], raw_name: str, summary_name: str) -> None:
    mpi_exe = here / args.build_dir / "q2parallel"
    compile_mpi(args.mpicc, args.opt, here / args.mpi_src, mpi_exe)
    needed_ns = sorted({n for n, _p in configs})
    baseline = ensure_seq_baseline(args, here, needed_ns)
    mpi_extra = [x for x in args.mpi_extra.split() if x]

    rows: list[MpiRun] = []
    for n, p in configs:
        for run in range(1, args.runs + 1):
            rows.append(run_mpi(args.mpi_runner, mpi_extra, mpi_exe, n, p, run, study))

    write_mpi_raw(here / raw_name, rows)
    write_mpi_summary(here / summary_name, rows, baseline)
    if not args.no_plots:
        prefix = "q2" if study == "q2" else f"q3_{study}"
        plot_scaling(here / summary_name, here / args.figures_dir, study, prefix)


def run_q2(args: argparse.Namespace, here: Path) -> None:
    n = args.fixed_n
    processes = [p for p in parse_int_list(args.processes) if p != 1]
    configs = [(n, p) for p in processes]
    run_mpi_study(args, here, "q2", configs, args.q2_raw, args.q2_summary)


def run_q3(args: argparse.Namespace, here: Path) -> None:
    processes = parse_int_list(args.processes)
    strong_configs = [(args.fixed_n, p) for p in processes]
    weak_configs = [(args.weak_base_n * p, p) for p in processes]
    run_mpi_study(args, here, "strong", strong_configs, args.q3_strong_raw, args.q3_strong_summary)
    run_mpi_study(args, here, "weak", weak_configs, args.q3_weak_raw, args.q3_weak_summary)


def csv_rows(path: Path) -> list[dict[str, str]]:
    if not path.exists():
        return []
    with path.open(newline="") as f:
        return list(csv.DictReader(f))


def md_table(headers: list[str], rows: list[list[object]]) -> str:
    lines = ["| " + " | ".join(headers) + " |"]
    lines.append("|" + "|".join(["---:" for _ in headers]) + "|")
    for row in rows:
        lines.append("| " + " | ".join(str(x) for x in row) + " |")
    return "\n".join(lines)


def fmt_int(value: str | int) -> str:
    return f"{int(value):,}"


def fmt_float(value: str | float, digits: int = 6) -> str:
    return f"{float(value):.{digits}f}"


def best_config(rows: list[dict[str, str]]) -> dict[str, str] | None:
    if not rows:
        return None
    return min(rows, key=lambda r: float(r["wall_avg_s"]))


def degraded_cases(rows: list[dict[str, str]]) -> list[str]:
    cases: list[str] = []
    sorted_rows = sorted(rows, key=lambda r: int(r["processes"]))
    for prev, cur in zip(sorted_rows, sorted_rows[1:]):
        if float(cur["wall_avg_s"]) > float(prev["wall_avg_s"]):
            cases.append(
                f"{cur['processes']} processes was slower than {prev['processes']} processes "
                f"({fmt_float(cur['wall_avg_s'])}s vs {fmt_float(prev['wall_avg_s'])}s)."
            )
    return cases


def generate_report(args: argparse.Namespace, here: Path) -> None:
    q1_rows = csv_rows(here / args.q1_summary)
    q2_rows = csv_rows(here / args.q2_summary)
    strong_rows = csv_rows(here / args.q3_strong_summary)
    weak_rows = csv_rows(here / args.q3_weak_summary)

    q1_table = md_table(
        ["n", "alloc avg (s)", "conversion avg (s)", "total avg (s)", "zeros", "ones"],
        [
            [fmt_int(r["n"]), fmt_float(r["alloc_avg_s"]), fmt_float(r["conversion_avg_s"]), fmt_float(r.get("total_avg_s") or r["conversion_avg_s"]), fmt_int(r["zeroes"]), fmt_int(r["ones"])]
            for r in q1_rows
        ],
    )
    q2_table = md_table(
        ["n", "processes", "wall avg (s)", "seq baseline (s)", "speedup", "efficiency"],
        [
            [fmt_int(r["n"]), r["processes"], fmt_float(r["wall_avg_s"]), fmt_float(r["seq_baseline_s"]), fmt_float(r["speedup"], 4), fmt_float(r["efficiency"], 4)]
            for r in q2_rows
        ],
    )
    strong_table = md_table(
        ["n", "processes", "wall avg (s)", "speedup", "efficiency"],
        [
            [fmt_int(r["n"]), r["processes"], fmt_float(r["wall_avg_s"]), fmt_float(r["speedup"], 4), fmt_float(r["efficiency"], 4)]
            for r in strong_rows
        ],
    )
    weak_table = md_table(
        ["n", "processes", "wall avg (s)", "speedup", "efficiency"],
        [
            [fmt_int(r["n"]), r["processes"], fmt_float(r["wall_avg_s"]), fmt_float(r["speedup"], 4), fmt_float(r["efficiency"], 4)]
            for r in weak_rows
        ],
    )

    q2_best = best_config(q2_rows)
    strong_best = best_config(strong_rows)
    weak_best = best_config(weak_rows)
    q2_degraded = degraded_cases(q2_rows)
    strong_degraded = degraded_cases(strong_rows)
    weak_degraded = degraded_cases(weak_rows)

    q2_best_text = "No Q2 data available."
    if q2_best:
        q2_best_text = f"The lowest Q2 wall time was at {q2_best['processes']} processes: {fmt_float(q2_best['wall_avg_s'])} seconds."
    strong_best_text = "No strong-scaling data available."
    if strong_best:
        strong_best_text = f"The lowest strong-scaling wall time was at {strong_best['processes']} processes: {fmt_float(strong_best['wall_avg_s'])} seconds."
    weak_best_text = "No weak-scaling data available."
    if weak_best:
        weak_best_text = f"The lowest weak-scaling wall time was at {weak_best['processes']} processes: {fmt_float(weak_best['wall_avg_s'])} seconds."

    def bullet_lines(items: list[str]) -> str:
        if not items:
            return "- No degradation was observed between adjacent tested process counts."
        return "\n".join(f"- {item}" for item in items)

    report = f"""# Lab Activity 2 Report

This report satisfies the Lab 2 requirements for:

- Section 1: Question 1 (Sequential Baseline and Execution Profiling)
- Section 2: Question 2 (MPI Parallel Implementation)
- Section 3: Question 3 (Scalability and Performance Analysis)

## Environment

Hardware:

- CPU: Apple M1
- Cores/Threads: 8/8
- RAM: 8 GB
- OS: macOS 26.3

Software / methodology:

- Sequential compiler: `clang++`
- MPI compiler: `mpicc`
- MPI runner: `mpirun`
- Sequential timing: `std::chrono::steady_clock`
- MPI timing: `MPI_Wtime()`
- Runs per configuration: 3, average reported

Note: this machine has 8 CPU cores. Runs with 16 and 32 MPI processes oversubscribe the CPU, so those configurations are useful for observing overhead but are not expected to scale ideally.

---

## Section 1: Question 1 (Sequential Baseline)

### Goal

The sequential program provides the baseline used to evaluate MPI speedup and efficiency.

### Build And Run

```bash
clang++ -O2 -std=c++17 q2sequential.cpp -o build/q2sequential
./build/q2sequential 10000000
```

Automated run:

```bash
python3 script.py q1
```

### Algorithm

For each input value `x`, the program computes:

$$
y = \\frac{{\\sin(x)^{{\\cos(x)}} + \\cos(x)^{{\\sin(x)}}}}{{2}}
$$

Values below `0.707` are counted as zero-class values. Remaining values are counted as one-class values.

### Results

Summary data is stored in `q1_summary.csv`. Raw measurements are stored in `q1_raw_timings.csv`.

{q1_table}

### Visualization

![](figures/q1_sequential_time_vs_n.png)

### Discussion

- The sequential version is required because speedup is measured relative to a single-process baseline.
- Runtime increases as input size increases because every element is initialized, transformed, and counted.
- The baseline also shows the limit of parallel improvement because MPI adds communication, synchronization, and process-management overhead.

---

## Section 2: Question 2 (MPI Parallel Implementation)

### Goal

The MPI version parallelizes the same discretization and counting algorithm using distributed-memory processes.

### Build And Run

```bash
mpicc -O2 q2parallel.c -lm -o build/q2parallel
mpirun -np 4 build/q2parallel 10000000
```

Automated run:

```bash
python3 script.py q2 --processes 2,4,8,16,32 --fixed-n 10000000 --mpi-extra "--oversubscribe"
```

### MPI Design

| Operation | Role |
|---|---|
| `MPI_Scatter` | Split the input array into equal chunks |
| Local computation | Each rank discretizes and counts its assigned chunk |
| `MPI_Reduce` | Sum local zero counts into a global zero count |
| `MPI_Gather` | Collect local computation times for reporting |
| `MPI_Wtime` | Measure wall-clock runtime |

### Process Responsibilities

- Rank 0 allocates and initializes the full input array.
- All ranks receive a chunk using `MPI_Scatter`.
- All ranks compute only on their local chunk.
- All ranks participate in `MPI_Reduce` to produce the final global count.
- Rank 0 prints the final result and timing information.

### Results

Summary data is stored in `q2_summary.csv`. Raw measurements are stored in `q2_raw_timings.csv`.

{q2_table}

### Visualizations

![](figures/q2_time_vs_processes.png)

![](figures/q2_speedup_vs_processes.png)

![](figures/q2_efficiency_vs_processes.png)

### Performance Observation

- {q2_best_text}
- More processes reduce local computation size, but communication overhead prevents perfect scaling.
- `MPI_Scatter` adds distribution cost before computation.
- `MPI_Reduce` adds synchronization cost after computation.
- Oversubscribed configurations may slow down because multiple MPI ranks compete for the same CPU cores.

Observed degradation cases:

{bullet_lines(q2_degraded)}

---

## Section 3: Question 3 (Scalability and Performance Analysis)

### Metrics

$$
Speedup(p) = \\frac{{T_s}}{{T_p}}
$$

$$
Efficiency(p) = \\frac{{Speedup(p)}}{{p}}
$$

Variables:

- `T_s`: sequential baseline time for the same problem size
- `T_p`: MPI wall-clock time with `p` processes
- `p`: number of MPI processes

### Strong Scaling

Strong scaling keeps total problem size fixed while increasing process count.

Summary data is stored in `q3_strong_summary.csv`. Raw measurements are stored in `q3_strong_raw_timings.csv`.

{strong_table}

![](figures/q3_strong_time_vs_processes.png)

![](figures/q3_strong_speedup_vs_processes.png)

![](figures/q3_strong_efficiency_vs_processes.png)

Strong-scaling observations:

- {strong_best_text}
- Increasing process count reduces per-rank work, but scatter/reduce costs and oversubscription eventually dominate.
- Efficiency tends to decrease as process count increases because overhead grows relative to local computation.

Observed strong-scaling degradation cases:

{bullet_lines(strong_degraded)}

### Weak Scaling

Weak scaling increases total problem size proportionally with process count.

Summary data is stored in `q3_weak_summary.csv`. Raw measurements are stored in `q3_weak_raw_timings.csv`.

{weak_table}

![](figures/q3_weak_time_vs_processes.png)

![](figures/q3_weak_speedup_vs_processes.png)

![](figures/q3_weak_efficiency_vs_processes.png)

Weak-scaling observations:

- {weak_best_text}
- The per-process workload is approximately constant, so ideal weak scaling would keep wall time nearly flat.
- Growth in wall time indicates communication, synchronization, memory pressure, or oversubscription overhead.

Observed weak-scaling degradation cases:

{bullet_lines(weak_degraded)}

### Communication Behavior Analysis

- Increasing process count does not always reduce execution time because communication and synchronization overhead grow.
- `MPI_Scatter` introduces overhead by distributing the input from rank 0 to all ranks.
- `MPI_Reduce` introduces synchronization because all local counts must be combined.
- Performance eventually saturates when communication overhead, memory bandwidth, and CPU oversubscription dominate.

### Optimal Configuration

- Q2 fixed-size run: {q2_best_text}
- Strong scaling: {strong_best_text}
- Weak scaling: {weak_best_text}

The balance point is the process count where adding more processes no longer provides meaningful wall-time improvement. On this machine, that point is strongly affected by the 8-core hardware limit.

## Files Submitted

- `q2sequential.cpp`
- `q2parallel.c`
- `script.py`
- `q1_raw_timings.csv`
- `q1_summary.csv`
- `q2_raw_timings.csv`
- `q2_summary.csv`
- `q3_strong_raw_timings.csv`
- `q3_strong_summary.csv`
- `q3_weak_raw_timings.csv`
- `q3_weak_summary.csv`
- `figures/`
- `REPORT.md`
- `REPORT.pdf`
"""

    (here / "REPORT.md").write_text(report, encoding="utf-8")


def build_pdf(here: Path) -> None:
    build_dir = here / "build"
    build_dir.mkdir(exist_ok=True)
    subprocess.check_call(["pandoc", "REPORT.md", "--template=report-template.tex", "-s", "-o", str(build_dir / "report.tex")], cwd=here)
    subprocess.check_call(
        ["xelatex", "-interaction=nonstopmode", "-halt-on-error", "-output-directory", str(build_dir), str(build_dir / "report.tex")],
        cwd=here,
    )
    (here / "REPORT.pdf").write_bytes((build_dir / "report.pdf").read_bytes())


def add_common_args(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--runs", type=int, default=3, help="Runs per configuration")
    parser.add_argument("--opt", default="-O2", help="Optimization flag")
    parser.add_argument("--cxx", default="clang++", help="C++ compiler for sequential baseline")
    parser.add_argument("--mpicc", default="mpicc", help="MPI C compiler")
    parser.add_argument("--mpi-runner", default="mpirun", help="MPI runner command")
    parser.add_argument("--mpi-extra", default="", help="Extra MPI runner flags, e.g. '--oversubscribe'")
    parser.add_argument("--processes", default="1,2,4,8,16,32", help="Comma-separated MPI process counts")
    parser.add_argument("--fixed-n", type=int, default=10_000_000, help="Fixed n for Q2 and strong scaling")
    parser.add_argument("--weak-base-n", type=int, default=1_000_000, help="Weak scaling elements per process")
    parser.add_argument("--seq-src", default="q2sequential.cpp")
    parser.add_argument("--mpi-src", default="q2parallel.c")
    parser.add_argument("--build-dir", default="build")
    parser.add_argument("--figures-dir", default="figures")
    parser.add_argument("--q1-raw", default="q1_raw_timings.csv")
    parser.add_argument("--q1-summary", default="q1_summary.csv")
    parser.add_argument("--q2-raw", default="q2_raw_timings.csv")
    parser.add_argument("--q2-summary", default="q2_summary.csv")
    parser.add_argument("--q3-strong-raw", default="q3_strong_raw_timings.csv")
    parser.add_argument("--q3-strong-summary", default="q3_strong_summary.csv")
    parser.add_argument("--q3-weak-raw", default="q3_weak_raw_timings.csv")
    parser.add_argument("--q3-weak-summary", default="q3_weak_summary.csv")
    parser.add_argument("--no-plots", action="store_true", help="Skip figure generation")


def add_report_args(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--q1-summary", default="q1_summary.csv")
    parser.add_argument("--q2-summary", default="q2_summary.csv")
    parser.add_argument("--q3-strong-summary", default="q3_strong_summary.csv")
    parser.add_argument("--q3-weak-summary", default="q3_weak_summary.csv")
    parser.add_argument("--build-pdf", action="store_true", help="Build REPORT.pdf after REPORT.md")


def main() -> int:
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="cmd", required=True)

    q1 = sub.add_parser("q1", help="Run sequential baseline experiments")
    add_common_args(q1)
    q1.add_argument("--ns", default="1000000,5000000,10000000,50000000", help="Sequential n values")

    q2 = sub.add_parser("q2", help="Run MPI implementation experiments")
    add_common_args(q2)

    q3 = sub.add_parser("q3", help="Run strong and weak scaling studies")
    add_common_args(q3)

    all_cmd = sub.add_parser("all", help="Run q1, q2, and q3")
    add_common_args(all_cmd)
    all_cmd.add_argument("--ns", default="1000000,5000000,10000000,50000000", help="Sequential n values")

    report_cmd = sub.add_parser("report", help="Generate REPORT.md from CSV summaries")
    add_report_args(report_cmd)

    args = parser.parse_args()
    here = Path(__file__).resolve().parent

    if args.cmd == "q1":
        run_q1(args, here)
    elif args.cmd == "q2":
        run_q2(args, here)
    elif args.cmd == "q3":
        run_q3(args, here)
    elif args.cmd == "all":
        run_q1(args, here)
        run_q2(args, here)
        run_q3(args, here)
    elif args.cmd == "report":
        generate_report(args, here)
        if args.build_pdf:
            build_pdf(here)
    else:
        raise SystemExit(f"Unknown command: {args.cmd}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
