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
    
    // Confirm Password Validation
    const passwordInput = document.getElementById('password');
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
                        confirmHint.textContent = '✗ Kata sandi tidak cocok';
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