export const CUT_FOR_TAX_INCIDENCE = 20_000;
export const GAIN_TAX_PERCENTAGE_DECIMAL = 0.2;
export const GAIN_TAX_PERCENTAGE = 0.2 * 100;

export const STDIN_BUFFER_LENGTH = 10240;

export const ENVIRONMENT = Deno.env.get("ENVIRONMENT");

export function isProduction() {
  return ENVIRONMENT === "production";
}
