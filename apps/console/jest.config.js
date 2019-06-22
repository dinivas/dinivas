module.exports = {
  name: 'console',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/console',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
