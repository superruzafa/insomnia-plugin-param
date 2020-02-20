module.exports.templateTags = [{
  name: 'param',
  displayName: 'Param',
  description: 'Ask for values for parameterized requests',
  args: [
    {
      displayName: 'Name',
      help: 'The name of the parameter',
      type: 'string'
    }
  ],

  async run (context, name) {
    return name;
  }
}];
