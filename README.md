# TrackrBoard

A polished job application tracker built with Django, HTML, CSS, JavaScript, Tailwind CSS, and SQL-backed storage through SQLite.

## Features

- User signup, login, and logout
- Dashboard with application metrics and status mix
- Create, edit, view, delete, search, and filter job applications
- Follow-up date tracking
- Responsive custom UI with Tailwind CSS and additional custom styling

## Stack

- Backend: Django 5
- Frontend: Django templates, HTML, Tailwind CSS, custom CSS, vanilla JavaScript
- Database: SQLite

## Run locally

```bash
python manage.py migrate
python manage.py runserver
```

Then open `http://127.0.0.1:8000/`.

## Deploy on Vercel

This repo includes a root `wsgi.py`, `requirements.txt`, `.python-version`, and `vercel.json` so Vercel can detect the Django entrypoint.

Recommended environment variables:

```bash
SECRET_KEY=your-production-secret
DEBUG=False
```

Important note: this project currently uses SQLite for local development. For a real Vercel deployment, switch to a hosted database such as PostgreSQL.
