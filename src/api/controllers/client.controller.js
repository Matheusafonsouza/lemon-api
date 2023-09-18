const httpStatus = require('http-status');
const ClientService = require('../services/client.service');

/**
 * Check if the user is valid.
 * @param {Object} req Request for the request.
 * @param {Object} res Response for the request.
 * @param {Object} next Next function for the request.
 */
exports.validate = async (req, res, next) => {
  const {
    tipoDeConexao: connectionType,
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

  const { valid, co2Economy } = clientData;

  const responseBody = {
    elegivel: valid,
  };

  const responseStatus = valid ? httpStatus.OK : httpStatus.BAD_REQUEST;
  if (valid) {
    responseBody.economiaAnualDeCO2 = co2Economy;
  } else {
    responseBody.erros = errors;
  }

  return res.status(responseStatus).json(responseBody);
};
