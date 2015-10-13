import * as channelsfactory from '../entity/channelsfactory';

const osirase = 'DP◆お知らせ';

export function url() {
    return 'http://dp.prgrssv.net/index.txt';
}

export function getChannels(body: string) {
    let list = channelsfactory.fromIndexTxt(body, 'DP');
    return [
        list.where(x => x.name !== osirase).toArray(),
        list.where(x => x.name === osirase).toArray()
    ];
}
