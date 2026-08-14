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

function createIncomeExpenseChart(period = '6m') {
    const ctx = document.getElementById('incomeExpenseChart');
    if (!ctx) return;
    
    // Data for different periods
    const dataMap = {
        '6m': {
            labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            income: [25000, 32000, 28000, 35000, 30000, 38000],
            expense: [12000, 15000, 10000, 14000, 13000, 16000]
        },
        '3m': {
            labels: ['Jun', 'Jul', 'Aug'],
            income: [35000, 30000, 38000],
            expense: [14000, 13000, 16000]
        },
        '1y': {
            labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            income: [22000, 25000, 28000, 30000, 32000, 35000, 25000, 32000, 28000, 35000, 30000, 38000],
            expense: [10000, 12000, 11000, 13000, 14000, 15000, 12000, 15000, 10000, 14000, 13000, 16000]
        },
        'all': {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            income: [20000, 22000, 25000, 28000, 30000, 32000, 35000, 38000, 25000, 32000, 28000, 35000],
            expense: [9000, 10000, 12000, 11000, 13000, 14000, 15000, 16000, 12000, 15000, 10000, 14000]
        }
    };
    
    const data = dataMap[period] || dataMap['6m'];
    
    if (incomeExpenseChart) {
        incomeExpenseChart.destroy();
    }
    
    incomeExpenseChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'Income',
                    data: data.income,
                    borderColor: chartColors.income,
                    backgroundColor: chartColors.income + '20',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: chartColors.income,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Expenses',
                    data: data.expense,
                    borderColor: chartColors.expense,
                    backgroundColor: chartColors.expense + '20',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: chartColors.expense,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12,
                            family: "'Inter', sans-serif"
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    titleColor: '#2d3748',
                    bodyColor: '#4a5568',
                    borderColor: '#e2e8f0',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ₹' + context.raw.toLocaleString('en-IN');
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value.toLocaleString('en-IN');
                        },
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        color: '#e2e8f0',
                        drawBorder: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
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
    
    spendingBreakdownChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Housing', 'Food', 'Transport', 'Shopping', 'Entertainment'],
            datasets: [{
                data: [21500, 14200, 8400, 7100, 4800],
                backgroundColor: [
                    chartColors.housing,
                    chartColors.food,
                    chartColors.transport,
                    chartColors.shopping,
                    chartColors.entertainment
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
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
                tooltip: {
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    titleColor: '#2d3748',
                    bodyColor: '#4a5568',
                    borderColor: '#e2e8f0',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.raw / total) * 100).toFixed(1);
                            return context.label + ': ₹' + context.raw.toLocaleString('en-IN') + ' (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });
}

// ============================================
// 4. INCOME SOURCES CHART (Bar Chart)
// ============================================

function createIncomeSourcesChart() {
    const ctx = document.getElementById('incomeSourcesChart');
    if (!ctx) return;
    
    if (incomeSourcesChart) {
        incomeSourcesChart.destroy();
    }
    
    incomeSourcesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
            datasets: [{
                label: 'Income Sources',
                data: [85000, 32000, 18000, 15000, 12000],
                backgroundColor: [
                    chartColors.salary,
                    chartColors.freelance,
                    chartColors.investment,
                    chartColors.gift,
                    chartColors.other
                ],
                borderRadius: 8,
                barPercentage: 0.6
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
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    titleColor: '#2d3748',
                    bodyColor: '#4a5568',
                    borderColor: '#e2e8f0',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return '₹' + context.raw.toLocaleString('en-IN');
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value.toLocaleString('en-IN');
                        },
                        font: {
                            size: 10
                        }
                    },
                    grid: {
                        color: '#e2e8f0',
                        drawBorder: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 10
                        }
                    }
                }
            }
        }
    });
}

// ============================================
// 5. MONTHLY SAVINGS CHART (Bar Chart)
// ============================================

function createMonthlySavingsChart() {
    const ctx = document.getElementById('monthlySavingsChart');
    if (!ctx) return;
    
    if (monthlySavingsChart) {
        monthlySavingsChart.destroy();
    }
    
    monthlySavingsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            datasets: [{
                label: 'Savings',
                data: [13000, 17000, 18000, 21000, 17000, 22000],
                backgroundColor: chartColors.savings + '80',
                borderColor: chartColors.savings,
                borderWidth: 2,
                borderRadius: 8,
                barPercentage: 0.5
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
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    titleColor: '#2d3748',
                    bodyColor: '#4a5568',
                    borderColor: '#e2e8f0',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return '₹' + context.raw.toLocaleString('en-IN');
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value.toLocaleString('en-IN');
                        },
                        font: {
                            size: 10
                        }
                    },
                    grid: {
                        color: '#e2e8f0',
                        drawBorder: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 10
                        }
                    }
                }
            }
        }
    });
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
