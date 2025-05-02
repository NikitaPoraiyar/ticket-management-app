🎟️ Ticket Management App
🚀 Live Demo
Experience the application in action:

- **Frontend (Vercel):** https://ticket-management-app-gamma.vercel.app

- **Backend (Render):** https://ticket-management-app.onrender.com
🛠️ Setup Instructions
1. Frontend Setup
Prerequisites
Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)

- [npm](https://www.npmjs.com/)

- [Vite](https://vitejs.dev/)

Steps:
1. Clone the repository:

```bash
git clone https://github.com/NikitaPoraiyar/ticket-management-app.git
cd ticket-management-app/frontend
```
2. Install dependencies:

```bash
npm install
```
3. Set up environment variables:
   - Create a `.env` file in the `frontend` directory.
   - Add the following variables:

```env
VITE_API_URL=https://ticket-management-app.onrender.com/api
```
4. Start the development server:

```bash
npm run dev
```
The application will be available at `http://localhost:5173`.
2. Backend Setup
Prerequisites
Ensure you have the following installed:

- [Node.js](https://nodejs.org/) 

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account for database setup

Steps:
1. Navigate to the backend directory:

```bash
cd ../backend
```
2. Install dependencies:

```bash
npm install
```
3. Set up environment variables:
   - Create a `.env` file in the `backend` directory.
   - Add the following variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```
4. Start the server:

```bash
npm start
```
The backend will be available at `http://localhost:3000`.
✨ Features
- **User Authentication:** Sign-up and login functionality with JWT-based authentication.

- **Dashboard:** View and manage tickets categorized as All, Resolved, and Unresolved.

- **Ticket Management:** Assign tickets to team members and mark them as resolved or unresolved.

- **Team Management:** Admins can manage team members and assign roles.

- **Analytics:** Visual representation of ticket statistics and team performance.

- **Chat Support:** chat window for customer support interactions.

- **Profile Management:** Users can update their profile information.

- **Admin Controls:** Multiple admins can manage their respective teams and tickets.
👤 Demo Credentials
To explore the application, use the following demo credentials:

- **Admin:**

  - Email: `admin@example.com`

  - Password: `admin123`

- **Team Member:**

  - Email: `team@example.com`

  - Password: `team123`

🛠️ Technologies Used
- **Frontend:** React.js, Vite, CSS, Recharts

- **Backend:** Node.js, Express.js, MongoDB, JWT

- **Deployment:**

  - Frontend: Vercel

  - Backend: Render

