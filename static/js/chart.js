// ============================================
// ANALYTICS CHARTS - CHART.JS
// ============================================

let incomeExpenseChart = null;
let spendingBreakdownChart = null;
let incomeSourcesChart = null;
let monthlySavingsChart = null;

// ============================================
// 1. CHART COLORS
// ============================================

const chartColors = {
    income: '#00b894',
    expense: '#fc8181',
    savings: '#667eea',
    housing: '#4a9eff',
    food: '#f6ad55',
    transport: '#68d391',
    shopping: '#fc8181',
    entertainment: '#9f7aea',
    salary: '#00b894',
    freelance: '#4299e1',
    investment: '#ed8936',
    gift: '#9f7aea',
    other: '#a0aec0'
};

// ============================================
// 2. INCOME VS EXPENSES CHART (Line Chart)
// ============================================

// ============================================
// INCOME VS EXPENSES CHART
// ============================================

function createIncomeExpenseChart() {

    const ctx = document.getElementById('incomeExpenseChart');

    if (!ctx) return;

    if (incomeExpenseChart) {
        incomeExpenseChart.destroy();
    }

    // Get monthly data from Flask
    const dataElement = document.getElementById('monthly-data');

    const monthlyData = dataElement
        ? JSON.parse(dataElement.textContent)
        : [];

    if (monthlyData.length === 0) {
        console.log('ℹ️ No monthly income/expense data available.');
        return;
    }

    // Month labels
    const labels = monthlyData.map(item => {

        const [year, month] = item.month.split('-');

        const date = new Date(
            Number(year),
            Number(month) - 1
        );

        return date.toLocaleString('en-US', {
            month: 'short'
        });
    });

    // Income values
    const incomeData = monthlyData.map(item =>
        Number(item.income)
    );

    // Expense values
    const expenseData = monthlyData.map(item =>
        Number(item.expenses)
    );

    incomeExpenseChart = new Chart(ctx, {

        type: 'line',

        data: {

            labels: labels,

            datasets: [

                {
                    label: 'Income',

                    data: incomeData,

                    borderColor: chartColors.income,

                    backgroundColor: 'rgba(16, 185, 129, 0.10)',

                    borderWidth: 3,

                    tension: 0.4,

                    fill: false,

                    pointRadius: 4,

                    pointHoverRadius: 6
                },

                {
                    label: 'Expenses',

                    data: expenseData,

                    borderColor: chartColors.expense,

                    backgroundColor: 'rgba(239, 68, 68, 0.10)',

                    borderWidth: 3,

                    tension: 0.4,

                    fill: false,

                    pointRadius: 4,

                    pointHoverRadius: 6
                }

            ]
        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            interaction: {
                mode: 'index',
                intersect: false
            },

            plugins: {

                legend: {
                    position: 'top',

                    labels: {
                        usePointStyle: true,
                        padding: 18,
                        font: {
                            size: 12,
                            family: "'Inter', sans-serif"
                        }
                    }
                },

                tooltip: {

                    callbacks: {

                        label: function(context) {

                            return (
                                context.dataset.label +
                                ': ₹' +
                                Number(context.raw)
                                    .toLocaleString('en-IN')
                            );

                        }

                    }

                }

            },

            scales: {

                y: {

                    beginAtZero: true,

                    ticks: {

                        callback: function(value) {

                            return '₹' +
                                Number(value)
                                    .toLocaleString('en-IN');

                        }

                    }

                }

            }

        }

    });

    console.log(
        '✅ Income vs Expenses chart created using database data!'
    );
}

// ============================================
// 3. SPENDING BREAKDOWN CHART (Donut Chart)
// ============================================

