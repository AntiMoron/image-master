#!/usr/bin/env node
/**
 * Fetches prompts from awesome-gpt-image-2 and awesome-nano-banana-pro-prompts READMEs
 * and saves them to ~/.claude/skills/image-master/prompts.json
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const OUTPUT_PATH = path.join(os.homedir(), '.claude/skills/image-master/prompts.json');

function fetchReadme(repo) {
  const raw = execSync(
    `gh api repos/YouMind-OpenLab/${repo}/contents/README_zh.md --jq '.content'`,
    { encoding: 'utf8' }
  ).trim();
  return Buffer.from(raw, 'base64').toString('utf8');
}

function parsePrompts(markdown, model) {
  const prompts = [];
  // Split on "### No. N:" headings
  const sections = markdown.split(/(?=### No\. \d+:)/);

  for (const section of sections) {
    const titleMatch = section.match(/^### No\. \d+: (.+)/);
    if (!titleMatch) continue;

    const title = titleMatch[1].trim();

    // Description
    const descMatch = section.match(/#### 📖 描述\n\n([\s\S]*?)(?=####|$)/);
    const description = descMatch ? descMatch[1].trim() : '';

    // Prompt content (inside triple backtick block after #### 📝 提示词)
    const promptMatch = section.match(/#### 📝 提示词\n+```[\w]*\n([\s\S]*?)```/);
    const content = promptMatch ? promptMatch[1].trim() : '';

    // Featured
    const featured = section.includes('⭐-Featured');

    // Language
    const langMatch = section.match(/Language-([A-Z-]+)/);
    const language = langMatch ? langMatch[1] : 'EN';

    // Raycast friendly
    const raycast = section.includes('Raycast_Friendly');

    // Try url
    const urlMatch = section.match(/\[👉 立即尝试 →\]\((https?:\/\/[^\)]+)\)/);
    const url = urlMatch ? urlMatch[1] : '';

    // Categories from badges (use case / style / subject) — not in README directly,
    // but we can infer from title keywords roughly; skip for now.

    if (content) {
      prompts.push({ title, description, content, model, featured, language, raycast, url });
    }
  }

  return prompts;
}

console.log('Fetching GPT Image 2 prompts...');
const gptReadme = fetchReadme('awesome-gpt-image-2');
const gptPrompts = parsePrompts(gptReadme, 'gpt');
console.log(`  Found ${gptPrompts.length} prompts`);

console.log('Fetching Nano Banana Pro prompts...');
const nanoReadme = fetchReadme('awesome-nano-banana-pro-prompts');
const nanoPrompts = parsePrompts(nanoReadme, 'nano');
console.log(`  Found ${nanoPrompts.length} prompts`);

const all = [...gptPrompts, ...nanoPrompts];
const output = {
  updated: new Date().toISOString(),
  total: all.length,
  gpt: gptPrompts.length,
  nano: nanoPrompts.length,
  prompts: all,
};

fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf8');
console.log(`\nSaved ${all.length} prompts → ${OUTPUT_PATH}`);
