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
    
    # Create default admin user if not exists
    if not User.query.filter_by(username='administrator1').first():
        admin = User(username='administrator1', password='password123', role='admin')
        db.session.add(admin)
        db.session.commit()

    # Create default teacher if not exists
    if not User.query.filter_by(username='rishil').first():
        teacher = User(username='rishil', password='password123', role='teacher')
        db.session.add(teacher)
        db.session.commit()

@app.route('/')
def index():
    return "Flask server is running ✅"

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
        if user_id == 'all':
            certificates = Certificate.query.all()
        else:
            certificates = Certificate.query.filter_by(user_id=int(user_id)).all()
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
            user_id=int(data['user_id'])
        )
        db.session.add(certificate)
        db.session.commit()
        return jsonify({'success': True, 'id': certificate.id})

@app.route('/api/certificates/<int:id>', methods=['DELETE'])
def delete_certificate(id):
    try:
        certificate = db.session.get(Certificate, id)
        if not certificate:
            return jsonify({'success': False, 'message': 'Certificate not found'}), 404
        
        db.session.delete(certificate)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Certificate deleted successfully'})
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting certificate: {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/projects', methods=['GET', 'POST'])
def handle_projects():
    if request.method == 'GET':
        user_id = request.args.get('user_id')
        if user_id == 'all':
            projects = Project.query.all()
        else:
            projects = Project.query.filter_by(user_id=int(user_id)).all()
        return jsonify([{
            'id': p.id,
            'title': p.title,
            'description': p.description,
            'start_date': p.start_date,
            'end_date': p.end_date,
            'user_id': p.user_id,
            'user': {
                'id': p.user.id if p.user else None,
                'username': p.user.username if p.user else 'Unknown',
                'role': p.user.role if p.user else 'student'
            } if p.user else None
        } for p in projects])
    elif request.method == 'POST':
        data = request.get_json()
        try:
            project = Project(
                title=data['title'],
                description=data['description'],
                start_date=data['start_date'],
                end_date=data['end_date'],
                user_id=int(data['user_id'])
            )
            db.session.add(project)
            db.session.commit()
            return jsonify({'success': True, 'id': project.id})
        except Exception as e:
            db.session.rollback()
            return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/projects/<int:id>', methods=['DELETE'])
def delete_project(id):
    try:
        project = db.session.get(Project, id)
        if not project:
            return jsonify({'success': False, 'message': 'Project not found'}), 404
        
        db.session.delete(project)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Project deleted successfully'})
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting project: {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/internships', methods=['GET', 'POST'])
def handle_internships():
    if request.method == 'GET':
        user_id = request.args.get('user_id')
        if user_id == 'all':
            internships = Internship.query.all()
        else:
            internships = Internship.query.filter_by(user_id=int(user_id)).all()
        return jsonify([{
            'id': i.id,
            'company': i.company,
            'position': i.position,
            'start_date': i.start_date,
            'end_date': i.end_date,
            'description': i.description,
            'user_id': i.user_id,
            'user': {
                'id': i.user.id if i.user else None,
                'username': i.user.username if i.user else 'Unknown',
                'role': i.user.role if i.user else 'student'
            } if i.user else None
        } for i in internships])
    elif request.method == 'POST':
        data = request.get_json()
        try:
            internship = Internship(
                company=data['company'],
                position=data['position'],
                start_date=data['start_date'],
                end_date=data['end_date'],
                description=data['description'],
                user_id=int(data['user_id'])
            )
            db.session.add(internship)
            db.session.commit()
            return jsonify({'success': True, 'id': internship.id})
        except Exception as e:
            db.session.rollback()
            return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/internships/<int:id>', methods=['DELETE'])
def delete_internship(id):
    try:
        internship = db.session.get(Internship, id)
        if not internship:
            return jsonify({'success': False, 'message': 'Internship not found'}), 404
        
        db.session.delete(internship)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Internship deleted successfully'})
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting internship: {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True) 