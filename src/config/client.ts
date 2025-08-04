import { z } from 'zod'

export const CurrencyCodeSchema = z.enum(['BGN', 'EUR']);

const clientEnvSchema = z.object({
  NEXT_PUBLIC_BASE_CURRENCY_CODE: CurrencyCodeSchema.optional().default('BGN'),
  NEXT_PUBLIC_SECONDARY_CURRENCY_CODE: CurrencyCodeSchema.optional().default('EUR'),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string(),
});

function validateClientEnv() {
  try {
    const env = clientEnvSchema.parse({
      NEXT_PUBLIC_BASE_CURRENCY_CODE: process.env.NEXT_PUBLIC_BASE_CURRENCY_CODE,
      NEXT_PUBLIC_SECONDARY_CURRENCY_CODE: process.env.NEXT_PUBLIC_SECONDARY_CURRENCY_CODE,
      NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    });
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Environment validation failed:', error.errors)
    } else {
      console.error('Environment validation failed:', error)
    }
    process.exit(1)
  }
}

const clientConfig = validateClientEnv();

export default clientConfig 