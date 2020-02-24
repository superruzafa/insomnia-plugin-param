const crypto = require('crypto');
const util = require('../util');
const index = require('../index');
const run = index.templateTags[0].run;

jest.mock('crypto');
jest.mock('../util');

function mockContext() {
  const prompt = jest.fn((title, options) => Promise.resolve('PROMPT_RESULT'));
  const getItem = jest.fn(storageKey => Promise.resolve('STORED_VALUE'));
  const setItem = jest.fn((storageKey, value) => Promise.resolve(null));
  const context = {
    app: {
      prompt
    },
    meta: {
      requestId: 'REQUEST_ID'
    },
    store: {
      getItem,
      setItem
    }
  };
  return { context, prompt, getItem, setItem };
}

function mockCrypto() {
  const digest = jest.fn(() => 'DIGEST_RESULT');
  const update = jest.fn(() => ({ digest }));
  const createHash = jest.fn(() => ({ update }));
  crypto.createHash = createHash;
  return { createHash, update, digest };
}

function mockUtil() {
  util.getTypeFormat = jest.fn(() => ['PARAM_TYPE', 'PARAM_FORMAT']);
  util.getHtmlInputType = jest.fn(() => 'INPUT_TYPE');
  util.getNameDesc = jest.fn(() => ['PARAM_NAME', 'DESCRIPTION']);
  util.formatValue = jest.fn(() => 'FORMATTED_VALUE');
  return util;
}

