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
*A high-yield marketplace interface allowing users to view real-time flash promotions, explore specific service categories, and instantly route to deep-linked reservation forms.*

<p align="center">
  <img src="https://github.com/user-attachments/assets/ab0eb7dc-de3c-4809-ae14-87304c15e35e" width="75%" alt="Discovery Deck Interface" style="border-radius: 10px; border: 1px solid #223047; box-shadow: 0 8px 24px rgba(0,0,0,0.4); margin-bottom: 16px;"/>
  <img src="https://github.com/user-attachments/assets/1216e27d-7601-46c8-802a-f7516ffbfdef" width="75%" alt="Filtered Results Deck" style="border-radius: 10px; border: 1px solid #223047; box-shadow: 0 8px 24px rgba(0,0,0,0.4); margin-bottom: 16px;"/>
  <img src="https://github.com/user-attachments/assets/bd82ef01-0949-4b9e-b869-12463e2dafc7" width="75%" alt="Consumer Details View" style="border-radius: 10px; border: 1px solid #223047; box-shadow: 0 8px 24px rgba(0,0,0,0.4);"/>
</p>

---

### 📊 2. Control Management Dashboard
*Real-time analytical control layout for merchant administrators monitoring operational capacity pools, active booking voucher codes, overall conversion metrics, and live-streaming transaction logs pipelines.*

<p align="center">
  <img src="https://github.com/user-attachments/assets/368af42d-2e62-4354-88a5-0d8566ff6ce1" width="75%" alt="Admin Dashboard Interface" style="border-radius: 10px; border: 1px solid #223047; box-shadow: 0 8px 24px rgba(0,0,0,0.4);"/>
</p>

---

### 🎟️ 3. Booking Confirmation Gateway & Form Controls
*Interactive transaction pipeline capturing precise client configurations alongside system execution screens mapping authenticated administration routers and operational registration forms.*

<p align="center">
  <img src="https://github.com/user-attachments/assets/09578612-87b6-4085-89ca-490eb3b4b9e4" width="75%" alt="Secure Gateway Form" style="border-radius: 10px; border: 1px solid #223047; box-shadow: 0 8px 24px rgba(0,0,0,0.4); margin-bottom: 16px;"/>
  <img src="https://github.com/user-attachments/assets/58ceb0c5-6ba5-4b6a-accd-6104f0416bd7" width="75%" alt="Merchant Profile Creation" style="border-radius: 10px; border: 1px solid #223047; box-shadow: 0 8px 24px rgba(0,0,0,0.4); margin-bottom: 16px;"/>
  <img src="https://github.com/user-attachments/assets/bdb1639d-0a1a-4991-8602-f49d170ef00f" width="75%" alt="Admin Credentials Verification Gateway" style="border-radius: 10px; border: 1px solid #223047; box-shadow: 0 8px 24px rgba(0,0,0,0.4); margin-bottom: 16px;"/>

</p>

---

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
