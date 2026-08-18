from flask import Flask, render_template, request, redirect, url_for, session, flash
from db import get_db_connection
from werkzeug.security import generate_password_hash,check_password_hash
import os
app = Flask(__name__)
app.secret_key =  os.getenv("SECRET_KEY")

# ==========================================
# Landing Page
# ==========================================

@app.route("/")
def index():
    return render_template("index.html")


# ==========================================
# Authentication
# ==========================================



@app.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":

        username = request.form["username"]
        password = request.form["password"]

        connection = get_db_connection()
        cursor = connection.cursor()

        # ============================================
        # GET USER + PASSWORD + THEME
        # ============================================

        query = """
        SELECT
            users.id,
            users.password,
            COALESCE(user_settings.theme, 'light')
        FROM users
        LEFT JOIN user_settings
            ON users.id = user_settings.user_id
        WHERE users.username = %s
        """

        cursor.execute(query, (username,))

        result = cursor.fetchone()

        # ============================================
        # CHECK USER
        # ============================================

        if result:

            if check_password_hash(result[1], password):

                # ====================================
                # CREATE LOGIN SESSION
                # ====================================

                session["user_id"] = result[0]

                # Save theme in session
                session["theme"] = result[2] or "light"

                cursor.close()
                connection.close()

                return redirect(url_for("dashboard"))

            else:

                cursor.close()
                connection.close()

                flash("Incorrect password", "error")
                return redirect(url_for("login"))

        else:

            cursor.close()
            connection.close()

            flash("User not found", "error")
            return redirect(url_for("login"))

    return render_template("login.html")

@app.route("/register", methods=["GET", "POST"])
def register():

    if request.method == "POST":

        fullname = request.form["fullname"]
        username = request.form["username"]
        email = request.form["email"]
        password = request.form["password"]
        confirm_password = request.form["confirm_password"]

        if password != confirm_password:
            return "Passwords do not match"

        hashed_password = generate_password_hash(password)

        connection = get_db_connection()
        cursor = connection.cursor()

        query = """
            INSERT INTO users
            (fullname, username, email, password)
            VALUES (%s, %s, %s, %s)
        """

        values = (
            fullname,
            username,
            email,
            hashed_password
        )

        cursor.execute(query, values)

        connection.commit()
        # ============================================
# CREATE DEFAULT USER SETTINGS
# ============================================

        user_id = cursor.lastrowid

        settings_query = """
    INSERT INTO user_settings
    (
        user_id,
        currency,
        theme,
        date_format,
        language,
        email_notifications,
        budget_alerts,
        weekly_reports,
        ai_insights,
        marketing_updates
    )
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
"""

        cursor.execute(
        settings_query,
    (
        user_id,
        "INR",
        "light",
        "DD/MM/YYYY",
        "en",
        1,
        1,
        1,
        1,
        0
    )
)

        connection.commit()

        cursor.close()
        connection.close()

        return redirect(url_for("login"))

    return render_template("register.html")


@app.route("/forgot-password")
def forgot_password():
    return render_template("forgot-password.html")


@app.route("/logout")
def logout():
    session.clear()
    return render_template("login.html")


