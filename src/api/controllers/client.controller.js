const { cnpj, cpf } =  require('cpf-cnpj-validator');
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
    numeroDoDocumento: documentNumber,
    tipoDeConexao: connectionType,
    classeDeConsumo: consumptionClass,
    subClasseDeConsumo: consumptionSubClass,
    modalidadeTarifaria: fareModality,
    historicoDeConsumo: consumptionHistory,
  } = req.body;

  if (documentNumber.length === 11 && !cpf.isValid(documentNumber)) {
    return res.status(httpStatus.BAD_REQUEST).json({
      elegivel: false,
      razoesDeInelegibilidade: [
        "CPF inválido"
      ]
    })
  }

  if (documentNumber.length === 14 && !cnpj.isValid(documentNumber)) {
    return res.status(httpStatus.BAD_REQUEST).json({
      elegivel: false,
      razoesDeInelegibilidade: [
        "CNPJ inválido"
      ]
    })
  }

  const clientService = new ClientService();
  const [clientData, errors] = clientService.validate({
    connectionType,
    consumptionClass,
    fareModality,
    consumptionHistory,
    consumptionSubClass
  });

  const { valid, co2Economy } = clientData;

  const responseBody = {
    elegivel: valid,
  };

  const responseStatus = valid ? httpStatus.OK : httpStatus.BAD_REQUEST;
  if (valid) {
    responseBody.economiaAnualDeCO2 = co2Economy;
  } else {
    responseBody.razoesDeInelegibilidade = errors;
  }

  return res.status(responseStatus).json(responseBody);
};
