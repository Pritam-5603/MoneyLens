// ============================================
// MONEYLENS - MAIN JAVASCRIPT
// Purpose: All interactive functionality
// Pages: Dashboard, Transactions, etc.
// ============================================

// ============================================
// MONEYLENS DASHBOARD
// SEARCH + TRANSACTIONS
// ============================================
// ============================================
// DASHBOARD PAGE FUNCTIONS (Update Existing)
// ============================================

// 1. Update Dashboard Stats
function updateDashboardStats() {
    const stats = {
        income: 65000,
        expenses: 16000,
        savings: 48000
    };
    
    // Update finance values
    const financeValues = document.querySelectorAll('.finance-value');
    if (financeValues.length >= 3) {
        if (financeValues[0]) financeValues[0].textContent = '₹' + stats.income.toLocaleString('en-IN');
        if (financeValues[1]) financeValues[1].textContent = '₹' + stats.expenses.toLocaleString('en-IN');
        if (financeValues[2]) financeValues[2].textContent = '₹' + stats.savings.toLocaleString('en-IN');
    }
}

// 2. Setup AI Insight Button
function setupAIInsight() {
    const aiButton = document.querySelector('.ai-action-btn');
    if (aiButton) {
        aiButton.addEventListener('click', function() {
            alert('🤖 AI Insights\n\nThis will open detailed AI-powered financial insights.');
            // In real implementation: window.location.href = '/analytics';
        });
    }
}

// 3. Setup Recent Transactions (for dashboard only)
function setupDashboardTransactions() {
    const transactions = document.querySelectorAll('.recent-transaction');
    transactions.forEach(transaction => {
        transaction.addEventListener('click', function() {
            const name = this.querySelector('.recent-details strong').textContent;
            alert(`📊 View transaction: ${name}\n\nThis will open the transaction details.`);
        });
    });
}

// 4. Initialize Dashboard (Update existing)
function initDashboard() {
    console.log('📊 Initializing dashboard...');
    
    // Update stats
    updateDashboardStats();
    
    // Setup quick actions
    setupQuickActions();
    
    // Setup AI insight
    setupAIInsight();
    
    // Setup recent transactions
    setupDashboardTransactions();
    
    // Setup mobile sidebar
    const mobileToggle = document.getElementById('mobileToggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleSidebar);
    }
    
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }
    
    console.log('✅ Dashboard initialized successfully!');
}

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
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const dateFilterElement = document.getElementById('dateFilter');

    if (!searchInput || !categoryFilter || !dateFilterElement) {
        return;
    }

    const search = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const dateFilter = dateFilterElement.value;

    const dateRange = document.getElementById('dateRange');

    if (dateFilter === 'custom') {
        if (dateRange) {
            dateRange.style.display = 'flex';
        }
    } else {
        if (dateRange) {
            dateRange.style.display = 'none';
        }
    }

    const items = document.querySelectorAll('.transaction-item');
    let visibleCount = 0;

    items.forEach(item => {
        let show = true;

        // Search filter
        if (search) {
            const nameElement = item.querySelector('.transaction-name');

            if (nameElement) {
                const name = nameElement.textContent.toLowerCase();

                if (!name.includes(search)) {
                    show = false;
                }
            }
        }

        // Category filter
        if (category && show) {
            const itemCategory = item.dataset.category;

            if (itemCategory !== category) {
                show = false;
            }
        }

        // Date filter
        if (dateFilter !== 'all' && show) {
            const itemDateValue = item.dataset.date;

            if (itemDateValue) {
                const itemDate = new Date(itemDateValue);
                const today = new Date();

                if (dateFilter === 'today') {

                    if (
                        itemDate.toDateString() !==
                        today.toDateString()
                    ) {
                        show = false;
                    }

                } else if (dateFilter === 'week') {

                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);

                    if (itemDate < weekAgo) {
                        show = false;
                    }

                } else if (dateFilter === 'month') {

                    const monthAgo = new Date();
                    monthAgo.setMonth(monthAgo.getMonth() - 1);

                    if (itemDate < monthAgo) {
                        show = false;
                    }
                }
            }
        }

        if (show) {
            item.style.display = 'flex';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });

    // Empty state
    const emptyState = document.getElementById('emptyState');

    if (emptyState) {
        if (visibleCount === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
        }
    }

    // Update transaction count
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

    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const dateFilter = document.getElementById('dateFilter');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const dateRange = document.getElementById('dateRange');

    if (searchInput) searchInput.value = '';
    if (categoryFilter) categoryFilter.value = '';
    if (dateFilter) dateFilter.value = 'all';
    if (startDate) startDate.value = '';
    if (endDate) endDate.value = '';

    if (dateRange) {
        dateRange.style.display = 'none';
    }

    filterTransactions();
}


