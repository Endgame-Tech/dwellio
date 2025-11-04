# Ubani - Property Management Web Application

Ubani is a modern property management web application that facilitates property rental, buying, and selling. It provides a user-friendly interface for both tenants and landlords.

## Features

- User authentication (signup, login, password reset, email verification)
- Property listings with interactive image carousels
- Search and filter capabilities for property discovery
- Responsive design following Airbnb-style UI principles
- Role-based access control (tenant, landlord, admin)

## Tech Stack

### Frontend

- React.js with TypeScript
- React Router for navigation
- TailwindCSS for styling
- React Icons for UI elements

### Backend

- Node.js with Express
- MongoDB with Mongoose ODM
- JWT for authentication
- Bcrypt for password hashing
- Nodemailer for email functionality

## Project Structure

The project is organized into:

- `client/` - Frontend React application
- `server/` - Backend Express API
- `shared/` - Shared types and utilities

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB instance (local or Atlas)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ubani.git
cd ubani
```

2. Install dependencies for both client and server:

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Set up environment variables:

   - Create a `.env` file in the server directory with the following variables:
     ```
     PORT=3000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```

4. Run the development servers:

```bash
# Run client (from client directory)
npm run dev

# Run server (from server directory)
npm run dev
```

## License

[MIT](LICENSE)

## Contact

Your Name - youremail@example.com

Project Link: [https://github.com/yourusername/ubani](https://github.com/yourusername/ubani)
