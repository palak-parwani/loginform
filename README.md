# React Login Form with Registration and Password Reset

This project is a simple authentication form built with React, featuring login, registration, and password reset functionality. It connects to a local JSON server to handle user data. It uses React hooks for state management and React Toastify for notifications.

## Features

- **Login**: Allows users to log in with their email and password.
- **Register**: New users can create an account by providing an email, password, and confirming the password.
- **Password Reset**: Users can reset their password by entering a new password and confirming it.
- **Input Validation**: Ensures that all fields are filled in and passwords match.
- **Toast Notifications**: Provides user feedback for successful or failed actions.
- **Responsive Design**: The form is styled using Bootstrap and custom CSS for a modern look.

## Installation

To run the project locally, follow these steps:

### 1. Clone the repository

```bash
git clone https://github.com/your-username/loginform.git
cd loginform

## Technologies Used
React: A JavaScript library for building user interfaces.

React Toastify: A library for displaying notifications.

JSON Server: A simple tool to set up a mock REST API for development purposes.

Bootstrap: For responsive design and layout styling.

## How It Works
Login: The user enters their email and password. If they match an existing user in the JSON server, they are logged in.

Register: The user provides an email and password. If the email is not already registered, the new user is added to the JSON server.

Reset Password: If the user forgets their password, they can reset it by providing a new password. The new password is saved in the JSON server.