// ============================================
// 2. MODAL FUNCTIONS
// ============================================

// Open modal
function openModal() {

    const modal =
        document.getElementById('addTransactionModal');

    const form =
        document.getElementById('addTransactionForm');

    if (modal) {

        modal.style.display = 'flex';

        document.body.style.overflow = 'hidden';

        // Reset form
        if (form) {
            form.reset();
        }

        // Set today's date
        const dateInput =
            document.getElementById('date');

        if (dateInput) {

            const today =
                new Date().toISOString().split('T')[0];

            dateInput.value = today;
        }

        // Update categories
        updateCategories();
    }
}


// Close modal
function closeModal() {

    const modal =
        document.getElementById('addTransactionModal');

    if (modal) {

        modal.style.display = 'none';

        document.body.style.overflow = 'auto';
    }
}


// ============================================
// 3. UPDATE TRANSACTION CATEGORIES
// ============================================

function updateCategories() {

    const typeSelect =
        document.getElementById('transactionType');

    const incomeGroup =
        document.getElementById('incomeCategories');

    const expenseGroup =
        document.getElementById('expenseCategories');

    if (!typeSelect) {
        return;
    }

    const type = typeSelect.value;

    if (type === 'income') {

        if (incomeGroup) {
            incomeGroup.style.display = '';
        }

        if (expenseGroup) {
            expenseGroup.style.display = 'none';
        }

    } else {

        if (incomeGroup) {
            incomeGroup.style.display = 'none';
        }

        if (expenseGroup) {
            expenseGroup.style.display = '';
        }
    }
}

// ==========================================
// TRANSACTION HISTORY MODAL
// ==========================================

const historyBtn = document.getElementById("historyBtn");
const historyModal = document.getElementById("historyModal");
const closeHistoryBtn = document.getElementById("closeHistoryBtn");

if (historyBtn && historyModal) {

    historyBtn.addEventListener("click", function () {

        historyModal.style.display = "flex";

    });

}

if (closeHistoryBtn && historyModal) {

    closeHistoryBtn.addEventListener("click", function () {

        historyModal.style.display = "none";

    });

}
// ============================================
// 4. ADD TRANSACTION
// ============================================

document.addEventListener('DOMContentLoaded', function () {

    const form =
        document.getElementById('addTransactionForm');

    if (form) {

        console.log('✅ Add Transaction form found');

        /*
         * IMPORTANT:
         *
         * We DO NOT use event.preventDefault()
         * here.
         *
         * The form must be allowed to submit
         * normally to Flask.
         */

        form.addEventListener('submit', function () {

            console.log('🔥 Sending transaction to Flask...');

        });
    } else {

        console.log('❌ Add Transaction form NOT found');

    }

    // Set initial categories
    updateCategories();
});


