import subprocess
import sys
import os
import time
from threading import Thread

def run_frontend():
    print("Starting frontend...")
    subprocess.run(["npm", "run", "dev"], shell=True)

def run_backend():
    print("Starting backend...")
    os.chdir("backend")
    if not os.path.exists("venv"):
        print("Creating virtual environment...")
        subprocess.run([sys.executable, "-m", "venv", "venv"], shell=True)
        
        if os.name == 'nt':  # Windows
            pip_path = os.path.join("venv", "Scripts", "pip")
        else:  # Unix/Linux/Mac
            pip_path = os.path.join("venv", "bin", "pip")
            
        print("Installing backend dependencies...")
        subprocess.run([pip_path, "install", "-r", "requirements.txt"], shell=True)
        
        print("Initializing database...")
        if os.name == 'nt':  # Windows
            python_path = os.path.join("venv", "Scripts", "python")
        else:  # Unix/Linux/Mac
            python_path = os.path.join("venv", "bin", "python")
            
        subprocess.run([python_path, "init_db.py"], shell=True)
    
    if os.name == 'nt':  # Windows
        python_path = os.path.join("venv", "Scripts", "python")
    else:  # Unix/Linux/Mac
        python_path = os.path.join("venv", "bin", "python")
        
    subprocess.run([python_path, "run.py"], shell=True)

if __name__ == "__main__":
    # Start backend in a separate thread
    backend_thread = Thread(target=run_backend)
    backend_thread.start()
    
    # Wait a bit for the backend to start
    time.sleep(2)
    
    # Start frontend
    run_frontend() 