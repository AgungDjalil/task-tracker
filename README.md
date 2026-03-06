# Task & Project Tracker

Aplikasi **Task & Project Tracker** untuk mengelola project dan task di dalamnya.
Setiap project dapat memiliki beberapa task dengan kategori sebagai status task.

Project ini dibuat menggunakan:

* **Backend:** Laravel 12 (REST API)
* **Frontend:** Vue.js 3 + TypeScript (Composition API)
* **Database:** PostgreSQL
* **Authentication:** Laravel Sanctum (Personal Access Token)
* **Testing:** PHPUnit & Vitest

---

# Tech Stack

| Layer         | Technology              |
| ------------- | ----------------------- |
| Backend       | Laravel 12              |
| Frontend      | Vue.js 3 + TypeScript   |
| Database      | PostgreSQL              |
| Auth          | Laravel Sanctum         |
| HTTP Client   | Axios                   |
| Backend Test  | PHPUnit                 |
| Frontend Test | Vitest / Vue Test Utils |

---

# Project Structure (Monorepo)

```
project-root
│
├── backend
│   ├── app
│   ├── routes
│   ├── database
│   └── tests
│
├── frontend
│   ├── public
│   ├── components
│   ├── views
│   ├── routes
│   ├── stores
│   ├── services
│   ├── types
│   └── plugins
│
└── README.md
```

---

# Requirements

Pastikan sudah menginstall:

* PHP >= 8.2
* Composer
* Node.js >= 18
* NPM / Yarn
* PostgreSQL
* Git

---

# Installation

## 1. Clone Repository

```bash
git clone https://github.com/AgungDjalil/task-tracker.git
cd task-tracker
```

---

# Backend Setup (Laravel)

Masuk ke folder backend

```bash
cd backend
```

## Install Dependency

```bash
composer install
```

## Copy Environment

```bash
cp .env.example .env
```

## Generate App Key

```bash
php artisan key:generate
```

## Setup Database

Edit file `.env`

```
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=taskTracker
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

## Run Migration & Seeder

Seeder akan membuat:

* Admin user
* Categories task

```bash
php artisan migrate --seed
```

---

# Running Backend

```bash
php artisan serve
```

Backend akan berjalan di:

```
http://127.0.0.1:8000
```

---

# Frontend Setup (Vue 3 + TypeScript)

Masuk ke folder frontend

```bash
cd ../frontend
```

## Install Dependency

```bash
npm install
```

---

# Running Frontend

```bash
npm run dev
```

Frontend akan berjalan di:

```
http://localhost:5173
```

---

# Default Login

User dibuat melalui **seeder**.

```
Email: admin@gmail.com
Password: 123
```

---

# API Documentation

Dokumentasi API tersedia dalam bentuk:

* Postman Collection

File dapat ditemukan pada folder:

```
/docs
```

Import file tersebut ke Postman untuk mencoba API.

---

# Running Tests

## Backend Test (PHPUnit)

Masuk ke folder backend

```bash
cd backend
```

Jalankan:

```bash
php artisan test
```

atau

```bash
vendor/bin/phpunit
```

---

## Frontend Test (Vitest)

Tidak sempat dibuat

---

# Features

## Authentication

* Login menggunakan Laravel Sanctum (PAT)
* Logout (revoke token)

---

## Project Management

* Create Project
* Update Project
* Archive Project
* Search Project by title

---

## Task Management

* Create Task
* Update Task
* Delete Task (Soft Delete)
* Search Task by title
* Task berdasarkan kategori

---

## Dashboard

Menampilkan:

* Total Project Aktif
* Total Task Belum Selesai
* Task Mendekati Due Date

---

# AI Usage

Detail penggunaan AI dapat dilihat pada file:

```
AI_USAGE.md
```

File tersebut berisi daftar prompt, tools AI, dan MCP yang digunakan selama proses pengerjaan.

---

# License

Project ini dibuat untuk keperluan **Test Junior Fullstack Web Developer 2026**.
