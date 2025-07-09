# 📚 vabTut – Peer Learning Exchange Platform
Live preview :- https://vabtut.netlify.app/

**Built by Team Hells_chain**  
A modern, collaborative skill-exchange platform for peer-to-peer doubt solving and micro-tutoring.

---

## 🚀 Hackathon Progress

---

### ✅ Checkpoint 1 – Project Setup & Landing Page

In this phase, we focused on laying a solid foundation for the platform with a clean and functional start:

- 🔧 **Folder Structure Initialized**  
  Set up a scalable mono-repo with clear separation between frontend (`client/`) and backend (`server/`).

- ⚙️ **Framework & Tooling Configured**  
  - `React 18` + `TypeScript` + `Vite` for frontend  
  - `Node.js` + `Express` + `TypeScript` for backend  
  - `Tailwind CSS` for styling  
  - Initial Tailwind theme configuration applied

- 🖥️ **Built Initial Landing Page (Welcome UI)**  
  - Designed a responsive, minimal landing screen  
  - Integrated a search bar to simulate doubt/topic discovery  
  - Showcased mock “popular topics” based on real student pain points  
  - Implemented blue-gradient theme for a modern, trustworthy vibe

✅ *Delivered a working MVP of the homepage with static topic discovery and strong project scaffolding.*

---

### ✅ Checkpoint 2 – Authentication UI + Dashboard Mock

In CP2, we enhanced the user interface and structure by introducing user interaction elements:

- 🔐 **Login & Signup UI Added**
  - Created basic frontend forms for user authentication  
  - UI designed with Tailwind and responsive behavior

- 🧑‍🎓 **Demo User Dashboard Created**
  - Built a mock dashboard screen to demonstrate post-login experience  
  - Placeholder content simulates topic lists, recent activity, etc.

- 📦 **Footer Component Added**
  - Introduced a global footer for branding and future navigation links

- 🎨 **UI/UX Enhancements**
  - Improved spacing, color balance, and component alignment  
  - Enhanced navigation bar structure for a cleaner look

✅ *The platform now offers a basic user journey: from welcome page → login/signup → dashboard mock.*

---

### ✅ Checkpoint 3 – Dashboard Redesign + Dark Mode Toggle

In this milestone, we focused on enhancing the **core user experience** by refining the dashboard layout and introducing a **modern dark mode** toggle, making the platform more usable, accessible, and visually appealing.

#### 💻 Dashboard UI Renovation
- Redesigned the “Post a Doubt” form for better input clarity and visual hierarchy  
- Improved the “Recent Doubts” section with urgency indicators and better card layout  
- Optimized layout spacing and responsiveness

#### 🌙 Dark Mode Support
- Implemented a Dark Mode toggle with persistent theme state  
- Ensured full contrast and accessibility across all components

✅ *This update significantly boosts user comfort and interactivity, especially for night-time learning sessions.*

---

### ✅ Checkpoint 4 – Explore Topics & Become a Tutor Pages + Skill Filtering

In this phase, we expanded the learning experience by introducing **topic exploration** and a **contribution pathway**, keeping the platform role-agnostic and focused on peer exchange.

#### 🧭 Explore Topics Page
- Implemented a dynamic page to browse all available topics  
- Integrated a **diamond-based filter system** to represent difficulty levels  
- Topics are categorized and visually presented using interactive cards

#### 🤝 Become a Tutor Page
- Created a motivational page that encourages learners to help others  
- Highlights vabTut’s philosophy: **learners can also teach**  
- Includes CTAs and visuals to onboard new peer tutors

#### 🎨 UI Enhancements
- Polished both pages with interactive components and improved spacing  
- Dark/light mode support maintained  
- Enhanced overall navigation flow

✅ *This update bridges learners and contributors more seamlessly, gamifies topic navigation, and invites users to help others based on their strengths.*

---

### ✅ Checkpoint 5 – Supabase Integration & Authentication Setup

In CP5, we focused on integrating **Supabase** as the backend service to enable secure authentication and prepare the platform for real-time data features.

#### 🔐 Supabase Auth Integration
- Connected Supabase using project URL and anon key  
- Integrated Supabase Auth UI for seamless login/signup  
- Added session persistence for consistent login behavior  
- Styled the auth components for both light and dark modes

#### 🧠 Backend Foundation
- Set up Supabase client for future database operations  
- Modular Supabase setup ready for secure data handling

#### 🌐 UI & Stability Enhancements
- Verified routing, auth state, and logout flows  
- Ensured responsive behavior and theming compatibility

✅ *These updates lay the groundwork for a scalable, real-time backend and enable secure, user-driven experiences on the platform.*

---

Day 2:- 

### ✅ Checkpoint 1 – AI Voice Assistant, Quiz Section, and UI Enhancements

For CP6, we focused on interactive learning and accessibility by integrating voice AI and quiz features while improving personalization and interface polish.

#### 🗣️ AI Voice Assistant (Vapi Integration)
- Integrated **Vapi Voice AI Assistant** into the platform  
- Allows users to post doubts via voice input  
- Enables voice-driven interactions to improve accessibility and engagement

#### ❓ Quiz Section Added
- Built a **quiz page** with subject-wise interactive MCQs  
- Helps learners practice and reinforce knowledge  
- Future-ready for tracking performance and earning karma

#### 👤 Profile & Settings Pages
- Added a **Profile page** showing:
  - Username, doubt stats, karma, badges  
- Added a **Settings page** to toggle dark mode and manage account preferences

#### 🎨 UI Improvements
- Unified spacing, responsiveness, and visual feedback  
- Improved hover, focus, and accessibility interactions  
- Refined menu UX for profile/settings/logout dropdown

✅ *This checkpoint brought vabTut closer to a full MVP with speech input, gamified learning, and personalized user control.*

---

## 📦 Project Structure

client/
├── pages/ # Landing, dashboard, profile, settings
├── components/ # Reusable UI components
├── utils/supabaseClient.ts
└── styles/global.css

server/
├── routes/topics.ts # Topics API
└── index.ts # Backend entry point

 Day 2: Checkpoint 2
🧩 Checkpoint 2 – Login/Signup UI & Basic Dashboard
In this checkpoint, we focused on building the user interaction flow and enhancing the visual consistency of the platform.

🔐 Authentication UI

Designed clean, responsive Login and Signup pages

Fields include email, password, and name

Interface ready for Firebase or Supabase integration

📊 Demo Dashboard Setup

Created a User Dashboard displaying dummy recent doubts

Includes a "Post a Doubt" section for future integration

Simple listing layout for recent peer questions

🎨 UI Enhancements

Added footer section with minimal branding

Improved spacing, padding, and mobile responsiveness

Created reusable component structure using Tailwind CSS


<<<<<<< HEAD
✅ README – Day 2: Checkpoint 3
📹 Checkpoint 3 – Video Call Integration & Live Interaction Setup
In this checkpoint, we focused on enabling real-time collaboration between users through secure and seamless video communication.

🧑‍🏫 Zego Video Call Integration

Integrated ZegoCloud to allow 1-on-1 peer video sessions

Configured room-based sessions using doubt.id as unique room ID

Enabled "Start Video Call" button on active doubts

📡 Real-Time Interaction Flow

Handled state for joining/leaving sessions dynamically

Triggered video interface only during active sessions

Prepared the base for upcoming voice/chat layer integrations

🧪 UI Improvements

Polished interaction components like buttons and card status

Made layout responsive for video-enabled workflows

✅ This update makes peer-to-peer learning more immersive through live video help sessions.


=======
>>>>>>> 08eed6c (feat(day 2 - check point 4): completed backend, integrated doubts system, improved UI)
