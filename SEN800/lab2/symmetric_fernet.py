from cryptography.fernet import Fernet
# Generate a key (In a real scenario, this must be kept safe!)
key = Fernet.generate_key()
print(f"Your secret key is: {key.decode()}") 
f = Fernet(key)
# Encrypt a message 
original_message = b"Hello! This is my secret message for the lab."
token = f.encrypt(original_message)
print(f"\nEncrypted token:\n{token.decode()}")
# Decrypt it back 
decrypted_message = f.decrypt(token)
print(f"\nDecrypted message: {decrypted_message.decode()}")
