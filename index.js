const crypto = require('crypto');

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
      value: 'string'
    }]
  }],

  async run (context, name, type) {
    const paramHash = crypto.createHash('md5').update(name).digest('hex');
    const storageKey = `${context.meta.requestId}.${paramHash}`;
    const storedValue = await context.store.getItem(storageKey);
    const title = name || 'Parameter';
    const value = await context.app.prompt(title, {
      defaultValue: storedValue || '',
      inputType: 'text',
      selectText: true
    });
    await context.store.setItem(storageKey, value);
    return value;
  }
}];
