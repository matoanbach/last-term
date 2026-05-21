#!/usr/bin/env python3
"""Lab 1 experiment runner.

Runs Lab 1 experiments for Q1 and Q2.

Usage (from this folder):
  python3 script.py q1
  python3 script.py q2

Usage (from repo root):
  python3 DPS921/labs/lab1/lab-1-assignment-matoanbach-main/script.py q1
  python3 DPS921/labs/lab1/lab-1-assignment-matoanbach-main/script.py q2
"""

from __future__ import annotations

import argparse
import csv
import re
import statistics
import subprocess
from dataclasses import dataclass
from pathlib import Path


ALLOC_RE = re.compile(r"allocation and initialization\s+- took -\s+(\d+)\s+milliseconds")
MAG_RE = re.compile(r"magnitude calculation\s+- took -\s+(\d+)\s+milliseconds")


@dataclass(frozen=True)
class RunResult:
    config: str
    n: int
    run: int
    alloc_ms: int
    mag_ms: int


def sh(cmd: list[str], cwd: Path | None = None) -> str:
    return subprocess.check_output(cmd, cwd=str(cwd) if cwd else None, text=True)


def compile_cpp(compiler: str, opt_flag: str, src: Path, out: Path) -> None:
    out.parent.mkdir(parents=True, exist_ok=True)
    cmd = [compiler, opt_flag, "-std=c++17", str(src), "-o", str(out)]
    subprocess.check_call(cmd)


def run_and_parse(exe: Path, argv: list[str]) -> tuple[int, int]:
    out = sh([str(exe), *argv])
    m_alloc = ALLOC_RE.search(out)
    m_mag = MAG_RE.search(out)
    if not m_alloc or not m_mag:
        raise RuntimeError(
            "Failed to parse timings from output.\n"
            "Expected lines containing 'allocation and initialization' and 'magnitude calculation'.\n\n"
            f"Output was:\n{out}"
        )
    return int(m_alloc.group(1)), int(m_mag.group(1))


def parse_int_list(csv_str: str) -> list[int]:
    vals: list[int] = []
    for part in csv_str.split(","):
        part = part.strip()
        if not part:
            continue
        vals.append(int(part))
    return vals


