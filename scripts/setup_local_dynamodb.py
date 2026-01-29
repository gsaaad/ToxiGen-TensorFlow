"""
Setup DynamoDB Local for Development
Downloads and configures DynamoDB Local for testing without AWS credentials

Usage:
    python scripts/setup_local_dynamodb.py
"""

import os
import sys
import subprocess
import urllib.request
import zipfile
import shutil
from pathlib import Path


DYNAMODB_LOCAL_URL = "https://d1ni2b6xgvw0s0.cloudfront.net/v2.x/dynamodb_local_latest.zip"
INSTALL_DIR = Path(__file__).parent.parent / "dynamodb_local"


def download_dynamodb_local():
    """Download DynamoDB Local from AWS"""
    print("Downloading DynamoDB Local...")

    zip_path = INSTALL_DIR / "dynamodb_local.zip"
    INSTALL_DIR.mkdir(parents=True, exist_ok=True)

    try:
        urllib.request.urlretrieve(DYNAMODB_LOCAL_URL, zip_path)
        print(f"Downloaded to {zip_path}")
        return zip_path
    except Exception as e:
        print(f"Error downloading: {e}")
        sys.exit(1)


def extract_zip(zip_path):
    """Extract the downloaded zip file"""
    print("Extracting DynamoDB Local...")

    try:
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(INSTALL_DIR)
        print(f"Extracted to {INSTALL_DIR}")

        # Clean up zip file
        os.remove(zip_path)
    except Exception as e:
        print(f"Error extracting: {e}")
        sys.exit(1)


def check_java():
    """Check if Java is installed"""
    try:
        result = subprocess.run(['java', '-version'], capture_output=True, text=True)
        print("Java is installed:")
        print(result.stderr.split('\n')[0])
        return True
    except FileNotFoundError:
        print("Java is not installed!")
        print("Please install Java Runtime Environment (JRE) 8 or higher")
        print("Download from: https://www.java.com/en/download/")
        return False


def create_start_script():
    """Create scripts to start DynamoDB Local"""

    # Windows batch file
    batch_content = f'''@echo off
echo Starting DynamoDB Local...
cd /d "{INSTALL_DIR}"
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb -port 8000
'''

    batch_path = INSTALL_DIR / "start-dynamodb.bat"
    with open(batch_path, 'w') as f:
        f.write(batch_content)
    print(f"Created Windows start script: {batch_path}")

    # Unix shell script
    shell_content = f'''#!/bin/bash
echo "Starting DynamoDB Local..."
cd "{INSTALL_DIR}"
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb -port 8000
'''

    shell_path = INSTALL_DIR / "start-dynamodb.sh"
    with open(shell_path, 'w') as f:
        f.write(shell_content)

    # Make executable on Unix
    try:
        os.chmod(shell_path, 0o755)
    except:
        pass

    print(f"Created Unix start script: {shell_path}")


def main():
    print("=" * 50)
    print("DynamoDB Local Setup")
    print("=" * 50)

    # Check Java first
    if not check_java():
        sys.exit(1)

    # Check if already installed
    jar_path = INSTALL_DIR / "DynamoDBLocal.jar"
    if jar_path.exists():
        print(f"\nDynamoDB Local is already installed at {INSTALL_DIR}")
        response = input("Reinstall? (y/n): ").lower()
        if response != 'y':
            print("Skipping download.")
            create_start_script()
            print_instructions()
            return

        # Clean up old installation
        shutil.rmtree(INSTALL_DIR)

    # Download and extract
    zip_path = download_dynamodb_local()
    extract_zip(zip_path)

    # Create start scripts
    create_start_script()

    print_instructions()


def print_instructions():
    print("\n" + "=" * 50)
    print("Setup Complete!")
    print("=" * 50)
    print(f"\nDynamoDB Local installed at: {INSTALL_DIR}")
    print("\nTo start DynamoDB Local:")
    print("  Windows: Run dynamodb_local\\start-dynamodb.bat")
    print("  Unix: Run ./dynamodb_local/start-dynamodb.sh")
    print("\nOr manually:")
    print(f'  cd {INSTALL_DIR}')
    print("  java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb")
    print("\nThen load data with:")
    print("  python scripts/load_dataset.py --local --create-table")
    print("  python scripts/load_dataset.py --local --upload --sample 1000")


if __name__ == '__main__':
    main()
