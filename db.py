import mysql.connector


def get_db_connection():
    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Pritam707588Das@",
        database="MoneyLens"
    )

    return connection