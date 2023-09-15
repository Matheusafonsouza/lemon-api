const Joi = require('joi');

module.exports = {
  validateClient: {
    body: Joi.object({
      numeroDoDocumento: Joi.string().required(),
      tipoDeConexao: Joi.string().required(),
      classeDeConsumo: Joi.string().required(),
      modalidadeTarifaria: Joi.string().required(),
      historicoDeConsumo: Joi.array().items(Joi.number()).required(),
    }),
  }
};
