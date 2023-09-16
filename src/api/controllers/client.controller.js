const httpStatus = require('http-status');
const ClientService = require('../services/client.service');

exports.validate = async (req, res, next) => {
  const {
    connectionType,
    classeDeConsumo: consumptionClass,
    modalidadeTarifaria: fareModality,
    historicoDeConsumo: consumptionHistory,
  } = req.body;

  const clientService = new ClientService();
  const [clientData, errors] = clientService.validate({
    connectionType,
    consumptionClass,
    fareModality,
    consumptionHistory,
  });

  const {
    valid,
    co2Economy,
  } = clientData;

  const responseBody = {
    elegivel: valid,
  };

  const responseStatus = valid ? httpStatus.OK : httpStatus.BAD_REQUEST;
  if (valid) {
    responseBody.economiaAnualDeCO2 = co2Economy;
  } else {
    responseBody.erros = errors;
  }

  res.status(responseStatus).json(responseBody);
};