// ============================================
// 5. TRANSACTION ACTIONS
// ============================================
function editTransaction(id) {

    const modal = document.getElementById("editTransactionModal");
    const form = document.getElementById("editTransactionForm");

    if (!modal || !form) {
        console.error("Edit modal or form not found");
        return;
    }

    // Set the Flask UPDATE route
    form.action = `/dashboard/transactions/edit/${id}`;

    console.log("Edit transaction ID:", id);
    console.log("Edit form action:", form.action);

    // Open modal
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
}
function closeEditModal() {

    const modal = document.getElementById("editTransactionModal");

    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
}
document.addEventListener("DOMContentLoaded", function () {

    const closeEditBtn =
        document.getElementById("closeEditModalBtn");

    const cancelEditBtn =
        document.getElementById("cancelEditBtn");

    if (closeEditBtn) {
        closeEditBtn.addEventListener("click", closeEditModal);
    }

    if (cancelEditBtn) {
        cancelEditBtn.addEventListener("click", closeEditModal);
    }

});
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
        form.addEventListener('submit', function() {
        console.log('🔥 Sending transaction to Flask...');
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

// ============================================
// ANALYTICS PAGE FUNCTIONS
// ============================================

// 1. Handle Analytics Period Change
function setupAnalyticsPeriod() {
    const periodSelect = document.getElementById('analyticsPeriod');
    if (periodSelect) {
        periodSelect.addEventListener('change', function() {
            const period = this.value;
            console.log(`📊 Period changed to: ${period}`);
            
            // Show loading state on charts
            showChartsLoading(true);
            
            // Simulate data fetch (replace with actual API call)
            setTimeout(() => {
                // Update charts with new data based on period
                updateChartsForPeriod(period);
                showChartsLoading(false);
            }, 800);
        });
    }
}

// 2. Show/Hide Charts Loading State
function showChartsLoading(show) {
    const containers = document.querySelectorAll('.analytics-chart-container, .analytics-donut-container');
    containers.forEach(container => {
        if (show) {
            container.style.opacity = '0.5';
            container.style.pointerEvents = 'none';
        } else {
            container.style.opacity = '1';
            container.style.pointerEvents = 'auto';
        }
    });
}

// 3. Update Charts for Different Periods (Demo)
function updateChartsForPeriod(period) {
    // This will be handled by chart.js
    // We'll dispatch a custom event that chart.js can listen to
    const event = new CustomEvent('periodChange', { 
        detail: { period: period } 
    });
    document.dispatchEvent(event);
}

// 4. Animate Analytics Stats on Scroll
function animateStats() {
    const statValues = document.querySelectorAll('.analytics-stat-value');
    statValues.forEach(stat => {
        const text = stat.textContent;
        // Only animate if it's a number
        const number = parseFloat(text.replace(/[₹,]/g, ''));
        if (!isNaN(number)) {
            animateNumber(stat, number);
        }
    });
}

// 5. Animate Number Counter
function animateNumber(element, target) {
    let current = 0;
    const increment = target / 60;
    const duration = 1000;
    const stepTime = duration / 60;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        // Format with currency symbol
        element.textContent = '₹' + Math.round(current).toLocaleString('en-IN');
    }, stepTime);
}

// 6. Analytics Page Initialization
function initAnalytics() {
    console.log('📊 Initializing Analytics page...');
    
    // Setup period selector
    setupAnalyticsPeriod();
    
    // Animate stats after a short delay
    setTimeout(() => {
        animateStats();
    }, 500);
    
    // Add hover effect to insight cards
    document.querySelectorAll('.analytics-insight-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.transition = 'transform 0.3s ease';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add hover effect to category items
    document.querySelectorAll('.analytics-category').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.background = '#f7fafc';
            this.style.borderRadius = '12px';
            this.style.transition = 'background 0.3s ease';
            this.style.padding = '12px 16px';
        });
        item.addEventListener('mouseleave', function() {
            this.style.background = 'transparent';
            this.style.padding = '0';
        });
    });
    
    console.log('✅ Analytics page initialized successfully!');
}
// ============================================
// BUDGETS PAGE
// ============================================

