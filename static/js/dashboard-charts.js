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

    // ============================================
    // GET DATA FROM FLASK
    // ============================================

    const cashflowElement = document.getElementById('cashflow-data');

    const data = cashflowElement
        ? JSON.parse(cashflowElement.textContent)
        : [];

    if (data.length === 0) {
        console.log('ℹ️ No cash flow data available.');
        return;
    }

    // ============================================
    // CREATE CHART LABELS
    // ============================================

    const labels = data.map(item => {

        const [year, month] = item.month.split('-');

        const date = new Date(year, month - 1);

        return date.toLocaleString('en-US', {
            month: 'short'
        });

    });

    // ============================================
    // GET INCOME VALUES
    // ============================================

    const incomeData = data.map(item =>
        Number(item.income)
    );

    // ============================================
    // GET EXPENSE VALUES
    // ============================================

    const expenseData = data.map(item =>
        Number(item.expenses)
    );

    // ============================================
    // CALCULATE NET FLOW
    // ============================================

    const netData = incomeData.map((income, index) =>
        income - expenseData[index]
    );


    try {

        cashFlowChart = new Chart(ctx, {

            type: 'line',

            data: {

                labels: labels,

                datasets: [

                    // ============================================
                    // INCOME
                    // ============================================

                    {
                        label: 'Income',

                        data: incomeData,

                        borderColor: chartColors.income,

                        backgroundColor:
                            chartColors.income + '20',

                        fill: true,

                        tension: 0.4,

                        pointRadius: 5,

                        pointBackgroundColor:
                            chartColors.income,

                        pointBorderColor: '#fff',

                        pointBorderWidth: 2,

                        borderWidth: 3
                    },


                    // ============================================
                    // EXPENSES
                    // ============================================

                    {
                        label: 'Expenses',

                        data: expenseData,

                        borderColor: chartColors.expense,

                        backgroundColor:
                            chartColors.expense + '20',

                        fill: true,

                        tension: 0.4,

                        pointRadius: 5,

                        pointBackgroundColor:
                            chartColors.expense,

                        pointBorderColor: '#fff',

                        pointBorderWidth: 2,

                        borderWidth: 3
                    },


                    // ============================================
                    // NET FLOW
                    // ============================================

                    {
                        label: 'Net Flow',

                        data: netData,

                        borderColor: chartColors.net,

                        backgroundColor:
                            chartColors.net + '20',

                        fill: true,

                        tension: 0.4,

                        pointRadius: 5,

                        pointBackgroundColor:
                            chartColors.net,

                        pointBorderColor: '#fff',

                        pointBorderWidth: 2,

                        borderWidth: 2,

                        borderDash: [6, 4]
                    }

                ]

            },


            // ============================================
            // CHART OPTIONS
            // ============================================

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

                        backgroundColor:
                            'rgba(255,255,255,0.95)',

                        titleColor: '#2d3748',

                        bodyColor: '#4a5568',

                        borderColor: '#e2e8f0',

                        borderWidth: 1,

                        padding: 14,

                        cornerRadius: 10,

                        titleFont: {
                            size: 14,
                            weight: '600'
                        },

                        bodyFont: {
                            size: 13
                        },

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


                // ============================================
                // SCALES
                // ============================================

                scales: {

                    y: {

                        beginAtZero: true,

                        ticks: {

                            callback: function(value) {

                                return '₹' +
                                    Number(value)
                                        .toLocaleString('en-IN');

                            },

                            font: {
                                size: 12
                            }

                        },

                        grid: {

                            color:
                                'rgba(0,0,0,0.06)',

                            drawBorder: false

                        }

                    },


                    x: {

                        grid: {
                            display: false
                        },

                        ticks: {

                            font: {
                                size: 12
                            },

                            color: '#4a5568'

                        }

                    }

                },


                // ============================================
                // INTERACTION
                // ============================================

                interaction: {

                    intersect: false,

                    mode: 'index'

                }

            }

        });


        console.log(
            '✅ Cash Flow Chart created using database data!'
        );

    } catch (error) {

        console.error(
            '❌ Cash flow chart error:',
            error
        );

    }

}
// ============================================
// CASH FLOW PERIOD FILTER
// ============================================

const cashFlowPeriod = document.getElementById('cashFlowPeriod');