describe('when there is not a stored value', () => {
  describe('when the ask behaviour is ask/blank', () => {
    test('', async () => {
      const { update, digest } = mockCrypto();
      const { context } = mockContext();
      mockUtil();
      context.store.getItem.mockImplementation(() => Promise.resolve(''));

      const value = await run(context, 'TYPE/FORMAT', 'PARAM_NAME', 'ask/blank', '');
      expect(value).toBe('FORMATTED_VALUE');
      expect(util.getTypeFormat).toHaveBeenCalledWith('TYPE/FORMAT');
      expect(crypto.createHash).toHaveBeenCalledWith('md5');
      expect(update).toHaveBeenCalledWith('PARAM_NAME');
      expect(digest).toHaveBeenCalledWith('hex');
      expect(context.store.getItem).toHaveBeenCalledWith('REQUEST_ID.DIGEST_RESULT.PARAM_TYPE')
      expect(util.getHtmlInputType).toHaveBeenCalledWith('TYPE/FORMAT');
      expect(context.app.prompt).toHaveBeenCalledWith('PARAM_NAME', {
        label: 'DESCRIPTION',
        defaultValue: '',
        inputType: 'INPUT_TYPE',
        selectText: true
      });
      expect(context.store.setItem).toHaveBeenCalledWith('REQUEST_ID.DIGEST_RESULT.PARAM_TYPE', 'PROMPT_RESULT');
      expect(util.formatValue).toHaveBeenCalledWith('PROMPT_RESULT', 'TYPE/FORMAT');
    });
  });

  describe('when the ask behaviour is ask/stored', () => {
    test('', async () => {
      const { update, digest } = mockCrypto();
      const { context } = mockContext();
      mockUtil();
      context.store.getItem.mockImplementation(() => Promise.resolve(''));

      const value = await run(context, 'TYPE/FORMAT', 'PARAM_NAME', 'ask/stored', '');
      expect(value).toBe('FORMATTED_VALUE');
      expect(util.getTypeFormat).toHaveBeenCalledWith('TYPE/FORMAT');
      expect(crypto.createHash).toHaveBeenCalledWith('md5');
      expect(update).toHaveBeenCalledWith('PARAM_NAME');
      expect(digest).toHaveBeenCalledWith('hex');
      expect(context.store.getItem).toHaveBeenCalledWith('REQUEST_ID.DIGEST_RESULT.PARAM_TYPE')
      expect(util.getHtmlInputType).toHaveBeenCalledWith('TYPE/FORMAT');
      expect(context.app.prompt).toHaveBeenCalledWith('PARAM_NAME', {
        label: 'DESCRIPTION',
        defaultValue: '',
        inputType: 'INPUT_TYPE',
        selectText: true
      });
      expect(context.store.setItem).toHaveBeenCalledWith('REQUEST_ID.DIGEST_RESULT.PARAM_TYPE', 'PROMPT_RESULT');
      expect(util.formatValue).toHaveBeenCalledWith('PROMPT_RESULT', 'TYPE/FORMAT');
    });
  });

  describe('when the ask behaviour is ask/default', () => {
    test('', async () => {
      const { update, digest } = mockCrypto();
      const { context } = mockContext();
      mockUtil();
      context.store.getItem.mockImplementation(() => Promise.resolve(''));

      const value = await run(context, 'TYPE/FORMAT', 'PARAM_NAME', 'ask/default', '');
      expect(value).toBe('FORMATTED_VALUE');
      expect(util.getTypeFormat).toHaveBeenCalledWith('TYPE/FORMAT');
      expect(crypto.createHash).toHaveBeenCalledWith('md5');
      expect(update).toHaveBeenCalledWith('PARAM_NAME');
      expect(digest).toHaveBeenCalledWith('hex');
      expect(context.store.getItem).toHaveBeenCalledWith('REQUEST_ID.DIGEST_RESULT.PARAM_TYPE')
      expect(util.getHtmlInputType).toHaveBeenCalledWith('TYPE/FORMAT');
      expect(context.app.prompt).toHaveBeenCalledWith('PARAM_NAME', {
        label: 'DESCRIPTION',
        defaultValue: '',
        inputType: 'INPUT_TYPE',
        selectText: true
      });
      expect(context.store.setItem).toHaveBeenCalledWith('REQUEST_ID.DIGEST_RESULT.PARAM_TYPE', 'PROMPT_RESULT');
      expect(util.formatValue).toHaveBeenCalledWith('PROMPT_RESULT', 'TYPE/FORMAT');
    });
  });

  describe('when the ask behaviour is once/stored', () => {
    test('the stored value should be returned without shown the prompt', async () => {
      const { update, digest } = mockCrypto();
      const { context } = mockContext();
      mockUtil();
      context.store.getItem.mockImplementation(() => Promise.resolve(''));

      const value = await run(context, 'TYPE/FORMAT', 'PARAM_NAME', 'once/stored', '');
      expect(value).toBe('FORMATTED_VALUE');
      expect(util.getTypeFormat).toHaveBeenCalledWith('TYPE/FORMAT');
      expect(crypto.createHash).toHaveBeenCalledWith('md5');
      expect(update).toHaveBeenCalledWith('PARAM_NAME');
      expect(digest).toHaveBeenCalledWith('hex');
      expect(context.store.getItem).toHaveBeenCalledWith('REQUEST_ID.DIGEST_RESULT.PARAM_TYPE')
      expect(context.app.prompt).toHaveBeenCalledWith('PARAM_NAME', {
        label: 'DESCRIPTION',
        defaultValue: '',
        inputType: 'INPUT_TYPE',
        selectText: true
      });
      expect(context.store.setItem).toHaveBeenCalledWith('REQUEST_ID.DIGEST_RESULT.PARAM_TYPE', 'PROMPT_RESULT');
      expect(util.formatValue).toHaveBeenCalledWith('PROMPT_RESULT', 'TYPE/FORMAT');
    });
  });

  describe('when the type/format is string/password', () => {
    test('the stored value should be returned without shown the prompt', async () => {
      const { update, digest } = mockCrypto();
      const { context } = mockContext();
      mockUtil();
      context.store.getItem.mockImplementation(() => Promise.resolve(''));

      const value = await run(context, 'string/password', 'PARAM_NAME', 'ask/always', '');
      expect(value).toBe('FORMATTED_VALUE');
      expect(util.getTypeFormat).toHaveBeenCalledWith('string/password');
      expect(crypto.createHash).toHaveBeenCalledWith('md5');
      expect(update).toHaveBeenCalledWith('PARAM_NAME');
      expect(digest).toHaveBeenCalledWith('hex');
      expect(context.store.getItem).toHaveBeenCalledWith('REQUEST_ID.DIGEST_RESULT.PARAM_TYPE')
      expect(context.app.prompt).toHaveBeenCalledWith('PARAM_NAME', {
        label: 'DESCRIPTION',
        defaultValue: '',
        inputType: 'INPUT_TYPE',
        selectText: true
      });
      expect(context.store.setItem).not.toHaveBeenCalled();
      expect(util.formatValue).toHaveBeenCalledWith('PROMPT_RESULT', 'string/password');
    });
  });
});

