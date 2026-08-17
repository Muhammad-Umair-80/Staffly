# Staffly

> A modern admin-only employee management system for managing employees, projects, documents, feedback, and archived employee records.

Staffly is a full-stack web application designed to help administrators manage employee information and company projects from a centralized dashboard.

The system provides secure admin authentication, detailed employee profiles, project management, employee archiving, document management, feedback, and administrative controls.

---

## 📸 Screenshots

> Add your project screenshots inside the `screenshots/` folder and update the filenames below.

### Login

<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/ef5fbf6d-06a3-42d0-9083-e5b931fc7c62" />


### Dashboard

<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/ce4a8c27-0747-49c5-88cc-1488c082be9d" />


### Employees

![Staffly Employees](./screenshots/employees.png)

### Employee Profile

<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/12c5669d-16f3-4785-b250-fe6d35b691b4" />

### Add Employee

<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/ba0225f8-91d8-407f-be69-da7ab1e9541d" />


### Edit Employee
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/14c46396-333f-487f-88a6-f7fcdd5b31e8" />

### Projects

<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/00a6f640-b407-48d3-b5af-4fc5668c4dff" />


### Project Profile
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/0dda8558-b919-4f2f-acfc-282673209199" />


### Archive
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/e6a9fed6-be01-4fb5-8673-785073d2bdd1" />

### Admin Management
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/913547d0-3da7-4260-b937-a88ea8eb82dd" />


---

## ✨ Features

### 🔐 Admin Authentication

- Secure admin login
- JWT-based authentication
- Protected routes
- Current admin session
- Admin-only access

### 👥 Employee Management

- Add employees
- View employee records
- Edit employee information
- Employee profile pictures
- Search employees
- Filter employees
- Employee status management
- Detailed employee profiles

### 📁 Project Management

- Create projects
- View projects
- Edit projects
- View project details
- Assign employees to projects
- Support multiple projects for a single employee

### 📄 Employee Documents

- Store employee documents
- View documents associated with employees
- Manage employee-related files

### 💬 Admin Feedback

- Add feedback for employees
- Display feedback inside employee profiles
- Keep feedback associated with the relevant employee

### 🗃️ Employee Archive

- Archive employees who leave the company
- Store leaving reason
- Store leaving date
- Store additional leaving details
- Preserve employee records
- View archived employees separately

### 👨‍💼 Admin Management

- Add administrators
- View administrators
- Edit administrator information
- Disable administrators
- Admin roles and access control

### 📊 Dashboard

- Total employees
- Active employees
- Archived employees
- Total projects
- Recent employees
- Recent projects
- Recently archived employees
- Quick actions

### 🎨 Responsive UI

- Modern admin dashboard
- Responsive layout
- Desktop support
- Tablet support
- Mobile-friendly design
- Consistent cards, forms, tables and buttons

---

## 🛠️ Tech Stack

### Frontend

- React.js
- JavaScript
- React Router
- CSS / SCSS
- Axios

### Backend

- Node.js
- Express.js
- JWT
- REST APIs

### Database

- MongoDB
- Mongoose

### Media / Storage

- ImageKit

### Development Tools

- Git
- GitHub
- VS Code
- Postman

---

## 🏗️ System Architecture

```text
                 ┌──────────────────┐
                 │     Staffly      │
                 │    Frontend      │
                 │     React        │
                 └────────┬─────────┘
                          │
                       REST API
                          │
                 ┌────────▼─────────┐
                 │      Backend     │
                 │ Node.js/Express  │
                 └────────┬─────────┘
                          │
              ┌───────────┴───────────┐
              │                       │
       ┌──────▼──────┐         ┌──────▼──────┐
       │   MongoDB   │         │   ImageKit  │
       │  Database   │         │    Media    │
       └─────────────┘         └─────────────┘