document.addEventListener("DOMContentLoaded", function () {

    // ============================================
    // CREATE BUDGET MODAL
    // ============================================

    const createModal = document.getElementById("createBudgetModal");
    const openBudgetBtn = document.getElementById("openBudgetModal");
    const closeBudgetBtn = document.getElementById("closeBudgetModal");
    const cancelBudgetBtn = document.getElementById("cancelBudgetBtn");
    const emptyBudgetBtn = document.getElementById("emptyBudgetBtn");

    function openBudgetModal() {

        if (!createModal) return;

        createModal.style.display = "flex";
        document.body.style.overflow = "hidden";

        // Set today's date as default start date
        const startDate = document.getElementById("budgetStartDate");

        if (startDate && !startDate.value) {

            const today = new Date();

            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, "0");
            const day = String(today.getDate()).padStart(2, "0");

            startDate.value = `${year}-${month}-${day}`;
        }
    }


    function closeBudgetModal() {

        if (!createModal) return;

        createModal.style.display = "none";
        document.body.style.overflow = "auto";
    }


    if (openBudgetBtn) {
        openBudgetBtn.addEventListener("click", openBudgetModal);
    }

    if (emptyBudgetBtn) {
        emptyBudgetBtn.addEventListener("click", openBudgetModal);
    }

    if (closeBudgetBtn) {
        closeBudgetBtn.addEventListener("click", closeBudgetModal);
    }

    if (cancelBudgetBtn) {
        cancelBudgetBtn.addEventListener("click", closeBudgetModal);
    }


    // Close Create modal when clicking outside
    if (createModal) {

        window.addEventListener("click", function (event) {

            if (event.target === createModal) {
                closeBudgetModal();
            }

        });
    }


    // ============================================
    // EDIT BUDGET
    // ============================================

    document.querySelectorAll(".budget-edit-btn").forEach(button => {

        button.addEventListener("click", async function () {

            const budgetId = this.dataset.budgetId;

            try {

                const response = await fetch(
                    `/dashboard/budgets/${budgetId}`
                );

                if (!response.ok) {
                    throw new Error("Failed to load budget");
                }

                const budget = await response.json();

                document.getElementById("editBudgetId").value =
                    budget.id;

                document.getElementById("editBudgetCategory").value =
                    budget.category;

                document.getElementById("editBudgetAmount").value =
                    budget.amount;

                document.getElementById("editBudgetStartDate").value =
                    budget.start_date;

                document.getElementById("editBudgetEndDate").value =
                    budget.end_date;


                document.getElementById("editBudgetModal").style.display =
                    "flex";

                document.body.style.overflow = "hidden";

            } catch (error) {

                console.error(error);

                alert("Unable to load budget details.");

            }

        });

    });


    // ============================================
    // EDIT BUDGET FORM
    // ============================================

    const editForm = document.getElementById("editBudgetForm");

    if (editForm) {

        editForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            const budgetId =
                document.getElementById("editBudgetId").value;

            const formData = new FormData();

            formData.append(
                "category",
                document.getElementById("editBudgetCategory").value
            );

            formData.append(
                "amount",
                document.getElementById("editBudgetAmount").value
            );

            formData.append(
                "start_date",
                document.getElementById("editBudgetStartDate").value
            );

            formData.append(
                "end_date",
                document.getElementById("editBudgetEndDate").value
            );


            try {

                const response = await fetch(
                    `/dashboard/budgets/edit/${budgetId}`,
                    {
                        method: "POST",
                        body: formData
                    }
                );


                if (!response.ok) {
                    throw new Error("Update failed");
                }


                window.location.href =
                    "/dashboard/budgets";


            } catch (error) {

                console.error(error);

                alert("Unable to update budget.");

            }

        });

    }


    // ============================================
    // CLOSE EDIT MODAL
    // ============================================

    const editModal =
        document.getElementById("editBudgetModal");

    const closeEditBtn =
        document.getElementById("closeEditBudgetModal");

    const cancelEditBtn =
        document.getElementById("cancelEditBudgetBtn");


    function closeEditModal() {

        if (!editModal) return;

        editModal.style.display = "none";
        document.body.style.overflow = "auto";
    }


    if (closeEditBtn) {
        closeEditBtn.addEventListener(
            "click",
            closeEditModal
        );
    }


    if (cancelEditBtn) {
        cancelEditBtn.addEventListener(
            "click",
            closeEditModal
        );
    }


    // ============================================
    // DELETE BUDGET
    // ============================================

    document.querySelectorAll(".budget-delete-btn").forEach(button => {

        button.addEventListener("click", async function () {

            const budgetId =
                this.dataset.budgetId;


            const confirmed = confirm(
                "Are you sure you want to delete this budget?\n\nThis action cannot be undone."
            );


            if (!confirmed) {
                return;
            }


            try {

                const response = await fetch(
                    `/dashboard/budgets/delete/${budgetId}`,
                    {
                        method: "POST"
                    }
                );


                if (!response.ok) {
                    throw new Error("Delete failed");
                }


                window.location.href =
                    "/dashboard/budgets";


            } catch (error) {

                console.error(error);

                alert("Unable to delete budget.");

            }

        });

    });


    // ============================================
    // ESC KEY
    // ============================================

    document.addEventListener("keydown", function (event) {

        if (event.key !== "Escape") {
            return;
        }

        closeBudgetModal();
        closeEditModal();

    });


    // ============================================
    // INITIALIZE
    // ============================================

    console.log("📊 Budgets page initialized!");

});
// ============================================
// SETTINGS PAGE FUNCTIONS
// ============================================


