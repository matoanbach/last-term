import csv
from pathlib import Path

import matplotlib.pyplot as plt


ROOT = Path(__file__).resolve().parent
CSV_PATH = ROOT / "timing_data.csv"
FIGURE_DIR = ROOT / "figures"


def load_rows():
    rows = []
    with CSV_PATH.open(newline="", encoding="utf-8") as csv_file:
        reader = csv.DictReader(csv_file)
        for row in reader:
            row["threads"] = int(row["threads"])
            row["time_ms"] = float(row["time_ms"])
            rows.append(row)
    return rows


def rows_for(rows, optimization, implementation):
    return sorted(
        [
            row for row in rows
            if row["optimization"] == optimization and row["implementation"] == implementation
        ],
        key=lambda row: row["threads"],
    )


def plot_time_chart(rows, optimization):
    plt.figure(figsize=(8, 5))

    serial = rows_for(rows, optimization, "serial")[0]
    thread_counts = [1, 2, 4, 8]
    plt.axhline(
        serial["time_ms"],
        color="black",
        linestyle="--",
        label=f"serial {optimization} ({serial['time_ms']:.0f} ms)",
    )

    for implementation, color in (
        ("naive", "#1f77b4"),
        ("padded", "#2ca02c"),
        ("synchronized", "#d62728"),
    ):
        data = rows_for(rows, optimization, implementation)
        plt.plot(
            [row["threads"] for row in data],
            [row["time_ms"] for row in data],
            marker="o",
            color=color,
            label=implementation,
        )

    plt.xticks(thread_counts)
    plt.xlabel("Threads")
    plt.ylabel("Execution Time (ms)")
    plt.title(f"Lab 4 Execution Time ({optimization})")
    plt.legend()
    plt.grid(True, linestyle=":", linewidth=0.5)
    plt.tight_layout()
    plt.savefig(FIGURE_DIR / f"q1_{optimization.lower()}_time_vs_threads.png", dpi=180)
    plt.close()


def plot_speedup_chart(rows, optimization):
    plt.figure(figsize=(8, 5))

    serial = rows_for(rows, optimization, "serial")[0]
    for implementation, color in (
        ("naive", "#1f77b4"),
        ("padded", "#2ca02c"),
        ("synchronized", "#d62728"),
    ):
        data = rows_for(rows, optimization, implementation)
        speedups = [serial["time_ms"] / row["time_ms"] for row in data]
        plt.plot(
            [row["threads"] for row in data],
            speedups,
            marker="o",
            color=color,
            label=implementation,
        )

    plt.xticks([1, 2, 4, 8])
    plt.xlabel("Threads")
    plt.ylabel("Speedup vs Serial")
    plt.title(f"Lab 4 Speedup ({optimization})")
    plt.legend()
    plt.grid(True, linestyle=":", linewidth=0.5)
    plt.tight_layout()
    plt.savefig(FIGURE_DIR / f"q1_{optimization.lower()}_speedup_vs_threads.png", dpi=180)
    plt.close()


def plot_efficiency_chart(rows, optimization):
    plt.figure(figsize=(8, 5))

    for implementation, color in (
        ("naive", "#1f77b4"),
        ("padded", "#2ca02c"),
        ("synchronized", "#d62728"),
    ):
        data = rows_for(rows, optimization, implementation)
        serial = rows_for(rows, optimization, "serial")[0]
        efficiency = [serial["time_ms"] / row["time_ms"] / row["threads"] for row in data]
        plt.plot(
            [row["threads"] for row in data],
            efficiency,
            marker="o",
            color=color,
            label=implementation,
        )

    plt.xticks([1, 2, 4, 8])
    plt.xlabel("Threads")
    plt.ylabel("Efficiency")
    plt.title(f"Lab 4 Efficiency ({optimization})")
    plt.legend()
    plt.grid(True, linestyle=":", linewidth=0.5)
    plt.tight_layout()
    plt.savefig(FIGURE_DIR / f"q1_{optimization.lower()}_efficiency_vs_threads.png", dpi=180)
    plt.close()


def main():
    FIGURE_DIR.mkdir(exist_ok=True)
    rows = load_rows()
    for optimization in ("O0", "O3"):
        plot_time_chart(rows, optimization)
        plot_speedup_chart(rows, optimization)
        plot_efficiency_chart(rows, optimization)


if __name__ == "__main__":
    main()
