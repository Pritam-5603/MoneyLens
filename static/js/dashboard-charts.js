// ============================================
// DASHBOARD CHARTS
// ============================================

console.log('📊 dashboard-charts.js loaded!');

let cashFlowChart = null;
let spendingChart = null;

// Colors
const chartColors = {
    income: '#00b894',
    expense: '#fc8181',
    net: '#667eea',
    housing: '#4a9eff',
    food: '#f6ad55',
    transport: '#68d391',
    shopping: '#fc8181',
    other: '#a0aec0'
};

// ============================================
// CASH FLOW CHART
// ============================================

function createCashFlowChart() {
    console.log('📊 Creating Cash Flow Chart...');
    
    const canvas = document.getElementById('cashFlowChart');
    if (!canvas) {
        console.error('❌ Cash flow chart canvas not found!');
        return;
    }
    
    if (cashFlowChart) {
        cashFlowChart.destroy();
        cashFlowChart = null;
    }

    const ctx = canvas.getContext('2d');
    
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    const incomeData = [28000, 32000, 35000, 30000, 38000, 42000, 45000, 49829];
    const expenseData = [12000, 15000, 14000, 16000, 18000, 20000, 22000, 36868];
    const netData = incomeData.map((inc, i) => inc - expenseData[i]);

    try {
        cashFlowChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Income',
                        data: incomeData,
                        borderColor: chartColors.income,
                        backgroundColor: chartColors.income + '20',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 5,
                        pointBackgroundColor: chartColors.income,
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        borderWidth: 3
                    },
                    {
                        label: 'Expenses',
                        data: expenseData,
                        borderColor: chartColors.expense,
                        backgroundColor: chartColors.expense + '20',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 5,
                        pointBackgroundColor: chartColors.expense,
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        borderWidth: 3
                    },
                    {
                        label: 'Net Flow',
                        data: netData,
                        borderColor: chartColors.net,
                        backgroundColor: chartColors.net + '20',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 5,
                        pointBackgroundColor: chartColors.net,
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        borderWidth: 2,
                        borderDash: [6, 4]
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
                                size: 13,
                                family: "'Inter', sans-serif",
                                weight: '500'
                            },
                            boxWidth: 12,
                            boxHeight: 12
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        titleColor: '#2d3748',
                        bodyColor: '#4a5568',
                        borderColor: '#e2e8f0',
                        borderWidth: 1,
                        padding: 14,
                        cornerRadius: 10,
                        titleFont: { size: 14, weight: '600' },
                        bodyFont: { size: 13 },
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
                            font: { size: 12 }
                        },
                        grid: {
                            color: 'rgba(0,0,0,0.06)',
                            drawBorder: false
                        }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { 
                            font: { size: 12 },
                            color: '#4a5568'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
        
        console.log('✅ Cash Flow Chart created!');
    } catch (error) {
        console.error('❌ Cash flow chart error:', error);
    }
}

// ============================================
// SPENDING CHART
// ============================================

function createSpendingChart() {
    console.log('📊 Creating Spending Chart...');
    
    const canvas = document.getElementById('spendingChart');
    if (!canvas) {
        console.error('❌ Spending chart canvas not found!');
        return;
    }
    
    if (spendingChart) {
        spendingChart.destroy();
        spendingChart = null;
    }

    const ctx = canvas.getContext('2d');

    try {
        spendingChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Housing', 'Food & Dining', 'Transport', 'Shopping', 'Other'],
                datasets: [{
                    data: [2100, 940, 520, 680, 410],  // ✅ CORRECT DATA
                    backgroundColor: [
                        chartColors.housing,
                        chartColors.food,
                        chartColors.transport,
                        chartColors.shopping,
                        chartColors.other
                    ],
                    borderWidth: 3,
                    borderColor: '#ffffff',
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '68%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            usePointStyle: true,
                            padding: 16,
                            font: {
                                size: 13,
                                family: "'Inter', sans-serif"
                            },
                            boxWidth: 12,
                            boxHeight: 12
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        titleColor: '#2d3748',
                        bodyColor: '#4a5568',
                        borderColor: '#e2e8f0',
                        borderWidth: 1,
                        padding: 14,
                        cornerRadius: 10,
                        titleFont: { size: 14, weight: '600' },
                        bodyFont: { size: 13 },
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.raw / total) * 100).toFixed(1);
                                return context.label + ': ₹' + context.raw + ' (' + percentage + '%)';
                            }
                        }
                    }
                }
            }
        });
        
        console.log('✅ Spending Chart created!');
        console.log('📊 Spending data:', [2100, 940, 520, 680, 410]);
    } catch (error) {
        console.error('❌ Spending chart error:', error);
    }
}

// ============================================
// INITIALIZE CHARTS
// ============================================

function initDashboardCharts() {
    console.log('📊 Initializing dashboard charts...');

    if (typeof Chart === 'undefined') {
        console.log('⏳ Waiting for Chart.js...');
        setTimeout(initDashboardCharts, 500);
        return;
    }

    console.log('✅ Chart.js loaded (version:', Chart.version + ')');
    createCashFlowChart();
    createSpendingChart();
    
    console.log('✅ Dashboard charts initialized!');
}

// ============================================
// AUTO-INITIALIZE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM loaded');
    if (document.getElementById('cashFlowChart') || document.getElementById('spendingChart')) {
        console.log('✅ Dashboard detected, initializing charts...');
        setTimeout(initDashboardCharts, 300);
    }
});