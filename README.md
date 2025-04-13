# Secret Link Generator

A secure web application for sharing sensitive information through self-destructing links. The application ensures that shared content can only be viewed once before being permanently deleted.

## Features

- Create one-time secret links
- End-to-end encryption
- Automatic secret destruction after viewing
- Configurable expiration times
- Dark/light mode support
- Mobile-responsive design

## Tech Stack

- Frontend:

  - React.js with TypeScript
  - Vite
  - Chakra UI
  - React Router
  - CryptoJS for encryption

- Backend:
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd secretlink
```

2. Install frontend dependencies:

```bash
npm install
```

3. Install backend dependencies:

```bash
cd server
npm install
```

4. Create a `.env` file in the server directory:

```bash
PORT=3001
MONGODB_URI=mongodb://localhost:27017/secretlink
```

5. Start MongoDB:

```bash
# Make sure MongoDB is running on your system
```

6. Start the backend server:

```bash
cd server
npm start
```

7. Start the frontend development server:

```bash
# In a new terminal
cd <project-root>
npm run dev
```

## Usage

1. Visit `http://localhost:5173` in your browser
2. Enter your secret message
3. Select an expiration time
4. Click "Create secret link"
5. Share the generated link with your recipient
6. The recipient can view the secret only once before it's destroyed

## Security Features

- Client-side encryption
- One-time access links
- Automatic secret destruction
- No storage of encryption keys
- Secure link format with encryption key in URL fragment

## Development

- Frontend development server: `npm run dev`
- Backend development server: `npm run dev` (in server directory)
- Build for production: `npm run build`

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT
