# Oren Sustainability Dashboard

Welcome to the **Oren Sustainability Dashboard**, a comprehensive platform for tracking and improving environmental impact. Oren provides businesses with data-driven insights to foster sustainability and eco-friendly practices.

### Deployed URLs

- **URL**: [https://sustanibilty-dashboard-oren.onrender.com](https://sustanibilty-dashboard-oren.onrender.com)

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Screenshots](#screenshots)
- [Access Ways](#access)

---

## Project Overview

The Oren Sustainability Dashboard is designed to help companies and organizations track and manage their environmental sustainability metrics. The platform provides insights into energy consumption, waste management, carbon footprint, and other environmental impact metrics, giving businesses the tools to make informed decisions for a greener future.

---

## Features

1. **Login System**:
   - Secure login system for authorized users using email and password.
   - JWT-based authentication to ensure secure access to the dashboard.
   - User session management with localStorage token storage.

2. **Dashboard Overview**:
   - A dynamic dashboard presenting key sustainability metrics such as energy consumption, waste management, and carbon emissions.
   - Data visualization using graphs and charts for better insights.

3. **User Role**:
   - Only Login Admins and access the platform.

4. **Data Insights & Reports**:
   - Generate Json Data to track progress over time and compare performance.
   - Downloadable reports in JSON format for external review.

5. **Responsive Design**:
   - Fully responsive design, optimized for both mobile and desktop screens.
   - Flexible layout with side-by-side sections on larger screens and a vertical stack on mobile.

---

## Technologies Used

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **Charts**: Chart.js or any other data visualization library
- **Deployment**: Render (Backend) | Netlify (Frontend)

---

## Screenshots

### 1. **Login Page**
The user can log in using their email and password to access the dashboard.
![image](https://github.com/user-attachments/assets/d662c21d-60d5-4bbe-a585-7bd42a08d0e0)

### 2. **Dashboard Overview**
Displays key metrics and data visualizations related to sustainability projects.
![image](https://github.com/user-attachments/assets/8edd95c2-6903-4dc1-8792-4c1e3b1928a9)

Same in mobile screen will be :
![image](https://github.com/user-attachments/assets/fb62fcf7-f0f4-4c69-86f7-62c69eded278)


### 3. **Metrics Adding and Comparing with Companies Benchmark**
Users can manage and track various sustainability projects and they can Compare with the Company Benchmarks.
![image](https://github.com/user-attachments/assets/96364783-8551-4c40-b975-b8550e0630b8)


### 4 Export JSON Functionality

The **Export JSON** feature allows users to download the entire sustainability project data in a structured JSON format. This can be useful for reporting, data analysis, or backups. 

- **How It Works:**
  - The system compiles all relevant project information, including metrics, progress updates, and project details.
  - Users can simply click the **Download JSON** button, and a `.json` file will be generated and downloaded automatically.
  
- **Usage:**
  This feature is accessible from the dashboard, making it easy for users to extract data at any point in time for external analysis or sharing.

![image](https://github.com/user-attachments/assets/044854a2-6713-4b14-80b2-4c8ff2440667)


## Access Ways

### Seeder File and Pre-entered Admin Data

To ensure the platform is ready for use after setup, a seeder file is included to pre-populate the database with an initial admin account. This allows for immediate access to the dashboard after the first-time deployment without manually entering credentials.

- **Admin Credentials:**
  - **Email:** `admin1@example.com`
  - **Password:** `password123`

- **Seeder File:**
  - The seeder script automatically inserts this admin user into the database when the project is set up. 
  - It ensures that there is at least one user with administrative privileges who can log in, manage the dashboard, and perform administrative functions such as adding or editing data.
  
- **Usage:**
  - After setting up the project, log in with the pre-entered admin credentials to access the full features of the dashboard, including the ability to export JSON data.
  
- **Security:**
  - It is strongly recommended to change the admin password upon the first login to ensure security.

- **Note:**
  - If anyone wants to retrieve the credentials of the admin user, they can check the seeder file for the pre-entered details.

![image](https://github.com/user-attachments/assets/165e7a4b-6bf4-4639-96cb-73b78c2a3b08)
