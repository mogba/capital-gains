# Capital Gains

This is a project developed to assert my problem solving and logical reasoning skills.

As a previous job interviewer in IT and as an interviewee, I know for a fact that organization and proactivity are great qualities to have, both in interview processes and in a day-to-day basis. When we care for what we create, we feel good and motivated to work and create even greater things, which acts in benefit for the engineer and their peers and the software we're building together as a community.

## Train of tought

When first starting the project, I listed all business rules in order to create small and predictable tasks, which greatly facilitated the development by making the requirements explicit and helped to keep concepts organized, enabling frequent and manageable commits with continuous delivery, besides isolating requirements physically in the codebase.

These were the considerations:

- Each line is a group of buy or sell operations, which occurred in the sequence they're provided.
- Each line must have an independent result. The state should not be kept between operation lines, only within the operation itself.
- No operation will sell more shares that there are available. For instance, the first operation will always be a buy operation.

And these were the small, manageable tasks which needed to be completed in order to correctly calculate taxes:

1. When processing a buy operation, the weighted mean price should be calculated and stored to be used by subsequent operations.
2. When processing a buy operation, there are not taxes.
3. When processing a sell operation, the tax incidence will depend on a series of criteria.
4. When the total operation value (unit cost X quantity) is lower than the cut for tax incidence, there are no taxes.
5. When the unit cost is lower than the weighted mean price, there is loss, in which there are not taxes.
6. Losses should be deduced from subsequent gains, thus losses should be stored as total loss.
7. When the unit cost is higher than the weighted mean price, there is gain.
8. After deducing total loss from gains, if total loss is higher than gains, then gains will be zeroed, in which case there are no taxes.
9. After deducing total loss from gains, if total loss is zeroed and gains are still positive, then there are taxes.
10. Taxes should incide on gains that are still positive after deducing losses for operations which total value is equal to or higher than the cut for tax incidence.

### Glossary

#### Input

| Name      | Meaning                                                 |
| --------- | ------------------------------------------------------- |
| operation | Whether the operation is a buy or sell                  |
| unit-cost | Unit price of the stock in a currency with two decimals |
| quantity  | Number of stocks traded                                 |

Example:

```json
[
  { "operation": "buy", "unit-cost": 10.00, "quantity": 10000 },
  { "operation": "sell", "unit-cost": 20.00, "quantity": 5000 },
],
[
  { "operation": "buy", "unit-cost": 20.00, "quantity": 10000 },
  { "operation": "sell", "unit-cost": 10.00, "quantity": 5000 },
]
```

#### Output

| Name | Meaning                                |
| ---- | -------------------------------------- |
| tax  | The amount of tax paid in an operation |

Example:

```json
[
  { "tax": 0.00 },
  { "tax": 10000.00 },
],
[
  { "tax": 0.00 },
  { "tax": 0.00 },
]
```

### Simplicity-driven design

My approach to projects like this is usually to first solve the problem and then build uppon the initial features and structure when necessary.

The project was set up prioritizing modularity in an organized folder structure, while avoiding unnecessary abstractions or boilerplate and still making good use of the Open-Closed Principle.

While I do like to keep things simple, I usually prefer not to install dependencies if the problem I need to solve is simple enough to be implemented by my own and/or there are snippets available online. Things like calculations, data processing algorithms, such mapping or transforming of data, I usually prefer to do it and make this part of the code my own responsibility. The main reasons are that: 1. I love to code algorithms and see what I'm developing grow up and take form; and 2. I cannot garantee the quality of a third-party dependency, but I can garantee the quality of the code I orchestrated.

### Deno

Deno is a batteries-included runtime and greatly facilitate the project bootstrap. It prioritizes security by default, as no file, network or environment access is allowed unless explicity granted via flags, such as `--allow-read` and `--allow-net`.

Furthermore, the standard library is very powerfull, providing built-in support for TypeScript, bundling, testing, formatting and linting. In alternative runtimes, many other libraries are required to make everything work, adding up to the app configuration's complexity.

Last, but not least, Deno enables the development, deployment and project management chores to be straightforward and one of the main reasons is that it removes head-aches like dependency management or manual version conflict resolution mess as seen in more generally used runtimes.

### Additional efforts

Some additional utility functions were created to help keep good standards in the project. The word case parser was created to avoid having to directly reference kebab case within a camel case codebase. There is also a utility routine to read the input in a standard way, which can be used anywhere in the app.

## Project setup

### Building

<!-- TODO -->

### Executing

To facilitate the execution of the project, the `main.ts` file was made into an executable.

To turn the file into an executable, the following instruction was added as the first line:

`#!/usr/bin/env -S deno run --allow-read`

The second step was to set executable permission to the file using the following command:

`chmod +x main.ts`

Both these steps were already accomplished and the file is ready to be executed.

Finally, to run the project, run the following command:

`echo "<input>" | ./main.ts`

For the input, make sure it has a valid JSON format. An error message will be printed if the format is invalid.

You can pass the input in the following formats:

- An array by line (without commas):
  ```
  [{ "operation": "buy", "unit-cost": 10, "quantity": 100 }]
  [{ "operation": "buy", "unit-cost":10, "quantity": 100}, { "operation": "sell", "unit-cost": 15, "quantity": 50 }]
  ```
- An array of arrays:
  ```
  [
    [{ "operation": "buy", "unit-cost": 10, "quantity": 100 }],
    [{ "operation": "buy", "unit-cost":10, "quantity": 100}, { "operation": "sell", "unit-cost": 15, "quantity": 50 }]
  ]
  ```
- A single object:
  ```
  { "operation": "buy", "unit-cost": 10, "quantity": 100 }
  ```

The result will be always printed using the same format:

```
[
  [ { tax: 0 } ],
  [ { tax: 0 }, { tax: 0 } ]
]
```

### Executing tests

To execute tests, run the command:

```
deno task test
```

There are unit tests for the main calculation routine and integration tests to make sure the project is working when calling it throught the terminal.

The unit tests were created based on the provided assertion cases from the documentation and it should cover important use cases for gains, losses and taxes calculation.

The integration tests check the behavior of the project's extreme edge cases, an area that is more technical in comparison to what the standard unit tests cover. In order to run, the integration tests require additional permissions, such as `--allow-read` and `--allow-run`, which are already configured in the 'test' task mentioned above.
