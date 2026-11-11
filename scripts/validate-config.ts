import { config } from '../src/content/birthday.config';
import { validateConfig } from '../src/validation/validate';

const { errors, warnings } = validateConfig(config);
console.log(`Config mode: ${config.mode}`);
warnings.forEach((w) => console.log(`  warning: ${w}`));
errors.forEach((e) => console.error(`  ERROR: ${e}`));
if (errors.length) {
  console.error(`${errors.length} error(s). Fix src/content/birthday.config.ts.`);
  process.exit(1);
}
console.log('Config OK.');
