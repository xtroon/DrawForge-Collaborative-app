# DrawForge - Collaborative Whiteboard

DrawForge is a lightweight, interactive collaborative whiteboard application built with React and HTML5 Canvas. It allows users to freely express their ideas through various drawing tools and shape creation.

## 🚀 Features

- **Freehand Drawing**: Sketch your ideas naturally using the Pencil tool.
- **Shape Tools**: Quickly create structured diagrams with the Rectangle, Circle, and Line tools.
- **State Management**: Your drawing sessions are managed as discrete shapes, allowing for robust redrawing and state retention.
- **Responsive Canvas**: The whiteboard automatically sizes to fit your browser window.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript
- **Drawing API**: HTML5 Canvas API
- **Styling**: Tailwind CSS (Optional, based on classes used)

## 📦 Getting Started

### Prerequisites

Ensure you have Node.js and npm (or yarn) installed on your machine.

### Installation & Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd user-ui
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in Browser:**
   Open [http://localhost:5173](http://localhost:5173) (or the port provided by your terminal) in your browser to start drawing!

## 🏗️ Project Structure

- `src/features/Canva.tsx`: The core React component managing the canvas element, drawing events (mousedown, mousemove, mouseup), and shape state.
- `src/features/draw.ts`: Contains the pure drawing functions for different tools (`pencil`, `rectangle`, `circle`, `line`) and the redraw logic.
- `src/features/types.ts`: Defines the TypeScript interfaces for the application's data models (`Point`, `Shape`, `Rectangle`, `Circle`, etc.).

## 📝 Future Scope

- Real-time collaboration via WebSockets
- Color and stroke width selection
- Shape selection, movement, and deletion
- Undo / Redo functionality
- Exporting the canvas to an image

---
*Built to make visual collaboration seamless and fast.*
