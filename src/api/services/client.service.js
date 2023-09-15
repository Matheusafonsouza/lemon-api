const { 
  connectionTypesEnum,
  consumptionClassesEnum,
  fareModalitiesEnum,
} = require('../schemas/client.schema')


const clientErrors = {
  'INVALID_CONSUMPTION_CLASS': 'Classe de consumo não aceita',
  'INVALID_FARE_MODALITY': 'Modalidade tarifária não aceita',
  'LOW_CONSUMPTION_FOR_CONNECTION_TYPE': 'Consumo muito baixo para tipo de conexão',
}

class ClientService {
  validateConsumptionClass(consumptionClass) {
    if (![
      consumptionClassesEnum['residencial'],
      consumptionClassesEnum['industrial'],
      consumptionClassesEnum['comercial'],
    ].includes(consumptionClass)) {
      return clientErrors['INVALID_CONSUMPTION_CLASS'];
    }
    return null;
  }

  validateFareModality(fareModality) {
    if (![
      fareModalitiesEnum['branco'],
      fareModalitiesEnum['convencional'],
    ].includes(fareModality)) {
      return clientErrors['INVALID_FARE_MODALITY'];
    }
    return null;
  }

  validateConsumptionHistory(consumptionHistoryAverage, connectionType) {
    const connectionTypeSwitch = {
      [connectionTypesEnum['monofasico']]: 400,
      [connectionTypesEnum['bifasico']]: 500, 
      [connectionTypesEnum['trifasico']]: 750,
    }
    if (consumptionHistoryAverage < connectionTypeSwitch[connectionType]) {
      return clientErrors['LOW_CONSUMPTION_FOR_CONNECTION_TYPE'];
    }
    return null;
  }

  getConsumptionHistoryData(consumptionHistory) {
    const validHistoryMonths = consumptionHistory.slice(0, 12);
    const historySum = validHistoryMonths.reduce((a, b) => a + b, 0);
    return {
      sum: historySum,
      average: historySum / validHistoryMonths.length,
      co2Economy: (84 * historySum) / 1000,
    }
  }

  validate({
    connectionType,
    consumptionClass,
    fareModality,
    consumptionHistory,
  }) {
    const consumptionHistoryData = this.getConsumptionHistoryData(consumptionHistory);

    const errors = [
      this.validateConsumptionClass(consumptionClass),
      this.validateFareModality(fareModality),
      this.validateConsumptionHistory(consumptionHistoryData.average, connectionType),
    ].map(error => error).filter(error => error);

    return [
      {
        valid: errors.length === 0,
        ...consumptionHistoryData,
      },
      errors
    ];
  }
}

module.exports = ClientService;
