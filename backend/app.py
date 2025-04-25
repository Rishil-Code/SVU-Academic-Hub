from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import os
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///svu_student_hub.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.urandom(24)
db = SQLAlchemy(app)

# Database Models
class User(db.Model):
    __tablename__ = 'users'  # Explicitly set table name
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    certificates = db.relationship('Certificate', backref='user', lazy=True, cascade='all, delete-orphan')
    projects = db.relationship('Project', backref='user', lazy=True, cascade='all, delete-orphan')
    internships = db.relationship('Internship', backref='user', lazy=True, cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Certificate(db.Model):
    __tablename__ = 'certificates'  # Explicitly set table name
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    issuer = db.Column(db.String(100), nullable=False)
    date_issued = db.Column(db.String(20), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def validate(self):
        if not self.title or len(self.title) > 100:
            raise ValueError("Title is required and must be less than 100 characters")
        if not self.issuer or len(self.issuer) > 100:
            raise ValueError("Issuer is required and must be less than 100 characters")
        if not self.date_issued:
            raise ValueError("Date issued is required")
        if not self.user_id:
            raise ValueError("User ID is required")

class Project(db.Model):
    __tablename__ = 'projects'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    start_date = db.Column(db.String(20), nullable=False)
    end_date = db.Column(db.String(20), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def validate(self):
        if not self.title or len(self.title) > 100:
            raise ValueError("Title is required and must be less than 100 characters")
        if not self.description:
            raise ValueError("Description is required")
        if not self.start_date:
            raise ValueError("Start date is required")
        if not self.end_date:
            raise ValueError("End date is required")
        if not self.user_id:
            raise ValueError("User ID is required")

class Internship(db.Model):
    __tablename__ = 'internships'
    id = db.Column(db.Integer, primary_key=True)
    company = db.Column(db.String(100), nullable=False)
    position = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    start_date = db.Column(db.String(20), nullable=False)
    end_date = db.Column(db.String(20), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def validate(self):
        if not self.company or len(self.company) > 100:
            raise ValueError("Company is required and must be less than 100 characters")
        if not self.position or len(self.position) > 100:
            raise ValueError("Position is required and must be less than 100 characters")
        if not self.start_date:
            raise ValueError("Start date is required")
        if not self.end_date:
            raise ValueError("End date is required")
        if not self.description:
            raise ValueError("Description is required")
        if not self.user_id:
            raise ValueError("User ID is required")

# Create database tables
def init_db():
    with app.app_context():
        # Drop all tables and recreate them
        db.drop_all()
        db.create_all()
        
        logger.info("Creating default users...")
        # Create default admin user
        admin = User(username='administrator1', role='admin', name='Administrator')
        admin.set_password('password123')
        db.session.add(admin)

        # Create default teacher
        teacher = User(username='rishil', role='teacher', name='Rishil')
        teacher.set_password('password123')
        db.session.add(teacher)

        try:
            db.session.commit()
            logger.info("Default users created successfully")
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error initializing database: {str(e)}")
            raise

# Initialize the database
init_db()

@app.route('/')
def index():
    return "Flask server is running ✅"

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data or 'username' not in data or 'password' not in data:
            return jsonify({'success': False, 'message': 'Missing username or password'}), 400
            
        user = User.query.filter_by(username=data['username']).first()
        if user and user.check_password(data['password']):
            return jsonify({
                'success': True,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'role': user.role,
                    'name': user.name
                }
            })
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
    except Exception as e:
        return jsonify({'success': False, 'message': 'An error occurred during login'}), 500

@app.route('/api/certificates', methods=['GET', 'POST'])
def handle_certificates():
    try:
        if request.method == 'GET':
            user_id = request.args.get('user_id')
            logger.info(f"Fetching certificates for user_id: {user_id}")
            
            try:
                if not user_id or user_id == '0' or user_id == 'all' or user_id == 'NaN':
                    certificates = Certificate.query.all()
                else:
                    certificates = Certificate.query.filter_by(user_id=int(user_id)).all()
                
                result = [{
                    'id': c.id,
                    'title': c.title,
                    'issuer': c.issuer,
                    'date_issued': c.date_issued,
                    'user_id': c.user_id,
                    'created_at': c.created_at.isoformat() if c.created_at else None,
                    'updated_at': c.updated_at.isoformat() if c.updated_at else None,
                    'user': {
                        'id': c.user.id,
                        'username': c.user.username,
                        'role': c.user.role,
                        'name': c.user.name
                    } if c.user else None
                } for c in certificates]
                
                logger.info(f"Successfully fetched {len(result)} certificates")
                return jsonify(result)
            except Exception as e:
                logger.error(f"Error fetching certificates: {str(e)}")
                return jsonify([])
                
        elif request.method == 'POST':
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'message': 'No data provided'}), 400
                
            logger.info(f"Creating new certificate: {data}")
            certificate = Certificate(
                title=data.get('title'),
                issuer=data.get('issuer'),
                date_issued=data.get('date_issued'),
                user_id=data.get('user_id')
            )
            
            certificate.validate()
            db.session.add(certificate)
            db.session.commit()
            logger.info(f"Successfully created certificate with ID: {certificate.id}")
            
            return jsonify({
                'success': True,
                'id': certificate.id,
                'message': 'Certificate created successfully'
            })
            
    except ValueError as e:
        db.session.rollback()
        logger.error(f"Validation error in certificates: {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error in certificates: {str(e)}")
        return jsonify({'success': False, 'message': 'An error occurred'}), 500

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
        logger.error(f"Error deleting certificate: {str(e)}")
        return jsonify({'success': False, 'message': 'An error occurred'}), 500

@app.route('/api/projects', methods=['GET', 'POST'])
def handle_projects():
    try:
        if request.method == 'GET':
            user_id = request.args.get('user_id')
            logger.info(f"Fetching projects for user_id: {user_id}")
            
            try:
                if not user_id or user_id == '0' or user_id == 'all' or user_id == 'NaN':
                    if request.args.get('view') == 'all':
                        projects = Project.query.all()
                    else:
                        return jsonify([])
                else:
                    projects = Project.query.filter_by(user_id=int(user_id)).all()
                
                result = [{
                    'id': p.id,
                    'title': p.title,
                    'description': p.description,
                    'start_date': p.start_date,
                    'end_date': p.end_date,
                    'user_id': p.user_id,
                    'created_at': p.created_at.isoformat() if p.created_at else None,
                    'updated_at': p.updated_at.isoformat() if p.updated_at else None,
                    'user': {
                        'id': p.user.id,
                        'username': p.user.username,
                        'role': p.user.role,
                        'name': p.user.name
                    } if p.user else None
                } for p in projects]
                
                logger.info(f"Successfully fetched {len(result)} projects")
                return jsonify(result)
            except Exception as e:
                logger.error(f"Error fetching projects: {str(e)}")
                return jsonify([])
                
        elif request.method == 'POST':
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'message': 'No data provided'}), 400
            
            project = Project(
                title=data.get('title'),
                description=data.get('description'),
                start_date=data.get('start_date'),
                end_date=data.get('end_date'),
                user_id=data.get('user_id')
            )
            
            db.session.add(project)
            db.session.commit()
            
            return jsonify({
                'success': True,
                'id': project.id,
                'message': 'Project created successfully'
            })
            
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error in projects: {str(e)}")
        return jsonify({'success': False, 'message': 'An error occurred'}), 500

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
        logger.error(f"Error deleting project: {str(e)}")
        return jsonify({'success': False, 'message': 'An error occurred'}), 500

