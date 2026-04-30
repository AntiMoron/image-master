const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');

const MODELS = {
  flash: 'gemini-2.5-flash-image',
  pro: 'gemini-3-pro-image-preview',
  preview: 'gemini-3.1-flash-image-preview',
};

/**
 * @param {string} prompt
 * @param {object} options
 * @param {string} [options.model] - 'flash' | 'pro' | 'preview' | exact model id
 * @param {string} [options.aspectRatio] - '1:1' | '16:9' | '9:16' | '4:3' | '3:4'
 * @param {string} [options.imageSize] - '1K' | '2K' | '4K'
 * @param {string[]} [options.referenceImages] - array of local image file paths
 * @param {string} [options.outputDir] - directory to save images
 * @param {string} [options.outputPath] - exact file path for single output
 * @returns {Promise<Array<{filePath: string, index: number, mimeType: string}>>}
 */
async function generateImage(prompt, options = {}) {
  const {
    model = 'flash',
    aspectRatio = '1:1',
    imageSize,
    referenceImages = [],
    outputDir = process.cwd(),
    outputPath,
  } = options;

  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY });

  const modelId = MODELS[model] || model;

  const contents = [{ text: prompt }];

  for (const imagePath of referenceImages) {
    const data = fs.readFileSync(imagePath).toString('base64');
    const ext = path.extname(imagePath).slice(1).toLowerCase();
    const mimeType = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
    contents.push({ inlineData: { mimeType, data } });
  }

  const imageConfig = { aspectRatio };
  if (imageSize) imageConfig.imageSize = imageSize;

  const response = await ai.models.generateContent({
    model: modelId,
    contents,
    config: {
      responseModalities: ['TEXT', 'IMAGE'],
      imageConfig,
    },
  });

  const timestamp = Date.now();
  const results = [];
  let imgIndex = 0;

  for (const part of response.candidates[0].content.parts) {
    if (!part.inlineData) continue;

    imgIndex++;
    const { mimeType, data } = part.inlineData;
    const ext = mimeType.split('/')[1] || 'png';
    const buffer = Buffer.from(data, 'base64');

    let filePath;
    if (outputPath && imgIndex === 1) {
      filePath = outputPath;
    } else {
      filePath = path.join(outputDir, `nano-image-${timestamp}_${imgIndex}.${ext}`);
    }

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, buffer);
    results.push({ filePath, index: imgIndex, mimeType });
  }

  return results;
}

module.exports = { generateImage, MODELS };
