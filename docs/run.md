# How to run locally
Step-by-step instructions on how to run the project locally on your machine.

## Prerequisites
- Git: Install the latest official version by clicking [here](https://git-scm.com/downloads);
- Python: Install the latest official version by clicking [here](https://www.python.org/downloads/);

## Installation
First, clone the repository.
bash
git clone https://github.com/lumahloi/email-analyzer/

Navigate to the backend directory.
bash
cd backend

Create the virtual environment.
bash
python -m venv venv

Install the backend dependencies. ```bash
pip install -r requirements.txt
```

## Environment Variables
In the ```.env.example``` file, you can view the environment variables.
- Create the ```.env``` file in the ```backend``` folder and assign a value to the ```GEMINI_KEY``` variable.

## Running Locally
Open a terminal and run the ```frontend``` server in the ```frontend``` directory.
```bash
cd frontend
python -m http.server 8000
```

Open another terminal and run the ```backend``` server in the ```backend``` directory.
```bash
cd ../backend
flask --app app run
```
