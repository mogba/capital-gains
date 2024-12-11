#!/usr/bin/env -S deno run --allow-read

import {
  calculateCapitalGains,
  readJsonInput,
  type Operation,
} from "./lib/index.ts";

const input = await readJsonInput<Operation[]>();
const result = await calculateCapitalGains(input);

console.log(result);

Deno.exit(0);