function createSpendingBreakdownChart() {

    const ctx = document.getElementById('spendingBreakdownChart');

    if (!ctx) return;

    if (spendingBreakdownChart) {
        spendingBreakdownChart.destroy();
    }


    // ============================================
    // GET DATA FROM FLASK
    // ============================================

    const dataElement =
        document.getElementById('category-spending-data');

    const categoryData = dataElement
        ? JSON.parse(dataElement.textContent)
        : [];


    if (categoryData.length === 0) {

        console.log('ℹ️ No spending data available.');

        return;
    }


    // ============================================
    // CATEGORY NAMES
    // ============================================

    const labels = categoryData.map(item =>
        item.category
    );


    // ============================================
    // CATEGORY AMOUNTS
    // ============================================

    const amounts = categoryData.map(item =>
        Number(item.total)
    );


    // ============================================
    // CHART COLORS
    // ============================================

    const categoryColors = [

        chartColors.housing,
        chartColors.food,
        chartColors.transport,
        chartColors.shopping,
        chartColors.entertainment,

        '#9B59B6',
        '#E67E22',
        '#1ABC9C',
        '#34495E',
        '#F1C40F',
        '#E74C3C',
        '#3498DB'

    ];


    // Give every category a different color
    const backgroundColors = categoryData.map(
        (item, index) =>
            categoryColors[index % categoryColors.length]
    );


    // ============================================
    // CREATE DONUT CHART
    // ============================================

    spendingBreakdownChart = new Chart(ctx, {

        type: 'doughnut',

        data: {

            labels: labels,

            datasets: [{

                data: amounts,

                backgroundColor: backgroundColors,

                borderWidth: 2,

                borderColor: '#ffffff'

            }]

        },


        // ========================================
        // CHART OPTIONS
        // ========================================

        options: {

            responsive: true,

            maintainAspectRatio: false,

            cutout: '70%',


            plugins: {

                // ==================================
                // LEGEND
                // ==================================

                legend: {

                    position: 'bottom',

                    labels: {

                        usePointStyle: true,

                        padding: 16,

                        font: {

                            size: 12,

                            family: "'Inter', sans-serif"

                        }

                    }

                },


                // ==================================
                // TOOLTIP
                // ==================================

                tooltip: {

                    backgroundColor:
                        'rgba(255,255,255,0.95)',

                    titleColor: '#2d3748',

                    bodyColor: '#4a5568',

                    borderColor: '#e2e8f0',

                    borderWidth: 1,

                    padding: 12,

                    cornerRadius: 8,


                    callbacks: {

                        label: function(context) {

                            const total =
                                context.dataset.data.reduce(
                                    (a, b) => a + b,
                                    0
                                );


                            const percentage =
                                (
                                    (context.raw / total) * 100
                                ).toFixed(1);


                            return (

                                context.label +

                                ': ₹' +

                                Number(context.raw)
                                    .toLocaleString('en-IN') +

                                ' (' +

                                percentage +

                                '%)'

                            );

                        }

                    }

                }

            }

        }

    });


    console.log(
        '✅ Spending Breakdown Chart created using database data!'
    );

}
// ============================================
// 4. INCOME SOURCES CHART (Bar Chart)
// ============================================

// ============================================
// INCOME SOURCES CHART (Bar Chart)
// ============================================

