import hashlib
import secrets
import os
import logging
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv(dotenv_path='../.env')

def get_passwd_iterations():
    """
    Retrieve the iteration count for PBKDF2 hashing from the .env file.

    Defaults to 100000 iterations if the value is missing or invalid.
    Returns:
        int: The number of iterations for PBKDF2.
    """
    try:
        return int(os.getenv('PASSWD_ITERATIONS', 100000))  # Default to 100000 if not set
    except ValueError:
        print("Invalid PASSWD_ITERATIONS value in .env, defaulting to 100000.")
        return 100000

def get_secure_passphrase():
    """
    Retrieve a random passphrase from a file.

    The function reads the passphrases from the file located at '../data/passphrases.txt',
    ensures that the file is not empty, and securely selects one passphrase at random.
    Returns:
        str: A randomly selected passphrase.
    Raises:
        FileNotFoundError: If the passphrase file is not found.
        ValueError: If the passphrase file is empty.
    """
    filepath = '../data/passphrases.txt'
    try:
        with open(filepath, 'r') as f:
            phrases = [line.strip() for line in f if line.strip()]
            if not phrases:
                raise ValueError("Passphrase file is empty")
            
            # Securely select a random passphrase
            chosen_phrase = secrets.choice(phrases)
            return chosen_phrase
            
    except (FileNotFoundError, ValueError) as e:
        print(f"Error reading passphrases file: {e}")
        print("Please create a passphrases.txt file with at least one passphrase")
        exit(1)

def generate_pbkdf2_hash(passphrase):
    """
    Generate a secure PBKDF2 hash for a given passphrase.

    The function uses a cryptographically secure random salt, retrieves
    the iteration count from the environment, and generates a SHA-256
    PBKDF2 hash.
    Args:
        passphrase (str): The passphrase to hash.
    Returns:
        str: A hexadecimal string combining the salt and hash.
    """
    iterations = get_passwd_iterations()

    # Generate a 16-byte random salt
    salt = secrets.token_bytes(16)
    
    # Hash the passphrase with PBKDF2
    hash_bytes = hashlib.pbkdf2_hmac(
        'sha256',                # Hash algorithm
        passphrase.encode('utf-8'), # Passphrase (converted to bytes)
        salt,                    # Cryptographically secure random salt
        iterations               # Iteration count
    )
    
    # Convert the hash and salt to hexadecimal for storage
    salt_hex = salt.hex()
    hash_hex = hash_bytes.hex()
    
    # Return a string combining the salt and hash without a separator
    return f"{salt_hex}{hash_hex}"

def update_env_file(env_path, key, value):
    """
    Update a specific key in the .env file or add it if it doesn't exist.

    Reads the .env file, updates or appends the key-value pair,
    and writes the updated content back to the file.
    Args:
        env_path (str): Path to the .env file.
        key (str): Key to update or add.
        value (str): New value for the key.
    Returns:
        bool: True if the update was successful, False otherwise.
    """
    if not os.path.exists(env_path):
        print(f"Error: {env_path} does not exist.")
        return False
    
    updated = False
    lines = []
    with open(env_path, 'r') as file:
        for line in file:
            if line.startswith(f"{key}="):
                lines.append(f"{key}={value}\n")
                updated = True
            else:
                lines.append(line)
   
    if not updated:
        # Add the key if it doesn't exist
        lines.append(f"{key}={value}\n")
   
    with open(env_path, 'w') as file:
        file.writelines(lines)
   
    return True

def main():
    """
    Main function to manage passphrase hashing and .env updates.

    This function retrieves a secure passphrase, generates a PBKDF2
    hash, and updates the HTTP_PASSWORD in the .env file.
    """
    env_path = "../.env"
    key = "HTTP_PASSWORD"
   
    passphrase = get_secure_passphrase()
    hashed_password = generate_pbkdf2_hash(passphrase)
   
    if update_env_file(env_path, key, hashed_password):
        print(f"The {key} in {env_path} has been successfully updated.")
    else:
        print(f"Failed to update the {key} in {env_path}.")

    # Clean up
    passphrase = None  # Overwrite the passphrase
    hashed_password = None  # Overwrite the hashed password

if __name__ == "__main__":
    main()