"""Test Azure SQL connection using same credentials as server/.env"""
import os

# Parse .env in same folder
env_path = os.path.join(os.path.dirname(__file__), ".env")
if not os.path.exists(env_path):
    print("No .env found in server folder")
    exit(1)

params = {}
with open(env_path, "r", encoding="utf-8") as f:
    for line in f:
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if "=" in line:
            key, val = line.split("=", 1)
            params[key.strip()] = val.strip()

url = params.get("DATABASE_URL", "")
if not url:
    print("DATABASE_URL not found in .env")
    exit(1)

# Parse connection string
parts = {}
for pair in url.split(";"):
    pair = pair.strip()
    if "=" in pair:
        k, v = pair.split("=", 1)
        parts[k.strip()] = v.strip()

server = (parts.get("Server") or "").replace("tcp:", "").split(",")[0].strip()
database = parts.get("Initial Catalog") or parts.get("Database", "")
user = parts.get("User ID", "")
password = parts.get("Password", "")

if not all([server, database, user, password]):
    print("Missing server/database/user/password in DATABASE_URL")
    exit(1)

try:
    import pyodbc
except ImportError:
    print("Installing pyodbc...")
    import subprocess
    subprocess.check_call(["python", "-m", "pip", "install", "pyodbc"])
    import pyodbc

# Prefer 18, then 17, then legacy "SQL Server"
for name in ["ODBC Driver 18 for SQL Server", "ODBC Driver 17 for SQL Server", "SQL Server"]:
    if name in pyodbc.drivers():
        driver = "{" + name + "}"
        break
else:
    print("No ODBC Driver for SQL Server found. Install 'ODBC Driver 17 for SQL Server'.")
    exit(1)

conn_str = (
    f"DRIVER={driver};SERVER={server};DATABASE={database};"
    f"UID={user};PWD={password};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;"
)
print("Conectando a Azure SQL...")
try:
    conn = pyodbc.connect(conn_str)
    cur = conn.cursor()
    cur.execute("SELECT 1 AS ok")
    row = cur.fetchone()
    print("Resultado SELECT 1:", row.ok)
    print("Conexión OK.")
    conn.close()
except pyodbc.Error as e:
    print("ERROR:", e)
    exit(1)
