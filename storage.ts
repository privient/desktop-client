const Store = require('data-store');
const store = new Store({path: 'data.json'});

export class Storage {
    constructor() {}

    static SetData(key, data) {
        store.set(key, data);
        return true;
    }

    static async GetData(key) {
        return new Promise((resolve, reject) => {
            if (!store.has(key)) {
                reject(undefined);
            }

            var result = store.get(key);
            return resolve(result);
        });
    }
}