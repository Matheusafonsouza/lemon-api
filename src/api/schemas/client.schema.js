const Joi = require('joi');


const connectionTypesEnum = {
  'monofasico': 'monofasico',
  'bifasico': 'bifasico',
  'trifasico': 'trifasico',
}
const consumptionClassesEnum = {
  'residencial': 'residencial',
  'industrial': 'industrial',
  'comercial': 'comercial',
  'rural': 'rural',
  'poderPublico': 'poderPublico',
}
const fareModalitiesEnum = {
  'azul': 'azul',
  'branca': 'branca',
  'verde': 'verde',
  'convencional': 'convencional',
}

const connectionTypes = Object.values(connectionTypesEnum);
const consumptionClasses = Object.values(consumptionClassesEnum);
const fareModalities = Object.values(fareModalitiesEnum);

module.exports = {
  connectionTypesEnum,
  consumptionClassesEnum,
  fareModalitiesEnum,
  connectionTypes,
  consumptionClasses,
  fareModalities,
  validateClient: {
    body: Joi.object({
      numeroDoDocumento: Joi.string().pattern(/(^\d{11}$)|(^\d{14}$)/).required(),
      tipoDeConexao: Joi.string().valid(...connectionTypes).required(),
      classeDeConsumo: Joi.string().valid(...consumptionClasses).required(),
      modalidadeTarifaria: Joi.string().valid(...fareModalities).required(),
      historicoDeConsumo: Joi.array().items(Joi.number()).required(),
    }),
  }
};
