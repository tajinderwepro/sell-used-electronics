# 📦 Sell Used Electronics - Backend (FastAPI + PostgreSQL)

This backend project powers the "Sell Used Electronics" platform. Built with **FastAPI**, **SQLAlchemy**, **PostgreSQL**, and **Alembic** for modern, performant API development.

---


### 1.  Stack Overview
- **FastAPI** – Web framework for building APIs with Python.
- **SQLAlchemy** – ORM for interacting with PostgreSQL.
- **Alembic** – Manages database schema migrations.
- **PostgreSQL** – The relational database.
- **Pydantic** – For request/response validation and serialization.

---

### 2.  Project Structure

server/
├── alembic/ # Alembic migrations
│ ├── versions/ # Auto-generated migration scripts
│ └── env.py # Migration environment config
├── alembic.ini # Alembic config file
├── app/
│ ├── database.py # DB connection & Base
│ ├── main.py # FastAPI app entry point
│ ├── models/ # SQLAlchemy models
│ ├── schemas/ # Pydantic schemas
│ ├── routes/ # FastAPI route definitions
│ ├── controllers/ # Business logic for routes
│ └── utils/ # Helper modules (optional)
├── .env # Environment variables
├── requirements.txt # Python dependencies
└── README.md # Project docs



---


####  Prerequisites
- Python 3.10+
- PostgreSQL running locally (port 5432)
- `sell-used-electronics` database created

####  Setup Instructions

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate


# Install dependencies

pip install -r requirements.txt

### 3.  Alembic Migrations

####  Initialize Alembic (only once)

```bash
alembic init alembic
```

####  Create a Migration

```bash
alembic revision --autogenerate -m "create users table"
```

####  Apply Migrations

```bash
alembic upgrade head
```

#### Rollback Migrations

- Rollback one step:

```bash
alembic downgrade <revision_id>
```

- Rollback all:

```bash
alembic downgrade base
```

####  Fake Apply Migrations (without running them)

```bash
alembic stamp head
```

> ⚠️ **Important**: Never delete files in the `alembic/versions/` directory manually.  
> If you must reset the migration history, use:
>
> ```bash
> alembic downgrade base
> ```

---

### 5. 🚀 Running the Server

Start your FastAPI development server:

```bash
uvicorn app.main:app --reload
```


