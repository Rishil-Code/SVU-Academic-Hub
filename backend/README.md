# SVU Student Hub Backend

This is the Python Flask backend for the SVU Student Hub application. It provides a RESTful API for managing student data, certificates, projects, and internships.

## Setup

1. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Initialize the database with sample data:
```bash
python init_db.py
```

## Running the Backend

Start the Flask development server:
```bash
python run.py
```

The server will start on `http://localhost:5000`.

## API Endpoints

### Authentication
- `POST /api/login` - Login with username and password

### Certificates
- `GET /api/certificates?user_id=<id>` - Get certificates for a user
- `POST /api/certificates` - Add a new certificate

### Projects
- `GET /api/projects?user_id=<id>` - Get projects for a user
- `POST /api/projects` - Add a new project

### Internships
- `GET /api/internships?user_id=<id>` - Get internships for a user
- `POST /api/internships` - Add a new internship

## Database

The application uses SQLite for data storage. The database file `svu_student_hub.db` will be created in the backend directory when you first run the application.

## Sample Users

The database is initialized with the following users:
- Student: username: `student1`, password: `password123`
- Teacher: username: `teacher1`, password: `password123`
- Admin: username: `admin`, password: `password123` 