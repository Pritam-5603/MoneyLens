
// ============================================
// MONEYLENS - MAIN JAVASCRIPT
// Purpose: Interactive functionality across pages
// ============================================


// ============================================
// 1. DASHBOARD
// ============================================

// Search dashboard transactions
function searchDashboardTransactions() {
    const searchInput = document.getElementById('dashboardSearchInput');
    const transactionList = document.getElementById('dashboardTransactionList');

    if (!searchInput || !transactionList) return;

    const search = searchInput.value.toLowerCase().trim();
    const transactions = transactionList.querySelectorAll('.recent-transaction');

    transactions.forEach(transaction => {
        const name = transaction.querySelector('.recent-details strong')
            ?.textContent.toLowerCase() || '';

        const date = transaction.querySelector('.recent-details span')
            ?.textContent.toLowerCase() || '';

        const category = transaction.dataset.category?.toLowerCase() || '';

        const matches =
            name.includes(search) ||
            date.includes(search) ||
            category.includes(search);

        transaction.style.display = matches ? 'flex' : 'none';
    });
}


// Mobile sidebar
function toggleSidebar() {
    const sidebar = document.querySelector('.dashboard-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (sidebar) {
        sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('active');
    }
}

function closeSidebar() {
    const sidebar = document.querySelector('.dashboard-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
}


// ============================================
// 2. TRANSACTIONS PAGE
// ============================================

function filterTransactions() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const dateFilterElement = document.getElementById('dateFilter');

    if (!searchInput || !categoryFilter || !dateFilterElement) return;

    const search = searchInput.value.toLowerCase().trim();
    const category = categoryFilter.value;
    const dateFilter = dateFilterElement.value;

    const dateRange = document.getElementById('dateRange');
    const startDateValue = document.getElementById('startDate')?.value;
    const endDateValue = document.getElementById('endDate')?.value;

    if (dateRange) {
        dateRange.style.display = dateFilter === 'custom' ? 'flex' : 'none';
    }

    const items = document.querySelectorAll('.transaction-item');
    let visibleCount = 0;

    items.forEach(item => {
        let show = true;

        // Search filter
        if (search) {
            const name = item.querySelector('.transaction-name')
                ?.textContent.toLowerCase() || '';

            if (!name.includes(search)) show = false;
        }

        // Category filter
        if (category && show) {
            if (item.dataset.category !== category) show = false;
        }

        // Date filter
        if (show && dateFilter !== 'all') {
            const itemDateValue = item.dataset.date;

            if (itemDateValue) {
                const itemDate = new Date(itemDateValue);
                const today = new Date();

                // Compare calendar dates without time
                today.setHours(0, 0, 0, 0);
                itemDate.setHours(0, 0, 0, 0);

                if (dateFilter === 'today') {
                    if (itemDate.getTime() !== today.getTime()) {
                        show = false;
                    }

                } else if (dateFilter === 'week') {
                    const weekAgo = new Date(today);
                    weekAgo.setDate(weekAgo.getDate() - 7);

                    if (itemDate < weekAgo || itemDate > today) {
                        show = false;
                    }

                } else if (dateFilter === 'month') {
                    const monthAgo = new Date(today);
                    monthAgo.setMonth(monthAgo.getMonth() - 1);

                    if (itemDate < monthAgo || itemDate > today) {
                        show = false;
                    }

                } else if (dateFilter === 'custom') {
                    if (startDateValue && itemDate < new Date(startDateValue)) {
                        show = false;
                    }

                    if (endDateValue) {
                        const endDate = new Date(endDateValue);
                        endDate.setHours(23, 59, 59, 999);

                        if (itemDate > endDate) show = false;
                    }
                }
            }
        }

        item.style.display = show ? 'flex' : 'none';

        if (show) visibleCount++;
    });

    // Empty state
    const emptyState = document.getElementById('emptyState');

    if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    // Transaction count
    const countElement = document.querySelector('.list-count');

    if (countElement) {
        countElement.textContent =
            `Showing ${visibleCount} of ${items.length} transactions`;
    }
}

function applyFilters() {
    filterTransactions();
}

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

    if (dateRange) dateRange.style.display = 'none';

    filterTransactions();
}


// ============================================
// 3. TRANSACTION MODALS
// ============================================

