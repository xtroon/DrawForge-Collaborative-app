# DrawForge - Collaborative Whiteboard

DrawForge is a lightweight, interactive collaborative whiteboard application built with React and HTML5 Canvas. It allows users to freely express their ideas through various drawing tools and shape creation.

## Features

- **Freehand Drawing**: Sketch your ideas naturally using the Pencil and Brush tools.
- **Shape Tools**: Quickly create structured diagrams with Rectangle, Circle, Line, Arrow, Rhombus, and more.
- **Color & Stroke Control**: Customize your drawing with different colors and stroke widths.
- **Selection & Movement**: Select, move, and resize your drawn shapes freely.
- **History System**: Full Undo and Redo functionality to easily revert or reapply actions (including erasures).
- **Real-time Collaboration**: Instantly see changes made by others in the same room.
- **Live Cursors & Online Users**: See who is currently active and where they are pointing on the board.
- **Export & Share**: Share your board with others via a link or room code, or export it as an image/PDF.
- **Responsive Canvas**: The whiteboard automatically sizes to fit your browser window, with Zoom and Pan controls.

## Tech Stack

- **Frontend**: React, TypeScript, socket.io-client, jsPDF
- **Backend**: Node.js, Express, Socket.IO, MongoDB
- **Drawing API**: HTML5 Canvas API
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

Ensure you have Node.js and npm (or yarn) installed on your machine.
You will also need a MongoDB database running.

### Installation & Setup

1. **Clone the repository and install backend dependencies:**
   ```bash
   cd server
   npm install
   ```
2. **Set up `.env` file in the `server` directory:**
   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```
3. **Start the backend server:**
   ```bash
   npm start
   ```

4. **Navigate to the frontend directory and install dependencies:**
   ```bash
   cd ../user-ui
   npm install
   ```

5. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

6. **Open in Browser:**
   Open [http://localhost:5173](http://localhost:5173) in multiple browser windows to test real-time collaboration!

## Project Structure

- `server/server.js`: Sets up Express and Socket.IO for real-time syncing of shapes, cursors, and online users.
- `user-ui/src/features/Canva.tsx`: The core React component managing the canvas element and drawing events.
- `user-ui/src/services/socket.ts`: Manages the shared Socket.IO client connection.

## Future Scope

- Configurable permissions (View-only vs Editor modes).
- More advanced shapes and templating.

---
*Built to make visual collaboration seamless and fast.*
