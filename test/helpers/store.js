import sinon from 'sinon';

export default function createMockStore(state) {
  return {
    dispatch:  sinon.stub(),
    getState:  sinon.stub().returns(state),
    subscribe: sinon.stub()
  };
}