# ==========================================
# Dashboard
# ==========================================
@app.route("/dashboard")
def dashboard():

    if "user_id" not in session:
        return redirect(url_for("login"))

    user_id = session["user_id"]

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    # =========================
    # TOTAL INCOME
    # =========================

    income_query = """
    SELECT COALESCE(SUM(amount), 0) AS total_income
    FROM transactions
    WHERE user_id = %s
    AND type = 'income'
    """

    cursor.execute(income_query, (user_id,))

    total_income = cursor.fetchone()["total_income"]


    # =========================
    # TOTAL EXPENSES
    # =========================

    expense_query = """
    SELECT COALESCE(SUM(amount), 0) AS total_expenses
    FROM transactions
    WHERE user_id = %s
    AND type = 'expense'
    """

    cursor.execute(expense_query, (user_id,))

    total_expenses = cursor.fetchone()["total_expenses"]
    total_savings = total_income - total_expenses
    # =========================
    # LAST 5 TRANSACTIONS
    # =========================

    recent_query = """
    SELECT id,type, amount, category, description, transaction_date 
    FROM transactions
    WHERE user_id = %s
    ORDER BY transaction_date DESC, created_at DESC
    LIMIT 5
    """

    cursor.execute(recent_query,(user_id,))
    recent_transactions = cursor.fetchall()

    category_query = """
    SELECT category, SUM(amount) AS total
    FROM transactions
    WHERE user_id = %s
    AND type = 'expense'
    GROUP BY category
    ORDER BY total DESC
    """
    cursor.execute(category_query,(user_id,))
    category_spending = cursor.fetchall()

    cashflow_query = """
    SELECT 
        DATE_FORMAT(transaction_date , '%Y-%m') AS month,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expenses
    FROM transactions
    WHERE user_id = %s
    AND transaction_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
    GROUP BY DATE_FORMAT(transaction_date, '%Y-%m')
    ORDER BY month ASC
    """

    cursor.execute(cashflow_query, (user_id,))

    cashflow_data = cursor.fetchall()
    cashflow_data = [
    {
        "month": row["month"],
        "income": float(row["income"]),
        "expenses": float(row["expenses"])
    }
    for row in cashflow_data
    ]

    # =========================
    # MONTHLY SPENDING BY CATEGORY
    # =========================
    spending_query = """
    SELECT
    category,
    SUM(amount) AS total
    FROM transactions
    WHERE user_id = %s
    AND type = 'expense'
    AND MONTH(transaction_date) = MONTH(CURDATE())
    AND YEAR(transaction_date) = YEAR(CURDATE())
    GROUP BY category
    ORDER BY total DESC
    """

    cursor.execute(spending_query, (user_id,))

    spending_rows = cursor.fetchall()
    spending_data = [
        {
            "category": row["category"],
            "total": float(row["total"])
        }
        for row in spending_rows
    ]
    
    # Close database
    cursor.close()
    connection.close()


    return render_template(
        "dashboard/dashboard.html",
        total_income=total_income,
        total_expenses=total_expenses,
        total_savings=total_savings,
        recent_transactions=recent_transactions,
        category_spending = category_spending,
        cashflow_data=cashflow_data,
        spending_data=spending_data
    )
# ==========================================
# Dashboard Pages
# ==========================================