// Local date helper (avoids UTC date shifting)
function getLocalDateString() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function openModal() {
    const modal = document.getElementById('addTransactionModal');
    const form = document.getElementById('addTransactionForm');

    if (!modal) return;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    if (form) form.reset();

    const dateInput = document.getElementById('date');

    if (dateInput) {
        dateInput.value = getLocalDateString();
    }

    updateCategories();
}

function closeModal() {
    const modal = document.getElementById('addTransactionModal');

    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}


// ============================================
// 4. TRANSACTION CATEGORIES
// ============================================

function updateCategories() {
    const typeSelect = document.getElementById('transactionType');
    const incomeGroup = document.getElementById('incomeCategories');
    const expenseGroup = document.getElementById('expenseCategories');

    if (!typeSelect) return;

    const type = typeSelect.value;

    if (type === 'income') {
        if (incomeGroup) incomeGroup.style.display = '';
        if (expenseGroup) expenseGroup.style.display = 'none';
    } else {
        if (incomeGroup) incomeGroup.style.display = 'none';
        if (expenseGroup) expenseGroup.style.display = '';
    }
}


// ============================================
// 5. TRANSACTION HISTORY MODAL
// ============================================

function openHistoryModal() {
    const modal = document.getElementById('historyModal');

    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeHistoryModal() {
    const modal = document.getElementById('historyModal');

    if (modal) {
        modal.style.display = 'none';
    }
}


// ============================================
// 6. EDIT TRANSACTION
// ============================================

function editTransaction(id) {
    const modal = document.getElementById('editTransactionModal');
    const form = document.getElementById('editTransactionForm');

    if (!modal || !form) {
        console.error('Edit modal or form not found');
        return;
    }

    form.action = `/dashboard/transactions/edit/${id}`;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    console.log('Editing transaction:', id);
}

function closeEditModal() {
    const modal = document.getElementById('editTransactionModal');

    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}


// ============================================
// 7. HOMEPAGE JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function () {

    // Mobile navigation
    const toggleButton = document.getElementById('navToggle');
    const navMenu = document.getElementById('navbarMenu');

    if (toggleButton && navMenu) {
        toggleButton.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            toggleButton.classList.toggle('active');
        });
    }

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (event) {
            const targetId = this.getAttribute('href');

            // Ignore empty placeholder links
            if (!targetId || targetId === '#') return;

            const section = document.querySelector(targetId);

            if (section) {
                event.preventDefault();

                section.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');

    if (navbar) {
        function handleNavbarScroll() {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }

        window.addEventListener('scroll', handleNavbarScroll);
        handleNavbarScroll();
    }

    console.log('MoneyLens homepage initialized!');
});


// ============================================
// 8. AUTHENTICATION HELPERS
// ============================================

// Toggle password visibility
function togglePasswordInput(inputId, buttonId) {
    const input = document.getElementById(inputId);
    const button = document.getElementById(buttonId);

    if (!input || !button) return;

    const isPassword = input.type === 'password';

    input.type = isPassword ? 'text' : 'password';

    button.innerHTML = isPassword
        ? '<i class="fas fa-eye-slash"></i>'
        : '<i class="fas fa-eye"></i>';

    button.title = isPassword ? 'Hide password' : 'Show password';
}


// Email validation
function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}


// Show error
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


// Clear errors
function clearErrors() {
    document.querySelectorAll('input').forEach(input => {
        input.classList.remove('error');
    });

    document.querySelectorAll('.error-message').forEach(message => {
        message.textContent = '';
        message.style.display = 'none';
    });
}


// ============================================
// 9. LOGIN PAGE
// ============================================

function handleLogin(event) {
    clearErrors();

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    if (!usernameInput || !passwordInput) return;

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    let isValid = true;

    // Username validation
    if (!username) {
        showError('username', 'Please enter your username or email');
        isValid = false;

    } else if (username.includes('@') && !validateEmail(username)) {
        showError('username', 'Please enter a valid email address');
        isValid = false;
    }

    // Password validation
    if (!password) {
        showError('password', 'Please enter your password');
        isValid = false;

    } else if (password.length < 6) {
        showError('password', 'Password must be at least 6 characters');
        isValid = false;
    }

    if (!isValid) {
        event.preventDefault();
        return;
    }

    // Allow the normal Flask form submission
    const button = document.querySelector('.auth-btn');

    if (button) {
        button.innerHTML =
            '<i class="fas fa-spinner fa-spin"></i> Signing in...';

        button.disabled = true;
    }
}


