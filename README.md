# 🏥 Arogya-Vahini (आरोग्य-वाहिनी • ಆರೋಗ್ಯ-ವಾಹಿನಿ)

> **"Bharat's Health, Our Priority."**  
> *Seamless Healthcare Bridge From Rural Care to Specialist Excellence.*

[![React 18](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Realtime%20%26%20Auth-3ECF8E.svg)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🌟 Overview

**Arogya-Vahini** is an AI-assisted rural referral network and digital health vault designed to eliminate paper-slip losses, repeated diagnostic tests, and delayed emergency transfers across primary healthcare centres in Bharat.

It seamlessly bridges **Primary Health Centres (PHCs)** in rural villages directly to **District Specialty Hospitals**, enabling instant scannable QR handoffs, AI-driven clinical risk triage, 4-language handoff reports (**English, Hindi, Kannada, Marathi**), and an encrypted **ABDM-aligned Health Vault**.

---

## ✨ Key Features & Architecture

### 1. 🌐 Enterprise Landing Page & Role Portal
- **Modern Dark-Mode SaaS UI**: Deep navy backdrop (`#030712`), ambient glowing radial grids, glassmorphism cards, and Indian-inspired saffron/emerald/blue accents.
- **5 Enterprise Sections**: Hero section with Indian Health Vault badge, 4 Key Feature Cards (*AI Risk Triage*, *Instant QR Referral*, *ABDM Health Vault*, *Specialist Network*), 6-Step Care Continuum Workflow, Statistics, and Trust Badges.
- **2-Role Medical Portal**: Clean card selection for **PHC Doctors** (primary care) and **Specialist Doctors** (district hub).
- **Save Login Info (Remember Me)**: Auto-fills stored credentials from `localStorage` on page load for 1-click authentication.

### 2. 📹 Auto-Start Live Camera QR Scanner
- **Live Device Webcam Feed**: Opens the device's camera automatically (`navigator.mediaDevices.getUserMedia`) as soon as the doctor navigates to the **Scan QR** page.
- **Click-to-Scan Viewfinder**: Clicking anywhere inside the camera scanner frame triggers an animated laser scan sweep, verifies the referral token (`AV-2026-1042KQZ`), and opens the patient's Health Vault in **< 1 second**.
- **1-Click Waiting Referral Slips**: Allows doctors to click any waiting patient referral card to auto-verify and open their record.

### 3. 🌐 Multilingual (i18n) Engine
- **Supported Languages**: **English (EN)**, **Hindi (हिंदी - HI)**, **Kannada (ಕನ್ನಡ - KN)**, and **Marathi (मराठी - MR)**.
- **National Health Portal Typography**: Prominent AIIMS-style top-middle header displaying Devanagari and Kannada scripts (`आरोग्य-वाहिनी • ಆರೋಗ್ಯ-ವಾಹಿನಿ`).
- **Live Language Switcher**: Real-time header dropdown instantly translates dashboard banners, CTAs, speech bubbles, and stat cards.

### 4. 🤖 AI Risk Triage & ABDM Health Vault
- **Clinical Risk Assessment**: Automatically calculates patient risk scores (*High, Medium, Low*) based on vital signs, symptoms, and medical history.
- **Encrypted Medical Vault**: Drag-and-drop file uploader for PDF lab reports, X-rays, ECGs, and prescriptions synchronized across Supabase DB.
- **Real-Time Priority Queue**: Sorted by AI risk score (*Emergency, Urgent, High Risk*) placed right below dashboard stats for rapid triage.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend UI** | React 18, Vite 5, TypeScript 5 |
| **Styling & Motion** | Vanilla CSS, Tailwind CSS, Framer Motion |
| **Backend & DB** | Supabase Cloud PostgreSQL & Realtime WebSockets |
| **Authentication** | Supabase Auth (`supabase.auth`) + Automatic Fallback Provisioning |
| **Icons & Notifications** | Lucide React, Sonner Toast Notifications |
| **Camera & Web APIs** | HTML5 `navigator.mediaDevices.getUserMedia` Video Stream |

---

## 🗄️ Database Schema

The platform connects to Supabase Cloud PostgreSQL with 4 core tables:

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

-- 3. Reports Table (Health Vault Files)
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

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 2. Installation Steps

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

<p align="center">
  <b>Arogya-Vahini (आरोग्य-वाहिनी • ಆರೋಗ್ಯ-ವಾಹಿನಿ)</b> — <i>Bridging Rural Care to Specialist Excellence across Bharat 🇮🇳</i>
</p>
