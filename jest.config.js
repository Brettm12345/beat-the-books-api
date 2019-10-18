const { defaults: tsjPreset } = require('ts-jest/presets');
const { pathsToModuleNameMapper } = require('ts-jest/utils');
// @ts-ignore
const { compilerOptions } = require('./tsconfig.json');

require('dotenv').config({ path: '.env.test' });

module.exports = {
  globalSetup: './jest.setup.ts',
  globalTeardown: './jest.teardown.ts',
  moduleFileExtensions: ['js', 'ts'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/'
  }),
  testEnvironment: 'node',
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.ts$',
  testPathIgnorePatterns: [
    '/tests/util/constants.ts',
    '/tests/util/mutations.ts',
    '/tests/util/queries.ts',
    '/tests/util/testClient.ts'
  ],
  transform: tsjPreset.transform,
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ]
};