// ============================================
// 1. THEME
// ============================================

function setTheme(theme) {

    // Remove active class from all theme buttons
    document.querySelectorAll(".settings-option").forEach(button => {
        button.classList.remove("active");
    });


    // Find selected theme button
    document.querySelectorAll(".settings-option").forEach(button => {

        if (
            button.getAttribute("onclick") ===
            `setTheme('${theme}')`
        ) {
            button.classList.add("active");
        }

    });


    // Update hidden theme input
    const themeInput = document.getElementById("settingsTheme");

    if (themeInput) {
        themeInput.value = theme;
    }


    // Apply theme
    if (theme === "dark") {

        document.body.classList.add("dark-theme");

    }

    else if (theme === "light") {

        document.body.classList.remove("dark-theme");

    }

    else if (theme === "system") {

        if (
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches
        ) {

            document.body.classList.add("dark-theme");

        }

        else {

            document.body.classList.remove("dark-theme");

        }

    }


    // Store temporarily in browser
    // Database will be updated when
    // Save Preferences is clicked.

    localStorage.setItem("theme", theme);
}


// ============================================
// 2. LOAD THEME
// ============================================

function loadTheme() {

    const themeInput =
        document.getElementById("settingsTheme");


    // First use database value from hidden input
    if (themeInput && themeInput.value) {

        const savedTheme = themeInput.value;

        setTheme(savedTheme);

        return;
    }


    // Fallback to localStorage
    const savedTheme =
        localStorage.getItem("theme");


    if (savedTheme) {

        setTheme(savedTheme);

    }

}


// ============================================
// 3. PROFILE SETTINGS
// ============================================

function initProfileSettings() {

    const form =
        document.getElementById(
            "profileSettingsForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener("submit", function(event) {

        const fullname =
            document
                .getElementById("settingsFullName")
                .value
                .trim();


        const email =
            document
                .getElementById("settingsEmail")
                .value
                .trim();


        const username =
            document
                .getElementById("settingsUsername")
                .value
                .trim();


        // ========================================
        // VALIDATION
        // ========================================

        if (!fullname) {

            event.preventDefault();

            alert("Please enter your full name.");

            return;
        }


        if (!username) {

            event.preventDefault();

            alert("Please enter your username.");

            return;
        }


        if (!email) {

            event.preventDefault();

            alert("Please enter your email address.");

            return;
        }


        // ========================================
        // ALLOW NORMAL FORM SUBMISSION
        // ========================================

        // Do NOT prevent default.
        //
        // The form will submit to:
        // /dashboard/settings
        //
        // Flask will detect:
        // action = profile

    });

}


// ============================================
// 4. PREFERENCES
// ============================================

function initPreferences() {

    const form =
        document.getElementById(
            "preferencesForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener("submit", function(event) {

        const currency =
            document
                .getElementById("settingsCurrency")
                .value;


        const dateFormat =
            document
                .getElementById("settingsDateFormat")
                .value;


        const language =
            document
                .getElementById("settingsLanguage")
                .value;


        const themeInput =
            document.getElementById("settingsTheme");


        // ========================================
        // VALIDATION
        // ========================================

        if (!currency) {

            event.preventDefault();

            alert("Please select a currency.");

            return;
        }


        if (!dateFormat) {

            event.preventDefault();

            alert("Please select a date format.");

            return;
        }


        if (!language) {

            event.preventDefault();

            alert("Please select a language.");

            return;
        }


        if (!themeInput || !themeInput.value) {

            event.preventDefault();

            alert("Please select a theme.");

            return;
        }


        // ========================================
        // ALLOW NORMAL FORM SUBMISSION
        // ========================================

        // Do NOT prevent default.
        //
        // Form submits to:
        // /dashboard/settings
        //
        // Flask will detect:
        // action = preferences

    });

}


