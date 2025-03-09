#!/usr/bin/env -S deno run --allow-read

import { readJsonInput } from "./lib/input/input-reader.ts";
import { calculateCapitalGains } from "./lib/operation/calculator.ts";
import type { Operation } from "./lib/operation/calculator.types.ts";

const input = await readJsonInput<Operation[]>();
const result = calculateCapitalGains(input);

result.forEach((line) => console.log(JSON.stringify(line)));

Deno.exit(0);
