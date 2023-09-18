const request = require('supertest')
const app = require('../../src/config/express')

describe('ClientController', () => {
  it.each([
    {
      payload: {
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
      },
      status: 200,
      response: {
        "elegivel": true,
        "economiaAnualDeCO2": 5553.24,
      },
    },
    {
      payload: {
        "numeroDoDocumento": "14041737706",
        "tipoDeConexao": "bifasico",
        "classeDeConsumo": "rural",
        "modalidadeTarifaria": "verde",
        "historicoDeConsumo": [
          100
        ]
      },
      status: 400,
      response: {
        "elegivel": false,
        "erros": [
          'Classe de consumo não aceita',
          'Modalidade tarifária não aceita',
          'Consumo muito baixo para tipo de conexão'
        ]
      },
    },
    {
      payload: {
        "numeroDoDocumento": "14041737706",
        "tipoDeConexao": "bifasico",
        "classeDeConsumo": "rural",
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
        "erros": [
          'Classe de consumo não aceita',
        ]
      },
    },
    {
      payload: {
        "numeroDoDocumento": "14041737706",
        "tipoDeConexao": "bifasico",
        "classeDeConsumo": "comercial",
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
        "erros": [
          'Modalidade tarifária não aceita',
        ]
      },
    },
    {
      payload: {
        "numeroDoDocumento": "14041737706",
        "tipoDeConexao": "bifasico",
        "classeDeConsumo": "comercial",
        "modalidadeTarifaria": "convencional",
        "historicoDeConsumo": [100]
      },
      status: 400,
      response: {
        "elegivel": false,
        "erros": [
          'Consumo muito baixo para tipo de conexão'
        ]
      },
    },
  ])('Should return errors if user not valid', async () => {
    await request(app).post('/clients/validate')
      .send({
        "numeroDoDocumento": "14041737706",
        "tipoDeConexao": "bifasico",
        "classeDeConsumo": "rural",
        "modalidadeTarifaria": "verde",
        "historicoDeConsumo": [
          100
        ]
      })
      .expect(400)
      .expect({
        "elegivel": false,
        "erros": [
          'Classe de consumo não aceita',
          'Modalidade tarifária não aceita',
          'Consumo muito baixo para tipo de conexão'
        ]
      })
  });
});
