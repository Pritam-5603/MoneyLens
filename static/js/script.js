// ============================================
// MONEYLENS - MAIN JAVASCRIPT
// Purpose: All interactive functionality
// Pages: Dashboard, Transactions, etc.
// ============================================

// ============================================
// MONEYLENS DASHBOARD
// SEARCH + TRANSACTIONS
// ============================================

function searchDashboardTransactions() {

    const searchInput = document.getElementById('dashboardSearchInput');
    const transactionList = document.getElementById('dashboardTransactionList');

    if (!searchInput || !transactionList) {
        return;
    }

    const search = searchInput.value.toLowerCase().trim();

    const transactions = transactionList.querySelectorAll('.recent-transaction');

    transactions.forEach(transaction => {

        const nameElement = transaction.querySelector('.recent-details strong');
        const dateElement = transaction.querySelector('.recent-details span');

        const name = nameElement
            ? nameElement.textContent.toLowerCase()
            : '';

        const date = dateElement
            ? dateElement.textContent.toLowerCase()
            : '';

        const category = transaction.dataset.category
            ? transaction.dataset.category.toLowerCase()
            : '';

        /*
         * Search through:
         * - Transaction name
         * - Date
         * - Category
         */

        const matches =
            name.includes(search) ||
            date.includes(search) ||
            category.includes(search);

        if (matches) {
            transaction.style.display = 'flex';
        } else {
            transaction.style.display = 'none';
        }

    });
}


// ============================================
// SEARCH BAR EVENT
// ============================================

document.addEventListener('DOMContentLoaded', function () {

    const searchInput = document.getElementById('dashboardSearchInput');

    if (searchInput) {

        searchInput.addEventListener('input', function () {
            searchDashboardTransactions();
        });

    }

});
// ============================================
// 1. TRANSACTIONS PAGE FUNCTIONS
// ============================================

// Filter transactions
function filterTransactions() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    // Show/hide date range
    const dateRange = document.getElementById('dateRange');
    if (dateFilter === 'custom') {
        dateRange.style.display = 'flex';
    } else {
        dateRange.style.display = 'none';
    }
    
    // Get all transaction items
    const items = document.querySelectorAll('.transaction-item');
    let visibleCount = 0;
    
    items.forEach(item => {
        let show = true;
        
        // Search filter
        if (search) {
            const name = item.querySelector('.transaction-name').textContent.toLowerCase();
            if (!name.includes(search)) show = false;
        }
        
        // Category filter
        if (category && show) {
            const itemCategory = item.dataset.category;
            if (itemCategory !== category) show = false;
        }
        
        // Date filter (simplified - just for demo)
        if (dateFilter !== 'all' && show) {
            const itemDate = new Date(item.dataset.date);
            const today = new Date();
            
            if (dateFilter === 'today') {
                if (itemDate.toDateString() !== today.toDateString()) show = false;
            } else if (dateFilter === 'week') {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                if (itemDate < weekAgo) show = false;
            } else if (dateFilter === 'month') {
                const monthAgo = new Date();
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                if (itemDate < monthAgo) show = false;
            }
        }
        
        if (show) {
            item.style.display = 'flex';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });
    
    // Show/hide empty state
    const emptyState = document.getElementById('emptyState');
    if (visibleCount === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }
    
    // Update count
    const countElement = document.querySelector('.list-count');
    if (countElement) {
        countElement.textContent = 
            `Showing ${visibleCount} of ${items.length} transactions`;
    }
}

// Apply filters
function applyFilters() {
    filterTransactions();
}

// Clear filters
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('dateFilter').value = 'all';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    document.getElementById('dateRange').style.display = 'none';
    filterTransactions();
}

// ============================================
// 2. MODAL FUNCTIONS
// ============================================

// Open modal
function openModal() {
    const modal = document.getElementById('addTransactionModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        // Reset form
        document.getElementById('addTransactionForm').reset();
        // Set default date
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
        // Reset category visibility
        updateCategories();
    }
}