// ============================================
// 10. PASSWORD STRENGTH
// ============================================

function checkPasswordStrength(password) {
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');

    if (!strengthFill || !strengthText) return;

    let strength = 0;

    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const percentage = (strength / 6) * 100;

    strengthFill.style.width = percentage + '%';

    if (password.length === 0) {
        strengthFill.style.background = '#e2e8f0';
        strengthText.textContent = 'Enter a password';
        strengthText.style.color = '#a0aec0';

    } else if (percentage <= 33) {
        strengthFill.style.background = '#fc8181';
        strengthText.textContent = 'Weak';
        strengthText.style.color = '#fc8181';

    } else if (percentage <= 66) {
        strengthFill.style.background = '#f6ad55';
        strengthText.textContent = 'Medium';
        strengthText.style.color = '#f6ad55';

    } else if (percentage < 100) {
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
// 11. REGISTRATION PAGE
// ============================================

function checkPasswordMatch() {
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirm-password');
    const errorDiv = document.getElementById('confirm-password-error');

    if (!passwordInput || !confirmInput) return true;

    const password = passwordInput.value;
    const confirmPassword = confirmInput.value;

    if (confirmPassword.length === 0) return true;

    if (password !== confirmPassword) {
        confirmInput.classList.add('error');

        if (errorDiv) {
            errorDiv.textContent = 'Passwords do not match';
            errorDiv.style.display = 'block';
        }

        return false;
    }

    confirmInput.classList.remove('error');

    if (errorDiv) {
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
    }

    return true;
}


function handleRegister(event) {
    clearErrors();

    const fullnameInput = document.getElementById('fullname');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirm-password');
    const terms = document.getElementById('terms');

    if (
        !fullnameInput ||
        !usernameInput ||
        !emailInput ||
        !passwordInput ||
        !confirmInput
    ) {
        return;
    }

    const fullname = fullnameInput.value.trim();
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmInput.value;

    let isValid = true;

    // Full name
    if (fullname.length < 2) {
        showError('fullname', 'Please enter your full name (minimum 2 characters)');
        isValid = false;
    }

    // Username
    if (username.length < 3) {
        showError('username', 'Username must be at least 3 characters');
        isValid = false;
    }

    // Email
    if (!email) {
        showError('email', 'Please enter your email address');
        isValid = false;

    } else if (!validateEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }

    // Password
    if (!password) {
        showError('password', 'Please create a password');
        isValid = false;

    } else if (password.length < 6) {
        showError('password', 'Password must be at least 6 characters');
        isValid = false;
    }

    // Confirm password
    if (!confirmPassword) {
        showError('confirm-password', 'Please confirm your password');
        isValid = false;

    } else if (password !== confirmPassword) {
        showError('confirm-password', 'Passwords do not match');
        isValid = false;
    }

    // Terms
    if (!terms || !terms.checked) {
        alert('Please agree to the Terms of Service and Privacy Policy');
        isValid = false;
    }

    if (!isValid) {
        event.preventDefault();
        return;
    }

    // Allow normal Flask registration submission
    const button = document.querySelector('.auth-btn');

    if (button) {
        button.innerHTML =
            '<i class="fas fa-spinner fa-spin"></i> Creating account...';

        button.disabled = true;
    }
}


// ============================================
// 12. AUTHENTICATION EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', function () {

    // Login form
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Login password visibility
    const loginToggle = document.querySelector('.toggle-password');
    const loginPassword = document.getElementById('password');

    if (loginToggle && loginPassword) {
        loginToggle.addEventListener('click', function () {
            const isPassword = loginPassword.type === 'password';

            loginPassword.type = isPassword ? 'text' : 'password';

            loginToggle.innerHTML = isPassword
                ? '<i class="fas fa-eye-slash"></i>'
                : '<i class="fas fa-eye"></i>';

            loginToggle.title = isPassword ? 'Hide password' : 'Show password';
        });
    }

    // Registration form
    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
        console.log('Registration form initialized');
    }

    // Registration password toggle
    const togglePassword = document.getElementById('togglePassword');

    if (togglePassword) {
        togglePassword.addEventListener('click', function () {
            togglePasswordInput('password', 'togglePassword');
        });
    }

    // Confirm password toggle
    const toggleConfirm = document.getElementById('toggleConfirmPassword');

    if (toggleConfirm) {
        toggleConfirm.addEventListener('click', function () {
            togglePasswordInput('confirm-password', 'toggleConfirmPassword');
        });
    }

    // Password strength
    const passwordInput = document.getElementById('password');

    if (passwordInput) {
        passwordInput.addEventListener('input', function () {
            checkPasswordStrength(this.value);
            checkPasswordMatch();
        });
    }

    // Password match
    const confirmInput = document.getElementById('confirm-password');

    if (confirmInput) {
        confirmInput.addEventListener('input', checkPasswordMatch);
    }
});


