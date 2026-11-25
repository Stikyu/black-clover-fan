// Compila el sitio en la raíz (sin /black-clover-fan) dentro de dist-check y corre las pruebas.
import { spawnSync } from 'node:child_process';

const env = { ...process.env, BASE_PATH: '/', OUT_DIR: './dist-check' };
const correr = (args) => {
  const r = spawnSync(process.execPath, args, { stdio: 'inherit', env });
  if (r.status) process.exit(r.status);
};
correr(['node_modules/astro/bin/astro.mjs', 'build']);
if (!process.argv.includes('--solo-compilar')) correr(['--test', 'tests/sitio.test.mjs']);
