export const ENVIRONMENT = Deno.env.get("ENVIRONMENT");

export function isProduction() {
  return ENVIRONMENT === "production";
}
