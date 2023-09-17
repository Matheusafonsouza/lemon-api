const ClientService = require('./client.service');
const { consumptionClassesEnum, fareModalitiesEnum, connectionTypesEnum } = require('../schemas/client.schema');

describe('ClientService', () => {
  let clientService;

  beforeAll(() => {
    clientService = new ClientService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    {
      consumptionClass: consumptionClassesEnum.residencial,
      expected: null,
    },
    {
      consumptionClass: consumptionClassesEnum.industrial,
      expected: null,
    },
    {
      consumptionClass: consumptionClassesEnum.comercial,
      expected: null,
    },
    {
      consumptionClass: consumptionClassesEnum.rural,
      expected: 'Classe de consumo não aceita',
    },
    {
      consumptionClass: consumptionClassesEnum.poderPublico,
      expected: 'Classe de consumo não aceita',
    },
  ])('Should validate $consumptionClass consumption class', ({ consumptionClass, expected }) => {
    const result = clientService.validateConsumptionClass(consumptionClass);
    expect(result).toBe(expected);
  });

  it.each([
    {
      fareModality: fareModalitiesEnum.branco,
      expected: null,
    },
    {
      fareModality: fareModalitiesEnum.convencional,
      expected: null,
    },
    {
      fareModality: fareModalitiesEnum.verde,
      expected: 'Modalidade tarifária não aceita',
    },
    {
      fareModality: fareModalitiesEnum.azul,
      expected: 'Modalidade tarifária não aceita',
    },
  ])('Should validate $fareModality fare modality', ({ fareModality, expected }) => {
    const result = clientService.validateFareModality(fareModality);
    expect(result).toBe(expected);
  });

  it.each([
    {
      consumptionHistoryAverage: 500,
      connectionType: connectionTypesEnum.monofasico,
      expected: null,
    },
    {
      consumptionHistoryAverage: 300,
      connectionType: connectionTypesEnum.monofasico,
      expected: 'Consumo muito baixo para tipo de conexão',
    },
    {
      consumptionHistoryAverage: 600,
      connectionType: connectionTypesEnum.bifasico,
      expected: null,
    },
    {
      consumptionHistoryAverage: 400,
      connectionType: connectionTypesEnum.bifasico,
      expected: 'Consumo muito baixo para tipo de conexão',
    },
    {
      consumptionHistoryAverage: 800,
      connectionType: connectionTypesEnum.trifasico,
      expected: null,
    },
    {
      consumptionHistoryAverage: 700,
      connectionType: connectionTypesEnum.trifasico,
      expected: 'Consumo muito baixo para tipo de conexão',
    },
  ])('Should validate $consumptionHistoryAverage for $connectionType', ({ consumptionHistoryAverage, connectionType, expected }) => {
    const result = clientService.validateConsumptionHistory(consumptionHistoryAverage, connectionType);
    expect(result).toBe(expected);
  });

  it('Should get consumption history data', () => {
    const consumptionHistory = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
    const expected = {
      sum: 5500,
      average: 550,
      co2Economy: 462,
    };
    const result = clientService.getConsumptionHistoryData(consumptionHistory);
    expect(result).toEqual(expected);
  });

  it('Should validate client', () => {
    const getConsumptionHistoryDataSpy = jest.spyOn(clientService, 'getConsumptionHistoryData');
    const validateConsumptionClassSpy = jest.spyOn(clientService, 'validateConsumptionClass');
    const validateFareModalitySpy = jest.spyOn(clientService, 'validateFareModality');
    const validateConsumptionHistorySpy = jest.spyOn(clientService, 'validateConsumptionHistory');

    getConsumptionHistoryDataSpy.mockReturnValueOnce({
      sum: 5500,
      average: 550,
      co2Economy: 462,
    });
    validateConsumptionClassSpy.mockReturnValueOnce(null);
    validateFareModalitySpy.mockReturnValueOnce(null);
    validateConsumptionHistorySpy.mockReturnValueOnce(null);

    const consumptionHistory = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

    const [data, errors] = clientService.validate({
      connectionType: connectionTypesEnum.monofasico,
      consumptionClass: consumptionClassesEnum.residencial,
      fareModality: fareModalitiesEnum.branca,
      consumptionHistory,
    });

    expect(getConsumptionHistoryDataSpy).toBeCalledWith(consumptionHistory);
    expect(validateConsumptionClassSpy).toBeCalledWith(consumptionClassesEnum.residencial);
    expect(validateFareModalitySpy).toBeCalledWith(fareModalitiesEnum.branca);
    expect(validateConsumptionHistorySpy).toBeCalledWith(550, connectionTypesEnum.monofasico);

    expect(data).toEqual({
      valid: true,
      co2Economy: 462,
    });
    expect(errors).toEqual([]);
  });

  it('Should return errors if client is invalid', () => {
    const getConsumptionHistoryDataSpy = jest.spyOn(clientService, 'getConsumptionHistoryData');
    const validateConsumptionClassSpy = jest.spyOn(clientService, 'validateConsumptionClass');
    const validateFareModalitySpy = jest.spyOn(clientService, 'validateFareModality');
    const validateConsumptionHistorySpy = jest.spyOn(clientService, 'validateConsumptionHistory');

    getConsumptionHistoryDataSpy.mockReturnValueOnce({
      sum: 5500,
      average: 550,
      co2Economy: 462,
    });
    validateConsumptionClassSpy.mockReturnValueOnce('Classe de consumo não aceita');
    validateFareModalitySpy.mockReturnValueOnce('Modalidade tarifária não aceita');
    validateConsumptionHistorySpy.mockReturnValueOnce(null);

    const consumptionHistory = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

    const [data, errors] = clientService.validate({
      connectionType: connectionTypesEnum.monofasico,
      consumptionClass: consumptionClassesEnum.rural,
      fareModality: fareModalitiesEnum.verde,
      consumptionHistory,
    });

    expect(getConsumptionHistoryDataSpy).toBeCalledWith(consumptionHistory);
    expect(validateConsumptionClassSpy).toBeCalledWith(consumptionClassesEnum.rural);
    expect(validateFareModalitySpy).toBeCalledWith(fareModalitiesEnum.verde);
    expect(validateConsumptionHistorySpy).toBeCalledWith(550, connectionTypesEnum.monofasico);

    expect(data).toEqual({
      valid: false,
      co2Economy: 462,
    });
    expect(errors).toEqual(['Classe de consumo não aceita', 'Modalidade tarifária não aceita']);
  });
});