if (cashFlowPeriod) {

    cashFlowPeriod.addEventListener('change', function () {

        const months = Number(this.value);

        const cashflowElement =
            document.getElementById('cashflow-data');

        if (!cashflowElement) {
            console.error('❌ Cash flow data not found!');
            return;
        }

        const data =
            JSON.parse(cashflowElement.textContent);

        // Take the selected number of months
        const filteredData =
            data.slice(-months);

        if (filteredData.length === 0) {
            console.log('ℹ️ No data for selected period.');
            return;
        }

        // Create labels
        const labels = filteredData.map(item => {

            const [year, month] =
                item.month.split('-');

            const date =
                new Date(year, month - 1);

            return date.toLocaleString('en-US', {
                month: 'short'
            });

        });

        // Income
        const incomeData =
            filteredData.map(item =>
                Number(item.income)
            );

        // Expenses
        const expenseData =
            filteredData.map(item =>
                Number(item.expenses)
            );

        // Net flow
        const netData =
            incomeData.map((income, index) =>
                income - expenseData[index]
            );


        // Destroy old chart
        if (cashFlowChart) {
            cashFlowChart.destroy();
        }


        // Create new chart
        const canvas =
            document.getElementById('cashFlowChart');

        const ctx =
            canvas.getContext('2d');


        cashFlowChart = new Chart(ctx, {

            type: 'line',

            data: {

                labels: labels,

                datasets: [

                    {
                        label: 'Income',

                        data: incomeData,

                        borderColor:
                            chartColors.income,

                        backgroundColor:
                            chartColors.income + '20',

                        fill: true,

                        tension: 0.4,

                        pointRadius: 5,

                        pointBackgroundColor:
                            chartColors.income,

                        pointBorderColor: '#fff',

                        pointBorderWidth: 2,

                        borderWidth: 3
                    },


                    {
                        label: 'Expenses',

                        data: expenseData,

                        borderColor:
                            chartColors.expense,

                        backgroundColor:
                            chartColors.expense + '20',

                        fill: true,

                        tension: 0.4,

                        pointRadius: 5,

                        pointBackgroundColor:
                            chartColors.expense,

                        pointBorderColor: '#fff',

                        pointBorderWidth: 2,

                        borderWidth: 3
                    },


                    {
                        label: 'Net Flow',

                        data: netData,

                        borderColor:
                            chartColors.net,

                        backgroundColor:
                            chartColors.net + '20',

                        fill: true,

                        tension: 0.4,

                        pointRadius: 5,

                        pointBackgroundColor:
                            chartColors.net,

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
                        position: 'top'
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

                    },

                    x: {

                        grid: {
                            display: false
                        }

                    }

                },

                interaction: {

                    intersect: false,

                    mode: 'index'

                }

            }

        });

    });

}
// ============================================
// SPENDING CHART
// ============================================
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

    // Get spending data from Flask
    const spendingElement = document.getElementById('spending-data');

    const data = spendingElement
    ? JSON.parse(spendingElement.textContent)
    : [];

    if (data.length === 0) {
        console.log('ℹ️ No spending data available.');
        return;
    }

    // Category names
    const labels = data.map(item => item.category);

    // Category amounts
    const values = data.map(item => Number(item.total));

    try {

        spendingChart = new Chart(ctx, {

            type: 'doughnut',

            data: {

                labels: labels,

                datasets: [
                    {
                        data: values,

                        backgroundColor: [
                            '#6366F1',
                            '#22C55E',
                            '#F59E0B',
                            '#EF4444',
                            '#06B6D4',
                            '#8B5CF6',
                            '#EC4899',
                            '#14B8A6'
                        ],

                        borderWidth: 2,
                        borderColor: '#ffffff'
                    }
                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                cutout: '65%',

                plugins: {

                    legend: {
                        display: false
                    },

                    tooltip: {

                        callbacks: {

                            label: function(context) {

                                return (
                                    context.label +
                                    ': ₹' +
                                    Number(context.raw)
                                        .toLocaleString('en-IN')
                                );

                            }

                        }

                    }

                }

            }

        });

        console.log(
            '✅ Spending Chart created using database data!'
        );

    } catch (error) {

        console.error(
            '❌ Spending chart error:',
            error
        );

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