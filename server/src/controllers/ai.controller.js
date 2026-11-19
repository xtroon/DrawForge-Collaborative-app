const { GoogleGenAI, Type } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateDiagram(req, res) {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, message: "Prompt is required" });
    }

    const systemInstruction = `
      You are an expert system diagram and flowchart generator for a collaborative whiteboard app called DrawForge.
      Given a user's request, produce a clean array of geometric shapes and text shapes that form a well-spaced diagram.

      Coordinate Rules:
      - Start coordinates around x: 150, y: 150.
      - Standard box size: width 160-200, height 70-90.
      - Keep clear horizontal spacing (e.g., 80-120px between boxes) or vertical spacing.
      - Connect boxes using "arrow" shapes pointing from the border of one box to another.
      - Put a "text" shape centered inside or near each box.
      
      Available shape types:
      1. "rounded-rectangle" or "rectangle": { id, type, start: {x, y}, end: {x, y}, color: "#18181b", strokeWidth: 2 }
      2. "rhombus" (for decisions): { id, type, start: {x, y}, end: {x, y}, color: "#eab308", strokeWidth: 2 }
      3. "arrow": { id, type, start: {x, y}, end: {x, y}, color: "#3b82f6", strokeWidth: 2 }
      4. "text": { id, type, position: {x, y}, text: "...", color: "#18181b", fontSize: 16 }

      Always output a valid JSON object with a single "shapes" array.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const data = JSON.parse(response.text);

    // give each shape a unique id if not provided
    const shapes = (data.shapes || []).map((s) => ({
      ...s,
      id: s.id || crypto.randomUUID(),
    }));

    return res.status(200).json({ success: true, shapes });
  } catch (error) {
    console.error("AI Generation Error:", error);
    return res.status(500).json({ success: false, message: "Failed to generate diagram" });
  }
}

module.exports = { generateDiagram };