// Close modal
function closeModal() {
    const modal = document.getElementById('addTransactionModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Update categories based on transaction type
function updateCategories() {
    const type = document.getElementById('transactionType').value;
    const incomeGroup = document.getElementById('incomeCategories');
    const expenseGroup = document.getElementById('expenseCategories');
    
    if (type === 'income') {
        if (incomeGroup) incomeGroup.style.display = '';
        if (expenseGroup) expenseGroup.style.display = 'none';
    } else {
        if (incomeGroup) incomeGroup.style.display = 'none';
        if (expenseGroup) expenseGroup.style.display = '';
    }
}

// ============================================
// 3. TRANSACTION ACTIONS
// ============================================

// Edit transaction
function editTransaction(id) {
    alert(`✏️ Edit transaction ${id}\n\nThis will open the edit modal with transaction data pre-filled.`);
    // TODO: In real implementation:
    // 1. Fetch transaction data from server
    // 2. Populate modal fields
    // 3. Open modal with "Edit" mode
}

// Delete transaction
function deleteTransaction(id) {
    if (confirm('⚠️ Are you sure you want to delete this transaction?\n\nThis action cannot be undone.')) {
        alert(`🗑️ Transaction ${id} deleted!\n\n(This is a demo. Real implementation will remove it from database.)`);
        // TODO: In real implementation:
        // 1. Send delete request to server
        // 2. Remove item from DOM
        // 3. Update stats and counts
    }
}

// ============================================
// 4. PAGINATION
// ============================================

// Change page
function changePage(page) {
    if (page === 'prev') {
        alert('📄 Previous page\n\n(Pagination coming soon with backend)');
    } else if (page === 'next') {
        alert('📄 Next page\n\n(Pagination coming soon with backend)');
    } else {
        alert(`📄 Page ${page}\n\n(Pagination coming soon with backend)`);
    }
    // TODO: In real implementation:
    // 1. Fetch transactions for that page from server
    // 2. Update the transaction list
    // 3. Update pagination active state
}

// ============================================
// 5. DASHBOARD FUNCTIONS
// ============================================

// Mobile sidebar toggle
function toggleSidebar() {
    const sidebar = document.querySelector('.dashboard-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (sidebar) {
        sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('active');
    }
}

// Close sidebar on overlay click
function closeSidebar() {
    const sidebar = document.querySelector('.dashboard-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (sidebar) {
        sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
    }
}

// ============================================
// 6. EVENT LISTENERS
// ============================================

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // ---- Modal Controls ----
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const modal = document.getElementById('addTransactionModal');
    
    if (openModalBtn) {
        openModalBtn.addEventListener('click', openModal);
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }
    
    // Close modal on outside click
    if (modal) {
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
    }
    
    // Close modal on ESC key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
    
    // ---- Form Submission ----
    const form = document.getElementById('addTransactionForm');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            alert('✅ Transaction saved successfully!\n\n(This is a demo. Real implementation will save to database.)');
            closeModal();
            // TODO: In real implementation:
            // 1. Send form data to server via AJAX
            // 2. Add new transaction to list
            // 3. Update stats
        });
    }
    
    // ---- Transaction Type Change ----
    const typeSelect = document.getElementById('transactionType');
    if (typeSelect) {
        typeSelect.addEventListener('change', updateCategories);
    }
    
    // ---- Mobile Sidebar Toggle ----
    const mobileToggle = document.getElementById('mobileToggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleSidebar);
    }
    
    // Close sidebar on overlay click
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }
    
    // ---- Initialize ----
    // Set default date in modal
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }
    
    // Initialize category visibility
    updateCategories();
    
    // Initialize filters
    filterTransactions();
    
    console.log('🚀 MoneyLens initialized successfully!');
});

// ============================================
// INDEX/HOMEPAGE JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // 1. MOBILE NAVIGATION TOGGLE
    // Purpose: Show/hide menu on small screens
    // ============================================
    
    function toggleMobileNav() {
        const toggleButton = document.getElementById('navToggle');
        const navMenu = document.getElementById('navbarMenu');
        
        if (toggleButton && navMenu) {
            toggleButton.addEventListener('click', function() {
                navMenu.classList.toggle('active');
                toggleButton.classList.toggle('active');
            });
        }
    }
    
    // Initialize mobile nav
    toggleMobileNav();
    
    // ============================================
    // 2. SMOOTH SCROLLING
    // Purpose: Smooth scroll to sections when clicking nav links
    // ============================================
    
    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    // Set up smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
    
    // ============================================
    // 3. NAVBAR SCROLL EFFECT
    // Purpose: Add shadow/background when scrolling down
    // ============================================
    
    function handleNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }
    
    // Add scroll listener
    window.addEventListener('scroll', handleNavbarScroll);
    
    // Set initial state on page load
    handleNavbarScroll();
    
    // ============================================
    // 4. CONSOLE FEEDBACK (Optional)
    // Purpose: Confirm script is working
    // ============================================
    
    console.log('✅ MoneyLens Index page initialized!');
});

