const { connectionTypesEnum, consumptionClassesEnum, fareModalitiesEnum } = require('../schemas/client.schema');

const clientErrors = {
  INVALID_CONSUMPTION_CLASS: 'Classe de consumo não aceita',
  INVALID_FARE_MODALITY: 'Modalidade tarifária não aceita',
  LOW_CONSUMPTION_FOR_CONNECTION_TYPE: 'Consumo muito baixo para tipo de conexão',
};

class ClientService {
  /**
   * Validate if the consumption class is valid.
   * @param  {String} consumptionClass Consumption class to be validated.
   * @return {String|null}  Error message if invalid, null if valid.
   */
  validateConsumptionClass(consumptionClass) {
    if (
      ![consumptionClassesEnum.residencial, consumptionClassesEnum.industrial, consumptionClassesEnum.comercial].includes(
        consumptionClass,
      )
    ) {
      return clientErrors.INVALID_CONSUMPTION_CLASS;
    }
    return null;
  }

  /**
   * Validate if the fare modality is valid.
   * @param  {String} fareModality Fare modality to be validated.
   * @return {String|null}  Error message if invalid, null if valid.
   */
  validateFareModality(fareModality) {
    if (![fareModalitiesEnum.branco, fareModalitiesEnum.convencional].includes(fareModality)) {
      return clientErrors.INVALID_FARE_MODALITY;
    }
    return null;
  }

  /**
   * Validate if the consumption history and connection type are valid.
   * @param  {String} consumptionHistoryAverage Consumption history average.
   * @param  {String} connectionType Connection Type to be validated.
   * @return {String|null}  Error message if invalid, null if valid.
   */
  validateConsumptionHistory({ consumptionHistoryAverage, connectionType }) {
    const connectionTypeSwitch = {
      [connectionTypesEnum.monofasico]: 400,
      [connectionTypesEnum.bifasico]: 500,
      [connectionTypesEnum.trifasico]: 750,
    };
    if (consumptionHistoryAverage < connectionTypeSwitch[connectionType]) {
      return clientErrors.LOW_CONSUMPTION_FOR_CONNECTION_TYPE;
    }
    return null;
  }

  /**
   * Get the consumption history data (sum, average and CO2 economy).
   * @param  {Array} consumptionHistory Consumption history to get data.
   * @return {Object} Sum, average and CO2 Economy for a given history data.
   */
  getConsumptionHistoryData(consumptionHistory) {
    const validHistoryMonths = consumptionHistory.slice(0, 12);
    const historySum = validHistoryMonths.reduce((a, b) => a + b, 0);
    return {
      sum: historySum,
      average: historySum / validHistoryMonths.length,
      co2Economy: (84 * historySum) / 1000,
    };
  }

  /**
   * Validates an user.
   * @param  {String} connectionType Connection type to be validated.
   * @param  {String} consumptionClass Consumption class to be validated.
   * @param  {String} fareModality Fare Modality to be validated.
   * @param  {Array} consumptionHistory Consumption history to be validated.
   * @return {Array} Array where the first value have the valid result and CO2 Economy, the second have the errors.
   */
  validate({ connectionType, consumptionClass, fareModality, consumptionHistory }) {
    const consumptionHistoryData = this.getConsumptionHistoryData(consumptionHistory);

    const errors = [
      this.validateConsumptionClass(consumptionClass),
      this.validateFareModality(fareModality),
      this.validateConsumptionHistory({
        consumptionHistoryAverage: consumptionHistoryData.average,
        connectionType
      }),
    ]
      .map((error) => error)
      .filter((error) => error);

    return [
      {
        valid: errors.length === 0,
        co2Economy: consumptionHistoryData.co2Economy,
      },
      errors,
    ];
  }
}

module.exports = ClientService;
