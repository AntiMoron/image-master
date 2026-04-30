require('dotenv').config();

const gpt = require('./gpt');
const nano = require('./nano');

/**
 * Generate images with GPT Image 2 or Nano Banana Pro (Google Gemini).
 *
 * @param {'gpt' | 'nano'} model
 * @param {string} prompt
 * @param {object} [options] - model-specific options passed through
 * @returns {Promise<Array<{filePath: string, index: number}>>}
 *
 * @example
 * const { generateImage } = require('./src');
 * const results = await generateImage('gpt', 'A cyberpunk city at night', { size: '1024x1536' });
 * console.log(results[0].filePath);
 *
 * @example
 * const results = await generateImage('nano', 'Watercolor map of Tokyo', {
 *   aspectRatio: '16:9',
 *   referenceImages: ['./ref.jpg'],
 * });
 */
async function generateImage(model, prompt, options = {}) {
  switch (model) {
    case 'gpt':
    case 'gpt-image-2':
      return gpt.generateImage(prompt, options);

    case 'nano':
    case 'nano-banana-pro':
    case 'gemini':
      return nano.generateImage(prompt, options);

    default:
      throw new Error(`Unknown model "${model}". Use "gpt" or "nano".`);
  }
}

module.exports = { generateImage, gpt, nano };
