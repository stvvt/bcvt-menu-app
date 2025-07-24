import { z } from 'zod'

const severEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().positive().default(3000),
  DATA_BASE_URL: z.string().url(),
});

function validateServerEnv() {
  try {
    const env = severEnvSchema.parse(process.env);
    return env;
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      console.error('Environment validation failed:', error.errors)
    } else {
      console.error('Environment validation failed:', error)
    }
    process.exit(1)
  }
}

const config = validateServerEnv();

export default config 