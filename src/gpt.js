const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

/**
 * @param {string} prompt
 * @param {object} options
 * @param {string} [options.size] - '1024x1024' | '1024x1536' | '1536x1024' | 'auto'
 * @param {string} [options.quality] - 'low' | 'medium' | 'high' | 'auto'
 * @param {number} [options.n] - number of images (1-10)
 * @param {string} [options.outputDir] - directory to save images
 * @param {string} [options.outputPath] - exact file path (overrides outputDir, only works with n=1)
 * @returns {Promise<Array<{filePath: string, index: number}>>}
 */
async function generateImage(prompt, options = {}) {
  const {
    size = 'auto',
    quality = 'auto',
    n = 1,
    outputDir = process.cwd(),
    outputPath,
  } = options;

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const response = await client.images.generate({
    model: 'gpt-image-2',
    prompt,
    size,
    quality,
    n,
    response_format: 'b64_json',
  });

  const timestamp = Date.now();
  const results = [];

  for (let i = 0; i < response.data.length; i++) {
    const { b64_json } = response.data[i];
    const buffer = Buffer.from(b64_json, 'base64');

    let filePath;
    if (outputPath && n === 1) {
      filePath = outputPath;
    } else {
      const suffix = n > 1 ? `_${i + 1}` : '';
      filePath = path.join(outputDir, `gpt-image-${timestamp}${suffix}.png`);
    }

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, buffer);
    results.push({ filePath, index: i + 1 });
  }

  return results;
}

module.exports = { generateImage };
