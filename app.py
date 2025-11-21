from flask import Flask, render_template, request, redirect, url_for, flash, session

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

@app.route('/')
def index():
    return redirect(url_for('dashboard'))

@app.route('/dashboard')
def dashboard():
    # Kirim data user ke template
    user = {
        'user_name': session.get('user', 'Pengunjung')  # Ambil dari session atau default 'Pengunjung'
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
            print(f"Registrasi berhasil - Name: {name}, NIM: {nim}, Email: {email}")
            flash('Pendaftaran berhasil! Silakan login.', 'success')
            return redirect(url_for('login'))
    
    return render_template('user/register.html', error=error)

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        
        if email and password:
            # Simpan nama user di session (untuk sementara pakai email)
            session['user'] = email.split('@')[0]  # Ambil bagian sebelum @
            flash('Login berhasil!', 'success')
            return redirect(url_for('dashboard'))
        else:
            error = 'Email atau password salah'
    
    return render_template('user/login.html', error=error)

@app.route('/logout')
def logout():
    session.pop('user', None)
    flash('Anda telah logout.', 'success')
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)
