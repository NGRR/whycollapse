// Reproducible static bundle from the current build; no framework or dependency.
import { cp, mkdir } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
for (const item of ['index.html','assets','components','pages','iao','adaptive-thinking']) {
  await cp(`protea_vivo/${item}`, `dist/${item}`, { recursive: true });
}
