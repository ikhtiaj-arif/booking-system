# 🗓️ Resource Booking System

A simple web app that lets users book shared resources like rooms or devices. It prevents overlapping bookings by checking for time conflicts and adds a small buffer between bookings.

---

## ✨ Features

- ✅ Book any resource for a specific time.
- 🧠 Smart conflict detection to prevent double-booking.
- 🕒 Automatically adds a 10-minute buffer before and after each booking.
- 📋 Bookings are shown **grouped by resource**, so it’s easier to track availability.
- 🔔 Toast notifications for success and errors (like double bookings).
- 🔄 Automatically reloads data when a booking is added or removed.

---

## 🔧 Technologies Used

- **Frontend**: Next.js with React (App Router)
- **Backend**: Next.js Route Handlers (API)
- **Styling**: Tailwind CSS + ShadCN
- **Toast**: Sonner
- **ORM**: Prisma
- **Database**: SQLite

---

## 🛠️ Getting Started

### 1. Clone the project

```bash
git clone https://github.com/your-username/resource-booking-system.git
cd resource-booking-system
npm install

datasource db {
  provider = "sqlite"
  url      = "file:app.db"
}

npm run dev
