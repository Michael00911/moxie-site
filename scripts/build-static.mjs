import { spawnSync } from 'node:child_process';

const result = spawnSync('npm', ['run', 'build'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, STATIC_EXPORT: 'true' },
});

process.exit(result.status ?? 1);
