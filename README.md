# EduPlay - School Management Backend

EduPlay is an interactive school management system specifically designed for grade 1 to 3 students, with an added twist of educational games to make learning more engaging and enjoyable. This README provides an overview of the backend component of the EduPlay project.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Database](#database)
- [Contributing](#contributing)
- [License](#license)

## Introduction

EduPlay aims to provide a user-friendly and interactive platform for young students, teachers, and parents to facilitate effective learning and school management. The backend component is built using Express.js, a Node.js web application framework, to handle the server-side logic and API endpoints.

## Features

- **User Management**: Manage students, teachers, and parents' accounts.
- **Assessment Management**: Create, update, and delete quizzes for grade 1 to 3.
- **Interactive Games**: Integrate educational games to make learning fun.
- **Security**: Implement secure user authentication and authorization.
- **Scalability**: Built to scale as your user base grows.

## Prerequisites

Before getting started, ensure you have the following installed:

- Node.js
- NPM (Node Package Manager)
- MongoDB (or another compatible database)

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/yourusername/eduplay-backend.git

2. Navigate to the project directory:
    cd eduplay-backend

3. Install the required dependencies:
    npm install

## Getting Started
Set up a MongoDB database and configure the connection in the .env file.

Start the server: npm start
The backend server should now be running and accessible at http://localhost:5000 by default.

## API Endpoints
* User Management
    * /api/v1/Admin: Admin registration and authentication endpoints.
    * /api/v1/Student: Student registration and authentication endpoints.
    * /api/v1/Teacher: Teacher registration and authentication endpoints.
* Assessment Management
* Score Tracking
* Games Integration
  

## Database
EduPlay uses MongoDB as the database. You can configure the database connection in the .env file.

## Contributors
<a href="https://github.com/ReiTony/EduPlay_Back-End/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ReiTony/EduPlay_Back-End" />
</a>

## License
This project is licensed under the MIT License - see the LICENSE file for details.
