# 🏥 Arogya-Vahini (आरोग्य-वाहिनी • ಆರೋಗ್ಯ-ವಾಹಿನಿ)
> **"Bharat's Health, Our Priority."**  
> *Seamless Healthcare Bridge From Rural Care to Specialist Excellence.*

[![React 18](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Realtime%20%26%20Auth-3ECF8E.svg)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg)](https://tailwindcss.com/)

---

## 🌟 Overview

**Arogya-Vahini** is an AI-assisted rural-to-specialist digital referral network designed to eliminate paper-slip losses, repeated diagnostic tests, and delayed emergency care across primary healthcare centres in India. 

It connects **Primary Health Centres (PHCs)** in rural villages directly to **District Specialty Hospitals**, enabling instant scannable QR handoffs, AI-driven clinical risk triage, multilingual handoff reports, and a portable, encrypted **ABDM-aligned Health Vault**.

---

## ✨ Key Features

- **🔐 Supabase Cloud Authentication & Realtime DB**:
  - Email/Password Doctor Authentication via Supabase Auth.
  - Direct DB fallback registration to prevent cloud rate-limit blocks.
  - Real-time bidirectional data synchronization using PostgreSQL WebSocket channels (`postgres_changes`).

- **🤖 AI Risk Triage & Multilingual Summarizer**:
  - Automatically calculates patient risk scores (*High, Medium, Low*) based on vital signs, symptoms, and medical history.
  - Generates instant clinical handoff summaries in **English, Hindi (हिंदी), Kannada (ಕನ್ನಡ), and Marathi (मराठी)**.

- **📁 Medical Report Vault (PDF & Pictures)**:
  - Drag-and-drop file upload modal for **PDF documents** (*ECG reports, Lab Panels, Discharge Summaries*) and **Image Scans** (*X-Rays, Prescriptions, Medical Pictures*).
  - Synchronizes medical documents in real time across the patient's Health Vault.

- **📱 Scannable QR Token Handoff**:
  - Generates unique QR tokens for each referral slip (`AV-2026-101...`).
  - Specialists can scan the QR code using any webcam/mobile camera to instantly pull the patient's full medical history in **< 1 second**.

- **🖥️ Dual Role Console Dashboards**:
  - **PHC Doctor Console**: Patient registry, digital referral slip creation, vital signs recording, and report vault views.
  - **Specialist Doctor Console**: QR desk scanner, AI risk-sorted priority queue, treatment note recorder, and case completion tools.

- **🛡️ Delete Patient Record & Profile Settings**:
  - Delete patient modal with double-confirmation safety for permanent removal of records from local state and Supabase DB.
  - Profile settings to edit doctor name, designation, primary facility, and medical council registration ID.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend UI** | React 18, Vite, TypeScript |
| **Styling** | Vanilla CSS, Tailwind CSS, Framer Motion |
| **Backend & DB** | Supabase Cloud PostgreSQL & Realtime WebSockets |
| **Authentication** | Supabase Auth (`supabase.auth`) + Local Session Storage |
| **Icons & Charts** | Lucide React, Recharts |
| **Date & Utilities** | `date-fns`, `sonner` toast notifications |

---

## 🗄️ Database Schema

The database consists of 4 main PostgreSQL tables managed via Supabase:

```sql
-- 1. Patients Table
CREATE TABLE public.patients (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    village VARCHAR(255) NOT NULL,
    address TEXT,
    blood_group VARCHAR(10) NOT NULL,
    history TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Referrals Table
CREATE TABLE public.referrals (
    id VARCHAR(50) PRIMARY KEY,
    token VARCHAR(100) UNIQUE NOT NULL,
    patient_id VARCHAR(50) REFERENCES public.patients(id) ON DELETE CASCADE,
    vitals JSONB NOT NULL,
    symptoms TEXT NOT NULL,
    diagnosis TEXT NOT NULL,
    priority VARCHAR(20) NOT NULL,
    hospital VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    reason TEXT NOT NULL,
    risk JSONB NOT NULL,
    summary JSONB NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255) NOT NULL,
    from_facility VARCHAR(255) NOT NULL,
    notes JSONB DEFAULT '[]'::jsonb,
    pdf_language VARCHAR(10) DEFAULT 'en'
);

-- 3. Reports Table
CREATE TABLE public.reports (
    id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50) REFERENCES public.patients(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    kind VARCHAR(100) NOT NULL,
    facility VARCHAR(255) NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    file_url TEXT,
    file_name VARCHAR(255),
    file_type VARCHAR(50),
    file_size VARCHAR(50)
);

-- 4. Doctor Users Table
CREATE TABLE public.doctor_users (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    designation VARCHAR(255) NOT NULL,
    facility VARCHAR(255) NOT NULL,
    registration VARCHAR(100) NOT NULL
);
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/tarunram-commits/arogya.git
   cd arogya
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=https://xllppukhwuxdvonfcokj.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_cetI1zLsNvW3h4aq8lEY9w_s9d4IsPk
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173/`.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p center>
<b>Arogya-Vahini</b> — <i>Bridging Rural Care to Specialist Excellence across Bharat.</i> 🇮🇳
</p>
