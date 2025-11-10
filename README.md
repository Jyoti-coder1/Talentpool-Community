# TalentPool Community Engagement Platform

## Project Overview

TalentPool is a community-based platform that enables individuals to showcase their skills and talents, discover relevant projects, and collaborate with others in skill-based or volunteering initiatives. Users can create profiles, post projects, join collaborations, and provide feedback to help foster a thriving community.

---

## Features

### Minimum Expected Features

1. User Authentication
   - JWT-based user registration and login for secure authentication.
   - Roles: user, projectOwner, admin.

2. Profile Management
   - Users can create and update profiles including skills, portfolio, bio, and location.
   - View other users' profiles and search by skill or location.

3. Community Projects
   - Project owners can create, update, and delete projects.
   - Users can join projects; waitlist automatically handled if project is full.
   - Projects support skill requirements, deadlines, and collaborator limits.

4. Role-Based Access Control (RBAC)
   - Different roles with permissions:
     - user → join projects, participate in collaborations.
     - projectOwner → create/manage projects.
     - admin → manage users, view analytics.

5. Collaboration Service
   - Users can collaborate on projects and exchange messages.
   - Real-time collaboration supported with Socket.IO (WebSockets).

6. MongoDB Integration
   - Store users, projects, collaborations, and ratings.

7. Search & Filter
   - Search users by skills or location.
   - Filter projects by skill or status.

---

### Unique Features

1. Project Matching Algorithm
   - Recommends projects to users based on their skills and interests.

2. Waitlist Management
   - Users are automatically waitlisted if project collaborators are full.

---

### Challenging Features

1. Ratings and Feedback
   - Users can rate collaborators (1–5) and provide feedback.
   - Ratings aggregated per user or project.

2. Real-Time Messaging
   - Collaboration messaging handled via Socket.IO for real-time communication.

---

## Tech Stack

- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose
- Authentication: JWT
- Real-Time: Socket.IO
- Environment Variables: .env
- Deployment Ready: Supports Render/Railway

---

## Folder Structure

src/
├─ config/ │  └─ db.js
├─ controllers/
    │
    ├─ adminController.js │
    ├─ authController.js │ 
    ├─ collabController.js │  
    ├─ matchController.js │  
    ├─ profileController.js │  
    ├─ projectController.js │  
    └─ ratingController.js 
├─ middleware/ │  
    ├─ authMiddleware.js │  
    └─ roleMiddleware.js 
├─ models/ │
    ├─ Collaboration.js │ 
    ├─ Project.js │ 
    ├─ Rating.js │ 
    └─ User.js 
├─ routes/ │ 
    ├─ admin.js │  
    ├─ auth.js │  
    ├─ collab.js │  
    ├─ match.js │  
    ├─ profile.js │  
    ├─ projectRoutes.js │  
    ├─ protected.js │  
    └─ ratingRoutes.js 
├─ server.js
├─ .env
├─ package.json
└─ .gitignore

---

## Environment Variables

Create a .env file in the root directory with the following variables:

`env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d


---

Installation & Setup

1. Clone the repository:

git clone https://github.com/Jyoti-coder1/Talentpool-Community.git
cd TalentPool_CommunityEngagement


2. Install dependencies:

npm install


3. Add .env file with your credentials (see above).


4. Start the server:

npm start


5. Server runs on http://localhost:5000 by default.




---

API Endpoints

Auth

POST /api/auth/register → Register a new user

POST /api/auth/login → Login and get JWT token


Profile

GET /api/profile/me → Get current user profile

PUT /api/profile/me → Update current user profile

GET /api/profile/:id → Get profile by user ID

GET /api/profile → Search users by skill/location


Projects

POST /api/projects/ → Create project (projectOwner only)

PUT /api/projects/:id → Update project

DELETE /api/projects/:id → Delete project

GET /api/projects/ → List all projects

POST /api/projects/:id/join → Join a project or waitlist


Collaborations

POST /api/collab/ → Create a collaboration

GET /api/collab/me → List my collaborations

GET /api/collab/:id → Get collaboration details

POST /api/collab/:id/messages → Send message (REST fallback)


Ratings

POST /api/ratings/ → Add rating/feedback

GET /api/ratings/:projectId → Get ratings by project

GET /api/ratings?userId=... → Get ratings by user


Admin

GET /api/admin/analytics → Get total users, projects, and ratings (admin only)


Match

GET /api/match/projects → Recommend projects for a user


Protected

GET /api/protected/me → Test authenticated route



---

Deployment

Deploy on Render or Railway.

Ensure your .env variables are set in the deployment environment.

The server will automatically run on the provided port.



---

Notes

Real-time collaboration uses Socket.IO (WebSockets).

Users must provide JWT token for protected routes.

Follow role-based permissions: users, project owners, and admins.