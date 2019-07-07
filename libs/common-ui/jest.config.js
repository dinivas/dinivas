module.exports = {
  name: 'common-ui',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/common-ui',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
