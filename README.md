# Blue Dart Automated Tracking System

A premium, automated shipment tracking platform for Blue Dart consignments. This system fetches real-time data from the TrackCourier API, stores history in MongoDB, and provides a modern dashboard for operational visibility.

## 🚀 Features

- **Modern Dashboard**: Real-time summary of shipment statuses (Delivered, In Transit, Pending).
- **Bulk Upload**: Seamlessly enter multiple tracking numbers via a clean interface or CSV.
- **Detailed History**: Expandable rows showing every checkpoint, scheduled delivery details, and POD links.
- **Excel Export**: Generate one-click reports for operational analysis.
- **Premium UI**: Built with React, Tailwind CSS v4, and Lucide icons for a pro-grade experience.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Frontend**: React (Vite), Tailwind CSS
- **API Integration**: TrackCourier API
- **Utilities**: Axios, XLSX, Dotenv

## 📦 Setup Instructions

### 1. Prerequisite
- Node.js installed
- MongoDB instance (local or Atlas)
- TrackCourier API Key

### 2. Backend Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root based on `.env.example`:
   ```env
   PORT=5001
   MONGODB_URI=your_mongodb_uri
   TRACKCOURIER_API_KEY=your_api_key
   ```
4. Start the backend:
   ```bash
   npm start
   ```

### 3. Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 📊 API Endpoints

**Base URL**: `https://bluedart-tracking.onrender.com/api/track`

- `POST /upload`: Process tracking numbers.
- `GET /status`: Retrieve all tracked records.
- `GET /report`: Download the Excel report.

---
Built with ❤️ for logistics efficiency.