function createIncomeSourcesChart() {

    const ctx = document.getElementById('incomeSourcesChart');

    if (!ctx) return;

    if (incomeSourcesChart) {
        incomeSourcesChart.destroy();
    }

    // Get income source data from Flask
    const dataElement = document.getElementById('income-sources-data');

    const incomeData = dataElement
        ? JSON.parse(dataElement.textContent)
        : [];

    if (incomeData.length === 0) {
        console.log('ℹ️ No income source data available.');
        return;
    }

    // Category names
    const labels = incomeData.map(item =>
        item.category
    );

    // Income amounts
    const amounts = incomeData.map(item =>
        Number(item.total)
    );

    incomeSourcesChart = new Chart(ctx, {

        type: 'bar',

        data: {

            labels: labels,

            datasets: [{
                label: 'Income',

                data: amounts,

                backgroundColor: '#10B981',

                borderRadius: 8,

                borderSkipped: false,

                barThickness: 32
            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {
                    display: false
                },

                tooltip: {

                    callbacks: {

                        label: function(context) {

                            return (
                                'Income: ₹' +
                                Number(context.raw)
                                    .toLocaleString('en-IN')
                            );

                        }

                    }

                }

            },

            scales: {

                x: {

                    grid: {
                        display: false
                    },

                    ticks: {
                        color: '#64748B',

                        font: {
                            size: 12,
                            family: "'Inter', sans-serif"
                        }
                    }

                },

                y: {

                    beginAtZero: true,

                    grid: {
                        color: '#E2E8F0'
                    },

                    ticks: {

                        color: '#64748B',

                        callback: function(value) {

                            return '₹' +
                                Number(value)
                                    .toLocaleString('en-IN');

                        },

                        font: {
                            size: 11,
                            family: "'Inter', sans-serif"
                        }
                    }

                }

            }

        }

    });

    console.log(
        '✅ Income Sources bar chart created using database data!'
    );
}

// ============================================
// MONTHLY SAVINGS CHART
// ============================================

function createMonthlySavingsChart() {

    const ctx = document.getElementById('monthlySavingsChart');

    if (!ctx) return;

    if (monthlySavingsChart) {
        monthlySavingsChart.destroy();
    }

    // Get savings data from Flask
    const dataElement = document.getElementById('monthly-savings-data');

    const savingsData = dataElement
        ? JSON.parse(dataElement.textContent)
        : [];

    if (savingsData.length === 0) {
        console.log('ℹ️ No monthly savings data available.');
        return;
    }

    // Month labels
    const labels = savingsData.map(item => {

        const [year, month] = item.month.split('-');

        const date = new Date(
            Number(year),
            Number(month) - 1
        );

        return date.toLocaleString('en-US', {
            month: 'short'
        });
    });

    // Savings values
    const amounts = savingsData.map(item =>
        Number(item.savings)
    );

    monthlySavingsChart = new Chart(ctx, {

        type: 'line',

        data: {

            labels: labels,

            datasets: [{

                label: 'Savings',

                data: amounts,

                borderColor: '#10B981',

                backgroundColor: 'rgba(16, 185, 129, 0.10)',

                borderWidth: 3,

                tension: 0.4,

                fill: true,

                pointRadius: 4,

                pointHoverRadius: 6

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            interaction: {
                mode: 'index',
                intersect: false
            },

            plugins: {

                legend: {
                    display: false
                },

                tooltip: {

                    callbacks: {

                        label: function(context) {

                            return (
                                'Savings: ₹' +
                                Number(context.raw)
                                    .toLocaleString('en-IN')
                            );

                        }

                    }

                }

            },

            scales: {

                x: {

                    grid: {
                        display: false
                    },

                    ticks: {
                        color: '#64748B',

                        font: {
                            size: 12,
                            family: "'Inter', sans-serif"
                        }
                    }

                },

                y: {

                    beginAtZero: false,

                    grid: {
                        color: '#E2E8F0'
                    },

                    ticks: {

                        color: '#64748B',

                        callback: function(value) {

                            return '₹' +
                                Number(value)
                                    .toLocaleString('en-IN');

                        },

                        font: {
                            size: 11,
                            family: "'Inter', sans-serif"
                        }
                    }

                }

            }

        }

    });

    console.log(
        '✅ Monthly Savings chart created using database data!'
    );
}
// ============================================
// 6. UPDATE CHARTS ON PERIOD CHANGE
// ============================================

document.addEventListener('periodChange', function(event) {
    const period = event.detail.period;
    console.log(`📊 Updating charts for period: ${period}`);
    
    // Recreate income vs expense chart with new data
    createIncomeExpenseChart(period);
    
    // Animate stats for new period (simulated)
    setTimeout(() => {
        const statValues = document.querySelectorAll('.analytics-stat-value');
        statValues.forEach(stat => {
            // Add a subtle flash effect
            stat.style.transition = 'color 0.3s ease';
            stat.style.color = '#667eea';
            setTimeout(() => {
                stat.style.color = '';
            }, 500);
        });
    }, 300);
});

// ============================================
// 7. INITIALIZE ALL CHARTS
// ============================================

function initCharts() {
    console.log('📊 Initializing charts...');
    
    // Wait for Chart.js to load
    if (typeof Chart === 'undefined') {
        console.log('⏳ Waiting for Chart.js to load...');
        setTimeout(initCharts, 500);
        return;
    }
    
    // Create all charts
    createIncomeExpenseChart('6m');
    createSpendingBreakdownChart();
    createIncomeSourcesChart();
    createMonthlySavingsChart();
    
    console.log('✅ All charts initialized successfully!');
}

// ============================================
// 8. HANDLE WINDOW RESIZE
// ============================================

let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Charts auto-resize with Chart.js responsive option
        console.log('📐 Window resized, charts updated');
    }, 250);
});

// ============================================
// 9. INITIALIZE ON DOM READY
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the analytics page
    const analyticsHeader = document.querySelector('.analytics-header');
    if (analyticsHeader) {
        console.log('📊 Analytics page detected');
        
        // Initialize charts
        initCharts();
        
        // Initialize analytics page functions from script.js
        if (typeof initAnalytics === 'function') {
            initAnalytics();
        }
    }
});
