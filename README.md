
![Logo](https://gallery-cdn.breezy.hr/65ab3264-97fb-4d3c-9c05-d4f88988da7c/logo-full-verde.png)


# Lemon API

Nem todos os clientes que desejam fazer parte da Lemon podem ser aceitos no momento. Seja por razões regulatórias ou porque não vale a pena para o cliente ou para a Lemon ter essa empresa como cliente. No processo de aquisição de clientes, fazemos a checagem de elegibilidade da mesma, através dos dados contidos na conta de luz do cliente. Caso a empresa não seja elegível, precisamos explicitar os motivos para tal. Caso ela seja elegível, precisamos calcular também a projeção da quantidade de CO2 que ela deixaria de emitir caso usasse energia limpa.


## Funcionalidades

- Validação de cliente por classe de consumo
- Validação de cliente por modalidade tarifária
- Validação de cliente pelo histórico de consumo e tipo de conexão


## Stack utilizada

- Node.js
- Docker
- Docker Compose
- Github Actions


## Rodando localmente

Clone o projeto

```bash
  git clone https://github.com/Matheusafonsouza/lemon-api.git
```

Entre no diretório do projeto

```bash
  cd lemon-api
```

Levante o container da aplicação

```bash
  docker compose up
```

## Rodando os testes

Para rodar os testes, rode o seguinte comando

```bash
  npm run test
```


## Documentação da API

#### Verifica se um cliente é válido

```
  POST /clients/validate
```

```json
  {
    "numeroDoDocumento": "14041737706",
    "tipoDeConexao": "bifasico",
    "classeDeConsumo": "comercial",
    "modalidadeTarifaria": "convencional",
    "historicoDeConsumo": [
        3878,
        9760,
        5976,
        2797,
        2481,
        5731,
        7538,
        4392,
        7859,
        4160,
        6941,
        4597 
    ]
}
```

## Melhorias

Que melhorias você fez no seu código? Ex: refatorações, melhorias de performance, acessibilidade, etc


## Contribuindo

Contribuições são sempre bem-vindas!

Para contribuir basta abrir um PR com a mudança que você quer propor que vamos revisar e determinar se a mesma é válida para a aplicação :)