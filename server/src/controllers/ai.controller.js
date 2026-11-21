const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateDiagram(req, res) {
  try {
    const { prompt, history = [], currentShapes = [], viewportCenter = { x: 400, y: 300 } } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, message: "Prompt is required" });
    }

    // Sanitize and simplify existing shapes so we don't blow token limits with raw pencil points
    const simplifiedShapes = (currentShapes || [])
      .filter((s) => s && s.type !== "eraser")
      .map((s) => {
        if (s.type === "text") {
          return {
            id: s.id,
            type: s.type,
            text: s.text,
            position: s.position,
            color: s.color,
            fontSize: s.fontSize,
          };
        }
        if (s.start && s.end) {
          return {
            id: s.id,
            type: s.type,
            start: s.start,
            end: s.end,
            color: s.color,
            strokeWidth: s.strokeWidth,
          };
        }
        return null;
      })
      .filter(Boolean);

    const systemInstruction = `
You are the intelligent AI Whiteboard Copilot for DrawForge, a collaborative sketching and diagramming whiteboard app with a doodle sketchbook aesthetic.
You have the power to:
1. CREATE diagrams, flowcharts, architectures, mindmaps, and UI wireframes.
2. ADD DETAILS or extra steps/branches to existing diagrams.
3. RECOLOR or RESTYLE specific shapes or the entire diagram to look cohesive and aesthetic.
4. REMOVE or DELETE shapes, steps, nodes, or connectors when requested.
5. PREVENT OVERLAPPING and ALIGN shapes neatly with generous padding and crisp connections.

DrawForge Specifications:
- Canvas coordinate bounds: 0 <= x <= 3600, 0 <= y <= 2400.
- Standard box dimensions: width 160-220, height 70-85.
- Spacing rules: Keep minimum 70-100px horizontal gap and 60-90px vertical gap between boxes so NOTHING EVER OVERLAPS.
- Aesthetic doodle colors:
  - Dark ink outline: "#2B2B2A"
  - Coral / Pink: "#FF6B6B"
  - Sky Cyan: "#4FC1CF"
  - Honey Yellow: "#FFC53D"
  - Lilac Purple: "#9B7EDE"
  - Mint Green: "#52C41A"
  - Muted Slate: "#64748b"

Allowed Shape Types:
1. "rounded-rectangle" or "rectangle": { "id": "uuid", "type": "rounded-rectangle", "start": {"x": 100, "y": 100}, "end": {"x": 280, "y": 175}, "color": "#2B2B2A", "strokeWidth": 2 }
2. "rhombus" (for decision / conditional nodes): { "id": "uuid", "type": "rhombus", "start": {"x": 100, "y": 100}, "end": {"x": 260, "y": 180}, "color": "#FFC53D", "strokeWidth": 2 }
3. "circle": { "id": "uuid", "type": "circle", "start": {"x": 100, "y": 100}, "end": {"x": 200, "y": 200}, "color": "#4FC1CF", "strokeWidth": 2 }
4. "arrow" (directional connectors): { "id": "uuid", "type": "arrow", "start": {"x": 280, "y": 137}, "end": {"x": 360, "y": 137}, "color": "#2B2B2A", "strokeWidth": 2 }
5. "text" (labels centered inside or next to shapes): { "id": "uuid", "type": "text", "position": {"x": 130, "y": 128}, "text": "Label", "color": "#2B2B2A", "fontSize": 16, "strokeWidth": 0 }

Behavior & Actions:
- "replace": Use when modifying existing diagram (adding detail, recoloring, removing nodes, beautifying, or anti-overlapping). Return the full updated set of shapes.
- "add": Use when adding a completely independent new diagram while keeping the previous diagram in another place.

Always reply in valid JSON adhering to:
{
  "reply": "Friendly, responsive description of what you built, modified, recolored, or removed",
  "action": "replace" | "add",
  "shapes": [ array of shapes ]
}
`;

    const userContent = `
User Instruction: "${prompt}"

Current Whiteboard Shapes (${simplifiedShapes.length} shapes):
${simplifiedShapes.length > 0 ? JSON.stringify(simplifiedShapes, null, 2) : "None (Canvas is currently empty)"}

Viewport Center: x=${Math.round(viewportCenter.x || 400)}, y=${Math.round(viewportCenter.y || 300)}

Recent Conversation History:
${(history || [])
  .slice(-6)
  .map((m) => `${m.sender || m.role || "user"}: ${m.text || m.content || ""}`)
  .join("\n") || "None"}

Please execute the user's request. Ensure:
- If adding details: preserve existing structure, add the requested new nodes with proper spacing and connecting arrows.
- If recoloring / styling: update target shapes and keep the rest intact.
- If removing: remove the requested shapes and any arrows pointing directly to/from them.
- If user says "don't overlap" or "make it look good": re-space and align all elements cleanly.
- If creating fresh: place centered near Viewport Center (between x: 200-3000, y: 150-2000).
- Provide a helpful, friendly message in "reply".
`;

    const candidateModels = ["gemini-3.5-flash-lite", "gemini-3.1-flash-lite", "gemini-3.5-flash"];
    let response = null;
    let lastError = null;

    for (const modelName of candidateModels) {
      try {
        console.log(`[AI] Processing with model: ${modelName}...`);
        response = await ai.models.generateContent({
          model: modelName,
          contents: userContent,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
          },
        });
        if (response && response.text) {
          console.log(`[AI] Success with ${modelName}!`);
          break;
        }
      } catch (err) {
        console.warn(`[AI] ${modelName} encountered: ${err.message || err.status}`);
        lastError = err;
        if (err.status === 503 || err.status === 404) {
          continue; // Try next fallback model
        }
        throw err;
      }
    }

    if (!response || !response.text) {
      throw lastError || new Error("All AI models are currently busy. Please try again in a moment.");
    }

    const data = JSON.parse(response.text);

    const shapes = (data.shapes || []).map((s) => ({
      ...s,
      id: s.id || crypto.randomUUID(),
    }));

    return res.status(200).json({
      success: true,
      reply: data.reply || "I've updated the whiteboard! ✨",
      action: data.action || (simplifiedShapes.length > 0 ? "replace" : "add"),
      shapes,
    });
  } catch (error) {
    console.error("AI Generation Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to process diagram with AI",
    });
  }
}

module.exports = { generateDiagram };
