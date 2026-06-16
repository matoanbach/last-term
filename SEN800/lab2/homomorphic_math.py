import tenseal as ts
import time

# Set up the encryption context (BFV scheme)
context = ts.context(
    ts.SCHEME_TYPE.BFV,
    poly_modulus_degree=4096,
    plain_modulus=1032193
)

context.generate_galois_keys()

# The plaintext data
data_a = [10, 20, 30]
data_b = [1, 2, 3]

# Encrypt the vectors
encrypted_a = ts.bfv_vector(context, data_a)
encrypted_b = ts.bfv_vector(context, data_b)

print("Vectors encrypted successfully.")

# Perform multiplication on the encrypted data
start_time = time.time()
encrypted_result = encrypted_a * encrypted_b
fhe_time = time.time() - start_time

print(f"Time taken for encrypted multiplication: {fhe_time:.6f} seconds")

# Decrypt the result
decrypted_result = encrypted_result.decrypt()

print(f"Decrypted Result: {decrypted_result}")

# Compare with regular multiplication
start_time_plain = time.time()
plain_result = [a * b for a, b in zip(data_a, data_b)]
plain_time = time.time() - start_time_plain

print(f"Time taken for plain multiplication: {plain_time:.6f} seconds")
print(f"Performance ratio (FHE / Plain): {fhe_time / plain_time:.2f}x slower")
