const request = require('supertest')
const app = require('../../src/config/express')

describe('ClientController', () => {
  it.each([
    {
      payload: {
        "numeroDoDocumento": "11620796000100",
        "tipoDeConexao": "bifasico",
        "classeDeConsumo": "comercial",
        "subClasseDeConsumo": "comercial",
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
      },
      status: 200,
      response: {
        "elegivel": true,
        "economiaAnualDeCO2": 5553.24,
      },
    },
    {
      payload: {
        "numeroDoDocumento": "11620796000100",
        "tipoDeConexao": "bifasico",
        "classeDeConsumo": "rural",
        "subClasseDeConsumo": "agropecuariaRural",
        "modalidadeTarifaria": "verde",
        "historicoDeConsumo": [
          100
        ]
      },
      status: 400,
      response: {
        "elegivel": false,
        "razoesDeInelegibilidade": [
          'Classe de consumo não aceita',
          'Modalidade tarifária não aceita',
          'Consumo muito baixo para tipo de conexão',
          'Subclasse invalida para classe de consumo'
        ]
      },
    },
    {
      payload: {
        "numeroDoDocumento": "11620796000100",
        "tipoDeConexao": "bifasico",
        "classeDeConsumo": "rural",
        "subClasseDeConsumo": "agropecuariaRural",
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
      },
      status: 400,
      response: {
        "elegivel": false,
        "razoesDeInelegibilidade": [
          'Classe de consumo não aceita',
          'Subclasse invalida para classe de consumo'
        ]
      },
    },
    {
      payload: {
        "numeroDoDocumento": "11620796000100",
        "tipoDeConexao": "bifasico",
        "classeDeConsumo": "comercial",
        "subClasseDeConsumo": "comercial",
        "modalidadeTarifaria": "verde",
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
      },
      status: 400,
      response: {
        "elegivel": false,
        "razoesDeInelegibilidade": [
          'Modalidade tarifária não aceita',
        ]
      },
    },
    {
      payload: {
        "numeroDoDocumento": "11620796000100",
        "tipoDeConexao": "bifasico",
        "classeDeConsumo": "comercial",
        "subClasseDeConsumo": "comercial",
        "modalidadeTarifaria": "convencional",
        "historicoDeConsumo": [100]
      },
      status: 400,
      response: {
        "elegivel": false,
        "razoesDeInelegibilidade": [
          'Consumo muito baixo para tipo de conexão'
        ]
      },
    },
    {
      payload: {
        "numeroDoDocumento": "11620796000100",
        "tipoDeConexao": "bifasico",
        "classeDeConsumo": "comercial",
        "subClasseDeConsumo": "templosReligiosos",
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
      },
      status: 400,
      response: {
        "elegivel": false,
        "razoesDeInelegibilidade": [
          "Subclasse invalida para classe de consumo"
        ],
      },
    },
  ])('Should validate client requests', async ({
    payload,
    status,
    response
  }) => {
    await request(app).post('/clients/validate')
      .send(payload)
      .expect(status)
      .expect(response)
  });
});
