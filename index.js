const crypto = require('crypto');
const util = require('./util');

const availableTypeFormats = [{
  typeFormat: 'string/string',
  displayName: 'String',
  emoji: '🔤'
}, {
  typeFormat: 'string/password',
  displayName: 'Password',
  emoji: '*️⃣'
}, {
  typeFormat: 'number/integer',
  displayName: 'Integer',
  emoji: '🔢'
}, {
  typeFormat: 'boolean/boolean',
  displayName: 'Boolean',
  emoji: '☑️'
}, {
  typeFormat: 'timestamp/unix',
  displayName: 'Unix timestamp',
  emoji: '📅'
}, {
  typeFormat: 'timestamp/unix-ms',
  displayName: 'Unix timestamp with milliseconds',
  emoji: '📅'
}, {
  typeFormat: 'timestamp/ISO-8601',
  displayName: 'ISO-8601',
  emoji: '📅'
}, {
  typeFormat: 'color/html',
  displayName: 'HTML Color',
  emoji: '🖍'
}];

module.exports.templateTags = [{
  name: 'param',
  displayName: 'Param',
  liveDisplayName: args => {
    const [name] = util.getNameDesc(args[1].value);
    return name;
  },
  disablePreview: args => args[0].value === 'string/password',
  description: 'Ask for values for parameterized requests',
  args: [{
    displayName: 'Type',
    help: 'The type and format of the parameter',
    type: 'enum',
    options: availableTypeFormats.map(tf => ({
      displayName: `${tf.emoji} ${tf.displayName}`,
      value: tf.typeFormat
    })),
  }, {
    displayName: 'Name',
    help: 'The name of the parameter.\n' +
          'Optionally you can include a description with the purpose of this ' +
          'parameter by using this format: "name: description"',
    type: 'string'
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

  async run(context, typeFormat, name, askBehavior, paramOpts) {
    const isSensitiveParam = typeFormat === 'string/password'
      && ['ask/blank', 'ask/default'].includes(askBehavior);
    const [type] = util.getTypeFormat(typeFormat);
    const paramHash = crypto.createHash('md5').update(name).digest('hex');
    const storageKey = `${context.meta.requestId}.${paramHash}.${type}`;
    let storedValue = '';
    if (isSensitiveParam) {
      await context.store.removeItem(storageKey);
    } else {
      storedValue = await context.store.getItem(storageKey) || '';
    }

    if (context.renderPurpose !== 'send') {
      return storedValue || '';
    }

    let defaultValue = '';
    if (askBehavior === 'once/stored' && storedValue) {
      return storedValue;
    } else if (askBehavior === 'ask/stored') {
      defaultValue = storedValue || '';
    }
    defaultValue = util.unstringifyValue(defaultValue, typeFormat);

    const inputType = util.getHtmlInputType(typeFormat);
    const [title, description] = util.getNameDesc(name)
    const value = await context.app.prompt(title, {
      label: description,
      defaultValue,
      inputType,
      selectText: true
    });

    if (!isSensitiveParam) {
      await context.store.setItem(storageKey, value);
    }

    return util.formatValue(value, typeFormat);
  }
}];
