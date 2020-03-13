const crypto = require('crypto');
const util = require('../util');
const index = require('../index');
const run = index.templateTags[0].run;

jest.mock('crypto');
jest.mock('../util');

function mockContext() {
  const prompt = jest.fn((title, options) => Promise.resolve('USERVALUE'));
  const getItem = jest.fn(storageKey => Promise.resolve('STOREDVALUE'));
  const setItem = jest.fn((storageKey, value) => Promise.resolve(null));
  const removeItem = jest.fn((storageKey) => Promise.resolve(null));
  const context = {
    app: {
      prompt
    },
    meta: {
      requestId: 'REQID'
    },
    renderPurpose: 'send',
    store: {
      getItem,
      setItem,
      removeItem,
    }
  };
  return { context, prompt, getItem, setItem };
}

function mockCrypto() {
  const digest = jest.fn(() => 'HASH');
  const update = jest.fn(() => ({ digest }));
  const createHash = jest.fn(() => ({ update }));
  crypto.createHash = createHash;
  return { createHash, update, digest };
}

function mockUtil() {
  util.getTypeFormat = jest.fn(() => ['TYPE', 'FORMAT']);
  util.getHtmlInputType = jest.fn(() => 'HTMLTYPE');
  util.getNameDesc = jest.fn(() => ['NAME', 'DESC']);
  util.formatValue = jest.fn(() => 'FMTVALUE');
  return util;
}

describe('when type/format is string/password', () => {
  describe('when ask behavior is ask/blank', () => {
    test('', async () => {
      mockCrypto();
      mockUtil();
      const { context } = mockContext();
      const result = await run(context, 'string/password', 'NAME', 'ask/blank', {});
      expect(result).toBe('FMTVALUE');
      expect(context.app.prompt).toHaveBeenCalled();
      expect(context.store.removeItem).toHaveBeenCalledWith('REQID.HASH.TYPE');
      expect(context.store.setItem).not.toHaveBeenCalled();
    });
  });
  describe('when ask behavior is ask/default', () => {
    test('', async () => {
      mockCrypto();
      mockUtil();
      const { context } = mockContext();
      const result = await run(context, 'string/password', 'NAME', 'ask/default', {});
      expect(result).toBe('FMTVALUE');
      expect(context.app.prompt).toHaveBeenCalled();
      expect(context.store.removeItem).toHaveBeenCalledWith('REQID.HASH.TYPE');
      expect(context.store.setItem).not.toHaveBeenCalled();
    });
  });
  describe('when ask behavior is ask/stored', () => {
    describe('when there is not a stored value', () => {
      test('', async () => {
        mockCrypto();
        mockUtil();
        const { context } = mockContext();
        context.store.getItem.mockImplementation(() => null);

        const result = await run(context, 'string/password', 'NAME', 'ask/stored', {});
        expect(result).toBe('FMTVALUE');
        expect(context.app.prompt.mock.calls[0][1].defaultValue).toBe('');
        expect(context.store.removeItem).not.toHaveBeenCalled();
        expect(context.store.setItem).toHaveBeenCalledWith('REQID.HASH.TYPE', 'USERVALUE');
      });
    });
    describe('when there is a stored value', () => {
      test('', async () => {
        mockCrypto();
        mockUtil();
        const { context } = mockContext();
        const result = await run(context, 'string/password', 'NAME', 'ask/stored', {});
        expect(result).toBe('FMTVALUE');
        expect(context.app.prompt.mock.calls[0][1].defaultValue).toBe('STOREDVALUE');
        expect(context.store.removeItem).not.toHaveBeenCalled();
        expect(context.store.setItem).toHaveBeenCalledWith('REQID.HASH.TYPE', 'USERVALUE');
      });
    });
  });
  describe('when ask behavior is once/stored', () => {
    describe('when there is not a stored value', () => {
      test('', async () => {
        mockCrypto();
        mockUtil();
        const { context } = mockContext();
        context.store.getItem.mockImplementation(() => null);

        const result = await run(context, 'string/password', 'NAME', 'once/stored', {});
        expect(result).toBe('FMTVALUE');
        expect(context.app.prompt.mock.calls[0][1].defaultValue).toBe('');
        expect(context.store.removeItem).not.toHaveBeenCalled();
        expect(context.store.setItem).toHaveBeenCalledWith('REQID.HASH.TYPE', 'USERVALUE');
      });
    });
    describe('when there is a stored value', () => {
      test('', async () => {
        mockCrypto();
        mockUtil();
        const { context } = mockContext();
        const result = await run(context, 'string/password', 'NAME', 'once/stored', {});
        expect(result).toBe('STOREDVALUE');
        expect(context.app.prompt).not.toHaveBeenCalled();
        expect(context.store.removeItem).not.toHaveBeenCalled();
        expect(context.store.setItem).not.toHaveBeenCalled();
      });
    });
  });
});

