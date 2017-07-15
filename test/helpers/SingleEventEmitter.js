import EventEmitter from 'events';

export default class SingleEventEmitter {
  constructor(eventName = '') {
    this.eventName = eventName;
    this.eventEmitter = new EventEmitter();
  }

  addListener = (listener) => {
    this.eventEmitter.on(this.eventName, listener);
  }

  emit = (...args) => {
    this.eventEmitter.emit(this.eventName, ...args);
  }
}
