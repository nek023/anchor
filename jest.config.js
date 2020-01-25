/* eslint-disable no-undef */

module.exports = {
  preset: 'ts-jest',
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
}
