/**
 * Converts strings from kebab case to camel case.
 *
 * Example:
 *
 * Input: "{ 'operation': 'buy', 'unit-cost': 10.00, 'quantity': 10000 }"
 *
 * Output: "{ 'operation': 'buy', 'unitCost': 10.00, 'quantity': 10000 }"
 * @param input A string structure such as a JSON with kebab case properties
 * @returns Outputs a string with kebab case terms parsed to camel case
 */
export function kebabToCamel(input: string): string {
  return input.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}
