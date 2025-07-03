# MessagingApp

A full-stack messaging application built with Django (backend) and React (frontend).

## Features

- Real-time messaging between users  
- User authentication and profiles  
- Responsive React UI with modern hooks and context  
- REST API built with Django REST Framework  
- Image upload and media management  
- Modular backend with chat and authentication apps  

## Tech Stack

- **Backend:** Django, Django REST Framework, SQLite
- **Frontend:** React, Vite, Axios  
- **Authentication:** JWT 

## Getting Started

### Prerequisites

- Python 3.x  
- Node.js and npm/yarn

### Installation

```bash
# Backend setup
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend setup (in a new terminal)
cd frontend
npm install
npm run dev