// ============================================
// 13. ANALYTICS PAGE
// ============================================

// The Analytics period selector is handled by analytics.html,
// which reloads the page with the selected Flask period.
// Do not simulate chart data here.

function showChartsLoading(show) {
    const containers = document.querySelectorAll(
        '.analytics-chart-container, .analytics-donut-container'
    );

    containers.forEach(container => {
        container.style.opacity = show ? '0.5' : '1';
        container.style.pointerEvents = show ? 'none' : 'auto';
    });
}



// ============================================
// 14. BUDGETS PAGE
// ============================================

document.addEventListener('DOMContentLoaded', function () {

    // ============================================
    // CREATE BUDGET MODAL
    // ============================================

    const createModal = document.getElementById('createBudgetModal');
    const openBudgetBtn = document.getElementById('openBudgetModal');
    const closeBudgetBtn = document.getElementById('closeBudgetModal');
    const cancelBudgetBtn = document.getElementById('cancelBudgetBtn');
    const emptyBudgetBtn = document.getElementById('emptyBudgetBtn');

    function openBudgetModal() {
        if (!createModal) return;

        createModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        const startDate = document.getElementById('budgetStartDate');

        if (startDate && !startDate.value) {
            startDate.value = getLocalDateString();
        }
    }

    function closeBudgetModal() {
        if (!createModal) return;

        createModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    if (openBudgetBtn) {
        openBudgetBtn.addEventListener('click', openBudgetModal);
    }

    if (emptyBudgetBtn) {
        emptyBudgetBtn.addEventListener('click', openBudgetModal);
    }

    if (closeBudgetBtn) {
        closeBudgetBtn.addEventListener('click', closeBudgetModal);
    }

    if (cancelBudgetBtn) {
        cancelBudgetBtn.addEventListener('click', closeBudgetModal);
    }

    if (createModal) {
        window.addEventListener('click', function (event) {
            if (event.target === createModal) {
                closeBudgetModal();
            }
        });
    }


    // ============================================
    // EDIT BUDGET
    // ============================================

    document.querySelectorAll('.budget-edit-btn').forEach(button => {

        button.addEventListener('click', async function () {

            const budgetId = this.dataset.budgetId;

            try {
                const response = await fetch(`/dashboard/budgets/${budgetId}`);

                if (!response.ok) {
                    throw new Error('Failed to load budget');
                }

                const budget = await response.json();

                const idInput = document.getElementById('editBudgetId');
                const categoryInput = document.getElementById('editBudgetCategory');
                const amountInput = document.getElementById('editBudgetAmount');
                const startInput = document.getElementById('editBudgetStartDate');
                const endInput = document.getElementById('editBudgetEndDate');
                const editModal = document.getElementById('editBudgetModal');

                if (
                    !idInput ||
                    !categoryInput ||
                    !amountInput ||
                    !startInput ||
                    !endInput ||
                    !editModal
                ) {
                    throw new Error('Budget edit form elements not found');
                }

                idInput.value = budget.id;
                categoryInput.value = budget.category;
                amountInput.value = budget.amount;
                startInput.value = budget.start_date;
                endInput.value = budget.end_date;

                editModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';

            } catch (error) {
                console.error(error);
                alert('Unable to load budget details.');
            }
        });
    });


    // ============================================
    // EDIT BUDGET FORM
    // ============================================

    const editForm = document.getElementById('editBudgetForm');

    if (editForm) {
        editForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const budgetId = document.getElementById('editBudgetId')?.value;

            if (!budgetId) {
                alert('Budget ID is missing.');
                return;
            }

            const formData = new FormData();

            formData.append(
                'category',
                document.getElementById('editBudgetCategory')?.value || ''
            );

            formData.append(
                'amount',
                document.getElementById('editBudgetAmount')?.value || ''
            );

            formData.append(
                'start_date',
                document.getElementById('editBudgetStartDate')?.value || ''
            );

            formData.append(
                'end_date',
                document.getElementById('editBudgetEndDate')?.value || ''
            );

            try {
                const response = await fetch(
                    `/dashboard/budgets/edit/${budgetId}`,
                    {
                        method: 'POST',
                        body: formData
                    }
                );

                if (!response.ok) {
                    throw new Error('Update failed');
                }

                window.location.href = '/dashboard/budgets';

            } catch (error) {
                console.error(error);
                alert('Unable to update budget.');
            }
        });
    }


    // ============================================
    // CLOSE EDIT BUDGET MODAL
    // ============================================

    const editModal = document.getElementById('editBudgetModal');
    const closeEditBtn = document.getElementById('closeEditBudgetModal');
    const cancelEditBtn = document.getElementById('cancelEditBudgetBtn');

    function closeEditBudgetModal() {
        if (!editModal) return;

        editModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    if (closeEditBtn) {
        closeEditBtn.addEventListener('click', closeEditBudgetModal);
    }

    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', closeEditBudgetModal);
    }


    // ============================================
    // DELETE BUDGET - CUSTOM CONFIRMATION MODAL
    // ============================================

    const deleteModal = document.getElementById('deleteBudgetModal');
    const deleteCategory = document.getElementById('deleteBudgetCategory');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBudget');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBudget');

    let selectedBudgetId = null;

    // Open delete confirmation modal
    function openDeleteBudgetModal(budgetId, category) {

        if (!deleteModal) {
            console.error('Delete confirmation modal not found.');
            return;
        }

        selectedBudgetId = budgetId;

        if (deleteCategory) {
            deleteCategory.textContent = category || 'this';
        }

        deleteModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }


    // Close delete confirmation modal
    function closeDeleteBudgetModal() {

        if (!deleteModal) return;

        deleteModal.style.display = 'none';
        document.body.style.overflow = 'auto';

        selectedBudgetId = null;

        if (confirmDeleteBtn) {
            confirmDeleteBtn.disabled = false;
            confirmDeleteBtn.innerHTML =
                '<i class="fas fa-trash-alt"></i> Delete Budget';
        }
    }


    // Attach click events to delete buttons
    document.querySelectorAll('.budget-delete-btn').forEach(button => {

        button.addEventListener('click', function () {

            const budgetId = this.dataset.budgetId;

            // Get the category name from the budget card
            const budgetItem = this.closest('.budget-item');
            const category = budgetItem
                ?.querySelector('.budget-item-name')
                ?.textContent.trim();

            openDeleteBudgetModal(budgetId, category);
        });
    });


    // Cancel deletion
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', closeDeleteBudgetModal);
    }


    // Close when clicking outside the modal
    if (deleteModal) {
        deleteModal.addEventListener('click', function (event) {

            if (event.target === deleteModal) {
                closeDeleteBudgetModal();
            }

        });
    }


    // Confirm deletion
    if (confirmDeleteBtn) {

        confirmDeleteBtn.addEventListener('click', async function () {

            if (!selectedBudgetId) return;

            const budgetId = selectedBudgetId;

            // Prevent multiple clicks
            confirmDeleteBtn.disabled = true;
            confirmDeleteBtn.innerHTML =
                '<i class="fas fa-spinner fa-spin"></i> Deleting...';

            try {

                const response = await fetch(
                    `/dashboard/budgets/delete/${budgetId}`,
                    {
                        method: 'POST'
                    }
                );

                if (!response.ok) {
                    throw new Error('Delete failed');
                }

                window.location.href = '/dashboard/budgets';

            } catch (error) {

                console.error(error);

                alert('Unable to delete budget. Please try again.');

                confirmDeleteBtn.disabled = false;
                confirmDeleteBtn.innerHTML =
                    '<i class="fas fa-trash-alt"></i> Delete Budget';
            }

        });
    }


    // ============================================
    // CLOSE BUDGET MODALS WITH ESCAPE
    // ============================================

    document.addEventListener('keydown', function (event) {

        if (event.key === 'Escape') {

            closeBudgetModal();
            closeEditBudgetModal();
            closeDeleteBudgetModal();

        }

    });


    console.log('Budgets page initialized!');

});


