# 🚀 Polyglot User System (Full Stack Monorepo)

[![Status](https://img.shields.io/badge/status-complete-green)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel)](https://polyglot-user-system.vercel.app/)

[Leia este documento em Português](README-pt.md)

A complete Full Stack project developed with a **microservices architecture** within a **monorepo**. The main goal was to build a resilient application where the Frontend is **agnostic** to the Backend, communicating transparently with APIs developed in different ecosystems (**Node.js** and **Java/Spring Boot**), both sharing the same database and business rules.

> **⚠️ Deployment Note (Render Free Tier):**
> The Backend API (Node.js) is hosted on **Render's free tier**.
> The first request (login/signup) **may take up to 60 seconds** to wake up the server. Please be patient on the first interaction.

---

## 🏗️ Project Architecture

The project is organized as a **Monorepo** containing:

-   **Frontend:** SPA application built with **React**, **Next.js**, and **Tailwind CSS**.
-   **Backend A (Node.js):** RESTful API with **Express** and **Prisma ORM**.
-   **Backend B (Java):** RESTful API with **Spring Boot** and **Spring Data JPA**.
-   **Database:** Containerized **PostgreSQL**.
-   **DevOps:** Complete orchestration with **Docker Compose** and CI/CD pipelines via **GitHub Actions**.

---

## 🛠️ Tech Stack

### 🎨 Frontend (`web-treinamento-react`)

-   **React 18** & **Next.js 14+** (App Router)
-   **TypeScript**
-   **Tailwind CSS**
-   **React Hot Toast** (Notifications)
-   **Nookies** (Cookie Management)
-   **Vitest** (Unit Testing)

### 🟢 Backend Node.js (`api-treinamento-node`)

-   **Node.js** & **Express**
-   **Prisma ORM**
-   **Jest** & **Supertest** (TDD & Integration Testing)
-   **JWT** & **BCrypt** (Authentication & Security)

### ☕ Backend Java (`api-treinamento-java`)

-   **Java 17** & **Spring Boot 3**
-   **Spring Data JPA** (Hibernate)
-   **Spring Security** (Stateless Authentication with JWT)
-   **JUnit 5** & **MockMvc** (Integration Testing)
-   **Lombok**

### ⚙️ DevOps & Infra

-   **Docker** & **Docker Compose**
-   **GitHub Actions** (Independent CI workflows for each service)

---

## 🚀 How to Run Locally

Thanks to Docker, you can run the entire stack (Frontend + Backend + Database) with a single command.

### Prerequisites

-   Docker and Docker Compose installed.

### Step by Step

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/paulorag/treinamento-fullstack.git](https://github.com/paulorag/treinamento-fullstack.git)
    cd treinamento-fullstack
    ```

2.  **Configure Environment Variables:**
    Create a `.env` file in the root of the project for Docker Compose:

    ```env
    JWT_SECRET="your_development_secret_key"
    ```

3.  **Start the Application:**
    Run the orchestration command:

    ```bash
    docker compose up --build -d
    ```

4.  **Access:**
    -   **Frontend:** `http://localhost:3000`
    -   **API (Node.js):** `http://localhost:3001`
    -   **Database:** `localhost:5433`

> **Note:** The frontend is configured by default to communicate with the Node.js API. To switch to the Java API, change the `NEXT_PUBLIC_API_URL` variable in the frontend's `.env.local` or adjust the port mapping in `docker-compose.yml` (the Java API runs internally on port 8080).

---

## ✅ Features

-   [x] **Complete User CRUD** (Create, Read, Update, Delete).
-   [x] **JWT Authentication** (Login and Register).
-   [x] **Route Protection** (Middleware in Node and Filter in Spring).
-   [x] **Reactive Interface** with Visual Feedback (Loading/Toasts).
-   [x] **Modals** for creation and editing forms.
-   [x] **Data Persistence** with PostgreSQL.

---

## 🧪 Testing

The project has high automated test coverage.

-   **Test Backend Node:** `cd api-treinamento-node && npm test`
-   **Test Backend Java:** `cd api-treinamento-java && mvn test`
-   **Test Frontend:** `cd web-treinamento-react && npm test`

---

Developed as part of an intensive Full Stack Software Engineering training.
