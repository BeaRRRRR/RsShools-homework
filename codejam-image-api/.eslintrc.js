module.exports = {
  'extends': [
    'airbnb-base'
  ],
  'parser': 'babel-eslint',
  'rules': {
    'no-plusplus': ['error', { 'allowForLoopAfterthoughts': true }],
    'no-param-reassign': 'off',
    'max-len': ['error', { 'ignoreComments': true , 'ignoreTemplateLiterals' : true, 'code' : 100}]
  },
  'env': {
    'browser': true,
    'jest' : true
  }
};