// ============================================
// 15. SETTINGS PAGE
// ============================================


// ============================================
// THEME
// ============================================

function setTheme(theme) {

    // Update selected theme button
    document.querySelectorAll('.settings-option').forEach(button => {
        button.classList.remove('active');

        if (
            button.getAttribute('onclick') === `setTheme('${theme}')`
        ) {
            button.classList.add('active');
        }
    });

    // Update hidden theme input
    const themeInput = document.getElementById('settingsTheme');

    if (themeInput) {
        themeInput.value = theme;
    }

    // Apply selected theme
    if (theme === 'dark') {

        document.body.classList.add('dark-theme');

    } else if (theme === 'light') {

        document.body.classList.remove('dark-theme');

    } else if (theme === 'system') {

        const prefersDark = window.matchMedia(
            '(prefers-color-scheme: dark)'
        ).matches;

        document.body.classList.toggle('dark-theme', prefersDark);
    }

    // Save temporarily until preferences are submitted
    localStorage.setItem('theme', theme);
}


// Load saved theme
function loadTheme() {
    const themeInput = document.getElementById('settingsTheme');

    if (themeInput && themeInput.value) {
        setTheme(themeInput.value);
        return;
    }

    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        setTheme(savedTheme);
    }
}


// ============================================
// PROFILE SETTINGS
// ============================================

