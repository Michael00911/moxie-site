import fs from 'fs';
import path from 'path';
import { tools } from '../src/lib/data';
import { generateBadgeSvg } from '../src/lib/badgeSvgGenerator';

const outputDir = path.join(__dirname, '..' , 'public', 'badges');

async function main() {
  // Ensure the output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const tool of tools) {
    const svgContent = generateBadgeSvg(tool.slug);
    const filePath = path.join(outputDir, `${tool.slug}.svg`);
    fs.writeFileSync(filePath, svgContent);
    console.log(`Generated badge for ${tool.slug} at ${filePath}`);
  }
  console.log('All badges generated!');
}

main().catch(console.error);
