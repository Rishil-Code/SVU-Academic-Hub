from app import app, db, User, Certificate, Project, Internship
from datetime import datetime, timedelta

def init_db():
    with app.app_context():
        # Drop all tables first
        db.drop_all()
        
        # Create tables
        db.create_all()

        # Create users including the one with ID 12216026
        users = [
            {'id': 12216026, 'username': 'student1', 'password': 'password123', 'role': 'student', 'name': 'Hinata Shoyo'},
            {'username': 'teacher1', 'password': 'password123', 'role': 'teacher', 'name': 'Dr. Sugawara'},
            {'username': 'admin', 'password': 'password123', 'role': 'admin', 'name': 'Administrator'}
        ]
        
        created_users = []
        for user_data in users:
            password = user_data.pop('password')
            user = User(**user_data)
            user.set_password(password)
            db.session.add(user)
            created_users.append(user)
        db.session.commit()

        # Create sample projects
        projects = [
            Project(
                title='E-commerce Website',
                description='A full-stack e-commerce website with user authentication and payment integration',
                start_date='2023-01-01',
                end_date='2023-03-31',
                user_id=12216026
            ),
            Project(
                title='Task Management App',
                description='A task management application with real-time updates and team collaboration',
                start_date='2023-04-01',
                end_date='2023-06-30',
                user_id=12216026
            )
        ]
        for project in projects:
            db.session.add(project)
        db.session.commit()
        print(f"Added {len(projects)} sample projects")

        # Create sample certificates
        certificates = [
            Certificate(
                title='Web Development Fundamentals',
                issuer='Coursera',
                date_issued='2023-01-15',
                user_id=12216026
            ),
            Certificate(
                title='Advanced Python Programming',
                issuer='Udacity',
                date_issued='2023-03-20',
                user_id=12216026
            )
        ]
        for certificate in certificates:
            db.session.add(certificate)
        db.session.commit()
        print(f"Added {len(certificates)} sample certificates")

        # Create sample internships
        internships = [
            Internship(
                company='Tech Solutions Inc.',
                position='Software Developer Intern',
                description='Worked on developing and maintaining web applications using React and Node.js',
                start_date='2023-05-01',
                end_date='2023-08-31',
                user_id=12216026
            ),
            Internship(
                company='Data Analytics Co.',
                position='Data Science Intern',
                description='Analyzed large datasets and created visualization dashboards using Python and Tableau',
                start_date='2023-09-01',
                end_date='2023-12-31',
                user_id=12216026
            )
        ]
        for internship in internships:
            db.session.add(internship)
        db.session.commit()
        print(f"Added {len(internships)} sample internships")

        print("Database initialized with sample data!")

if __name__ == '__main__':
    init_db() 