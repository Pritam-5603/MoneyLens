
import os
import mysql.connector


def get_db_connection():

    connection_config = {
        "host": os.getenv("MYSQLHOST", "localhost"),
        "port": int(os.getenv("MYSQLPORT", "3306")),
        "user": os.getenv("MYSQLUSER", "root"),
        "password": os.getenv("MYSQLPASSWORD"),
        "database": os.getenv("MYSQLDATABASE", "MoneyLens")
    }

    # Configure SSL when a CA certificate path is provided
    ssl_ca = os.getenv("MYSQL_SSL_CA")

    if ssl_ca:
        connection_config.update({
            "ssl_ca": ssl_ca,
            "ssl_verify_cert": True,
            "ssl_verify_identity": True
        })

    connection = mysql.connector.connect(**connection_config)

    return connection
