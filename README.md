# Khaitan Cyber Guardians 🛡️✨
### Official National Cyber Security Initiative Portal
**In Association with The Khaitan School & Government Cyber Crime Coordination Centre (I4C)**

---

## 🌟 Overview
**Khaitan Cyber Guardians** is an interactive, gamified, and modern cyber security operations and learning portal created for **The Khaitan School** in collaboration with the Government Cyber Cell.

It equips school students with vital cyber defense awareness through competitive, hands-on, scenario-based tasks while building inter-class and inter-section school spirit.

---

## 🚀 Key Features

### 1. 🔐 School Credentials & Squad Sync
- **Strict School Domain Authentication**:
  - Restricts login strictly to official `@thekhaitanschool.org` email addresses (e.g. `k-6764@thekhaitanschool.org`).
  - Student selects their **Full Name**, **Class Grade (6 to 12)**, **Section (A to F)**, and **Cyber Agent Insignia**.
- **Collaborative Class Squad Roster**:
  - Automatically groups students by their Class and Section (e.g., `Class 10-B`).
  - View fellow classmates enrolled in the same section, their points, clearance ranks, and badges.
  - **Shared Class Pool**: Points earned by any student in any task are immediately tallied into their section's total score!
  - 1-Click quick student switcher included for testing multiple students in the same or competing sections.

### 2. 🌌 Immersive Cosmic Background & Easter Eggs
- **Twinkling Starfield**: Hundreds of depth-calculated twinkling stars and procedural shooting stars across a deep void background.
- **Rare Blue Comet Easter Egg**:
  - A rare glowing cyan-blue comet traversing from left to right with a particle dust tail.
  - Clicking or catching it unlocks the classified *"COSMIC PACKET INTERCEPTED!"* secret event (+150 XP & "Starlight Explorer" badge).
- **Rare Red Twinkling Star Easter Egg**:
  - A ruby-red pulsating pulsar star with diamond diffraction spikes.
  - Clicking it triggers the clandestine *"CLASSIFIED RED TEAM SATELLITE LOCATED!"* event (+200 XP & "Red Team Scout" badge).
- **Zero-Dependency Synthesized Audio Engine**:
  - Built with the native Web Audio API (retro bleeps, level up chimes, alert sirens, and toggleable mute switch).

### 3. 🛡️ Official Cyber Intel Hub
- Direct alignment with the **Indian Cyber Crime Coordination Centre (I4C)** and **National Emergency Helpline 1930 / cybercrime.gov.in**.
- 6 Essential Defensive Pillars:
  1. *Phishing & Impersonation*
  2. *Password Fortification & 2FA*
  3. *Public Wi-Fi & Rogue Hotspots*
  4. *Social Engineering & Gaming Currency Scams*
  5. *Digital Footprint & Location Metadata*
  6. *Cyber Ethics & IT Act Guidelines (POCSO, Anti-Bullying)*
- **Interactive Student Cyber Hygiene Checklist**: Complete 8 safety verification checks to earn bonus XP.

---

## 🎮 The 4 Interactive Cyber Games & Challenges

### 🎯 Game 1: Security Scenario Quiz
- Multi-stage scenario challenges based on realistic school contexts (fake exam circulars, USB drop attacks in computer labs, Discord OTP social engineering, cafe Wi-Fi evil twins, subdomain deception).
- Interactive visual mockups (Email clients with headers, SMS threads, raw URL inspect boxes, USB flash drive telemetry).
- Streak multipliers, immediate educational feedback, and score contribution to the class squad.

### 🕵️ Game 2: Khaitan Cyber Hunt (CTF Scavenger Hunt)
- An authentic 5-level Capture The Flag (CTF) investigation with a built-in terminal console:
  - **Level 1**: DOM Source Code Inspection (`FLAG{INSPECT_ELEMENT_HERO_2026}`)
  - **Level 2**: Radio Transmission Base64 Cipher (`FLAG{BASE64_DECRYPTED_SUCCESS}`)
  - **Level 3**: SMTP Spoofed Header Forensics (`FLAG{IP_198.51.100.77_EXPOSED}`)
  - **Level 4**: Steganography Bit Parity Matrix (`FLAG{CYBER_MATRIX_KEY_UNLOCKED}`)
  - **Level 5**: Master Firewall Caesar / ROT-13 Crypt (`FLAG{KHAITAN_CYBER_GUARDIAN_2026}`)
- Interactive Cyber Shell with commands: `scan`, `decode base64 <str>`, `rot13 <str>`, `submit <flag>`, `hint`, and `clear`.

### 🔐 Game 3: The Password Gauntlet (Neil.fun Cyber Edition)
- 15 progressive, escalating password rules with zero glitches and sleek UI transitions:
  - Minimum length, digits, uppercase, special symbols
  - Digits checksum must equal **25**
  - Must include a calendar month
  - Must include Roman numerals that multiply to **35** (`V * VII` or `XXXV`)
  - Must include standard HTTPS port number (**443**)
  - Must include official National Cyber Helpline (**1930**)
  - Must include an official cyber security protocol (`HTTPS`, `SSH`, `AES`, `TLS`, `VPN`)
  - Must contain a valid 6-digit hex color code (`#06B6D4`) that dynamically themes the card
  - Dynamic 2FA Token (changes live every 25 seconds)
  - Must contain school keyword: `KHAITAN`
  - No consecutive identical characters
- Real-time checksum calculations and rewarding slide-in animations.

### 🛡️ Game 4: PhishGuard SOC (Threat Operations Terminal)
- Take on the role of the School Security Operations Center (SOC) Warden:
  - Real-time incoming security incidents (typosquatted circulars, legitimate school notices, fake govt grant extortion, Trojan `.bat` practical exam scripts, CERT-In bulletins).
  - Triage under pressure: 15-second time window per incident.
  - 3 Strategic Commands: `[ALLOW / LEGITIMATE]`, `[QUARANTINE MALWARE]`, or `[REPORT TO 1930 / CERT-IN]`.
  - Combo streak bonuses, 3 defense heart shields, and operational debriefing reports.

---

## 🏆 School-Wide Inter-Class Cup
- **Inter-Class Section Podium**: Gold, Silver, and Bronze trophies for the leading sections (e.g. Class 10-A vs 10-B vs 11-A).
- **Individual Student Operatives Ranking**: Filterable by grade (Class 6 through 12).
- Automatic ranking updates whenever any student scores in any module.

---

## 🛠️ Tech Stack & Architecture
- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + Glassmorphism UI
- **Icons**: Lucide React (crisp SVG iconography, no cheap emojis)
- **Audio Engine**: Native Web Audio API synthesizer (no external audio latency or 404 risks)
- **Particle Effects**: Canvas Confetti + Custom 60fps HTML5 Canvas Starlight & Comet Engine
- **Persistence**: High-reliability LocalStorage caching with pre-seeded Khaitan School student rosters.

---

## 💻 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Launch development server
npm run dev

# 3. Build for production
npm run build
```
