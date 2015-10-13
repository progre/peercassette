import * as channelsfactory from '../entity/channelsfactory';
import * as log4js from 'log4js';

const osirase = 'TPからのお知らせ◆お知らせ';
const upload = 'Temporary yellow Pages◆アップロード帯域';

export function url(localPort: number) {
    if (localPort === 8080) {
        log4js.getLogger('server').warn('TPは8080ではアクセスできないっぽい');
    }
    return 'http://temp.orz.hm/yp/index.txt?port=' + localPort;
}

export function getChannels(body: string) {
    let list = channelsfactory.fromIndexTxt(body, 'TP')
    // Free, Open, Over, 3Mbps Overを取り出す。descからは削除
        .select(channel => {
            let r = channel.desc.match(/(?: - )?<(.*)>$/);
            if (r == null) {
                channel.bandType = '';
                return channel;
            }
            channel.bandType = r[1];
            channel.desc = channel.desc.substring(0, (<any>r).index);
            return channel;
        })
        .where(x => x.name !== upload);

    return [
        list.where(x => x.name !== osirase).toArray(),
        list.where(x => x.name === osirase).toArray()
    ];
}