// ============================================
// LOGIN PAGE JAVASCRIPT
// ============================================

// 1. Toggle Password Visibility

// Toggle password visibility for any password field
function togglePasswordInput(inputId, buttonId) {

    const input = document.getElementById(inputId);
    const button = document.getElementById(buttonId);

    if (!input || !button) return;

    if (input.type === "password") {

        input.type = "text";

        button.innerHTML = '<i class="fas fa-eye-slash"></i>';
        button.title = "Hide password";

    } else {

        input.type = "password";

        button.innerHTML = '<i class="fas fa-eye"></i>';
        button.title = "Show password";

    }
}

// 2. Email Validation
function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// 3. Show Error Message
function showError(inputId, message) {
    const input = document.getElementById(inputId);
    if (input) {
        input.classList.add('error');
    }
    
    const errorMessage = document.getElementById(inputId + '-error');
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
}

// 4. Clear All Errors
function clearErrors() {
    document.querySelectorAll('input').forEach(input => {
        input.classList.remove('error');
    });
    document.querySelectorAll('.error-message').forEach(message => {
        message.style.display = 'none';
    });
}

// 5. Handle Login Form Submission
function handleLogin(event) {
    event.preventDefault();
    clearErrors();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    let isValid = true;
    
    // Validate username
    if (!username || username.trim() === '') {
        showError('username', 'Please enter your username or email');
        isValid = false;
    } else if (username.includes('@') && !validateEmail(username)) {
        showError('username', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate password
    if (!password || password.trim() === '') {
        showError('password', 'Please enter your password');
        isValid = false;
    } else if (password.length < 6) {
        showError('password', 'Password must be at least 6 characters');
        isValid = false;
    }
    
    // If all valid, submit
    if (isValid) {
        const btn = document.querySelector('.auth-btn');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
        btn.disabled = true;
        
        // Simulate login (replace with actual AJAX later)
        setTimeout(() => {
            window.location.href = '/dashboard';
        }, 1500);
    }
}

// 6. DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Password toggle
    const toggleBtn = document.querySelector('.toggle-password');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', togglePassword);
    }
    
    // Also toggle password on enter key in password field
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const form = document.getElementById('loginForm');
                if (form) {
                    form.dispatchEvent(new Event('submit'));
                }
            }
        });
    }
});

