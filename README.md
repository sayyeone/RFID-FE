# RFID-FE
A modern, intelligent Point of Sale (POS) frontend for the Smart Plate System. Built with React and TailwindCSS, featuring zero-click RFID scanning, real-time data visualization, and seamless Midtrans payment integration.

**Live Demo:** [RFID-FE on Vercel](https://rfid-8f5e3tai5-sayyeones-projects.vercel.app/)

## What's This?
This is the **Frontend** component of the **Sistem Penghitungan Piring Otomatis**. It provides a sleek, responsive interface for cashiers to manage transactions and for admins to monitor sales performance. 

Key interactions include:
- **Instant Plate Recognition**: automatically detects items placed on the RFID reader.
- **Smart Dashboard**: Visualizes revenue, popular items, and activity logs in real-time.
- **Integrated Payments**: Pop-up Midtrans Snap window for QRIS, E-Wallet, and Card payments.

> **Note**: This frontend requires the Backend API to function.
> **Backend Repository**: [Get the Backend Here](https://github.com/sayyeone/Sistem-Penghitungan-Piring-Menggunakan-RFID/tree/railway-backend)

## Tech Stack
Keeping it fast and beautiful:

- [x] **React.js** (Vite)
- [x] **Tailwind CSS** (Styling)
- [x] **Lucide React** (Icons)
- [x] **Axios** (API Client)
- [x] **Midtrans Snap** (Payment Gateway)
- [x] **Chart.js** (Data Visualization)

No complex enterprise boilerplate. Just clean, functional code.

## Getting Started

### Option 1: Just Run It (Localhost)
Clone the repo, install dependencies, and start the vite server.

```bash
git clone https://github.com/sayyeone/portfolio.git
cd RFID-FE
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

### Option 2: Connect to Backend
By default, the frontend looks for the backend at `http://127.0.0.1:8000`. 
To change this (e.g., to connect to Railway), update your `.env` file:

```env
VITE_API_BASE_URL=https://sistem-penghitungan-piring-menggunakan-rfid-production.up.railway.app/api
VITE_MIDTRANS_CLIENT_KEY=your_client_key_here
```

## Deploying to Vercel
Want to put this online? It's optimized for Vercel.

1. Push your code to GitHub.
2. Go to **Vercel Dashboard** → **Add New Project**.
3. Import your `RFID-FE` repository.
4. In **Environment Variables**, add:
   - `VITE_API_BASE_URL`: Your Railway Backend URL
   - `VITE_MIDTRANS_CLIENT_KEY`: Your Midtrans Client Key
5. Hit **Deploy**.

Your POS system is now live worldwide. 🌍

## Project Structure
Clean and modular architecture.

```bash
RFID-FE/
├── public/             # Static assets
├── src/
│   ├── api/            # Axios configuration
│   ├── assets/         # Images & Global Styles
│   ├── components/     # Reusable UI Components
│   │   ├── admin/      # Admin-specific widgets (Charts, Tables)
│   │   ├── kasir/      # Cashier-specific widgets (Cart, RFID Listener)
│   │   └── common/     # Shared components (Modals, Alerts)
│   ├── layouts/        # Dashboard & Auth Layouts
│   ├── pages/          # Main Views (Login, Dashboard, History)
│   └── utils/          # Helpers (Currency Formatter, Printer Template)
├── .env                # Environment Variables
└── vite.config.js      # Vite Configuration
```

## Features
- **Zero-Click Scanning**: MutationObserver detects RFID input focus automatically.
- **Role-Based Access**: Secure routing for Admin vs. Cashier roles.
- **Interactive Tables**: Sort, filter, and pagination for managing thousands of records.
- **Activity Logging**: Tracks every plate addition, user edit, and login event.
- **Responsive Design**: Works perfectly on tablets (iPad) for modern POS setups.
- **Smart Printing**: Generates thermal-printer friendly invoices directly from the browser.

## Browser Support
Optimized for modern engines:
- Chrome (Latest) - *Recommended for RFID Hardware*
- Edge (Latest)
- Firefox (Latest)
- Safari (Latest)

## Credits
- **UI Design**: Inspired by Sneat Admin Template
- **Icons**: Lucide React
- **Charts**: Chart.js
- **Made with ❤️ by Adisty Fatika Ardani**

---
Questions? Reach out or open an issue in the repo! 🚀
