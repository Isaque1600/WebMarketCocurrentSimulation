# WebMarketConcurrentSimulation

API de simulacao de marketplace para estudo de paradigmas e fluxo de pedidos.

O projeto expoe endpoints para:

- consultar produtos e estoque;
- criar pedidos com itens;
- atualizar status de pagamento de pedidos.

## Como executar

1. Instale as dependencias:

```bash
pnpm install
```

1. Rode o servidor de desenvolvimento:

```bash
pnpm dev
```

1. A API estara disponivel em:

```text
http://localhost:3000
```

## Rotas

### Produtos

#### GET /products

Retorna a lista completa de produtos.

- Uso: listar catalogo e estoque atual.
- Resposta de sucesso: `200 OK` com array de produtos.

#### GET /products/:id

Retorna um produto especifico pelo identificador.

- Parametro de rota: `id` (numero).
- Resposta de sucesso: `200 OK` com o produto.
- Erro: `404 Not Found` quando o produto nao existe.

### Pedidos

#### POST /orders

Cria um novo pedido para um usuario com uma lista de itens.

- Body esperado:

```json
{
  "userId": 1,
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 3, "quantity": 1 }
  ]
}
```

- Comportamento:
  - cria o pedido com status inicial `PENDING`;
  - cria os itens do pedido com precos calculados.
- Resposta de sucesso: `201 Created` com `order` e `items`.
- Erro: `400 Bad Request` para body invalido.

#### PATCH /orders/:id/status

Atualiza o status de pagamento de um pedido existente.

- Parametro de rota: `id` (numero).
- Body esperado:

```json
{
  "paymentStatus": "PENDING"
}
```

- Valores aceitos em `paymentStatus`:
  - `PENDING`
  - `DENIED`
  - `ACCEPTED`
- Comportamento:
  - se o pedido nao existir, retorna `404 Not Found`;
  - se o status for invalido, retorna `400 Bad Request`;
  - quando status muda para `DENIED`, o estoque dos itens do pedido e reestabelecido.
- Resposta de sucesso: `200 OK` com o pedido atualizado.- Resposta de sucesso: `200 OK` com o pedido atualizado.
