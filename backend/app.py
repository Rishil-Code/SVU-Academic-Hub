from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///svu_student_hub.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'student' or 'teacher'
    certificates = db.relationship('Certificate', backref='user', lazy=True)
    projects = db.relationship('Project', backref='user', lazy=True)
    internships = db.relationship('Internship', backref='user', lazy=True)

class Certificate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    issuer = db.Column(db.String(100), nullable=False)
    date_issued = db.Column(db.String(20), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    start_date = db.Column(db.String(20), nullable=False)
    end_date = db.Column(db.String(20), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class Internship(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company = db.Column(db.String(100), nullable=False)
    position = db.Column(db.String(100), nullable=False)
    start_date = db.Column(db.String(20), nullable=False)
    end_date = db.Column(db.String(20), nullable=False)
    description = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

# Create database tables
with app.app_context():
    db.create_all()

# Root route
@app.route('/')
def index():
    return "Flask server is running ✅"

# API Routes
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and user.password == data['password']:
        return jsonify({
            'success': True,
            'user': {
                'id': user.id,
                'username': user.username,
                'role': user.role
            }
        })
    return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

@app.route('/api/certificates', methods=['GET', 'POST'])
def handle_certificates():
    if request.method == 'GET':
        user_id = request.args.get('user_id')
        certificates = Certificate.query.filter_by(user_id=user_id).all()
        return jsonify([{
            'id': c.id,
            'title': c.title,
            'issuer': c.issuer,
            'date_issued': c.date_issued,
            'user_id': c.user_id
        } for c in certificates])
    
    elif request.method == 'POST':
        data = request.get_json()
        certificate = Certificate(
            title=data['title'],
            issuer=data['issuer'],
            date_issued=data['date_issued'],
            user_id=data['user_id']
        )
        db.session.add(certificate)
        db.session.commit()
        return jsonify({'success': True, 'id': certificate.id})

@app.route('/api/projects', methods=['GET', 'POST'])
def handle_projects():
    if request.method == 'GET':
        user_id = request.args.get('user_id')
        if user_id == 'all':
            # Return all projects for teachers
            projects = Project.query.all()
        else:
            # Return specific student's projects
            projects = Project.query.filter_by(user_id=user_id).all()
        return jsonify([{
            'id': p.id,
            'title': p.title,
            'description': p.description,
            'start_date': p.start_date,
            'end_date': p.end_date,
            'user_id': p.user_id
        } for p in projects])
    
    elif request.method == 'POST':
        data = request.get_json()
        project = Project(
            title=data['title'],
            description=data['description'],
            start_date=data['start_date'],
            end_date=data['end_date'],
            user_id=data['user_id']
        )
        db.session.add(project)
        db.session.commit()
        return jsonify({'success': True, 'id': project.id})

@app.route('/api/internships', methods=['GET', 'POST'])
def handle_internships():
    if request.method == 'GET':
        user_id = request.args.get('user_id')
        if user_id == 'all':
            # Return all internships for teachers
            internships = Internship.query.all()
        else:
            # Return specific student's internships
            internships = Internship.query.filter_by(user_id=user_id).all()
        return jsonify([{
            'id': i.id,
            'company': i.company,
            'position': i.position,
            'start_date': i.start_date,
            'end_date': i.end_date,
            'description': i.description,
            'user_id': i.user_id
        } for i in internships])
    
    elif request.method == 'POST':
        data = request.get_json()
        internship = Internship(
            company=data['company'],
            position=data['position'],
            start_date=data['start_date'],
            end_date=data['end_date'],
            description=data['description'],
            user_id=data['user_id']
        )
        db.session.add(internship)
        db.session.commit()
        return jsonify({'success': True, 'id': internship.id})

if __name__ == '__main__':
    app.run(debug=True, port=5000) 