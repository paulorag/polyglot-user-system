# 🚀 Treinamento Full Stack: Sistema de Usuários (Polyglot Architecture)

![Status do Projeto](https://img.shields.io/badge/status-concluído-green)
![License](https://img.shields.io/badge/license-MIT-blue)

Um projeto Full Stack completo desenvolvido com uma arquitetura de microsserviços e monorepo. O objetivo principal foi construir uma aplicação resiliente onde o Frontend é agnóstico ao Backend, comunicando-se transparentemente com APIs desenvolvidas em ecossistemas diferentes (**Node.js** e **Java/Spring Boot**), ambas compartilhando o mesmo banco de dados e regras de negócio.

## 🏗️ Arquitetura do Projeto

O projeto está organizado como um **Monorepo** contendo:

-   **Frontend:** Aplicação SPA construída com **React**, **Next.js** e **Tailwind CSS**.
-   **Backend A (Node.js):** API RESTful com **Express** e **Prisma ORM**.
-   **Backend B (Java):** API RESTful com **Spring Boot** e **Spring Data JPA**.
-   **Banco de Dados:** **PostgreSQL** containerizado.
-   **DevOps:** Orquestração completa com **Docker Compose** e pipelines de CI/CD via **GitHub Actions**.

---

## 🛠️ Tecnologias Utilizadas

### 🎨 Frontend (`web-treinamento-react`)

-   **React 18** & **Next.js 14+** (App Router)
-   **TypeScript**
-   **Tailwind CSS**
-   **React Hot Toast** (Notificações)
-   **Nookies** (Gerenciamento de Cookies)
-   **Vitest** (Testes Unitários)

### 🟢 Backend Node.js (`api-treinamento-node`)

-   **Node.js** & **Express**
-   **Prisma ORM**
-   **Jest** & **Supertest** (TDD & Testes de Integração)
-   **JWT** & **BCrypt** (Autenticação & Segurança)

### ☕ Backend Java (`api-treinamento-java`)

-   **Java 17** & **Spring Boot 3**
-   **Spring Data JPA** (Hibernate)
-   **Spring Security** (Autenticação Stateless com JWT)
-   **JUnit 5** & **MockMvc** (Testes de Integração)
-   **Lombok**

### ⚙️ DevOps & Infra

-   **Docker** & **Docker Compose**
-   **GitHub Actions** (Workflows de CI independentes para cada serviço)

---

## 🚀 Como Rodar o Projeto

Graças ao Docker, você pode rodar toda a stack (Frontend + Backend + Banco) com um único comando.

### Pré-requisitos

-   Docker e Docker Compose instalados.

### Passo a Passo

1.  **Clone o repositório:**

    ```bash
    git clone [https://github.com/SEU_USUARIO/treinamento-fullstack.git](https://github.com/SEU_USUARIO/treinamento-fullstack.git)
    cd treinamento-fullstack
    ```

2.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz do projeto para o Docker Compose:

    ```env
    JWT_SECRET="sua_chave_secreta_de_desenvolvimento"
    ```

3.  **Inicie a Aplicação:**
    Execute o comando de orquestração:

    ```bash
    docker compose up --build -d
    ```

4.  **Acesse:**
    -   **Frontend:** `http://localhost:3000`
    -   **API (Node.js):** `http://localhost:3001`
    -   **Banco de Dados:** `localhost:5433`

> **Nota:** O frontend é configurado por padrão para se comunicar com a API Node.js. Para trocar para a API Java, altere a variável `NEXT_PUBLIC_API_URL` no `.env.local` do frontend ou ajuste o mapeamento de portas no `docker-compose.yml` (a API Java roda internamente na porta 8080).

---

## ✅ Funcionalidades

-   [x] **CRUD Completo de Usuários** (Criar, Ler, Atualizar, Deletar).
-   [x] **Autenticação JWT** (Login e Registro).
-   [x] **Proteção de Rotas** (Middleware no Node e Filter no Spring).
-   [x] **Interface Reativa** com Feedback Visual (Loading/Toasts).
-   [x] **Modais** para formulários de criação e edição.
-   [x] **Persistência de Dados** com PostgreSQL.

---

## 🧪 Testes

O projeto possui alta cobertura de testes automatizados.

-   **Testar Backend Node:** `cd api-treinamento-node && npm test`
-   **Testar Backend Java:** `cd api-treinamento-java && mvn test`
-   **Testar Frontend:** `cd web-treinamento-react && npm test`

---

Desenvolvido como parte de um treinamento intensivo de Engenharia de Software Full Stack.
