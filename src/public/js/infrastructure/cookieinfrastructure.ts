export default class CookieInfrastructure {
    constructor(private $cookie: any) {
    }

    getSet(key: string) {
        return toSet(this.$cookie[key]);
    }

    put(key: string, value: Set<string>): void;
    put(key: string, value: any) {
        if (value instanceof Set) {
            value = toString(value);
        }
        this.$cookie[key] = value;
    }
}

function toString(set: Set<string>) {
    let list: string[] = [];
    set.forEach(item => {
        list.push(item);
    });
    return JSON.stringify(list);
}

function toSet(cookie: string) {
    let set = new Set<string>();
    let list: string[];
    try {
        list = JSON.parse(cookie);
    } catch (e) {
        list = [];
    }
    list.forEach(item => {
        set.add(item);
    });
    return set;
}
