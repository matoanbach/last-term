import csv
from pathlib import Path

import matplotlib.pyplot as plt


ROOT = Path(__file__).resolve().parent


def read_rows(file_name):
    with (ROOT / file_name).open(newline="", encoding="utf-8") as csv_file:
        return list(csv.DictReader(csv_file))


def to_float_list(rows, key):
    return [float(row[key]) for row in rows]


def to_int_list(rows, key):
    return [int(row[key]) for row in rows]


def save_time_plot(output_path, sizes, cpu_times, basic_times, tiled_times, basic_label, tiled_label, title):
    plt.figure(figsize=(8, 5))
    plt.plot(sizes, cpu_times, marker="o", linewidth=2, label="CPU")
    plt.plot(sizes, basic_times, marker="s", linewidth=2, label=basic_label)
    plt.plot(sizes, tiled_times, marker="^", linewidth=2, label=tiled_label)
    plt.xlabel("Matrix size (N x N)")
    plt.ylabel("Total execution time (ms)")
    plt.title(title)
    plt.xscale("log", base=2)
    plt.yscale("log")
    plt.grid(True, which="both", linestyle="--", alpha=0.4)
    plt.legend()
    plt.tight_layout()
    plt.savefig(output_path, dpi=200)
    plt.close()


def save_speedup_plot(output_path, sizes, basic_speedups, tiled_speedups, basic_label, tiled_label, title):
    plt.figure(figsize=(8, 5))
    plt.plot(sizes, basic_speedups, marker="s", linewidth=2, label=basic_label)
    plt.plot(sizes, tiled_speedups, marker="^", linewidth=2, label=tiled_label)
    plt.xlabel("Matrix size (N x N)")
    plt.ylabel("Speedup over CPU")
    plt.title(title)
    plt.xscale("log", base=2)
    plt.grid(True, which="both", linestyle="--", alpha=0.4)
    plt.legend()
    plt.tight_layout()
    plt.savefig(output_path, dpi=200)
    plt.close()


def main():
    q2_rows = read_rows("q2_results.csv")
    q3_rows = read_rows("q3_results.csv")

    q2_sizes = to_int_list(q2_rows, "matrix_size")
    q2_cpu = to_float_list(q2_rows, "cpu_avg_ms")
    q2_basic_total = to_float_list(q2_rows, "basic_total_ms")
    q2_tiled_total = to_float_list(q2_rows, "tiled_total_ms")
    q2_basic_speedup = to_float_list(q2_rows, "basic_total_speedup")
    q2_tiled_speedup = to_float_list(q2_rows, "tiled_total_speedup")

    q3_sizes = to_int_list(q3_rows, "matrix_size")
    q3_cpu = to_float_list(q3_rows, "cpu_avg_ms")
    q3_basic_total = to_float_list(q3_rows, "basic_total_ms")
    q3_tiled_total = to_float_list(q3_rows, "tiled_total_ms")
    q3_basic_speedup = to_float_list(q3_rows, "basic_total_speedup")
    q3_tiled_speedup = to_float_list(q3_rows, "tiled_total_speedup")

    save_time_plot(
        ROOT / "pics" / "q2_execution_time.png",
        q2_sizes,
        q2_cpu,
        q2_basic_total,
        q2_tiled_total,
        "Basic CUDA total",
        "Tiled CUDA total",
        "Question 2: Total Execution Time vs Matrix Size",
    )
    save_speedup_plot(
        ROOT / "pics" / "q2_speedup.png",
        q2_sizes,
        q2_basic_speedup,
        q2_tiled_speedup,
        "Basic CUDA speedup",
        "Tiled CUDA speedup",
        "Question 2: Speedup over CPU",
    )

    save_time_plot(
        ROOT / "pics" / "q3_execution_time.png",
        q3_sizes,
        q3_cpu,
        q3_basic_total,
        q3_tiled_total,
        "Thrust basic total",
        "Thrust tiled total",
        "Question 3: Total Execution Time vs Matrix Size",
    )
    save_speedup_plot(
        ROOT / "pics" / "q3_speedup.png",
        q3_sizes,
        q3_basic_speedup,
        q3_tiled_speedup,
        "Thrust basic speedup",
        "Thrust tiled speedup",
        "Question 3: Speedup over CPU",
    )


if __name__ == "__main__":
    main()
