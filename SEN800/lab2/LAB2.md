Overview



Part 1: Symmetric Encryption with Python and OpenSSL

Symmetric encryption uses a single shared key for both encryption and decryption. It is fast and efficient, making it ideal for large amounts of data. In this section, we will explore both a programming approach (Python) and a command-line approach (OpenSSL).



Exercise 1.1: Python Fernet Implementation

The cryptography library in Python provides a high-level recipe called Fernet, which guarantees that a message encrypted using it cannot be manipulated or read without the key. Fernet uses AES-128 in CBC mode with a SHA256 HMAC for authentication.

Step 1: Install the required Python library.

Bash

pip install cryptography

Step 2: Create a Python script named symmetric_fernet.py and add the following code:

Python

from cryptography.fernet import Fernet # Generate a key (In a real scenario, this must be kept safe!) key = Fernet.generate_key() print(f"Your secret key is: {key.decode()}") f = Fernet(key) # Encrypt a message original_message = b"Hello! This is my secret message for the lab." token = f.encrypt(original_message) print(f"\nEncrypted token:\n{token.decode()}") # Decrypt it back decrypted_message = f.decrypt(token) print(f"\nDecrypted message: {decrypted_message.decode()}")

Step 3: Run the script multiple times.

Scenario Question 1.1: When you run the script multiple times with the exact same original_message, does the token change? Why is this a desirable property in cryptography, and what underlying mechanism makes this happen?



Exercise 1.2: Command-Line Encryption with OpenSSL

Sometimes you need to encrypt a file quickly without writing a script. OpenSSL is perfect for this.

Step 1: Create a plain text file.

Bash

echo "This is a highly confidential document." > secret.txt

Step 2: Encrypt the file using AES-256 in CBC mode. You will be prompted to enter a password.

Bash

openssl enc -aes-256-cbc -pbkdf2 -in secret.txt -out secret.enc

Step 3: Decrypt the file to verify it works.

Bash

openssl enc -d -aes-256-cbc -pbkdf2 -in secret.enc -out recovered.txt cat recovered.txt

Step 4: Tamper with the encrypted file. Open secret.enc in a text editor, change a single random character, and save it. Now try to decrypt it again using the command from Step 3.

Scenario Question 1.2: What happened when you tried to decrypt the tampered file? The presentation mentions that GCM mode is the modern default because it "verifies the data was not tampered with." How does this experiment demonstrate the need for authenticated encryption modes like GCM?



Part 2: Asymmetric Encryption with GPG

Asymmetric encryption uses a pair of keys: a public key for encryption (which anyone can have) and a private key for decryption (which only you possess). This solves the key distribution problem inherent in symmetric encryption.

Exercise 2.1: Key Generation and File Encryption

GnuPG (GPG) is a complete and free implementation of the OpenPGP standard.

Step 1: Generate your own key pair. (Accept the default options, provide your name and email, and set a strong passphrase).

Bash

gpg --gen-key

Step 2: Export your public key to share with others.

Bash

gpg --export -a "Your Name" > my_public_key.asc

Step 3: Encrypt a message for yourself (simulating someone sending you a message using your public key).

Bash

echo "Only the holder of the private key can read this." > private_msg.txt gpg -e -r "Your Name" private_msg.txt

This creates a file named private_msg.txt.gpg.

Step 4: Decrypt the message using your private key.

Bash

gpg -d private_msg.txt.gpg



Exercise 2.2: Digital Signatures

Asymmetric cryptography can also be used in reverse: encrypting a hash of a document with your private key to prove you wrote it (a digital signature).

Step 1: Create a document and sign it.

Bash

echo "I agree to pay $100." > contract.txt gpg --sign contract.txt

This creates contract.txt.gpg.

Step 2: Verify the signature.

Bash

gpg --verify contract.txt.gpg

Step 3: Extract the original document.

Bash

gpg --decrypt contract.txt.gpg > verified_contract.txt

Scenario Question 2.1: You receive an email from a colleague containing an important document and a digital signature. You verify the signature, and GPG says it is valid. Does this prove that the document is factually true? What exactly is the digital signature proving in this context?

Scenario Question 2.2: Asymmetric encryption is significantly slower than symmetric encryption. Based on the slides, how do modern systems like HTTPS combine both types of encryption to get the best of both worlds?



Part 3: Homomorphic Encryption with TenSEAL

Homomorphic encryption allows computations to be performed on encrypted data without first decrypting it. The server performing the computation never sees the plaintext data.

Exercise 3.1: Computing on Encrypted Data

We will use TenSEAL, a library for doing homomorphic encryption operations on tensors.

Step 1: Install TenSEAL.

Bash

pip install tenseal

Step 2: Create a Python script named homomorphic_math.py and add the following code:

Python

import tenseal as ts import time # Set up the encryption context (BFV scheme) context = ts.context( ts.SCHEME_TYPE.BFV, poly_modulus_degree=4096, plain_modulus=1032193 ) context.generate_galois_keys() # The plaintext data data_a = [10, 20, 30] data_b = [1, 2, 3] # Encrypt the vectors encrypted_a = ts.bfv_vector(context, data_a) encrypted_b = ts.bfv_vector(context, data_b) print("Vectors encrypted successfully.") # Perform addition on the encrypted data start_time = time.time() encrypted_result = encrypted_a + encrypted_b fhe_time = time.time() - start_time print(f"Time taken for encrypted addition: {fhe_time:.6f} seconds") # Decrypt the result decrypted_result = encrypted_result.decrypt() print(f"Decrypted Result: {decrypted_result}") # Compare with regular addition start_time_plain = time.time() plain_result = [a + b for a, b in zip(data_a, data_b)] plain_time = time.time() - start_time_plain print(f"Time taken for plain addition: {plain_time:.6f} seconds") print(f"Performance ratio (FHE / Plain): {fhe_time / plain_time:.2f}x slower")

Step 3: Run the script. Modify the script to perform multiplication (encrypted_a * encrypted_b) instead of addition and observe the results.

Scenario Question 3.1: When you ran the script, you likely noticed a significant performance difference between plain addition and homomorphic addition. Given this performance trade-off, describe a real-world scenario (e.g., in healthcare or finance) where the privacy benefits of Fully Homomorphic Encryption (FHE) would completely justify the computational cost.

Scenario Question 3.2: The slides mention the "noise problem" in FHE, where operations add random noise that grows over time. If you were building a system that needed to perform thousands of sequential calculations on encrypted data, why would this noise be a critical limiting factor, and what might happen to your final decrypted result?

Final Review

To complete this lab, compile your answers to all five scenario questions (1.1, 1.2, 2.1, 2.2, 3.1, 3.2) into a single document and submit it to your instructor. Ensure your answers demonstrate an understanding of not just how to use the tools, but why they work the way they do and their inherent limitations.
