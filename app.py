from flask import Flask, render_template, request, redirect, url_for

# ==========================================
# Flask App Configuration
# ==========================================

app = Flask(__name__)

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
        # Temporary: after clicking Sign In,
        # go directly to the dashboard.
        return redirect(url_for("dashboard"))

    return render_template("login.html")


@app.route("/register", methods=["GET", "POST"])
def register():

    if request.method == "POST":
        return redirect(url_for("login"))

    return render_template("register.html")


@app.route("/forgot-password")
def forgot_password():
    return render_template("forgot-password.html")


@app.route("/logout")
def logout():
    # Authentication logic will be added later
    return render_template("login.html")


# ==========================================
# Dashboard
# ==========================================

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard/dashboard.html")


# ==========================================
# Dashboard Pages
# ==========================================

@app.route("/dashboard/transactions")
def transactions():
    return render_template("dashboard/transactions.html")


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