describe('when there is a stored value', () => {
  describe('when the ask behaviour is ask/blank', () => {
    test('', async () => {
      const { update, digest } = mockCrypto();
      const { context } = mockContext();
      mockUtil();
      context.store.getItem.mockImplementation(() => Promise.resolve('STORED_VALUE'));

      const value = await run(context, 'TYPE/FORMAT', 'PARAM_NAME', 'ask/blank', '');
      expect(value).toBe('FORMATTED_VALUE');
      expect(util.getTypeFormat).toHaveBeenCalledWith('TYPE/FORMAT');
      expect(crypto.createHash).toHaveBeenCalledWith('md5');
      expect(update).toHaveBeenCalledWith('PARAM_NAME');
      expect(digest).toHaveBeenCalledWith('hex');
      expect(context.store.getItem).toHaveBeenCalledWith('REQUEST_ID.DIGEST_RESULT.PARAM_TYPE')
      expect(util.getHtmlInputType).toHaveBeenCalledWith('TYPE/FORMAT');
      expect(context.app.prompt).toHaveBeenCalledWith('PARAM_NAME', {
        label: 'DESCRIPTION',
        defaultValue: '',
        inputType: 'INPUT_TYPE',
        selectText: true
      });
      expect(context.store.setItem).toHaveBeenCalledWith('REQUEST_ID.DIGEST_RESULT.PARAM_TYPE', 'PROMPT_RESULT');
      expect(util.formatValue).toHaveBeenCalledWith('PROMPT_RESULT', 'TYPE/FORMAT');
    });
  });

  describe('when the ask behaviour is ask/stored', () => {
    test('', async () => {
      const { update, digest } = mockCrypto();
      const { context } = mockContext();
      mockUtil();
      context.store.getItem.mockImplementation(() => Promise.resolve('STORED_VALUE'));

      const value = await run(context, 'TYPE/FORMAT', 'PARAM_NAME', 'ask/stored', '');
      expect(value).toBe('FORMATTED_VALUE');
      expect(util.getTypeFormat).toHaveBeenCalledWith('TYPE/FORMAT');
      expect(crypto.createHash).toHaveBeenCalledWith('md5');
      expect(update).toHaveBeenCalledWith('PARAM_NAME');
      expect(digest).toHaveBeenCalledWith('hex');
      expect(context.store.getItem).toHaveBeenCalledWith('REQUEST_ID.DIGEST_RESULT.PARAM_TYPE')
      expect(context.app.prompt).toHaveBeenCalledWith('PARAM_NAME', {
        label: 'DESCRIPTION',
        defaultValue: 'STORED_VALUE',
        inputType: 'INPUT_TYPE',
        selectText: true
      });
      expect(context.store.setItem).toHaveBeenCalledWith('REQUEST_ID.DIGEST_RESULT.PARAM_TYPE', 'PROMPT_RESULT');
      expect(util.formatValue).toHaveBeenCalledWith('PROMPT_RESULT', 'TYPE/FORMAT');
    });
  });
  describe('when the ask behaviour is ask/default', () => {
    test('', async () => {
      const { update, digest } = mockCrypto();
      const { context } = mockContext();
      mockUtil();
      context.store.getItem.mockImplementation(() => Promise.resolve('STORED_VALUE'));

      const value = await run(context, 'TYPE/FORMAT', 'PARAM_NAME', 'ask/default', '');
      expect(value).toBe('FORMATTED_VALUE');
      expect(util.getTypeFormat).toHaveBeenCalledWith('TYPE/FORMAT');
      expect(crypto.createHash).toHaveBeenCalledWith('md5');
      expect(update).toHaveBeenCalledWith('PARAM_NAME');
      expect(digest).toHaveBeenCalledWith('hex');
      expect(context.store.getItem).toHaveBeenCalledWith('REQUEST_ID.DIGEST_RESULT.PARAM_TYPE')
      expect(context.app.prompt).toHaveBeenCalledWith('PARAM_NAME', {
        label: 'DESCRIPTION',
        defaultValue: '',
        inputType: 'INPUT_TYPE',
        selectText: true
      });
      expect(context.store.setItem).toHaveBeenCalledWith('REQUEST_ID.DIGEST_RESULT.PARAM_TYPE', 'PROMPT_RESULT');
      expect(util.formatValue).toHaveBeenCalledWith('PROMPT_RESULT', 'TYPE/FORMAT');
    });
  });
  describe('when the ask behaviour is once/stored', () => {
    test('the stored value should be returned without shown the prompt', async () => {
      const { update, digest } = mockCrypto();
      const { context } = mockContext();
      mockUtil();

      context.store.getItem.mockImplementation(() => Promise.resolve('STORED_VALUE'));
      const value = await run(context, 'TYPE/FORMAT', 'PARAM_NAME', 'once/stored', '');
      expect(value).toBe('STORED_VALUE');
      expect(util.getTypeFormat).toHaveBeenCalledWith('TYPE/FORMAT');
      expect(crypto.createHash).toHaveBeenCalledWith('md5');
      expect(update).toHaveBeenCalledWith('PARAM_NAME');
      expect(digest).toHaveBeenCalledWith('hex');
      expect(context.store.getItem).toHaveBeenCalledWith('REQUEST_ID.DIGEST_RESULT.PARAM_TYPE')
      expect(context.app.prompt).not.toHaveBeenCalled();
      expect(context.store.setItem).not.toHaveBeenCalled();
      expect(util.formatValue).not.toHaveBeenCalled();
    });
  });
});

