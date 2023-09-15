const httpStatus = require('http-status');

exports.validate = async (req, res, next) => {
  const {
    tipoDeConexao,
    classeDeConsumo,
    modalidadeTarifaria,
    historicoDeConsumo,
  } = req.body;

  const errors = [];

  if (![
    'residencial',
    'industrial',
    'comercial',
  ].includes(classeDeConsumo)) {
    errors.push('Classe de consumo não aceita');
  }

  if (!['branca', 'convencional'].includes(modalidadeTarifaria)) {
    errors.push('Modalidade tarifária não aceita');
  }

  const validHistoryMonths = historicoDeConsumo.slice(0, 12);
  const historySum = validHistoryMonths.reduce((a, b) => a + b, 0);
  const average = historySum / validHistoryMonths.length;

  const connectionTypeSwitch = {
    'monofasico': 400,
    'bifasico': 500,
    'trifasico': 750,
  }
  if (average < connectionTypeSwitch[tipoDeConexao]) {
    errors.push('Consumo muito baixo para tipo de conexão');
  }

  const co2Economy = (84 * historySum) / 1000;

  const responseBody = {
    "elegivel": errors.length === 0,
  }

  let responseStatus = httpStatus.OK;
  if (errors.length === 0) {
    responseBody['economiaAnualDeCO2'] = co2Economy;
  } else {
    responseStatus = httpStatus.BAD_REQUEST;
    responseBody['erros'] = errors;
  }

  res.status(responseStatus).json(responseBody);
};