def write_raw_csv(path: Path, rows: list[RunResult]) -> None:
    with path.open("w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["config", "n", "run", "alloc_ms", "mag_ms"])
        for r in rows:
            w.writerow([r.config, r.n, r.run, r.alloc_ms, r.mag_ms])


def write_summary_csv(path: Path, rows: list[RunResult]) -> None:
    grouped: dict[tuple[str, int], list[RunResult]] = {}
    for r in rows:
        grouped.setdefault((r.config, r.n), []).append(r)

    with path.open("w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["config", "n", "alloc_avg_ms", "mag_avg_ms"])
        for (cfg, n) in sorted(grouped.keys(), key=lambda x: (x[0], x[1])):
            rs = grouped[(cfg, n)]
            alloc_avg = statistics.mean([x.alloc_ms for x in rs])
            mag_avg = statistics.mean([x.mag_ms for x in rs])
            w.writerow([cfg, n, f"{alloc_avg:.4f}", f"{mag_avg:.4f}"])


def _require_matplotlib():
    try:
        import matplotlib
        matplotlib.use("Agg")
        import matplotlib.pyplot as plt
        return plt
    except Exception as e:
        raise RuntimeError(
            "matplotlib is required to generate figures.\n"
            "Install it (e.g., pip3 install matplotlib) and rerun.\n"
            f"Original error: {e}"
        )


def plot_q1_figures(fig_dir: Path, ns: list[int], rows: list[RunResult], configs: list[str]) -> None:
    plt = _require_matplotlib()

    grouped: dict[tuple[str, int], list[RunResult]] = {}
    for r in rows:
        grouped.setdefault((r.config, r.n), []).append(r)

    alloc_avg: dict[str, list[float]] = {c: [] for c in configs}
    mag_avg: dict[str, list[float]] = {c: [] for c in configs}

    for c in configs:
        for n in ns:
            rs = grouped[(c, n)]
            alloc_avg[c].append(statistics.mean([x.alloc_ms for x in rs]))
            mag_avg[c].append(statistics.mean([x.mag_ms for x in rs]))

    fig_dir.mkdir(parents=True, exist_ok=True)
    x = list(range(len(ns)))
    xlabels = [f"{n:g}" for n in ns]

    # Magnitude plot
    plt.figure(figsize=(7.5, 4.5), dpi=160)
    for c in configs:
        plt.plot(x, mag_avg[c], marker="o", linewidth=2, label=c)
    plt.xticks(x, xlabels)
    plt.xlabel("n (elements)")
    plt.ylabel("Average time (ms)")
    plt.title("Q1: Magnitude Calculation Time vs n")
    plt.grid(True, alpha=0.3)
    plt.legend(title="Optimization")
    plt.tight_layout()
    plt.savefig(fig_dir / "q1_magnitude_vs_n.png")
    plt.close()

    # Allocation+init plot
    plt.figure(figsize=(7.5, 4.5), dpi=160)
    for c in configs:
        plt.plot(x, alloc_avg[c], marker="o", linewidth=2, label=c)
    plt.xticks(x, xlabels)
    plt.xlabel("n (elements)")
    plt.ylabel("Average time (ms)")
    plt.title("Q1: Allocation + Initialization Time vs n")
    plt.grid(True, alpha=0.3)
    plt.legend(title="Optimization")
    plt.tight_layout()
    plt.savefig(fig_dir / "q1_alloc_init_vs_n.png")
    plt.close()


def plot_q2_figures(fig_dir: Path, n: int, threads: list[int], mag_avgs: list[float]) -> None:
    plt = _require_matplotlib()

    fig_dir.mkdir(parents=True, exist_ok=True)

    # Time vs threads
    plt.figure(figsize=(7.5, 4.5), dpi=160)
    plt.plot(threads, mag_avgs, marker="o", linewidth=2)
    plt.xlabel("Threads")
    plt.ylabel("Average time (ms)")
    plt.title(f"Q2: Magnitude Time vs Threads (n={n})")
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(fig_dir / f"q2_time_vs_threads_n{n}.png")
    plt.close()

    # Speedup vs threads
    t1 = mag_avgs[threads.index(1)]
    speedup = [t1 / t for t in mag_avgs]
    plt.figure(figsize=(7.5, 4.5), dpi=160)
    plt.plot(threads, speedup, marker="o", linewidth=2)
    plt.xlabel("Threads")
    plt.ylabel("Speedup")
    plt.title(f"Q2: Speedup vs Threads (n={n})")
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(fig_dir / f"q2_speedup_vs_threads_n{n}.png")
    plt.close()


def run_q1(args: argparse.Namespace, here: Path) -> int:
    src = (here / args.src).resolve()
    build_dir = (here / args.build_dir).resolve()
    out_raw = (here / args.out_raw).resolve()
    out_summary = (here / args.out_summary).resolve()
    figures_dir = (here / args.figures_dir).resolve()

    ns = parse_int_list(args.ns)
    if not ns:
        raise SystemExit("No n values provided.")

    configs = [("O0", "-O0"), ("O2", "-O2"), ("O3", "-O3")]
    exes: dict[str, Path] = {}
    for name, opt in configs:
        exe = build_dir / f"q1_{name}"
        compile_cpp(args.compiler, opt, src, exe)
        exes[name] = exe

    rows: list[RunResult] = []
    for cfg_name, _opt in configs:
        exe = exes[cfg_name]
        for n in ns:
            for r in range(1, args.runs + 1):
                alloc_ms, mag_ms = run_and_parse(exe, [str(n)])
                rows.append(RunResult(cfg_name, n, r, alloc_ms, mag_ms))

    write_raw_csv(out_raw, rows)
    write_summary_csv(out_summary, rows)
    if not args.no_plots:
        plot_q1_figures(figures_dir, ns, rows, [c[0] for c in configs])

    print(f"Wrote: {out_raw}")
    print(f"Wrote: {out_summary}")
    if not args.no_plots:
        print(f"Wrote: {figures_dir / 'q1_magnitude_vs_n.png'}")
        print(f"Wrote: {figures_dir / 'q1_alloc_init_vs_n.png'}")
    return 0


def run_q2(args: argparse.Namespace, here: Path) -> int:
    src = (here / args.src).resolve()
    build_dir = (here / args.build_dir).resolve()
    out_raw = (here / args.out_raw).resolve()
    out_summary = (here / args.out_summary).resolve()
    figures_dir = (here / args.figures_dir).resolve()

    ns = parse_int_list(args.ns)
    if not ns:
        raise SystemExit("No n values provided.")
    threads = parse_int_list(args.threads)
    if not threads:
        raise SystemExit("No thread counts provided.")
    if 1 not in threads:
        raise SystemExit("Q2 requires threads list to include 1 (baseline).")
    if any(t <= 0 for t in threads):
        raise SystemExit("Thread counts must all be positive.")

    exe = build_dir / f"q2_{args.opt.replace('-', '')}"
    compile_cpp(args.compiler, args.opt, src, exe)

    # Raw rows: n,threads,run,alloc_ms,mag_ms
    raw_rows: list[dict[str, object]] = []
    for n in ns:
        for p in threads:
            for r in range(1, args.runs + 1):
                alloc_ms, mag_ms = run_and_parse(exe, [str(n), str(p)])
                raw_rows.append(
                    {
                        "n": n,
                        "threads": p,
                        "run": r,
                        "alloc_ms": alloc_ms,
                        "mag_ms": mag_ms,
                    }
                )

    # Write raw
    with out_raw.open("w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["n", "threads", "run", "alloc_ms", "mag_ms"])
        for row in raw_rows:
            w.writerow([row["n"], row["threads"], row["run"], row["alloc_ms"], row["mag_ms"]])

    # Summarize per (n,threads)
    grouped: dict[tuple[int, int], list[dict[str, object]]] = {}
    for row in raw_rows:
        grouped.setdefault((int(row["n"]), int(row["threads"])), []).append(row)

    # Compute per-n baselines for speedup/efficiency
    mag_avg: dict[tuple[int, int], float] = {}
    alloc_avg: dict[tuple[int, int], float] = {}
    for key, rows in grouped.items():
        alloc_avg[key] = statistics.mean([int(r["alloc_ms"]) for r in rows])
        mag_avg[key] = statistics.mean([int(r["mag_ms"]) for r in rows])

    with out_summary.open("w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["n", "threads", "alloc_avg_ms", "mag_avg_ms", "speedup", "efficiency"])
        for n in sorted(set(ns)):
            t1 = mag_avg[(n, 1)]
            for p in sorted(threads):
                tp = mag_avg[(n, p)]
                s = (t1 / tp) if tp > 0 else float("inf")
                e = s / p
                w.writerow([n, p, f"{alloc_avg[(n, p)]:.4f}", f"{tp:.4f}", f"{s:.4f}", f"{e:.4f}"])

    if not args.no_plots:
        # Plot for the largest n by default
        n_plot = max(ns)
        mag_avgs_plot = [mag_avg[(n_plot, p)] for p in sorted(threads)]
        plot_q2_figures(figures_dir, n_plot, sorted(threads), mag_avgs_plot)

    print(f"Wrote: {out_raw}")
    print(f"Wrote: {out_summary}")
    if not args.no_plots:
        n_plot = max(ns)
        print(f"Wrote: {figures_dir / f'q2_time_vs_threads_n{n_plot}.png'}")
        print(f"Wrote: {figures_dir / f'q2_speedup_vs_threads_n{n_plot}.png'}")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)

    # q1
    ap_q1 = sub.add_parser("q1", help="Run Q1 optimization experiments")
    ap_q1.add_argument("--compiler", default="clang++", help="C++ compiler command (default: clang++)")
    ap_q1.add_argument("--runs", type=int, default=3, help="Runs per (config,n) (default: 3)")
    ap_q1.add_argument(
        "--ns",
        default="1000000,3000000,10000000,30000000",
        help="Comma-separated n values (default: 1e6,3e6,1e7,3e7)",
    )
    ap_q1.add_argument("--src", default="q1.cpp", help="Path to q1.cpp (default: q1.cpp)")
    ap_q1.add_argument("--build-dir", default="build", help="Directory for built binaries (default: build)")
    ap_q1.add_argument("--out-raw", default="q1_raw_timings.csv", help="Raw CSV output")
    ap_q1.add_argument("--out-summary", default="q1_summary.csv", help="Summary CSV output")
    ap_q1.add_argument("--figures-dir", default="figures", help="Figures output dir")
    ap_q1.add_argument("--no-plots", action="store_true", help="Skip generating figures")

    # q2
    ap_q2 = sub.add_parser("q2", help="Run Q2 threading experiments")
    ap_q2.add_argument("--compiler", default="clang++", help="C++ compiler command (default: clang++)")
    ap_q2.add_argument("--opt", default="-O2", help="Optimization flag to use for q2 build (default: -O2)")
    ap_q2.add_argument("--runs", type=int, default=3, help="Runs per (n,threads) (default: 3)")
    ap_q2.add_argument(
        "--ns",
        default="1000000,3000000,10000000,30000000",
        help="Comma-separated n values",
    )
    ap_q2.add_argument(
        "--threads",
        default="1,2,4,8",
        help="Comma-separated thread counts to test (must include 1)",
    )
    ap_q2.add_argument("--src", default="q2.cpp", help="Path to q2.cpp (default: q2.cpp)")
    ap_q2.add_argument("--build-dir", default="build", help="Directory for built binaries (default: build)")
    ap_q2.add_argument("--out-raw", default="q2_raw_timings.csv", help="Raw CSV output")
    ap_q2.add_argument("--out-summary", default="q2_summary.csv", help="Summary CSV output")
    ap_q2.add_argument("--figures-dir", default="figures", help="Figures output dir")
    ap_q2.add_argument("--no-plots", action="store_true", help="Skip generating figures")

    args = ap.parse_args()
    here = Path(__file__).resolve().parent

    if args.cmd == "q1":
        return run_q1(args, here)
    if args.cmd == "q2":
        return run_q2(args, here)

    raise SystemExit(f"Unknown command: {args.cmd}")


if __name__ == "__main__":
    raise SystemExit(main())
