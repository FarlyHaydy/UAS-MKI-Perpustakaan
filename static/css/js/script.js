// Toggle Password Visibility dengan animasi eye icon
document.addEventListener('DOMContentLoaded', function() {
    console.log('Script loaded successfully!'); // Debug
    
    const toggleButtons = document.querySelectorAll('.toggle-password');
    console.log('Found toggle buttons:', toggleButtons.length); // Debug
    
    toggleButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const eyeOpen = this.querySelector('.eye-open');
            const eyeClosed = this.querySelector('.eye-closed');
            
            if (input.type === 'password') {
                input.type = 'text';
                eyeOpen.style.display = 'none';
                eyeClosed.style.display = 'block';
            } else {
                input.type = 'password';
                eyeOpen.style.display = 'block';
                eyeClosed.style.display = 'none';
            }
        });
    });
    
    // Password Strength Checker
    const passwordInput = document.getElementById('password');
    const strengthBar = document.querySelector('.strength-bar');
    const passwordHint = document.querySelector('.password-hint');
    
    if (passwordInput && strengthBar && passwordHint) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            
            // Update strength bar
            strengthBar.style.width = strength.percentage + '%';
            strengthBar.className = 'strength-bar ' + strength.class;
            
            // Update hint text
            passwordHint.textContent = strength.message;
            passwordHint.className = 'password-hint ' + strength.class;
        });
    }
    
    // Confirm Password Validation
    const confirmPasswordInput = document.getElementById('confirm_password');
    const confirmHint = document.querySelector('.confirm-hint');
    
    if (confirmPasswordInput && confirmHint) {
        confirmPasswordInput.addEventListener('input', function() {
            const password = passwordInput.value;
            const confirmPassword = this.value;
            
            if (confirmPassword === '') {
                confirmHint.textContent = '';
                confirmHint.className = 'confirm-hint';
            } else if (password === confirmPassword) {
                confirmHint.textContent = '✓ Kata sandi cocok';
                confirmHint.className = 'confirm-hint match';
            } else {
                confirmHint.textContent = '✗ Kata sandi tidak cocok';
                confirmHint.className = 'confirm-hint no-match';
            }
        });
        
        // Real-time validation saat password berubah
        if (passwordInput) {
            passwordInput.addEventListener('input', function() {
                const confirmPassword = confirmPasswordInput.value;
                if (confirmPassword !== '') {
                    const password = this.value;
                    if (password === confirmPassword) {
                        confirmHint.textContent = '✓ Kata sandi cocok';
                        confirmHint.className = 'confirm-hint match';
                    } else {
                        confirmHint.textContent = 'X Kata sandi tidak cocok';
                        confirmHint.className = 'confirm-hint no-match';
                    }
                }
            });
        }
    }
    
    // Form Validation
    const form = document.querySelector('form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            const nameInput = document.querySelector('input[name="name"]');
            const nimInput = document.querySelector('input[name="nim"]');
            const emailInput = document.querySelector('input[name="email"]');
            const passwordInput = document.getElementById('password');
            const confirmPasswordInput = document.getElementById('confirm_password');
            
            if (!nameInput || !nimInput || !emailInput || !passwordInput) {
                return; // Form tidak lengkap, biarkan HTML5 validation handle
            }
            
            const name = nameInput.value;
            const nim = nimInput.value;
            const email = emailInput.value;
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : password;
            
            // Validasi Nama
            if (name.trim().length < 3) {
                e.preventDefault();
                showError('Nama harus minimal 3 karakter');
                return;
            }
            
            // Validasi NIM
            if (nim.trim().length < 5) {
                e.preventDefault();
                showError('NIM tidak valid');
                return;
            }
            
            // Validasi Email
            if (!isValidEmail(email)) {
                e.preventDefault();
                showError('Email tidak valid');
                return;
            }
            
            // Validasi Password
            if (password.length < 10) {
                e.preventDefault();
                showError('Kata sandi minimal 10 karakter');
                return;
            }
            
            // Validasi Confirm Password
            if (confirmPasswordInput && password !== confirmPassword) {
                e.preventDefault();
                showError('Kata sandi tidak cocok');
                return;
            }
            
            // Jika semua validasi lolos
            showSuccess('Pendaftaran berhasil!');
        });
    }
    
    // Input Animation
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
    
    inputs.forEach(function(input) {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            }
        });
    });
    
    // Page load animation
    document.body.classList.add('loaded');
});

// Function untuk menghitung kekuatan password
function calculatePasswordStrength(password) {
    let strength = 0;
    let message = '';
    let className = '';
    
    if (password.length === 0) {
        return { percentage: 0, message: '', class: '' };
    }
    
    // Cek panjang
    if (password.length >= 10) strength += 25;
    if (password.length >= 15) strength += 15;
    
    // Cek huruf besar
    if (/[A-Z]/.test(password)) strength += 20;
    
    // Cek huruf kecil
    if (/[a-z]/.test(password)) strength += 20;
    
    // Cek angka
    if (/[0-9]/.test(password)) strength += 20;
    
    // Cek karakter spesial
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    
    // Tentukan level dan message
    if (strength < 40) {
        message = 'Kata sandi lemah';
        className = 'weak';
    } else if (strength < 70) {
        message = 'Kata sandi sedang';
        className = 'medium';
    } else {
        message = 'Kata sandi kuat';
        className = 'strong';
    }
    
    return {
        percentage: strength,
        message: message,
        class: className
    };
}

// Function untuk validasi email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function untuk menampilkan error message
function showError(message) {
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alert = document.createElement('div');
    alert.className = 'alert alert-error';
    alert.textContent = message;
    
    const formContainer = document.querySelector('.form-container');
    const form = formContainer.querySelector('form');
    formContainer.insertBefore(alert, form);
    
    setTimeout(function() {
        alert.classList.add('show');
    }, 10);
    
    setTimeout(function() {
        alert.classList.remove('show');
        setTimeout(function() {
            alert.remove();
        }, 300);
    }, 3000);
}

// Function untuk menampilkan success message
function showSuccess(message) {
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alert = document.createElement('div');
    alert.className = 'alert alert-success';
    alert.textContent = message;
    
    const formContainer = document.querySelector('.form-container');
    const form = formContainer.querySelector('form');
    formContainer.insertBefore(alert, form);
    
    setTimeout(function() {
        alert.classList.add('show');
    }, 10);
}