@app.route("/dashboard/transactions", methods=["GET", "POST"])
def transactions():

    if "user_id" not in session:
        return redirect(url_for("login"))

    user_id = session["user_id"]

    if request.method == "POST":

        transaction_type = request.form["transaction_type"]
        amount = request.form["amount"]
        date = request.form["date"]
        description = request.form["description"]
        category = request.form["category"]

        connection = get_db_connection()
        cursor = connection.cursor()

        query = """
        INSERT INTO transactions
        (user_id, type, amount, category, description, transaction_date)
        VALUES (%s, %s, %s, %s, %s, %s)
        """

        values = (
            user_id,
            transaction_type,
            amount,
            category,
            description,
            date
        )

        cursor.execute(query, values)
        connection.commit()

        cursor.close()
        connection.close()

        return redirect(url_for("transactions"))

    # Get transactions from database
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
    SELECT id, type, amount, category, description, transaction_date
    FROM transactions
    WHERE user_id = %s
    ORDER BY transaction_date DESC, created_at DESC
    """

    cursor.execute(query, (user_id,))

    transactions = cursor.fetchall()

    # Get totals
    stats_cursor = connection.cursor()

    income_query = """
    SELECT COALESCE(SUM(amount), 0)
    FROM transactions
    WHERE user_id = %s AND type = 'income'
    """

    stats_cursor.execute(income_query, (user_id,))
    total_income = stats_cursor.fetchone()[0]


    expense_query = """
    SELECT COALESCE(SUM(amount), 0)
    FROM transactions
    WHERE user_id = %s AND type = 'expense'
    """

    stats_cursor.execute(expense_query, (user_id,))
    total_expenses = stats_cursor.fetchone()[0]


    net_balance = total_income - total_expenses

    stats_cursor.close()

    cursor.close()
    connection.close()

    return render_template(
    "dashboard/transactions.html",
    transactions=transactions,
    total_income=total_income,
    total_expenses=total_expenses,
    net_balance=net_balance
    )
@app.route("/dashboard/transactions/delete/<int:transaction_id>", methods=["POST"])
def delete_transaction(transaction_id):

    if "user_id" not in session:
        return redirect(url_for("login"))

    user_id = session["user_id"]

    connection = get_db_connection()
    cursor = connection.cursor()

    query = """
    DELETE FROM transactions
    WHERE id = %s AND user_id = %s
    """

    cursor.execute(query, (transaction_id, user_id))
    connection.commit()

    print("Rows deleted:", cursor.rowcount)

    cursor.close()
    connection.close()

    return redirect(url_for("transactions"))

@app.route("/dashboard/transactions/edit/<int:transaction_id>", methods=["POST"])
def edit_transaction(transaction_id):

    if "user_id" not in session:
        return redirect(url_for("login"))

    user_id = session["user_id"]

    transaction_type = request.form["transaction_type"]
    amount = request.form["amount"]
    date = request.form["date"]
    description = request.form["description"]
    category = request.form["category"]

    connection = get_db_connection()
    cursor = connection.cursor()

    query = """
    UPDATE transactions
    SET type = %s,
        amount = %s,
        category = %s,
        description = %s,
        transaction_date = %s
    WHERE id = %s AND user_id = %s
    """

    values = (
        transaction_type,
        amount,
        category,
        description,
        date,
        transaction_id,
        user_id
    )

    cursor.execute(query, values)
    connection.commit()

    cursor.close()
    connection.close()

    return redirect(url_for("transactions"))

@app.route("/dashboard/analytics")
def analytics():

    if "user_id" not in session:
        return redirect(url_for("login"))

    user_id = session["user_id"]

    # ============================================
    # GET SELECTED PERIOD
    # ============================================

    period = request.args.get("period", "6m")

    period_months = {
        "3m": 3,
        "6m": 6,
        "1y": 12
    }

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    # ============================================
    # PERIOD CONDITIONS
    # ============================================

    if period == "all":

        current_condition = ""
        previous_condition = ""

    else:

        months = period_months.get(period, 6)

        current_condition = f"""
            AND transaction_date >=
            DATE_SUB(CURDATE(), INTERVAL {months} MONTH)
        """

        previous_condition = f"""
            AND transaction_date >=
            DATE_SUB(CURDATE(), INTERVAL {months * 2} MONTH)

            AND transaction_date <
            DATE_SUB(CURDATE(), INTERVAL {months} MONTH)
        """

    # ============================================
    # CURRENT PERIOD - INCOME
    # ============================================

    income_query = f"""
        SELECT COALESCE(SUM(amount), 0) AS total_income
        FROM transactions
        WHERE user_id = %s
        AND type = 'income'
        {current_condition}
    """

    cursor.execute(income_query, (user_id,))

    total_income = cursor.fetchone()["total_income"]

    # ============================================
    # CURRENT PERIOD - EXPENSES
    # ============================================

    expense_query = f"""
        SELECT COALESCE(SUM(amount), 0) AS total_expenses
        FROM transactions
        WHERE user_id = %s
        AND type = 'expense'
        {current_condition}
    """

    cursor.execute(expense_query, (user_id,))

    total_expenses = cursor.fetchone()["total_expenses"]

    # ============================================
    # CURRENT PERIOD - SAVINGS
    # ============================================

    total_savings = total_income - total_expenses

    if total_income > 0:

        savings_rate = (
            float(total_savings) /
            float(total_income)
        ) * 100

    else:

        savings_rate = 0

    # ============================================
    # PREVIOUS PERIOD
    # ============================================

    if period == "all":

        previous_income = 0
        previous_expenses = 0
        previous_savings = 0
        previous_savings_rate = 0

    else:

        # Previous income

        previous_income_query = f"""
            SELECT COALESCE(SUM(amount), 0) AS total_income
            FROM transactions
            WHERE user_id = %s
            AND type = 'income'
            {previous_condition}
        """

        cursor.execute(
            previous_income_query,
            (user_id,)
        )

        previous_income = cursor.fetchone()["total_income"]

        # Previous expenses

        previous_expense_query = f"""
            SELECT COALESCE(SUM(amount), 0) AS total_expenses
            FROM transactions
            WHERE user_id = %s
            AND type = 'expense'
            {previous_condition}
        """

        cursor.execute(
            previous_expense_query,
            (user_id,)
        )

        previous_expenses = cursor.fetchone()["total_expenses"]

        # Previous savings

        previous_savings = (
            previous_income -
            previous_expenses
        )

        # Previous savings rate

        if previous_income > 0:

            previous_savings_rate = (
                float(previous_savings) /
                float(previous_income)
            ) * 100

        else:

            previous_savings_rate = 0

    # ============================================
    # PERCENTAGE CHANGE FUNCTION
    # ============================================

    def percentage_change(current, previous):

        current = float(current)
        previous = float(previous)

        if previous == 0:

            if current == 0:
                return 0

            return 100

        return (
            (current - previous) /
            previous
        ) * 100

    # ============================================
    # CALCULATE CHANGES
    # ============================================

    income_change = percentage_change(
        total_income,
        previous_income
    )

    expense_change = percentage_change(
        total_expenses,
        previous_expenses
    )

    savings_change = percentage_change(
        total_savings,
        previous_savings
    )

    savings_rate_change = percentage_change(
        savings_rate,
        previous_savings_rate
    )

    # ============================================
    # SPENDING BY CATEGORY
    # ============================================

    category_query = f"""
        SELECT
            category,
            COALESCE(SUM(amount), 0) AS total
        FROM transactions
        WHERE user_id = %s
        AND type = 'expense'
        {current_condition}
        GROUP BY category
        ORDER BY total DESC
    """

    cursor.execute(
        category_query,
        (user_id,)
    )

    category_spending = cursor.fetchall()

    # ============================================
    # CATEGORY PERCENTAGES
    # ============================================

    for item in category_spending:

        if total_expenses > 0:

            item["percentage"] = (
                float(item["total"]) /
                float(total_expenses)
            ) * 100

        else:

            item["percentage"] = 0

    # ============================================
    # MONTHLY INCOME & EXPENSES
    # ============================================

    monthly_query = """
        SELECT
            DATE_FORMAT(transaction_date, '%Y-%m') AS month,
            SUM(
                CASE
                    WHEN type = 'income'
                    THEN amount
                    ELSE 0
                END
            ) AS income,
            SUM(
                CASE
                    WHEN type = 'expense'
                    THEN amount
                    ELSE 0
                END
            ) AS expenses
        FROM transactions
        WHERE user_id = %s
        GROUP BY DATE_FORMAT(transaction_date, '%Y-%m')
        ORDER BY month ASC
    """

    cursor.execute(
        monthly_query,
        (user_id,)
    )

    monthly_data = cursor.fetchall()
    # ============================================
# MONTHLY SAVINGS
# ============================================

    monthly_savings_data = []

    for item in monthly_data:

        income = float(item["income"] or 0)
        expenses = float(item["expenses"] or 0)

        savings = income - expenses

        monthly_savings_data.append({
        "month": item["month"],
        "savings": savings
    })

    # ============================================
# INCOME BY SOURCE
# ============================================

    income_source_query = f"""
    SELECT
        category,
        COALESCE(SUM(amount), 0) AS total
    FROM transactions
    WHERE user_id = %s
    AND type = 'income'
    {current_condition}
    GROUP BY category
    ORDER BY total DESC
    """

    cursor.execute(
    income_source_query,
    (user_id,)
)

    income_sources = cursor.fetchall()

    # ============================================
    # CLOSE DATABASE
    # ============================================

    cursor.close()
    connection.close()

    # ============================================
    # RENDER ANALYTICS PAGE
    # ============================================

    return render_template(
        "dashboard/analytics.html",

        total_income=total_income,
        total_expenses=total_expenses,
        total_savings=total_savings,
        savings_rate=savings_rate,

        income_change=income_change,
        expense_change=expense_change,
        savings_change=savings_change,
        savings_rate_change=savings_rate_change,

        category_spending=category_spending,

        monthly_data=monthly_data,
        monthly_savings_data=monthly_savings_data,

        selected_period=period,
        income_sources=income_sources
    )

@app.route("/dashboard/budgets" , methods = ["GET","POST"])
def budgets():
    if request.method == "POST":

        category = request.form["category"]
        amount = request.form["amount"]
        start_date = request.form["start_date"]
        end_date = request.form["end_date"]

        connection = get_db_connection()
        cursor = connection.cursor()

        insert_query = """
        INSERT INTO budgets
        (user_id, category, amount, start_date, end_date)
        VALUES (%s, %s, %s, %s, %s)
         """

        cursor.execute(
        insert_query,
        (
            session["user_id"],
            category,
            amount,
            start_date,
            end_date
        )
        )

        connection.commit()

        cursor.close()
        connection.close()

        return redirect(url_for("budgets"))

    if "user_id" not in session:
        return redirect(url_for("login"))

    user_id = session["user_id"]

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    # ============================================
    # GET USER BUDGETS
    # ============================================

    budget_query = """
        SELECT
            id,
            category,
            amount,
            start_date,
            end_date
        FROM budgets
        WHERE user_id = %s
        ORDER BY start_date DESC, id DESC
    """

    cursor.execute(budget_query, (user_id,))

    budgets = cursor.fetchall()

    # ============================================
    # CALCULATE SPENDING FOR EACH BUDGET
    # ============================================

    total_budget = 0
    total_spent = 0

    for budget in budgets:

        budget_amount = float(budget["amount"])

        # ----------------------------------------
        # Get spending for this category
        # during the budget period
        # ----------------------------------------

        spent_query = """
            SELECT COALESCE(SUM(amount), 0) AS spent
            FROM transactions
            WHERE user_id = %s
            AND category = %s
            AND type = 'expense'
            AND transaction_date BETWEEN %s AND %s
        """

        cursor.execute(
            spent_query,
            (
                user_id,
                budget["category"],
                budget["start_date"],
                budget["end_date"]
            )
        )

        result = cursor.fetchone()

        spent = float(result["spent"] or 0)

        # ----------------------------------------
        # Calculate remaining
        # ----------------------------------------

        remaining = budget_amount - spent

        # ----------------------------------------
        # Calculate percentage
        # ----------------------------------------

        if budget_amount > 0:
            percentage = (spent / budget_amount) * 100
        else:
            percentage = 0

        if percentage > 100:
            progress = 100
        else:
            progress = percentage

        # ----------------------------------------
        # Add calculated values
        # ----------------------------------------

        budget["budget_amount"] = budget_amount
        budget["spent"] = spent
        budget["remaining"] = remaining
        budget["percentage"] = percentage
        budget["progress"] = progress

        # ----------------------------------------
        # Totals
        # ----------------------------------------

        total_budget += budget_amount
        total_spent += spent

    # ============================================
    # TOTAL REMAINING
    # ============================================

    total_remaining = total_budget - total_spent

    # ============================================
    # CLOSE DATABASE
    # ============================================

    cursor.close()
    connection.close()

    # ============================================
    # RENDER PAGE
    # ============================================

    return render_template(
        "dashboard/budgets.html",

        budgets=budgets,

        total_budget=total_budget,
        total_spent=total_spent,
        total_remaining=total_remaining
    )

@app.route("/dashboard/budgets/delete/<int:budget_id>", methods=["POST"])
def delete_budget(budget_id):

    if "user_id" not in session:
        return redirect(url_for("login"))

    user_id = session["user_id"]

    connection = get_db_connection()
    cursor = connection.cursor()

    delete_query = """
        DELETE FROM budgets
        WHERE id = %s
        AND user_id = %s
    """

    cursor.execute(
        delete_query,
        (budget_id, user_id)
    )

    connection.commit()

    cursor.close()
    connection.close()

    return redirect(url_for("budgets"))

@app.route("/dashboard/budgets/edit/<int:budget_id>", methods=["POST"])
def edit_budget(budget_id):

    if "user_id" not in session:
        return redirect(url_for("login"))

    user_id = session["user_id"]

    category = request.form["category"]
    amount = request.form["amount"]
    start_date = request.form["start_date"]
    end_date = request.form["end_date"]

    connection = get_db_connection()
    cursor = connection.cursor()

    update_query = """
        UPDATE budgets
        SET category = %s,
            amount = %s,
            start_date = %s,
            end_date = %s
        WHERE id = %s
        AND user_id = %s
    """

    cursor.execute(
        update_query,
        (
            category,
            amount,
            start_date,
            end_date,
            budget_id,
            user_id
        )
    )

    connection.commit()

    cursor.close()
    connection.close()

    return redirect(url_for("budgets"))

@app.route("/dashboard/budgets/<int:budget_id>")
def get_budget(budget_id):

    if "user_id" not in session:
        return {"error": "Unauthorized"}, 401

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT
            id,
            category,
            amount,
            start_date,
            end_date
        FROM budgets
        WHERE id = %s
        AND user_id = %s
    """

    cursor.execute(
        query,
        (budget_id, session["user_id"])
    )

    budget = cursor.fetchone()

    cursor.close()
    connection.close()

    if not budget:
        return {"error": "Budget not found"}, 404

    # Convert dates so JavaScript can use them
    budget["start_date"] = str(budget["start_date"])
    budget["end_date"] = str(budget["end_date"])

    return budget

