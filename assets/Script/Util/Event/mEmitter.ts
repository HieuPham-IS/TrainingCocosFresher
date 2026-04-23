import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import { EventTarget } from 'cc';

@ccclass('mEmitter')
export class mEmitter {
    private static _instance: mEmitter | null = null;
    private _emitter: EventTarget;

    private constructor() {
        this._emitter = new EventTarget();
    }

    public static get instance(): mEmitter {
        if (!this._instance) {
            this._instance = new mEmitter();
        }
        return this._instance;
    }

    emit(event: string, ...args: any[]) {
        this._emitter.emit(event, ...args);
    }

    on(event: string, listener: (...args: any[]) => void, target?: any) {
        this._emitter.on(event, listener, target);
    }

    once(event: string, listener: (...args: any[]) => void, target?: any) {
        this._emitter.once(event, listener, target);
    }

    off(event: string, listener: (...args: any[]) => void, target?: any) {
        this._emitter.off(event, listener, target);
    }

    destroy() {
        this._emitter = new EventTarget();
        mEmitter._instance = null;
    }
}