// ============================================
// 5. NOTIFICATION SETTINGS
// ============================================

function initNotifications() {

    const form =
        document.getElementById(
            "notificationsForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener("submit", function(event) {

        const checkboxes =
            form.querySelectorAll(
                "input[type='checkbox']"
            );


        // Make sure all five checkboxes exist
        if (checkboxes.length !== 5) {

            event.preventDefault();

            console.error(
                "Notification checkbox configuration error."
            );

            return;
        }


        // ========================================
        // ALLOW NORMAL FORM SUBMISSION
        // ========================================

        // IMPORTANT:
        //
        // Checked checkboxes are automatically
        // sent to Flask.
        //
        // Unchecked checkboxes are not sent.
        //
        // Flask handles this using:
        //
        // request.form.get(...)
        //
        // and converts missing values to 0.

    });

}


// ============================================
// 6. DELETE ACCOUNT
// ============================================

function confirmDeleteAccount() {

    const firstConfirm = confirm(

        "⚠️ Are you sure you want to delete your account?\n\n" +

        "All your transactions, budgets and account data " +

        "will be permanently deleted."

    );


    if (!firstConfirm) {
        return;
    }


    const secondConfirm = confirm(

        "This action cannot be undone.\n\n" +

        "Do you really want to permanently delete your account?"

    );


    if (!secondConfirm) {
        return;
    }


    // ========================================
    // CREATE DELETE FORM
    // ========================================

    const form =
        document.createElement("form");


    form.method = "POST";

    form.action =
        "/dashboard/settings/delete-account";


    document.body.appendChild(form);


    form.submit();

}


// ============================================
// 7. INITIALIZE SETTINGS PAGE
// ============================================

function initSettings() {

    console.log(
        "⚙️ Settings page initialized!"
    );


    loadTheme();

    initProfileSettings();

    initPreferences();

    initNotifications();

}


// ============================================
// 8. AUTO INITIALIZE
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        if (
            document.querySelector(
                ".settings-header"
            )
        ) {

            initSettings();

        }

    }
);
// ============================================
// PROFILE PAGE FUNCTIONS
// ============================================


// ============================================
// 1. PREVIEW PROFILE PICTURE
// ============================================

function previewProfilePicture(input) {

    if (input.files && input.files[0]) {

        const reader = new FileReader();

        reader.onload = function(e) {

            const avatar = document.querySelector(".profile-avatar-large");

            if (avatar) {

                avatar.style.backgroundImage =
                    `url(${e.target.result})`;

                avatar.style.backgroundSize = "cover";
                avatar.style.backgroundPosition = "center";

                const avatarText =
                    avatar.querySelector(".profile-avatar-text");

                if (avatarText) {
                    avatarText.style.display = "none";
                }
            }
        };

        reader.readAsDataURL(input.files[0]);
    }
}


// ============================================
// 2. RESET PROFILE FORM
// ============================================

function resetProfileForm() {

    if (confirm("Discard your changes?")) {

        window.location.reload();

    }
}


// ============================================
// 3. INITIALIZE PROFILE PAGE
// ============================================

function initProfile() {

    console.log("👤 Profile page initialized!");

    const profileForm =
        document.getElementById("profileForm");

    if (!profileForm) {
        return;
    }

    /*
        IMPORTANT:

        Do NOT add a submit event listener here.

        The profile form is submitted normally to Flask:

        POST /dashboard/profile

        Flask then updates the MySQL database.
    */
}


// ============================================
// AUTO-INITIALIZE
// ============================================

document.addEventListener("DOMContentLoaded", function() {

    if (document.querySelector(".profile-header")) {

        initProfile();

    }

});