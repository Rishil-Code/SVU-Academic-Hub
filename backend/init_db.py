from app import app, db, User, Certificate, Project, Internship
from datetime import datetime, timedelta

def init_db():
    with app.app_context():
        # Create tables
        db.create_all()

        # Create sample users
        users = [
            User(username='student1', password='password123', role='student'),
            User(username='student2', password='password123', role='student'),
            User(username='teacher1', password='password123', role='teacher'),
            User(username='admin', password='password123', role='admin'),
        ]
        for user in users:
            db.session.add(user)
        db.session.commit()

        # Create sample certificates
        certificates = [
            Certificate(
                title='Python Programming Certificate',
                issuer='Coursera',
                date_issued=(datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d'),
                user_id=1
            ),
            Certificate(
                title='Web Development Certificate',
                issuer='Udemy',
                date_issued=(datetime.now() - timedelta(days=60)).strftime('%Y-%m-%d'),
                user_id=1
            ),
        ]
        for cert in certificates:
            db.session.add(cert)
        db.session.commit()

        # Create sample projects
        projects = [
            Project(
                title='Student Management System',
                description='A web application for managing student records and academic information.',
                start_date=(datetime.now() - timedelta(days=90)).strftime('%Y-%m-%d'),
                end_date=(datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d'),
                user_id=1
            ),
            Project(
                title='E-commerce Website',
                description='An online shopping platform with user authentication and payment processing.',
                start_date=(datetime.now() - timedelta(days=120)).strftime('%Y-%m-%d'),
                end_date=(datetime.now() - timedelta(days=60)).strftime('%Y-%m-%d'),
                user_id=1
            ),
        ]
        for project in projects:
            db.session.add(project)
        db.session.commit()

        # Create sample internships
        internships = [
            Internship(
                company='Tech Solutions Inc.',
                position='Software Development Intern',
                start_date=(datetime.now() - timedelta(days=180)).strftime('%Y-%m-%d'),
                end_date=(datetime.now() - timedelta(days=90)).strftime('%Y-%m-%d'),
                description='Worked on developing and maintaining web applications using React and Python.',
                user_id=1
            ),
            Internship(
                company='Data Analytics Co.',
                position='Data Science Intern',
                start_date=(datetime.now() - timedelta(days=270)).strftime('%Y-%m-%d'),
                end_date=(datetime.now() - timedelta(days=180)).strftime('%Y-%m-%d'),
                description='Analyzed large datasets and created predictive models using Python and machine learning.',
                user_id=1
            ),
        ]
        for internship in internships:
            db.session.add(internship)
        db.session.commit()

        print("Database initialized with sample data!")

if __name__ == '__main__':
    init_db() 