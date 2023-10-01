const Joi = require('joi');
const { clientRules } = require('../../config/vars');

const connectionTypesEnum = {
  monofasico: 'monofasico',
  bifasico: 'bifasico',
  trifasico: 'trifasico',
};
const connectionTypesValuesEnum = {
  [connectionTypesEnum.monofasico]: clientRules.connections.monofasico,
  [connectionTypesEnum.bifasico]: clientRules.connections.bifasico,
  [connectionTypesEnum.trifasico]: clientRules.connections.trifasico,
}
const consumptionClassesEnum = {
  residencial: 'residencial',
  industrial: 'industrial',
  comercial: 'comercial',
  rural: 'rural',
  poderPublico: 'poderPublico',
};
const fareModalitiesEnum = {
  azul: 'azul',
  branca: 'branca',
  verde: 'verde',
  convencional: 'convencional',
};
const consumptionSubClassesEnum = {
  administracaoCondominial: 'administracaoCondominial',
  comercial: 'comercial',
  servicosDeTelecomunicacao: 'servicosDeTelecomunicacao',
  servicosDeTransporte: 'servicosDeTransporte',
  templosReligiosos: 'templosReligiosos',
  industrial: 'industrial',
  residencial: 'residencial',
  baixaRenda: 'baixaRenda',
  poderPublicoEstadual: 'poderPublicoEstadual',
  poderPublicoMunicipal: 'poderPublicoMunicipal',
  agropecuariaRural: 'agropecuariaRural',
};
const consumptionSubClassesSwitch = {
  [consumptionClassesEnum.comercial]: {
    elegiveis: [
      consumptionSubClassesEnum.administracaoCondominial,
      consumptionSubClassesEnum.comercial,
      consumptionSubClassesEnum.servicosDeTelecomunicacao,
      consumptionSubClassesEnum.servicosDeTransporte,
    ],
    naoElegiveis: [consumptionSubClassesEnum.templosReligiosos],
  },
  [consumptionClassesEnum.industrial]: {
    elegiveis: [consumptionSubClassesEnum.industrial],
    naoElegiveis: [],
  },
  [consumptionClassesEnum.residencial]: {
    elegiveis: [consumptionSubClassesEnum.residencial],
    naoElegiveis: [consumptionSubClassesEnum.baixaRenda],
  },
  [consumptionClassesEnum.poderPublico]: {
      elegiveis: [],
      naoElegiveis: [
        consumptionSubClassesEnum.poderPublicoEstadual,
        consumptionSubClassesEnum.poderPublicoMunicipal
      ],
    },
  [consumptionClassesEnum.rural]: {
    elegiveis: [],
    naoElegiveis: [consumptionSubClassesEnum.agropecuariaRural],
  },
}


const connectionTypes = Object.values(connectionTypesEnum);
const consumptionClasses = Object.values(consumptionClassesEnum);
const consumptionSubClasses = Object.values(consumptionSubClassesEnum);
const fareModalities = Object.values(fareModalitiesEnum);

module.exports = {
  connectionTypesEnum,
  connectionTypesValuesEnum,
  consumptionClassesEnum,
  consumptionSubClassesEnum,
  fareModalitiesEnum,
  connectionTypes,
  consumptionClasses,
  fareModalities,
  co2Fare: clientRules.co2Fare,
  consumptionSubClassesSwitch,
  validateClient: {
    body: Joi.object({
      numeroDoDocumento: Joi.string()
        .pattern(/(^\d{11}$)|(^\d{14}$)/)
        .required(),
      tipoDeConexao: Joi.string()
        .valid(...connectionTypes)
        .required(),
      classeDeConsumo: Joi.string()
        .valid(...consumptionClasses)
        .required(),
      subClasseDeConsumo: Joi.string()
        .valid(...consumptionSubClasses)
        .required(),
      modalidadeTarifaria: Joi.string()
        .valid(...fareModalities)
        .required(),
      historicoDeConsumo: Joi.array().items(Joi.number()).required(),
    }),
  },
};
