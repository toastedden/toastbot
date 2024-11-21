import hashlib
import secrets
import time

def benchmark_pbkdf2(iterations):
    """Benchmark PBKDF2 hashing for a given number of iterations."""
    # Generate a dummy passphrase and salt
    passphrase = "benchmark_test_password"
    salt = secrets.token_bytes(16)

    # Measure the time it takes to hash
    start_time = time.time()
    hashlib.pbkdf2_hmac('sha256', passphrase.encode(), salt, iterations)
    elapsed_time = time.time() - start_time
    return elapsed_time

def run_benchmarks():
    """Run PBKDF2 benchmarks for different iteration counts and print the results."""
    iteration_counts = [1000, 10000, 50000, 100000, 200000, 500000, 750000, 1000000, 2500000, 5000000, 10000000]
    print("Benchmarking PBKDF2 hashing with varying iteration counts...\n")
    print(f"{'Iterations':<12}{'Time (s)':<10}")
    print("-" * 22)

    for iterations in iteration_counts:
        elapsed_time = benchmark_pbkdf2(iterations)
        print(f"{iterations:<12}{elapsed_time:<10.6f}")

    print("\nBenchmark complete.")

if __name__ == "__main__":
    run_benchmarks()