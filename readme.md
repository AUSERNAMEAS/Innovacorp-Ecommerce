# 🚀 InnovaCorp — Full-Stack E-Commerce Platform

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4.x-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![Microsoft SQL Server](https://img.shields.io/badge/SQL_Server-2019+-CC292B?style=flat&logo=microsoft-sql-server&logoColor=white)](https://www.microsoft.com/sql-server)
[![Vanilla JS](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

## 📝 Descripción / Description

### 🇪🇸 Español
**InnovaCorp** es una plataforma web **Full-Stack** interactiva de comercio electrónico orientada a la personalización de productos en tiempo real. Este sistema cuenta con una arquitectura robusta MVC (Modelo-Controlador-Rutas) en el backend, manejo dinámico del DOM mediante JavaScript Vanilla en el cliente, autenticación segura de usuarios (incluyendo integración con Google OAuth) y almacenamiento relacional gestionado íntegramente a través de **Microsoft SQL Server**.

### 🇺🇸 English
**InnovaCorp** is an interactive **Full-Stack** e-commerce platform dedicated to real-time product customization. It features a robust MVC backend architecture (Models-Controllers-Routes), dynamic client-side DOM manipulation via Vanilla JavaScript, secure user authentication (including Google OAuth integration), and relational data management handled entirely through **Microsoft SQL Server**.

---

## 📺 Demostración en Video / Video Demonstration

### 🇪🇸 Español
¡Mira la aplicación en acción completa e interactiva en el siguiente video demostrativo! Muestra el panel de administración, la pasarela de pedidos y la persistencia de datos:

### 🇺🇸 English
See the application in full interactive action in the video demonstration below! It showcases the admin dashboard, the checkout flow, and live data persistence:

* 🔗 **[➔ Ver Video Demostrativo aquí / Watch Demo Video Here](#)** *(https://youtu.be/TRvf1PYG5Yw)*

---

## 🛠️ Tecnologías Utilizadas / Tech Stack

* **Backend:** Node.js, Express.js, Passport.js (Authentication & Google OAuth), Multer (Image uploads).
* **Frontend:** HTML5, CSS3 Avanzado (Diseño Adaptivo), **Vanilla JavaScript** (AJAX Fetch API).
* **Database:** **Microsoft SQL Server (MSSQL)** con procedimientos almacenados e integridad relacional.

---

## ✨ Características Clave / Key Features

### 🇪🇸 Español
* 🛒 **Flujo Completo de Compra:** Gestión interactiva de carrito, cálculo automático de totales y pasarela de checkout.
* 🔐 **Autenticación Dual:** Inicio de sesión local seguro y autenticación federada mediante **Google OAuth**.
* 🛡️ **Panel de Administración Privado:** Panel exclusivo para gestionar productos, actualizar inventario y subir imágenes del servidor.
* 📊 **Base de Datos Relacional:** Consultas optimizadas, llaves foráneas y persistencia robusta de pedidos y usuarios.

### 🇺🇸 English
* 🛒 **Complete Shopping Flow:** Interactive cart management, automatic total calculation, and a seamless checkout pipeline.
* 🔐 **Dual Authentication:** Secure local login and federated authentication via **Google OAuth**.
* 🛡️ **Private Admin Dashboard:** Exclusive dashboard to manage product catalogs, update stock, and handle server-side image uploads.
* 📊 **Relational Database:** Optimized SQL queries, strict foreign keys, and secure persistence for orders and users.

---

## 📂 Estructura del Proyecto / Project Structure

```text
proyecto-nodejs/
├── public/             # 🎨 Client-side (HTML, CSS, Vanilla JS)
│   ├── html/           # Interface Views (Shop, Cart, Login, Account)
│   ├── css/            # Custom Layouts & Styles
│   └── javascript/     # Asynchronous Fetch Client Logic
├── private/            # 🔐 Secure Restricted Files (Admin Panel Views)
├── src/                # 🚀 Backend Core (Node.js + Express)
│   ├── config/         # SQL Server DB Connection & Passport Strategy
│   ├── controllers/    # Request Handling & Business Logic
│   ├── models/         # Database Queries & Schema Mappings
│   ├── routes/         # REST API Endpoints Matrix
│   └── server.js       # Express Application Entry Point
├── queryDB/            # 🗄️ Database Scripts & T-SQL Layouts
└── .gitignore          # Environment Isolation Security
