#!/usr/bin/env node

const { generateImage } = require('./src/index');

const args = process.argv.slice(2);

if (args.length < 2 || args[0] === '--help' || args[0] === '-h') {
  console.log(`
image-master — generate images with GPT Image 2 or Nano Banana Pro

Usage:
  image-master <model> <prompt> [options]

Models:
  gpt    GPT Image 2 (OpenAI)   requires OPENAI_API_KEY
  nano   Nano Banana Pro (Google) requires GOOGLE_AI_API_KEY

Options:
  --output, -o <path>      Save to exact file path
  --dir, -d <dir>          Output directory (default: current dir)
  --size <size>            GPT only: 1024x1024 | 1024x1536 | 1536x1024 | auto
  --quality <q>            GPT only: low | medium | high | auto
  --n <number>             GPT only: number of images (1-10)
  --aspect <ratio>         Nano only: 1:1 | 16:9 | 9:16 | 4:3 | 3:4
  --image-size <size>      Nano only: 1K | 2K | 4K
  --model <id>             Nano only: flash | pro | preview | exact model id
  --ref <path>             Nano only: reference image path (repeatable)

Examples:
  image-master gpt "A cyberpunk city at night" --size 1024x1536
  image-master nano "Watercolor map of Tokyo" --aspect 16:9 --image-size 2K
  image-master nano "Style transfer" --ref ./photo.jpg --output ./result.png
`);
  process.exit(0);
}

const model = args[0];
const promptParts = [];
const options = {};
const refs = [];

for (let i = 1; i < args.length; i++) {
  const flag = args[i];
  const next = () => {
    if (i + 1 >= args.length) { console.error(`Missing value for ${flag}`); process.exit(1); }
    return args[++i];
  };

  switch (flag) {
    case '--output': case '-o': options.outputPath = next(); break;
    case '--dir': case '-d': options.outputDir = next(); break;
    case '--size': options.size = next(); break;
    case '--quality': options.quality = next(); break;
    case '--n': options.n = parseInt(next(), 10); break;
    case '--aspect': options.aspectRatio = next(); break;
    case '--image-size': options.imageSize = next(); break;
    case '--model': options.model = next(); break;
    case '--ref': refs.push(next()); break;
    default:
      if (flag.startsWith('-')) { console.error(`Unknown flag: ${flag}`); process.exit(1); }
      promptParts.push(flag);
  }
}

if (refs.length > 0) options.referenceImages = refs;

const prompt = promptParts.join(' ');
if (!prompt) { console.error('Error: prompt is required'); process.exit(1); }

generateImage(model, prompt, options)
  .then(results => {
    for (const r of results) {
      console.log(`[${r.index}] ${r.filePath}`);
    }
  })
  .catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