function initProfileSettings() {
    const form = document.getElementById('profileSettingsForm');

    if (!form) return;

    form.addEventListener('submit', function (event) {

        const fullname = document.getElementById('settingsFullName')?.value.trim();
        const email = document.getElementById('settingsEmail')?.value.trim();
        const username = document.getElementById('settingsUsername')?.value.trim();

        if (!fullname) {
            event.preventDefault();
            alert('Please enter your full name.');
            return;
        }

        if (!username) {
            event.preventDefault();
            alert('Please enter your username.');
            return;
        }

        if (!email) {
            event.preventDefault();
            alert('Please enter your email address.');
            return;
        }

        // Valid form: allow normal Flask submission
    });
}


// ============================================
// PREFERENCES
// ============================================

function initPreferences() {
    const form = document.getElementById('preferencesForm');

    if (!form) return;

    form.addEventListener('submit', function (event) {

        const currency = document.getElementById('settingsCurrency')?.value;
        const dateFormat = document.getElementById('settingsDateFormat')?.value;
        const language = document.getElementById('settingsLanguage')?.value;
        const themeInput = document.getElementById('settingsTheme');

        if (!currency) {
            event.preventDefault();
            alert('Please select a currency.');
            return;
        }

        if (!dateFormat) {
            event.preventDefault();
            alert('Please select a date format.');
            return;
        }

        if (!language) {
            event.preventDefault();
            alert('Please select a language.');
            return;
        }

        if (!themeInput || !themeInput.value) {
            event.preventDefault();
            alert('Please select a theme.');
            return;
        }

        // Valid form: allow normal Flask submission
    });
}


// ============================================
// NOTIFICATION SETTINGS
// ============================================

function initNotifications() {
    const form = document.getElementById('notificationsForm');

    if (!form) return;

    form.addEventListener('submit', function (event) {

        const checkboxes = form.querySelectorAll(
            "input[type='checkbox']"
        );

        if (checkboxes.length !== 5) {
            event.preventDefault();

            console.error(
                'Notification checkbox configuration error.'
            );

            return;
        }

        // Allow normal Flask submission
    });
}


// ============================================
// DELETE ACCOUNT
// ============================================

function confirmDeleteAccount() {

    const firstConfirm = confirm(
        '⚠️ Are you sure you want to delete your account?\n\n' +
        'All your transactions, budgets and account data ' +
        'will be permanently deleted.'
    );

    if (!firstConfirm) return;

    const secondConfirm = confirm(
        'This action cannot be undone.\n\n' +
        'Do you really want to permanently delete your account?'
    );

    if (!secondConfirm) return;

    const form = document.createElement('form');

    form.method = 'POST';
    form.action = '/dashboard/settings/delete-account';

    document.body.appendChild(form);
    form.submit();
}


// ============================================
// INITIALIZE SETTINGS
// ============================================

function initSettings() {
    console.log('Settings page initialized!');

    loadTheme();
    initProfileSettings();
    initPreferences();
    initNotifications();
}


// ============================================
// 16. PROFILE PAGE
// ============================================

