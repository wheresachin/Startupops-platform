const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Using gemini-2.0-flash as it is a valid model available in the API
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// Helper function for retry logic
const generateContentWithRetry = async (prompt, retries = 5, delay = 10000) => {
    try {
        return await model.generateContent(prompt);
    } catch (error) {
        // Debug log to ensure we catch the error
        console.log(`[DEBUG] Gemini Error: ${error.message}`);

        if (retries > 0 && (error.message.includes('429') || error.message.includes('Quota'))) {
            console.log(`Gemini Rate Limit hit. Retrying in ${delay / 1000}s... (Retries left: ${retries})`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return generateContentWithRetry(prompt, retries - 1, delay * 2); // Exponential backoff
        }
        throw error;
    }
};

/**
 * Generate a comprehensive pitch script based on startup data
 */
const generatePitchScript = async (startupData, customPrompt) => {
    const prompt = `You are an expert startup pitch consultant. Create a compelling investor pitch script based on the following startup information:

Startup Name: ${startupData.name}
Description: ${startupData.description}
Problem: ${startupData.problem || 'Not specified'}
Solution: ${startupData.solution || 'Not specified'}
Target Market: ${startupData.market || 'Not specified'}
Stage: ${startupData.stage || 'Early Stage'}

${customPrompt ? `\n--- FOUNDER INPUT ---\nThe founder has sent this message: "${customPrompt}"\n---------------------\n\nINSTRUCTIONS:\n1. If the input is a greeting (e.g., "hi"), question, or general request, simply REPLY DIRECTLY to the founder in a helpful, conversational manner. Do NOT generate the full pitch script in this case.\n2. If the input is a specific instruction for the pitch (e.g., "focus on AI", "make it short"), or if there is no input, generates the full pitch script following the structure below, incorporating the instructions.\n` : ''}

Generate a professional pitch script with the following sections (ONLY if generating a full script):
1. Opening Hook (30 seconds)
2. The Problem (1 minute)
3. The Solution (1 minute)
4. Market Opportunity (45 seconds)
5. Business Model (45 seconds)
6. Traction & Milestones (1 minute)
7. Team Introduction (30 seconds)
8. The Ask (30 seconds)
9. Closing Statement (30 seconds)

For each section, provide:
- What to say (exact script)
- Key points to emphasize
- Suggested tone/delivery

Make it conversational, confident, and investor-ready. Total pitch should be 6-7 minutes.`;

    try {
        const result = await generateContentWithRetry(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error generating pitch script:', error.message);
        throw new Error(`Failed to generate pitch script: ${error.message}`);
    }
};

/**
 * Generate a presentation outline (slide-by-slide)
 */
const generatePresentationOutline = async (startupData) => {
    const prompt = `You are an expert presentation designer. Create a detailed slide-by-slide presentation outline for an investor pitch based on this startup:

Startup Name: ${startupData.name}
Description: ${startupData.description}
Problem: ${startupData.problem || 'Not specified'}
Solution: ${startupData.solution || 'Not specified'}
Target Market: ${startupData.market || 'Not specified'}
Stage: ${startupData.stage || 'Early Stage'}

Create a 10-12 slide presentation outline with:
- Slide number and title
- Key content points (bullet points)
- Visual suggestions (charts, images, icons)
- Design notes

Format as JSON with this structure:
{
  "slides": [
    {
      "number": 1,
      "title": "Slide Title",
      "content": ["Point 1", "Point 2"],
      "visuals": "Suggested visual elements",
      "notes": "Design/delivery notes"
    }
  ]
}`;

    try {
        const result = await generateContentWithRetry(prompt);
        const response = await result.response;
        const text = response.text();

        // Robust JSON extraction
        let jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');

        // Find the first '{' and last '}' to extract the JSON object
        const firstOpen = jsonText.indexOf('{');
        const lastClose = jsonText.lastIndexOf('}');

        if (firstOpen !== -1 && lastClose !== -1) {
            jsonText = jsonText.substring(firstOpen, lastClose + 1);
        }

        try {
            return JSON.parse(jsonText);
        } catch (parseError) {
            console.warn('JSON parse failed, returning raw text structure:', parseError.message);
            // Fallback: create a simple structure with the raw text
            return { slides: [{ number: 1, title: 'AI Presentation Draft', content: [text], visuals: '', notes: 'Parsed as raw text due to formatting error' }] };
        }
    } catch (error) {
        console.error('Error generating presentation:', error.message);
        throw new Error(`Failed to generate presentation: ${error.message}`);
    }
};

/**
 * Generate Q&A preparation (common investor questions and answers)
 */
const generateQAPrep = async (startupData) => {
    const prompt = `You are an investor relations expert. Based on this startup information, generate the top 10 questions investors are likely to ask, along with strong, confident answers.

Startup Name: ${startupData.name}
Description: ${startupData.description}
Problem: ${startupData.problem || 'Not specified'}
Solution: ${startupData.solution || 'Not specified'}
Target Market: ${startupData.market || 'Not specified'}
Stage: ${startupData.stage || 'Early Stage'}

For each question, provide:
1. The question investors will ask
2. A strong, confident answer (2-3 sentences)
3. Key data points to mention (if applicable)

Format as JSON:
{
  "qa": [
    {
      "question": "Question text",
      "answer": "Answer text",
      "keyPoints": ["Point 1", "Point 2"]
    }
  ]
}`;

    try {
        const result = await generateContentWithRetry(prompt);
        const response = await result.response;
        const text = response.text();

        // Robust JSON extraction
        let jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');

        const firstOpen = jsonText.indexOf('{');
        const lastClose = jsonText.lastIndexOf('}');

        if (firstOpen !== -1 && lastClose !== -1) {
            jsonText = jsonText.substring(firstOpen, lastClose + 1);
        }

        try {
            return JSON.parse(jsonText);
        } catch (parseError) {
            console.warn('JSON parse failed for Q&A, returning raw text structure:', parseError.message);
            return { qa: [{ question: 'AI Generated Q&A', answer: text, keyPoints: [] }] };
        }
    } catch (error) {
        console.error('Error generating Q&A:', error.message);
        throw new Error(`Failed to generate Q&A: ${error.message}`);
    }
};

module.exports = {
    generatePitchScript,
    generatePresentationOutline,
    generateQAPrep,
};