describe('when ask behavior is ask/blank', () => {
  test('', async () => {
    mockCrypto();
    mockUtil();
    const { context } = mockContext();
    const result = await run(context, 'TYPEFORMAT', 'NAME', 'ask/blank', {});
    expect(result).toBe('FMTVALUE');
    expect(context.app.prompt.mock.calls[0][1].defaultValue).toBe('');
    expect(context.store.removeItem).not.toHaveBeenCalled();
    expect(context.store.setItem).toHaveBeenCalledWith('REQID.HASH.TYPE', 'USERVALUE');
  });
});

describe('when ask behavior is ask/default', () => {
  test('', async () => {
    mockCrypto();
    mockUtil();
    const { context } = mockContext();
    const result = await run(context, 'TYPEFORMAT', 'NAME', 'ask/blank', {});
    expect(result).toBe('FMTVALUE');
    expect(context.app.prompt.mock.calls[0][1].defaultValue).toBe('');
    expect(context.store.removeItem).not.toHaveBeenCalled();
    expect(context.store.setItem).toHaveBeenCalledWith('REQID.HASH.TYPE', 'USERVALUE');
  });
});

describe('when ask behavior is ask/stored', () => {
  describe('when there is a stored value', () => {
    test('', async () => {
      mockCrypto();
      mockUtil();
      const { context } = mockContext();
      const result = await run(context, 'TYPEFORMAT', 'NAME', 'ask/stored', {});
      expect(result).toBe('FMTVALUE');
      expect(context.app.prompt.mock.calls[0][1].defaultValue).toBe('STOREDVALUE');
      expect(context.store.removeItem).not.toHaveBeenCalled();
      expect(context.store.setItem).toHaveBeenCalledWith('REQID.HASH.TYPE', 'USERVALUE');
    });
  });
  describe('when there is not a stored value', () => {
    test('', async () => {
      mockCrypto();
      mockUtil();
      const { context } = mockContext();
      context.store.getItem.mockImplementation(() => null);
      const result = await run(context, 'TYPEFORMAT', 'NAME', 'ask/stored', {});
      expect(result).toBe('FMTVALUE');
      expect(context.app.prompt.mock.calls[0][1].defaultValue).toBe('');
      expect(context.store.removeItem).not.toHaveBeenCalled();
      expect(context.store.setItem).toHaveBeenCalledWith('REQID.HASH.TYPE', 'USERVALUE');
    });
  });
});

describe('when ask behavior is once/stored', () => {
  describe('when there is a stored value', () => {
    test('', async () => {
      mockCrypto();
      mockUtil();
      const { context } = mockContext();
      const result = await run(context, 'TYPEFORMAT', 'NAME', 'once/stored', {});
      expect(result).toBe('STOREDVALUE');
      expect(context.app.prompt).not.toHaveBeenCalled();
      expect(context.store.removeItem).not.toHaveBeenCalled();
      expect(context.store.setItem).not.toHaveBeenCalledWith();
    });
  });
  describe('when there is not a stored value', () => {
    test('', async () => {
      mockCrypto();
      mockUtil();
      const { context } = mockContext();
      context.store.getItem.mockImplementation(() => null);
      const result = await run(context, 'TYPEFORMAT', 'NAME', 'once/stored', {});
      expect(result).toBe('FMTVALUE');
      expect(context.app.prompt.mock.calls[0][1].defaultValue).toBe('');
      expect(context.store.removeItem).not.toHaveBeenCalled();
      expect(context.store.setItem).toHaveBeenCalledWith('REQID.HASH.TYPE', 'USERVALUE');
    });
  });
});

// describe('when the render purpose is to preview', () => {
//   describe('when the typeFormat is string/password', () => {
//     test('', async () => {
//       mockCrypto();
//       mockUtil();
//       const { context } = mockContext();
//       context.renderPurpose = '';
//       context.store.getItem.mockImplementation(() => 'S3CR3T');
//       const result = await run(context, 'string/password', 'NAME', 'once/stored', {});
//       expect(result).toBe('******');
//       expect(context.app.prompt).not.toHaveBeenCalled();
//       expect(context.store.removeItem).not.toHaveBeenCalled();
//       expect(context.store.setItem).not.toHaveBeenCalled();
//     });
//   });
//   describe('when the typeFormat is not string/password', () => {
//     test('', async () => {
//       mockCrypto();
//       mockUtil();
//       const { context } = mockContext();
//       context.renderPurpose = '';
//       const result = await run(context, 'TYPEFORMAT', 'NAME', 'once/stored', {});
//       expect(result).toBe('STOREDVALUE');
//       expect(context.app.prompt).not.toHaveBeenCalled();
//       expect(context.store.removeItem).not.toHaveBeenCalled();
//       expect(context.store.setItem).not.toHaveBeenCalled();
//     });
//   });
// });