// Preview profile picture
function previewProfilePicture(input) {

    if (!input.files || !input.files[0]) return;

    const reader = new FileReader();

    reader.onload = function (event) {
        const avatar = document.querySelector('.profile-avatar-large');

        if (!avatar) return;

        avatar.style.backgroundImage = `url(${event.target.result})`;
        avatar.style.backgroundSize = 'cover';
        avatar.style.backgroundPosition = 'center';

        const avatarText = avatar.querySelector('.profile-avatar-text');

        if (avatarText) {
            avatarText.style.display = 'none';
        }
    };

    reader.readAsDataURL(input.files[0]);
}


// Reset profile form
function resetProfileForm() {
    if (confirm('Discard your changes?')) {
        window.location.reload();
    }
}


// Initialize profile
function initProfile() {
    console.log('Profile page initialized!');

    // Profile form submits normally to Flask.
    // No JavaScript submission handler is required.
}


// ============================================
// 17. GLOBAL INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function () {

    console.log('Initializing MoneyLens...');


    // ----------------------------------------
    // Dashboard search
    // ----------------------------------------

    const dashboardSearch = document.getElementById(
        'dashboardSearchInput'
    );

    if (dashboardSearch) {
        dashboardSearch.addEventListener(
            'input',
            searchDashboardTransactions
        );
    }


    // ----------------------------------------
    // Transaction history modal
    // ----------------------------------------

    const historyBtn = document.getElementById('historyBtn');
    const closeHistoryBtn = document.getElementById('closeHistoryBtn');

    if (historyBtn) {
        historyBtn.addEventListener('click', openHistoryModal);
    }

    if (closeHistoryBtn) {
        closeHistoryBtn.addEventListener('click', closeHistoryModal);
    }


    // ----------------------------------------
    // Add transaction modal
    // ----------------------------------------

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

    // Close modal when clicking outside
    if (modal) {
        window.addEventListener('click', function (event) {
            if (event.target === modal) {
                closeModal();
            }
        });
    }


    // ----------------------------------------
    // Edit transaction modal
    // ----------------------------------------

    const closeEditBtn = document.getElementById('closeEditModalBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');

    if (closeEditBtn) {
        closeEditBtn.addEventListener('click', closeEditModal);
    }

    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', closeEditModal);
    }


    // ----------------------------------------
    // Transaction type
    // ----------------------------------------

    const typeSelect = document.getElementById('transactionType');

    if (typeSelect) {
        typeSelect.addEventListener('change', updateCategories);
        updateCategories();
    }


    // ----------------------------------------
    // Add transaction form
    // ----------------------------------------

    const transactionForm = document.getElementById('addTransactionForm');

    if (transactionForm) {
        transactionForm.addEventListener('submit', function () {
            console.log('Sending transaction to Flask...');
        });
    }


    // ----------------------------------------
    // Mobile sidebar
    // ----------------------------------------

    const mobileToggle = document.getElementById('mobileToggle');
    const overlay = document.querySelector('.sidebar-overlay');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleSidebar);
    }

    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }


    // ----------------------------------------
    // Default transaction date
    // ----------------------------------------

    const dateInput = document.getElementById('date');

    if (dateInput && !dateInput.value) {
        dateInput.value = getLocalDateString();
    }


    // ----------------------------------------
    // Transaction filters
    // ----------------------------------------

    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const dateFilter = document.getElementById('dateFilter');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');

    if (searchInput) {
        searchInput.addEventListener('input', filterTransactions);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterTransactions);
    }

    if (dateFilter) {
        dateFilter.addEventListener('change', filterTransactions);
    }

    if (startDate) {
        startDate.addEventListener('change', filterTransactions);
    }

    if (endDate) {
        endDate.addEventListener('change', filterTransactions);
    }

    if (searchInput || categoryFilter || dateFilter) {
        filterTransactions();
    }


    // ----------------------------------------
    // Close modals with Escape
    // ----------------------------------------

    document.addEventListener('keydown', function (event) {

        if (event.key === 'Escape') {
            closeModal();
            closeHistoryModal();
            closeEditModal();
            closeSidebar();
        }
    });


    // ----------------------------------------
    // Settings page
    // ----------------------------------------

    if (document.querySelector('.settings-header')) {
        initSettings();
    }


    // ----------------------------------------
    // Profile page
    // ----------------------------------------

    if (document.querySelector('.profile-header')) {
        initProfile();
    }


    console.log('MoneyLens initialized successfully!');
});
