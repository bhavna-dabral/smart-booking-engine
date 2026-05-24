# ⚡ SmartBooking Engine (End-to-End Flash Sale Platform)

[![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?logo=react&logoColor=black&style=for-the-badge)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript&logoColor=white&style=for-the-badge)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white&style=for-the-badge)](https://tailwindcss.com/)
[![.NET Core](https://img.shields.io/badge/Backend-.NET%20Core%208.0-512BD4?logo=dotnet&logoColor=white&style=for-the-badge)](https://dotnet.microsoft.com/)
[![MS%20SQL%20Server](https://img.shields.io/badge/Database-MS%20SQL%20Server-CC2927?logo=microsoftsqlserver&logoColor=white&style=for-the-badge)](https://www.microsoft.com/en-us/sql-server)

An end-to-end web application architecture designed to help service-based local merchants (Spas, Salons, and Wellness Centers) monetize unutilized off-peak hours through gamified real-time scarcity promos and flash booking slots.

---

## 🖥️ Application Previews & Core Interfaces

### 🌌 1. Discovery Deck & Consumer Portal
*A beautiful, high-yield marketplace interface allowing users to filter live promotions by merchant classification and instantly route to real-time reservation forms.*

<img width="1920" height="930" alt="Screenshot (843)" src="https://github.com/user-attachments/assets/da6faa15-97c2-4f32-85f7-c9ac66cf4100" />
<img width="1920" height="937" alt="Screenshot (844)" src="https://github.com/user-attachments/assets/368af42d-2e62-4354-88a5-0d8566ff6ce1" />
<img width="1875" height="919" alt="Screenshot (851)" src="https://github.com/user-attachments/assets/863e304b-b1e2-4f2a-b76e-f26d900b23e5" />






### 📊 2. Merchant Operations & Control Dashboard
*Real-time analytical control layout for merchant administrators monitoring operational capacity pools, active booking voucher codes, conversion metrics, and streaming transaction pipes.*
<img width="1907" height="919" alt="Screenshot (845)" src="https://github.com/user-attachments/assets/f37837d9-c2f2-4e92-b037-7317f24d8cfe" />
<img width="1883" height="938" alt="Screenshot (847)" src="https://github.com/user-attachments/assets/3755a4c3-9b07-47a8-8e99-4f33c436105b" />
<img width="1920" height="925" alt="Screenshot (848)" src="https://github.com/user-attachments/assets/61a1929a-ec33-4d05-8842-bde3e82bad70" />
<img width="1904" height="944" alt="Screenshot (849)" src="https://github.com/user-attachments/assets/bdbf246d-889d-4c0d-af81-ae92b3ea8fd1" />




## 🛠️ Complete Technology Stack & System Architecture

### 🔹 1. Client Presentation Layer (Frontend)
- **React.js (v18) & TypeScript:** Strictly typed structural components optimizing lifecycle rendering speeds.
- **Tailwind CSS System:** Configured with specific color fallback overrides to guarantee a crisp dark-theme experience on any presentation monitor.
- **Vite Bundler:** Instant Hot Module Replacement (HMR) for an ultra-fast developer workflow.

### 🔹 2. Core Service Pipeline (Backend API)
- **ASP.NET Core Web API:** RESTful microservice layer architected with secure route endpoints maps for resource allocation.
- **Entity Framework Core (EF Core):** Object-Relational Mapper (ORM) handling secure transaction queries and database mappings.

### 🔹 3. Persistence Layer (Database)
- **Microsoft SQL Server:** Relational DB management maintaining ACID-compliant schema structures for critical customer transactions (`Businesses`, `Offers`, `Slots`, and `Bookings`).

---

## ⚙️ Core Engineering Design Patterns

1. **Race-Condition Isolation:** The system queries seat availability constraints instantly before booking tokens are verified, completely avoiding overbooking overlapping anomalies.
2. **Dynamic Resiliency Mode:** When local database web connections are decoupled, the frontend client falls back instantly to client-side data simulations to guarantee uninterrupted demonstration continuity during live judge testing.
3. **Regex Validator Pipeline:** Built-in validation filters check email integrity blocks and 10-digit Indian mobile sequence parameters directly on the client layer to protect database processing pipelines.

