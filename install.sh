#!/usr/bin/env bash
set -e

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILL_DIR="$HOME/.claude/skills/image-master"

echo "Installing image-master skill..."

# 1. Install Node.js dependencies
echo "  npm install..."
npm install --prefix "$REPO_DIR" --silent

# 2. Create skill dir and copy files
mkdir -p "$SKILL_DIR"
cp "$REPO_DIR/skill.md"     "$SKILL_DIR/skill.md"
cp "$REPO_DIR/prompts.json" "$SKILL_DIR/prompts.json"

# 3. Write config so skill.md knows where the scripts live
cat > "$SKILL_DIR/config.json" <<EOF
{
  "repoDir": "$REPO_DIR"
}
EOF

echo ""
echo "✓ Skill installed to $SKILL_DIR"
echo ""
echo "Next: set API keys and start using /image-master"
echo ""
echo "  export OPENAI_API_KEY=sk-..."
echo "  export GOOGLE_AI_API_KEY=AIza..."
echo ""
echo "To refresh prompts from the upstream repos:"
echo "  node $REPO_DIR/scripts/fetch-prompts.js"
