# ⚡ SmartBooking Engine (End-to-End Flash Sale Platform)

[![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?logo=react&logoColor=black&style=for-the-badge)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript&logoColor=white&style=for-the-badge)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white&style=for-the-badge)](https://tailwindcss.com/)
[![.NET Core](https://img.shields.io/badge/Backend-.NET%20Core%208.0-512BD4?logo=dotnet&logoColor=white&style=for-the-badge)](https://dotnet.microsoft.com/)
[![MS%20SQL%20Server](https://img.shields.io/badge/Database-MS%20SQL%20Server-CC2927?logo=microsoftsqlserver&logoColor=white&style=for-the-badge)](https://www.microsoft.com/en-us/sql-server)

An end-to-end web application architecture designed to help service-based local merchants (Spas, Salons, and Wellness Centers) monetize unutilized off-peak hours through gamified real-time scarcity promos and flash booking slots.

---
---

## 🖥️ Application Previews & Core Interfaces

### 🌌 1. Discovery Deck & Booking Portal
*A clean marketplace interface allowing users to view promotions and instantly fill real-time reservation forms.*

<p align="center">
  <img src="https://github.com/user-attachments/assets/da6faa15-97c2-4f32-85f7-c9ac66cf4100" width="70%" alt="Marketplace Interface" style="border-radius: 10px; border: 1px solid #223047; box-shadow: 0 8px 24px rgba(0,0,0,0.4);"/>
</p>

---

### 📊 2. Control Management Dashboard
*Real-time analytical control layout for merchant administrators monitoring operational capacity pools and streaming transaction lines.*

<p align="center">
  <img src="https://github.com/user-attachments/assets/368af42d-2e62-4354-88a5-0d8566ff6ce1" width="70%" alt="Admin Dashboard Interface" style="border-radius: 10px; border: 1px solid #223047; box-shadow: 0 8px 24px rgba(0,0,0,0.4);"/>
</p>

---

### 🎟️ 3. Booking Confirmation Gateway
*Dynamic token rendering showcasing successful reservation allocations.*

<p align="center">
  <img src="https://github.com/user-attachments/assets/863e304b-b1e2-4f2a-b76e-f26d900b23e5" width="70%" alt="Booking Confirmation Gateway" style="border-radius: 10px; border: 1px solid #223047; box-shadow: 0 8px 24px rgba(0,0,0,0.4);"/>
</p>




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

