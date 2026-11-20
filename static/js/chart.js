
/* ==================================================
   MONEYLENS - ANALYTICS CHARTS
   Purpose: Create and manage Analytics page charts
   Requires: Chart.js
================================================== */

(() => {
    "use strict";

    console.log("📊 MoneyLens Analytics Charts loaded!");

    // -----------------------------------------------
    // 1. THEME COLORS
    // -----------------------------------------------

    function getChartTheme() {
        const isDark =
            document.body.dataset.theme === "dark" ||
            document.body.classList.contains("dark-theme");

        return {
            text: isDark ? "#A7B4C7" : "#64748B",
            heading: isDark ? "#F0F4FA" : "#1E293B",
            grid: isDark
                ? "rgba(167, 180, 199, 0.12)"
                : "rgba(100, 116, 139, 0.12)",
            tooltipBackground: isDark ? "#202E43" : "#FFFFFF",
            tooltipText: isDark ? "#F0F4FA" : "#1E293B",
            border: isDark ? "#172235" : "#FFFFFF",

            income: "#42B883",
            expense: "#E47D83",
            net: "#8BA8D8",

            categories: [
                "#42B883",
                "#8BA8D8",
                "#E6AD62",
                "#E47D83",
                "#9B8AD8",
                "#65B6C8",
                "#A7B4C7",
                "#D49A75"
            ]
        };
    }


    // -----------------------------------------------
    // 2. READ DATA FROM FLASK
    // -----------------------------------------------

    function readChartData(elementId) {
        const element = document.getElementById(elementId);

        if (!element) {
            console.warn(`Chart data element not found: ${elementId}`);
            return null;
        }

        try {
            return JSON.parse(element.textContent);
        } catch (error) {
            console.error(`Invalid JSON in ${elementId}:`, error);
            return null;
        }
    }


    // -----------------------------------------------
    // 3. DATA HELPERS
    // -----------------------------------------------

    function findArray(data, possibleKeys) {
        if (!data || typeof data !== "object") {
            return [];
        }

        for (const key of possibleKeys) {
            if (Array.isArray(data[key])) {
                return data[key];
            }
        }

        return [];
    }


    function findValue(object, possibleKeys) {
        if (!object || typeof object !== "object") {
            return undefined;
        }

        for (const key of possibleKeys) {
            if (object[key] !== undefined && object[key] !== null) {
                return object[key];
            }
        }

        return undefined;
    }


    function toNumber(value) {
        const number = Number(value);
        return Number.isFinite(number) ? number : 0;
    }


    function getLabels(data, possibleKeys) {
        const labels = findArray(data, possibleKeys);

        return labels.map(label => {
            if (typeof label === "object" && label !== null) {
                return String(
                    findValue(label, ["label", "month", "date", "name"]) ?? ""
                );
            }

            return String(label);
        });
    }


    // -----------------------------------------------
    // 4. NORMALIZE MONTHLY DATA
    // -----------------------------------------------

    function normalizeMonthlyData(data) {
        if (!data) {
            return { labels: [], income: [], expenses: [], net: [] };
        }

        // Format 1: Array of objects
        // Example:
        // [{ month: "Jan", income: 5000, expenses: 2000 }]

        if (Array.isArray(data)) {
            return {
                labels: data.map(item =>
                    String(findValue(item, ["month", "label", "date", "name"]) ?? "")
                ),

                income: data.map(item =>
                    toNumber(findValue(item, ["income", "total_income"]))
                ),

                expenses: data.map(item =>
                    toNumber(findValue(item, ["expenses", "expense", "total_expenses"]))
                ),

                net: data.map(item =>
                    toNumber(findValue(item, ["net", "savings", "balance"]))
                )
            };
        }

        // Format 2: Object containing arrays
        // Example:
        // { labels: [], income: [], expenses: [] }

        const labels = getLabels(data, [
            "labels", "months", "dates", "categories"
        ]);

        return {
            labels,

            income: findArray(data, [
                "income", "incomes", "total_income"
            ]).map(toNumber),

            expenses: findArray(data, [
                "expenses", "expense", "total_expenses"
            ]).map(toNumber),

            net: findArray(data, [
                "net", "savings", "balance"
            ]).map(toNumber)
        };
    }


    // -----------------------------------------------
    // 5. NORMALIZE CATEGORY / SOURCE DATA
    // -----------------------------------------------

    function normalizeBreakdownData(data, labelKeys, valueKeys) {
        if (!data) {
            return { labels: [], values: [] };
        }

        // Format 1: Array of objects
        // Example:
        // [{ category: "Food", amount: 2500 }]

        if (Array.isArray(data)) {
            return {
                labels: data.map(item =>
                    String(findValue(item, labelKeys) ?? "")
                ),

                values: data.map(item =>
                    toNumber(findValue(item, valueKeys))
                )
            };
        }

        // Format 2: Object containing label and value arrays

        const labels = getLabels(data, [
            "labels", "categories", "sources", "names"
        ]);

        const values = findArray(data, [
            "values", "amounts", "totals", "spending", "income"
        ]);

        if (labels.length && values.length) {
            return {
                labels,
                values: values.map(toNumber)
            };
        }

        // Format 3: Simple object
        // Example:
        // { Food: 2500, Transport: 1000 }

        const entries = Object.entries(data).filter(
            ([, value]) =>
                typeof value === "number" ||
                (typeof value === "string" && value.trim() !== "")
        );

        return {
            labels: entries.map(([key]) => key),
            values: entries.map(([, value]) => toNumber(value))
        };
    }


    // -----------------------------------------------
    // 6. COMMON CHART OPTIONS
    // -----------------------------------------------

    function getAxisOptions(theme) {
        return {
            x: {
                ticks: {
                    color: theme.text
                },
                grid: {
                    display: false
                },
                border: {
                    display: false
                }
            },

            y: {
                beginAtZero: true,
                ticks: {
                    color: theme.text,
                    callback: value => "₹" + Number(value).toLocaleString("en-IN")
                },
                grid: {
                    color: theme.grid
                },
                border: {
                    display: false
                }
            }
        };
    }


    function getTooltipOptions(theme) {
        return {
            backgroundColor: theme.tooltipBackground,
            titleColor: theme.tooltipText,
            bodyColor: theme.tooltipText,
            borderColor: theme.grid,
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            displayColors: true
        };
    }


    function getLegendOptions(theme) {
        return {
            position: "bottom",
            labels: {
                color: theme.text,
                usePointStyle: true,
                pointStyle: "circle",
                padding: 20,
                boxWidth: 8
            }
        };
    }


    // -----------------------------------------------
    // 7. INCOME VS EXPENSE CHART
    // -----------------------------------------------

    function createIncomeExpenseChart(theme) {
        const canvas = document.getElementById("incomeExpenseChart");

        if (!canvas) return;

        const rawData = readChartData("monthly-data");
        const data = normalizeMonthlyData(rawData);

        if (!data.labels.length) {
            console.warn("No monthly data available for Income vs Expense chart.");
            return;
        }

        const datasets = [
            {
                label: "Income",
                data: data.income,
                borderColor: theme.income,
                backgroundColor: "rgba(66, 184, 131, 0.10)",
                borderWidth: 2.5,
                pointRadius: 3,
                pointHoverRadius: 5,
                pointBackgroundColor: theme.income,
                tension: 0.35,
                fill: true
            },
            {
                label: "Expenses",
                data: data.expenses,
                borderColor: theme.expense,
                backgroundColor: "rgba(228, 125, 131, 0.08)",
                borderWidth: 2.5,
                pointRadius: 3,
                pointHoverRadius: 5,
                pointBackgroundColor: theme.expense,
                tension: 0.35,
                fill: true
            }
        ];

        if (data.net.length) {
            datasets.push({
                label: "Net Savings",
                data: data.net,
                borderColor: theme.net,
                backgroundColor: "transparent",
                borderWidth: 2,
                pointRadius: 2,
                tension: 0.35,
                borderDash: [5, 4]
            });
        }

        new Chart(canvas, {
            type: "line",

            data: {
                labels: data.labels,
                datasets
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                interaction: {
                    intersect: false,
                    mode: "index"
                },

                plugins: {
                    legend: getLegendOptions(theme),
                    tooltip: getTooltipOptions(theme)
                },

                scales: getAxisOptions(theme)
            }
        });
    }


    // -----------------------------------------------
    // 8. SPENDING BREAKDOWN CHART
    // -----------------------------------------------

    function createSpendingBreakdownChart(theme) {
        const canvas = document.getElementById("spendingBreakdownChart");

        if (!canvas) return;

        const rawData = readChartData("category-spending-data");

        const data = normalizeBreakdownData(
            rawData,
            ["category", "name", "label"],
            ["amount", "total", "value", "spending"]
        );

        if (!data.labels.length) {
            console.warn("No category data available for Spending Breakdown chart.");
            return;
        }

        new Chart(canvas, {
            type: "doughnut",

            data: {
                labels: data.labels,

                datasets: [{
                    data: data.values,
                    backgroundColor: theme.categories,
                    borderColor: theme.border,
                    borderWidth: 3,
                    hoverOffset: 6
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "68%",

                plugins: {
                    legend: getLegendOptions(theme),
                    tooltip: getTooltipOptions(theme)
                }
            }
        });
    }


    // -----------------------------------------------
    // 9. INCOME SOURCES CHART
    // -----------------------------------------------

    function createIncomeSourcesChart(theme) {
        const canvas = document.getElementById("incomeSourcesChart");

        if (!canvas) return;

        const rawData = readChartData("income-sources-data");

        const data = normalizeBreakdownData(
            rawData,
            ["source", "name", "label", "category"],
            ["amount", "total", "value", "income"]
        );

        if (!data.labels.length) {
            console.warn("No income source data available.");
            return;
        }

        new Chart(canvas, {
            type: "doughnut",

            data: {
                labels: data.labels,

                datasets: [{
                    data: data.values,
                    backgroundColor: theme.categories,
                    borderColor: theme.border,
                    borderWidth: 3,
                    hoverOffset: 6
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "68%",

                plugins: {
                    legend: getLegendOptions(theme),
                    tooltip: getTooltipOptions(theme)
                }
            }
        });
    }


    // -----------------------------------------------
    // 10. MONTHLY SAVINGS CHART
    // -----------------------------------------------

    function createMonthlySavingsChart(theme) {
        const canvas = document.getElementById("monthlySavingsChart");

        if (!canvas) return;

        const rawData = readChartData("monthly-savings-data");

        let labels = [];
        let values = [];

        if (Array.isArray(rawData)) {
            labels = rawData.map(item =>
                String(findValue(item, ["month", "label", "date", "name"]) ?? "")
            );

            values = rawData.map(item =>
                toNumber(findValue(item, ["savings", "amount", "value", "balance"]))
            );

        } else if (rawData) {
            labels = getLabels(rawData, [
                "labels", "months", "dates"
            ]);

            values = findArray(rawData, [
                "savings", "amounts", "values", "balance"
            ]).map(toNumber);
        }

        if (!labels.length) {
            console.warn("No monthly savings data available.");
            return;
        }

        new Chart(canvas, {
            type: "bar",

            data: {
                labels,

                datasets: [{
                    label: "Savings",
                    data: values,
                    backgroundColor: "rgba(66, 184, 131, 0.75)",
                    borderColor: theme.income,
                    borderWidth: 1,
                    borderRadius: 5,
                    maxBarThickness: 42
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: getTooltipOptions(theme)
                },

                scales: getAxisOptions(theme)
            }
        });
    }


    // -----------------------------------------------
    // 11. INITIALIZE ANALYTICS CHARTS
    // -----------------------------------------------

    function initializeAnalyticsCharts() {
        const analyticsPage = document.getElementById("incomeExpenseChart");

        if (!analyticsPage) {
            return;
        }

        if (typeof Chart === "undefined") {
            console.error("Chart.js is not loaded. Check the Chart.js CDN script.");
            return;
        }

        const theme = getChartTheme();

        // Apply theme defaults
        Chart.defaults.color = theme.text;
        Chart.defaults.font.family = "'Inter', sans-serif";

        createIncomeExpenseChart(theme);
        createSpendingBreakdownChart(theme);
        createIncomeSourcesChart(theme);
        createMonthlySavingsChart(theme);

        console.log("✅ Analytics charts initialized!");
    }


    // -----------------------------------------------
    // 12. START
    // -----------------------------------------------

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeAnalyticsCharts
        );
    } else {
        initializeAnalyticsCharts();
    }

})();