@app.route('/api/internships', methods=['GET', 'POST'])
def handle_internships():
    try:
        if request.method == 'GET':
            user_id = request.args.get('user_id')
            logger.info(f"Fetching internships for user_id: {user_id}")
            
            try:
                if not user_id or user_id == '0' or user_id == 'all' or user_id == 'NaN':
                    if request.args.get('view') == 'all':
                        internships = Internship.query.all()
                    else:
                        return jsonify([])
                else:
                    internships = Internship.query.filter_by(user_id=int(user_id)).all()
                
                result = [{
                    'id': i.id,
                    'company': i.company,
                    'position': i.position,
                    'description': i.description,
                    'start_date': i.start_date,
                    'end_date': i.end_date,
                    'user_id': i.user_id,
                    'created_at': i.created_at.isoformat() if i.created_at else None,
                    'updated_at': i.updated_at.isoformat() if i.updated_at else None,
                    'user': {
                        'id': i.user.id,
                        'username': i.user.username,
                        'role': i.user.role,
                        'name': i.user.name
                    } if i.user else None
                } for i in internships]
                
                logger.info(f"Successfully fetched {len(result)} internships")
                return jsonify(result)
            except Exception as e:
                logger.error(f"Error fetching internships: {str(e)}")
                return jsonify([])
                
        elif request.method == 'POST':
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'message': 'No data provided'}), 400
            
            internship = Internship(
                company=data.get('company'),
                position=data.get('position'),
                description=data.get('description'),
                start_date=data.get('start_date'),
                end_date=data.get('end_date'),
                user_id=data.get('user_id')
            )
            
            db.session.add(internship)
            db.session.commit()
            
            return jsonify({
                'success': True,
                'id': internship.id,
                'message': 'Internship created successfully'
            })
            
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error in internships: {str(e)}")
        return jsonify({'success': False, 'message': 'An error occurred'}), 500

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
        logger.error(f"Error deleting internship: {str(e)}")
        return jsonify({'success': False, 'message': 'An error occurred'}), 500

if __name__ == '__main__':
    app.run(debug=False)  # Disable debug mode in production 