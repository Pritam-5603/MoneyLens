from flask import Flask, render_template, request, redirect, url_for, session, flash
from db import get_db_connection
from werkzeug.security import generate_password_hash,check_password_hash
app = Flask(__name__)
app.secret_key = "your-secret-key"

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

        query = """
        SELECT id, password
        FROM users
        WHERE username = %s
        """

        values = (
            username,
        )

        cursor.execute(query, values)

        result = cursor.fetchone()

        if result:

            if check_password_hash(result[1], password):
                session["user_id"] = result[0]

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
    cursor = connection.cursor()

    query = """
    SELECT FROM USERS"""

    return render_template("dashboard/dashboard.html")
# ==========================================
# Dashboard Pages
# ==========================================

@app.route("/dashboard/transactions", methods=["GET", "POST"])
def transactions():

    # Check if user is logged in
    if "user_id" not in session:
        return redirect(url_for("login"))

    # Get logged-in user's ID
    user_id = session["user_id"]

    # ==========================================
    # ADD TRANSACTION
    # ==========================================
    if request.method == "POST":
        print("TRANSACTION POST RECEIVED")

        transaction_type = request.form["transaction_type"]
        amount = request.form["amount"]
        date = request.form["date"]
        description = request.form["description"]
        category = request.form["category"]
        note = request.form["note"]

        connection = get_db_connection()
        cursor = connection.cursor()

        query = """
            INSERT INTO transactions
            (user_id, transaction_type, amount, date,
             description, category, note)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """

        values = (
            user_id,
            transaction_type,
            amount,
            date,
            description,
            category,
            note
        )

        cursor.execute(query, values)

        connection.commit()

        cursor.close()
        connection.close()

        return redirect(url_for("transactions"))

    # ==========================================
    # GET USER'S TRANSACTIONS
    # ==========================================

    connection = get_db_connection()
    cursor = connection.cursor()

    query = """
        SELECT *
        FROM transactions
        WHERE user_id = %s
    """

    cursor.execute(query, (user_id,))

    transactions = cursor.fetchall()

    cursor.close()
    connection.close()

    # Send transactions to HTML
    return render_template(
        "dashboard/transactions.html",
        transactions=transactions
    )

@app.route("/dashboard/analytics")
def analytics():
    return render_template("dashboard/analytics.html")


@app.route("/dashboard/budgets")
def budgets():
    return render_template("dashboard/budgets.html")


@app.route("/dashboard/profile")
def profile():
    return render_template("dashboard/profile.html")


@app.route("/dashboard/settings")
def settings():
    return render_template("dashboard/settings.html")


# ==========================================
# Run Application
# ==========================================

if __name__ == "__main__":
    app.run(debug=True)