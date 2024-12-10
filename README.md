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
