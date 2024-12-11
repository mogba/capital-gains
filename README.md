Considerações:

- Cada linha é um conjunto de operações de compra ou venda ocorridas em sequência.
- Cada linha deve ter um resultado independente. O estado deve ser guardado apenas entre operações de mesma linha,
- Nenhuma operação vai vender mais ações do que você tem naquele momento. Por exemplo, a primeira operação será sempre de compra.
- Em operações de compra de ações, deve-se recalcular o preço médio ponderado utilizando essa fórmula:
- nova-média-ponderada = ((quantidade-de-ações-atual _ média-ponderada-atual) + (quantidade-de-ações-compradas _ valor-de-compra)) / (quantidade-de-ações-atual + quantidade-de-ações-compradas)
- Por exemplo, se você comprou 10 ações por R$ 20,00, vendeu 5, depois comprou outras 5 por R$ 10,00, a média ponderada é ((5 x 20.00) + (5 x 10.00)) / (5 + 5) = 15.00.
- Entrada:
  [{ "operation": "buy", "unit-cost": 10.00, "quantity": 10000 }, { "operation": "sell", "unit-cost": 20.00, "quantity": 5000 }],
  [{ "operation": "buy", "unit-cost": 20.00, "quantity": 10000 }, { "operation": "sell", "unit-cost": 10.00, "quantity": 5000 }]
- Retorno:
  [{ "tax": 0.00 }, { "tax": 10000.00 }],
  [{ "tax": 0.00 }, { "tax": 0.00 }]

Exercício:

1. Calcular preço médio ponderado.
2. Verificar se operação resultou em prejuízo ou lucro:

- Se o valor total da operação (custo unitário da ação x quantidade) for menor que o preço médio ponderado de compra, então houve prejuízo.
- Se o valor total da operação (custo unitário da ação x quantidade) for maior que o preço médio ponderado de compra, então houve lucro.

3. Verificar se paga imposto:

- Se for operação de compra, não paga imposto.
- Se for operação de venda com valor total da operação (custo unitário da ação x quantidade) for menor que R$ 20000,00, não paga imposto.
- Se houve prejuízo, não paga imposto.
- Se houve lucro, paga imposto de 20% sobre o lucro.

| Name      | Meaning                                                 |
| --------- | ------------------------------------------------------- |
| operation | Whether the operation is a buy or sell                  |
| unit-cost | Unit price of the stock in a currency with two decimals |
| quantity  | Number of stocks traded                                 |

Example input:

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

| Name | Meaning                                |
| ---- | -------------------------------------- |
| tax  | The amount of tax paid in an operation |

Example output:

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

## Decision making

### Simplicity-driven design

I took a "solve the problem first, build up when necessary" approach, by sticking to solving the proposed problem in a way that prioritizes modularity and reasonable organization in the folder structure, while avoiding unnecessary abstractions or boilerplate and still making good use of the Open-Closed Principle.

While ... talk about, when possible, preferring implementing algorithms manually instead of importing external dependencies.

### Deno

Deno is a batteries-included runtime and greatly facilitate the project bootstrap. It prioritizes security by default, as no file, network or environment access is allowed unless explicity granted via flags, such as `--allow-read` and `--allow-net`.

Furthermore, the standard library is very powerfull, providing built-in support for TypeScript, bundling, testing, formatting and linting. In alternative runtimes, many other libraries are required to make everything work, adding up to the app configuration's complexity.

Last, but not least, Deno enables the development, deployment and project management chores to be straightforward and one of the main reasons is that it removes head-aches like dependency management or manual version conflict resolution mess as seen in more generally used runtimes.

### Additional code

## Project setup

### Building

### Executing

To facilitate the execution of the project, the `main.ts` file was made into an executable.

To turn the file into an executable, the following line was added as the first line:

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

Sua solução deve conter um arquivo de README com:
● Instruções sobre como compilar e executar o projeto;
● Instruções sobre como executar os testes da solução;
● Notas adicionais que você considere importantes para a avaliação.
