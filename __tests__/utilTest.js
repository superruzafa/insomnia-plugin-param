const dateFns = require('date-fns');
jest.mock('date-fns');

const {
  getTypeFormat,
  getHtmlInputType,
  formatInteger,
  formatTimestamp,
  formatValue,
  extractParamComponents,
} = require('../util');

beforeAll(() => {
  dateFns.parseISO.mockReset();
  dateFns.format.mockReset();
  dateFns.formatISO.mockReset();
});

describe('#getTypeFormat', () => {
  describe('when typeFormat does not include the format', () => {
    test('the type should be returned but not the format', () => {
      const [type, format] = getTypeFormat('typeWithoutFormat');
      expect(type).toBe('typeWithoutFormat');
      expect(format).toBe('');
    });
  });
  describe('when typeFormat does include the format', () => {
    test('both the type and the format should be returned', () => {
      const [type, format] = getTypeFormat('type/format');
      expect(type).toBe('type');
      expect(format).toBe('format');
    });
  });
});

describe('#getHtmlInputTypeFormat', () => {
  [
    'unknown',
    'unknown/unknown',
  ].forEach(type => describe(`when typeFormat is ${type}`, () => {
    test('the html input type should be "text"', () => {
      const format = getHtmlInputType(type);
      expect(format).toBe('text');
    });
  }));

  [
    'string',
    'string/unknown',
    'string/string',
  ].forEach(type => describe(`when typeFormat is ${type}`, () => {
    test('the html input type should be "text"', () => {
      const format = getHtmlInputType(type);
      expect(format).toBe('text');
    });
  }));

  describe('when the type is string/password', () => {
    test('the html input type should be "password"', () => {
      const format = getHtmlInputType('string/password');
      expect(format).toBe('password');
    });
  });

  [
    'integer',
    'integer/unknown',
    'integer/integer',
  ].forEach(type => describe(`when typeFormat is ${type}`, () => {
    test('the html input type should be "number"', () => {
      const format = getHtmlInputType(type);
      expect(format).toBe('number');
    });
  }));

  [
    'timestamp',
    'timestamp/unknown',
    'timestamp/unix',
    'timestamp/unix-ms',
    'timestamp/iso-8601',
  ].forEach(type => describe(`when typeFormat is ${type}`, () => {
    test('the html input type should be "datetime-local"', () => {
      const format = getHtmlInputType(type);
      expect(format).toBe('datetime-local');
    });
  }));

  [
    'color',
    'color/unknown',
    'color/html',
  ].forEach(type => describe(`when typeFormat is ${type}`, () => {
    test('the html input type should be "color"', () => {
      const format = getHtmlInputType(type);
      expect(format).toBe('color');
    });
  }));
});

describe('#formatInteger', () => {
  [
    ['', '0'],
    [NaN, '0'],
    [true, '0'],
    [false, '0'],
    ['0', '0'],
    ['abc', '0'],
    ['123', '123'],
    ['123abc', '123'],
    ['4.1', '4'],
    ['4.9', '4'],
  ].forEach(([input, output]) => describe(`when input is "${input}"`, () => {
    test(`the output should be "${output}"`, () => {
      const integer = formatInteger(input);
      expect(integer).toBe(output);
    });
  }));
});

describe('#formatTimestamp', () => {
  describe('when the input is not a valid ISO-8601 date', () => {
    test('it should return "0"', () => {
      dateFns.parseISO.mockImplementation(() => {
        throw new Error('Invalid date');
      });
      const timestamp = formatTimestamp('1nput', 'whatever');
      expect(timestamp).toBe('0');
      expect(dateFns.parseISO).toHaveBeenCalledWith('1nput');
    });
  });

  describe('when the format is UNIX timestamp with milliseconds', () => {
    test('the timestamp should be formatted as UNIX timestamp with milliseconds', () => {
      dateFns.parseISO.mockReturnValue('d4t3');
      dateFns.format.mockReturnValue('t1m3st4mp');
      const timestamp = formatTimestamp('1nput', 'unix-ms')
      expect(dateFns.parseISO).toHaveBeenCalledWith('1nput');
      expect(dateFns.format).toHaveBeenCalledWith('d4t3', 'T');
      expect(timestamp).toBe('t1m3st4mp');
    });
  });

  describe('when the format is ISO-8601', () => {
    test('the timestamp should be formatted as ISO-8601 timestamp', () => {
      dateFns.parseISO.mockReturnValue('d4t3');
      dateFns.formatISO.mockReturnValue('t1m3st4mp');
      const timestamp = formatTimestamp('1nput', 'iso-8601')
      expect(dateFns.parseISO).toHaveBeenCalledWith('1nput');
      expect(dateFns.formatISO).toHaveBeenCalledWith('d4t3');
      expect(timestamp).toBe('t1m3st4mp');
    });
  });

  [
    'unknown',
    'unix'
  ].forEach(format => describe(`when format is ${format}`, () => {
      test('the timestamp should be formatted as UNIX timestamp', () => {
        dateFns.parseISO.mockReturnValue('d4t3');
        dateFns.format.mockReturnValue('t1m3st4mp');
        const timestamp = formatTimestamp('1nput', 'format')
        expect(dateFns.parseISO).toHaveBeenCalledWith('1nput');
        expect(dateFns.format).toHaveBeenCalledWith('d4t3', 't');
        expect(timestamp).toBe('t1m3st4mp');
      });
    }));
});

describe('#formatValue', () => {
  describe('when the typeFormat is timestamp', () => {
    test('it should format the value as timestamp', () => {
      dateFns.format.mockReturnValue('t1m3st4mp');
      const value = formatValue('1nput', 'timestamp/whatever');
      expect(dateFns.parseISO).toHaveBeenCalledWith('1nput');
      expect(value).toBe('t1m3st4mp');
    });
  });
  describe('when the typeFormat is integer', () => {
    test('it should format the value as integer', () => {
      const value = formatValue('123', 'integer/whatever');
      expect(value).toBe('123');
    });
  });
  describe('when the typeFormat is another type', () => {
    test('it should return the value untouched', () => {
      const value = formatValue('xxxx', 'whatever/whatever');
      expect(value).toBe('xxxx');
    });
  });
});

describe('#extractParamComponents', () => {
  [
    ['', 'Parameter', ''],
    ['param', 'param', ''],
    ['param : the description', 'param', 'the description'],
    [':user id: the id of the user', ':user id', 'the id of the user'],
  ].forEach(([input, expectedName, expectedDesc]) => {
    describe(`when the input is "${input}"`, () => {
      test(`the name should be "${expectedName}" and the desc. "${expectedDesc}"`, () => {
        const [name, desc] = extractParamComponents(input);
        expect(name).toBe(expectedName);
        expect(desc).toBe(expectedDesc);
      });
    });
  });
});
