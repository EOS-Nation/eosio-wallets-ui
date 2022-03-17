const localStorage = global.localStorage;

export function set(key: string, value: any) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        localStorage.setItem(key, value);
    }
}

export function add(key: string, value: any) {
    try {
        set(key, Object.assign(get(key) || {}, value));
    } catch (err) {
        console.error("common/storage::add", {err, key, value});
    }
}

export function get(key: string) {
    const value = localStorage.getItem(key);
    if ( !value ) return value;
    try {
        return JSON.parse(value);
    } catch (e) {
        return value;
    }
}

export function remove(key: string) {
    localStorage.removeItem(key);
}