@app.route("/dashboard/profile", methods=["GET", "POST"])
def profile():

    # ============================================
    # CHECK LOGIN
    # ============================================

    if "user_id" not in session:
        return redirect(url_for("login"))

    user_id = session["user_id"]

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    # ============================================
    # UPDATE PROFILE
    # ============================================

    if request.method == "POST":

        fullname = request.form["fullname"]
        username = request.form["username"]
        email = request.form["email"]

        update_query = """
            UPDATE users
            SET fullname = %s,
                username = %s,
                email = %s
            WHERE id = %s
        """

        cursor.execute(
            update_query,
            (
                fullname,
                username,
                email,
                user_id
            )
        )

        connection.commit()

        cursor.close()
        connection.close()

        return redirect(url_for("profile"))

    # ============================================
    # GET USER INFORMATION
    # ============================================

    user_query = """
        SELECT
            id,
            fullname,
            username,
            email,
            created_at
        FROM users
        WHERE id = %s
    """

    cursor.execute(user_query, (user_id,))

    user = cursor.fetchone()

    # ============================================
    # TRANSACTION COUNT
    # ============================================

    transaction_query = """
        SELECT COUNT(*) AS transaction_count
        FROM transactions
        WHERE user_id = %s
    """

    cursor.execute(transaction_query, (user_id,))

    transaction_result = cursor.fetchone()
    transaction_count = transaction_result["transaction_count"]

    # ============================================
    # BUDGET COUNT
    # ============================================

    budget_query = """
        SELECT COUNT(*) AS budget_count
        FROM budgets
        WHERE user_id = %s
    """

    cursor.execute(budget_query, (user_id,))

    budget_result = cursor.fetchone()
    budget_count = budget_result["budget_count"]

    # ============================================
    # MONTH COUNT
    # ============================================

    month_query = """
        SELECT
            COUNT(
                DISTINCT DATE_FORMAT(transaction_date, '%Y-%m')
            ) AS month_count
        FROM transactions
        WHERE user_id = %s
    """

    cursor.execute(month_query, (user_id,))

    month_result = cursor.fetchone()
    month_count = month_result["month_count"]

    # ============================================
    # ACCOUNT STATUS
    # ============================================

    account_status = "Active"

    # ============================================
    # CLOSE DATABASE
    # ============================================

    cursor.close()
    connection.close()

    # ============================================
    # RENDER PROFILE
    # ============================================

    return render_template(
        "dashboard/profile.html",
        user=user,
        transaction_count=transaction_count,
        budget_count=budget_count,
        month_count=month_count,
        account_status=account_status
    )

