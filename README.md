# EasyFitTrack

🚀 **Live Demo:** [http://easyfittrack.netlify.app/](http://easyfittrack.netlify.app/)
> **⚠️ Server Cold Start Notice:**
> The backend is hosted on **Render's Free Tier**. To save resources, the server "spins down" after 15 minutes of inactivity.
> **Please allow 20-30 seconds for the initial load** while the server wakes up. Once active, the application will perform at normal speed.

**EasyFitTrack** is a comprehensive full-stack fitness management platform designed to bridge the gap between gym owners, trainers, and fitness enthusiasts. It provides a seamless ecosystem for managing gym operations, tracking workout progress, planning diets, and facilitating real-time communication.

---

## 🌟 Key Features

### 1. User Roles & Authentication
- **Multi-Role System:** Dedicated portals for **Admin**, **Gym Owners**, **Trainers**, and **Members**.
- **Secure Authentication:** JWT-based login with Bcrypt password hashing.
- **Role-Based Access Control:** Secure routes ensuring users can only access features relevant to their role.

### 2. Gym Management (For Owners)
- **Dashboard:** Overview of total members, trainers, and pending requests.
- **Profile Management:** Update gym details, location, and upload photo galleries.
- **Membership Plans:** Create and manage flexible membership tiers and pricing.
- **Staff Management:** Add and manage trainers associated with the gym.

### 3. Member Experience
- **Gym Discovery:** Browse and search for gyms, view profiles, and send join requests.
- **Plan Requests:** Users can request personalized workout or diet plans from their trainers.
- **Progress Tracking:**
  - Visual charts for weight and performance tracking (Chart.js).
  - Daily logs for workouts and macros.
- **Macro Calculator:** Built-in tool to calculate BMR and daily caloric needs.

### 4. Trainer Tools
- **Client Management:** View and manage assigned members.
- **Plan Creation:** Design and assign custom **Workout** and **Diet Plans**.
- **Schedule Management:** Set availability and manage session bookings.

### 5. Communication & Engagement
- **Real-Time Chat:** integrated messaging system using **Socket.io** for instant communication between members and trainers/gyms.
- **Announcements:** Gyms can post updates and announcements for all members to see.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** [React](https://reactjs.org/) (Vite)
- **Styling:** [TailwindCSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **State Management:** React Context API
- **HTTP Client:** Axios
- **Data Visualization:** Chart.js
- **Real-Time:** Socket.io-client

### Backend
- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT)
- **Image Storage:** Cloudinary
- **Real-Time:** Socket.io

---

## 🔮 Future Works

We are constantly working to improve EasyFitTrack. Here are some features planned for future updates:

- [ ] **Payment Gateway Integration:** Secure online payments for gym memberships (Stripe/Razorpay).
- [ ] **Mobile Application:** Native mobile app using React Native.
- [ ] **AI Recommendations:** AI-driven workout and diet suggestions based on user goals and progress.
- [ ] **Social Feed:** A community feed for members to share achievements and photos.
- [ ] **Advanced Analytics:** Deeper insights for gym owners regarding revenue and retention.
- [ ] **Wearable Integration:** Syncing data with fitness bands and smartwatches.

---

## 📦 Installation & Setup

To run this project locally:

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/easyfittrack.git
    cd easyfittrack
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    # Create a .env file with your credentials (MONGO_URI, JWT_SECRET, CLOUDINARY_URL, etc.)
    npm run dev
    ```

3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

4.  **Access the App**
    Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📄 License

This project is licensed under the MIT License.
