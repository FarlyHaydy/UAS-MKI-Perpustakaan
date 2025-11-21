from flask import Flask, render_template, request, redirect, url_for, flash, session
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime
import requests
import webbrowser
from threading import Timer

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'

# === reCAPTCHA Configuration ===
RECAPTCHA_SITE_KEY = '6LcoqRMsAAAAAGGMd4ylVYsbyW4G1YGqYa0_OdS1'
RECAPTCHA_SECRET_KEY = '6LcoqRMsAAAAAO8gR_GWuSvzVMf2zhv5m5c6YmUa'

# === MongoDB Configuration ===
client = MongoClient('mongodb+srv://haydy123:perpus123@cluster0.yjmgixn.mongodb.net/?appName=Cluster0')
db = client['perpustakaan']
users_collection = db['users']

def verify_recaptcha(response):
    """Verifikasi reCAPTCHA response"""
    try:
        payload = {
            'secret': RECAPTCHA_SECRET_KEY,
            'response': response
        }
        verify_response = requests.post('https://www.google.com/recaptcha/api/siteverify', data=payload)
        result = verify_response.json()
        return result.get('success', False)
    except:
        return False

@app.route('/')
def index():
    # Cek apakah user sudah login
    if 'user' in session:
        return redirect(url_for('dashboard'))
    else:
        return redirect(url_for('login'))

@app.route('/dashboard')
def dashboard():
    # Proteksi: harus login dulu
    if 'user' not in session:
        flash('Silakan login terlebih dahulu', 'error')
        return redirect(url_for('login'))
    
    # Kirim data user ke template
    user = {
        'user_name': session.get('user', 'Pengunjung')
    }
    return render_template('user/dashboard.html', user=user)

@app.route('/register', methods=['GET', 'POST'])
def register():
    error = None
    if request.method == 'POST':
        name = request.form.get('name')
        nim = request.form.get('nim')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        
        if not name or not nim or not email or not password or not confirm_password:
            error = 'Semua field harus diisi'
        elif len(password) < 10:
            error = 'Kata sandi minimal 10 karakter'
        elif password != confirm_password:
            error = 'Kata sandi tidak cocok'
        else:
            # Cek apakah email sudah terdaftar
            existing_user = users_collection.find_one({'email': email})
            if existing_user:
                error = 'Email sudah terdaftar'
            else:
                # Cek apakah NIM sudah terdaftar
                existing_nim = users_collection.find_one({'nim': nim})
                if existing_nim:
                    error = 'NIM sudah terdaftar'
                else:
                    # Hash password
                    hashed_password = generate_password_hash(password)
                    
                    # Simpan user ke database
                    user_data = {
                        'name': name,
                        'nim': nim,
                        'email': email,
                        'password': hashed_password,
                        'created_at': datetime.now(),
                        'role': 'user'  # default role
                    }
                    
                    users_collection.insert_one(user_data)
                    
                    print(f"Registrasi berhasil - Name: {name}, NIM: {nim}, Email: {email}")
                    flash('Pendaftaran berhasil! Silakan login.', 'success')
                    return redirect(url_for('login'))
    
    return render_template('user/register.html', error=error, site_key=RECAPTCHA_SITE_KEY)

@app.route('/login', methods=['GET', 'POST'])
def login():
    # Jika sudah login, redirect ke dashboard
    if 'user' in session:
        return redirect(url_for('dashboard'))
    
    error = None
    if request.method == 'POST':
        # Verifikasi reCAPTCHA
        recaptcha_response = request.form.get('g-recaptcha-response')
        if not recaptcha_response or not verify_recaptcha(recaptcha_response):
            error = 'Verifikasi CAPTCHA gagal. Silakan coba lagi.'
            return render_template('user/login.html', error=error, site_key=RECAPTCHA_SITE_KEY)
        
        email = request.form.get('email')
        password = request.form.get('password')
        
        if email and password:
            # Cari user di database
            user = users_collection.find_one({'email': email})
            
            if user and check_password_hash(user['password'], password):
                # Simpan data user di session
                session['user'] = user['name']
                session['user_id'] = str(user['_id'])
                session['user_email'] = user['email']
                session['user_role'] = user.get('role', 'user')
                
                flash('Login berhasil!', 'success')
                
                # Redirect berdasarkan role
                if user.get('role') == 'admin': # untuk uas
                    return redirect(url_for('admin_dashboard'))
                else:
                    return redirect(url_for('dashboard'))
            else:
                error = 'Email atau password salah'
        else:
            error = 'Email dan password harus diisi'
    
    return render_template('user/login.html', error=error, site_key=RECAPTCHA_SITE_KEY)

@app.route('/logout')
def logout():
    session.clear()
    flash('Anda telah logout.', 'success')
    return redirect(url_for('login'))

# Placeholder untuk admin dashboard (untuk uas)
@app.route('/admin/dashboard')
def admin_dashboard():
    # Proteksi: harus login dan role admin
    if 'user' not in session:
        flash('Silakan login terlebih dahulu', 'error')
        return redirect(url_for('login'))
    
    if session.get('user_role') != 'admin':
        flash('Akses ditolak. Hanya admin yang dapat mengakses halaman ini.', 'error')
        return redirect(url_for('dashboard'))
    
    return render_template('admin/dashboardAdmin.html', user={'user_name': session.get('user')})

def open_browser():
    """Buka browser dengan localhost setelah Flask start"""
    webbrowser.open('http://localhost:5000/login')

if __name__ == '__main__':
    # Auto-open browser dengan localhost setelah 1 detik
    Timer(0, open_browser).start()
    
    app.run(debug=True, host='0.0.0.0', port=5000)