function checkPasswordStrength(password) {
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (!strengthFill || !strengthText) return;
    
    let strength = 0;
    
    // Check length
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    
    // Check for lowercase
    if (password.match(/[a-z]+/)) strength++;
    
    // Check for uppercase
    if (password.match(/[A-Z]+/)) strength++;
    
    // Check for numbers
    if (password.match(/[0-9]+/)) strength++;
    
    // Check for special characters
    if (password.match(/[$@#&!]+/)) strength++;
    
    // Calculate percentage (max 7)
    const percentage = (strength / 7) * 100;
    strengthFill.style.width = percentage + '%';
    
    // Set color and text
    if (password.length === 0) {
        strengthFill.style.background = '#e2e8f0';
        strengthText.textContent = 'Enter a password';
        strengthText.style.color = '#a0aec0';
    } else if (percentage <= 20) {
        strengthFill.style.background = '#fc8181';
        strengthText.textContent = 'Weak';
        strengthText.style.color = '#fc8181';
    } else if (percentage <= 40) {
        strengthFill.style.background = '#f6ad55';
        strengthText.textContent = 'Weak';
        strengthText.style.color = '#f6ad55';
    } else if (percentage <= 60) {
        strengthFill.style.background = '#f6e05e';
        strengthText.textContent = 'Medium';
        strengthText.style.color = '#f6e05e';
    } else if (percentage <= 80) {
        strengthFill.style.background = '#68d391';
        strengthText.textContent = 'Strong';
        strengthText.style.color = '#68d391';
    } else {
        strengthFill.style.background = '#00b894';
        strengthText.textContent = 'Very Strong';
        strengthText.style.color = '#00b894';
    }
}
// ============================================
// REGISTER PAGE JAVASCRIPT - COMPLETE
// ============================================



// 5. Clear All Errors
function clearErrors() {
    document.querySelectorAll('.input-group input').forEach(input => {
        input.classList.remove('error');
    });
    document.querySelectorAll('.error-message').forEach(message => {
        message.style.display = 'none';
    });
}

// 6. Check Password Match
function checkPasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmInput = document.getElementById('confirm-password');
    const confirmPassword = confirmInput.value;
    const errorDiv = document.getElementById('confirm-password-error');
    
    if (confirmPassword.length > 0) {
        if (password !== confirmPassword) {
            confirmInput.classList.add('error');
            if (errorDiv) {
                errorDiv.textContent = 'Passwords do not match';
                errorDiv.style.display = 'block';
            }
            return false;
        } else {
            confirmInput.classList.remove('error');
            if (errorDiv) {
                errorDiv.style.display = 'none';
            }
            return true;
        }
    }
    return true;
}

// 7. Handle Register Form Submission
function handleRegister(event) {
    event.preventDefault();
    clearErrors();
    
    const fullname = document.getElementById('fullname').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const terms = document.getElementById('terms');
    let isValid = true;
    
    // Validate Full Name
    if (!fullname || fullname.trim() === '' || fullname.trim().length < 2) {
        showError('fullname', 'Please enter your full name (minimum 2 characters)');
        isValid = false;
    }
    
    // Validate Username
    if (!username || username.trim() === '' || username.trim().length < 3) {
        showError('username', 'Username must be at least 3 characters');
        isValid = false;
    }
    
    // Validate Email
    if (!email || email.trim() === '') {
        showError('email', 'Please enter your email address');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate Password
    if (!password || password.trim() === '') {
        showError('password', 'Please create a password');
        isValid = false;
    } else if (password.length < 6) {
        showError('password', 'Password must be at least 6 characters');
        isValid = false;
    }
    
    // Validate Confirm Password
    if (!confirmPassword || confirmPassword.trim() === '') {
        showError('confirm-password', 'Please confirm your password');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('confirm-password', 'Passwords do not match');
        isValid = false;
    }
    
    // Validate Terms
    if (!terms || !terms.checked) {
        alert('Please agree to the Terms of Service and Privacy Policy');
        isValid = false;
    }
    
    if (isValid) {
        const btn = document.querySelector('.auth-btn');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
        btn.disabled = true;
        
        setTimeout(() => {
            window.location.href = '/login';
        }, 1500);
    }
}

// 8. DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Register page loaded!');
    
    // Form submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
        console.log('✅ Register form initialized!');
    } else {
        console.log('❌ Register form NOT found!');
    }
    
    // Password toggle for password field
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            togglePasswordInput('password', 'togglePassword');
        });
        console.log('✅ Password toggle button found!');
    } else {
        console.log('❌ Password toggle button NOT found!');
    }
    
    // Password toggle for confirm password field
    const toggleConfirm = document.getElementById('toggleConfirmPassword');
    if (toggleConfirm) {
        toggleConfirm.addEventListener('click', function() {
            togglePasswordInput('confirm-password', 'toggleConfirmPassword');
        });
        console.log('✅ Confirm password toggle button found!');
    } else {
        console.log('❌ Confirm password toggle button NOT found!');
    }
    
    // Password strength checker
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            checkPasswordStrength(this.value);
            checkPasswordMatch();
        });
        console.log('✅ Password strength checker initialized!');
    } else {
        console.log('❌ Password input NOT found!');
    }
    
    // Confirm password match checker
    const confirmInput = document.getElementById('confirm-password');
    if (confirmInput) {
        confirmInput.addEventListener('input', checkPasswordMatch);
        console.log('✅ Password match checker initialized!');
    } else {
        console.log('❌ Confirm password input NOT found!');
    }
});
