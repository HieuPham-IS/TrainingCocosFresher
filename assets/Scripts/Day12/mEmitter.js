const EventEmitter = require('events');
class mEmitter {

    constructor() {
        this._emiter = new EventEmitter();
        this._emiter.setMaxListeners(100);
    }
    emit(...args) {
        this._emiter.emit(...args);
    }

    on(event, listener) {
        this._emiter.on(event, listener);
    }

    once(event, listener) {
        this._emiter.once(event, listener);
    }

    off(event, listener) {
        this._emiter.removeListener(event, listener);
    }

    removeAllEvents(event) {
        if (event) {
            this._emiter.removeAllListeners(event);
        } else {
            this._emiter.removeAllListeners();
        }
    }

    destroy() {
        this._emiter.removeAllListeners();
        this._emiter = null;
        mEmitter.instance = null;
    }
}
mEmitter.instance = new mEmitter();
module.exports = mEmitter.instance;
