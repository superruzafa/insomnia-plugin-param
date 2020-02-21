const crypto = require('crypto');
const util = require('./util');

module.exports.templateTags = [{
  name: 'param',
  displayName: 'Param',
  description: 'Ask for values for parameterized requests',
  args: [{
    displayName: 'Name',
    help: 'The name of the parameter.\n' +
          'Optionally you can include a description with the purpose of this ' +
          'parameter by using this format: <Name>: <description>',
    type: 'string'
  }, {
    displayName: 'Type',
    help: 'The type and format of the parameter',
    type: 'enum',
    options: [{
      displayName: 'String',
      value: 'string/string'
    }, {
      displayName: 'String - Password',
      value: 'string/password'
    }, {
      displayName: 'Integer',
      value: 'integer/integer'
    }, {
      displayName: 'Timestamp - Unix',
      value: 'timestamp/unix'
    }, {
      displayName: 'Timestamp - Unix with milliseconds',
      value: 'timestamp/unix-ms'
    }, {
      displayName: 'Timestamp - ISO-8601',
      value: 'timestamp/iso-8601'
    }, {
      displayName: 'Color - HTML',
      value: 'color/html'
    }]
  }, {
    displayName: 'When to ask for a value',
    help: 'Controls when the asking dialog must be shown to the user',
    type: 'enum',
    options: [{
      displayName: 'Ask always',
      value: 'ask/blank'
    }, {
      displayName: 'Ask always, but suggest the last entered value',
      value: 'ask/stored'
    }, {
      displayName: 'Ask always, but suggest the default value',
      value: 'ask/default'
    }, {
      displayName: 'Ask once, and use the value for further requests',
      value: 'once/stored'
    }]
  }, {
    displayName: 'Options - Reserved for future use',
    help: 'Options for the param',
    hide: () => true,
    type: 'string'
  }],

  async run (context, name, typeFormat, askBehavior, paramOpts) {
    const [type] = util.getTypeFormat(typeFormat);
    const paramHash = crypto.createHash('md5').update(name).digest('hex');
    const storageKey = `${context.meta.requestId}.${paramHash}.${type}`;
    const storedValue = await context.store.getItem(storageKey);
    let defaultValue = '';

    if (askBehavior === 'once/stored' && storedValue !== '') {
      return storedValue;
    } else if (askBehavior === 'ask/stored') {
      defaultValue = storedValue || '';
    }
    const inputType = util.getHtmlInputType(typeFormat);
    const [title, description] = util.extractParamComponents(name)
    const value = await context.app.prompt(title, {
      label: description,
      defaultValue,
      inputType,
      selectText: true
    });
    if (typeFormat !== 'string/password') {
      await context.store.setItem(storageKey, value);
    }
    return util.formatValue(value, typeFormat);
  }
}];
