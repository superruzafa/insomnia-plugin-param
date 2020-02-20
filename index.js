const crypto = require('crypto');
const dateFns = require('date-fns');

function getTypeFormat(typeFormat) {
  return typeFormat.split('/');
}

function getHtmlInputType(typeFormat) {
  const [type] = getTypeFormat(typeFormat);
  if (typeFormat === 'string/password') return 'password';
  if (type === 'timestamp') return 'datetime-local';
  return 'text'
}

function formatValue(value, typeFormat) {
  const [type, format] = getTypeFormat(typeFormat);
  if (type === 'timestamp') {
    const date = dateFns.parseISO(value);
    if (format === 'unix-ms') return dateFns.format(date, 'T');
    if (format === 'iso-8601') return dateFns.formatISO(date);
    return dateFns.format(date, 't');
  }
  return value;
}

module.exports.templateTags = [{
  name: 'param',
  displayName: 'Param',
  description: 'Ask for values for parameterized requests',
  args: [{
    displayName: 'Name',
    help: 'The name of the parameter',
    type: 'string'
  }, {
    displayName: 'Type',
    help: 'The type and format of the parameter',
    type: 'enum',
    options: [{
      displayName: 'String',
      value: 'string/raw'
    }, {
      displayName: 'String - Password',
      value: 'string/password'
    }, {
      displayName: 'Timestamp - Unix',
      value: 'timestamp/unix'
    }, {
      displayName: 'Timestamp - Unix with milliseconds',
      value: 'timestamp/unix-ms'
    }, {
      displayName: 'Timestamp - ISO-8601',
      value: 'timestamp/iso-8601'
    }]
  }],

  async run (context, name, typeFormat) {
    const paramHash = crypto.createHash('md5').update(name).digest('hex');
    const storageKey = `${context.meta.requestId}.${paramHash}.${typeFormat}`;
    const storedValue = await context.store.getItem(storageKey);
    const title = name || 'Parameter';
    const inputType = getHtmlInputType(typeFormat);
    const value = await context.app.prompt(title, {
      defaultValue: storedValue || '',
      inputType,
      selectText: true
    });
    if (typeFormat !== 'string/password') {
      await context.store.setItem(storageKey, value);
    }
    return formatValue(value, typeFormat);
  }
}];