@app.route("/dashboard/settings", methods=["GET", "POST"])
def settings():

    # ============================================
    # CHECK LOGIN
    # ============================================

    if "user_id" not in session:
        return redirect(url_for("login"))

    user_id = session["user_id"]

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)


    # ============================================
    # HANDLE FORM SUBMISSION
    # ============================================

    if request.method == "POST":

        action = request.form.get("action")


        # ========================================
        # UPDATE PROFILE
        # ========================================

        if action == "profile":

            fullname = request.form.get(
                "fullname",
                ""
            ).strip()

            username = request.form.get(
                "username",
                ""
            ).strip()

            email = request.form.get(
                "email",
                ""
            ).strip()


            if not fullname or not username or not email:

                cursor.close()
                connection.close()

                return redirect(url_for("settings"))


            update_user_query = """
                UPDATE users
                SET fullname = %s,
                    username = %s,
                    email = %s
                WHERE id = %s
            """

            cursor.execute(
                update_user_query,
                (
                    fullname,
                    username,
                    email,
                    user_id
                )
            )

            connection.commit()


        # ========================================
        # UPDATE PREFERENCES
        # ========================================

        elif action == "preferences":

            currency = request.form.get(
                "currency",
                "INR"
            )

            theme = request.form.get(
                "theme",
                "light"
            )

            date_format = request.form.get(
                "date_format",
                "DD/MM/YYYY"
            )

            language = request.form.get(
                "language",
                "en"
            )


            # ========================================
            # VALIDATE THEME
            # ========================================

            allowed_themes = [
                "light",
                "dark",
                "system"
            ]

            if theme not in allowed_themes:
                theme = "light"


            # ========================================
            # UPDATE DATABASE
            # ========================================

            update_settings_query = """
                UPDATE user_settings
                SET currency = %s,
                    theme = %s,
                    date_format = %s,
                    language = %s
                WHERE user_id = %s
            """

            cursor.execute(
                update_settings_query,
                (
                    currency,
                    theme,
                    date_format,
                    language,
                    user_id
                )
            )

            connection.commit()


            # ========================================
            # UPDATE SESSION THEME
            # ========================================

            session["theme"] = theme


        # ========================================
        # UPDATE NOTIFICATIONS
        # ========================================

        elif action == "notifications":

            email_notifications = (
                1
                if request.form.get(
                    "email_notifications"
                )
                else 0
            )

            budget_alerts = (
                1
                if request.form.get(
                    "budget_alerts"
                )
                else 0
            )

            weekly_reports = (
                1
                if request.form.get(
                    "weekly_reports"
                )
                else 0
            )

            ai_insights = (
                1
                if request.form.get(
                    "ai_insights"
                )
                else 0
            )

            marketing_updates = (
                1
                if request.form.get(
                    "marketing_updates"
                )
                else 0
            )


            update_notifications_query = """
                UPDATE user_settings
                SET email_notifications = %s,
                    budget_alerts = %s,
                    weekly_reports = %s,
                    ai_insights = %s,
                    marketing_updates = %s
                WHERE user_id = %s
            """

            cursor.execute(
                update_notifications_query,
                (
                    email_notifications,
                    budget_alerts,
                    weekly_reports,
                    ai_insights,
                    marketing_updates,
                    user_id
                )
            )

            connection.commit()


        # ========================================
        # CLOSE DATABASE
        # ========================================

        cursor.close()
        connection.close()


        return redirect(url_for("settings"))


    # ============================================
    # GET USER INFORMATION
    # ============================================

    user_query = """
        SELECT
            id,
            fullname,
            username,
            email
        FROM users
        WHERE id = %s
    """

    cursor.execute(
        user_query,
        (user_id,)
    )

    user = cursor.fetchone()


    # ============================================
    # GET USER SETTINGS
    # ============================================

    settings_query = """
        SELECT
            id,
            user_id,
            currency,
            theme,
            date_format,
            language,
            email_notifications,
            budget_alerts,
            weekly_reports,
            ai_insights,
            marketing_updates
        FROM user_settings
        WHERE user_id = %s
    """

    cursor.execute(
        settings_query,
        (user_id,)
    )

    settings = cursor.fetchone()


    # ============================================
    # CLOSE DATABASE
    # ============================================

    cursor.close()
    connection.close()


    # ============================================
    # RENDER SETTINGS PAGE
    # ============================================

    return render_template(
        "dashboard/settings.html",
        user=user,
        settings=settings
    )

@app.context_processor
def inject_user_settings():

    settings = None

    if "user_id" in session:

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT theme
            FROM user_settings
            WHERE user_id = %s
            """,
            (session["user_id"],)
        )

        settings = cursor.fetchone()

        cursor.close()
        connection.close()

    return {
        "settings": settings
    }

# ==========================================
# Run Application
# ==========================================

if __name__ == "__main__":
    app.run(debug=True)