### Project Management Tool

This project is a full-stack application for managing projects. Below are the steps to set up and run the project.

---

### Prerequisites

Ensure you have the following installed on your system:
- Node.js (v16 or later)
- npm (Node Package Manager)
- TypeScript (globally installed: `npm install -g typescript`)
- A modern web browser

---

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd project-management-tool
   ```

2. Install dependencies for both client and server:
   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```

---

### Running the Project

#### Server Side
1. Compile TypeScript files to JavaScript:
   ```bash
   tsc --outDir ./dist
   ```

2. Start the server:
   ```bash
   node ./dist/index.js
   ```

3. The server will run on `http://localhost:5000` by default.

#### Client Side
1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. The client will run on `http://localhost:3000` by default.

---

### Folder Structure

- `client/`: Contains the frontend code (React application).
- `server/`: Contains the backend code (Node.js with Express).
- `dist/`: Compiled server-side JavaScript files.

---

### Environment Variables

Create a `.env` file in the `server` directory with the following variables:
```
PORT=5000
DATABASE_URL=<your-database-url>
JWT_SECRET=<your-secret-key>
```

---

### Build for Production

#### Client
1. Build the React application:
   ```bash
   npm run build
   ```

2. The production-ready files will be in the `client/build` directory.

#### Server
1. Compile the TypeScript files:
   ```bash
   tsc --outDir ./dist
   ```

2. Deploy the `dist` folder along with the necessary environment variables.

---

### Testing

#### Server
Run tests using:
```bash
npm test
```

#### Client
Run tests using:
```bash
npm test
```

---

### Troubleshooting

- Ensure all dependencies are installed correctly.
- Verify that the `.env` file is properly configured.
- Check if the required ports (3000 and 5000) are available.

---
