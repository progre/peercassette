import * as Enumerable from 'linq';
import {getLogger} from 'log4js';
const logger = getLogger('server');
import Channel from '../domain/entity/channel';
import * as tp from '../domain/service/tp';
import * as sp from '../domain/service/sp';
import * as dp from '../domain/service/dp';
import * as ep from '../domain/service/ep';

export default class YPWatcher {
    channels: Channel[] = [];
    ypInfos: Channel[] = [];
    events: Channel[] = [];

    constructor(private localPort: number) {
    }

    beginWatchYP() {
        this.watchYP();
        setInterval(() => this.watchYP(), 60 * 1000);
    }

    watchYP() {
        let channels = Enumerable.from(<Channel[]>[]);
        let ypInfos = Enumerable.from(<Channel[]>[]);
        let events = Enumerable.from(<Channel[]>[]);
        let start: number;
        Promise.resolve()
            .then(() => {
                logger.debug('Start TP Request.');
                start = Date.now();
                return get(tp.url(this.localPort));
            })
            .then(body => {
                let time = Date.now() - start;
                let result = tp.getChannels(body);
                channels = channels.concat(result[0]);
                ypInfos = ypInfos.concat(result[1]);
                logger.debug('End TP Request. ' + time + 'ms, ' + result[0].length + ' channel(s), ' + result[1].length + ' info(s)');

                logger.debug('Start SP Request.');
                start = Date.now();
                return get(sp.url(this.localPort));
            })
            .then(body => {
                let time = Date.now() - start;
                let result = sp.getChannels(body);
                channels = channels.concat(result[0]);
                ypInfos = ypInfos.concat(result[1]);
                logger.debug('End SP Request. ' + time + 'ms, ' + result[0].length + ' channel(s), ' + result[1].length + ' info(s)');

                logger.debug('Start DP Request.');
                start = Date.now();
                return get(dp.url());
            })
            .then(body => {
                let time = Date.now() - start;
                let result = dp.getChannels(body);
                channels = channels.concat(result[0]);
                ypInfos = ypInfos.concat(result[1]);
                logger.debug('End DP Request. ' + time + 'ms, ' + result[0].length + ' channel(s), ' + result[1].length + ' info(s)');

                logger.debug('Start EP Request.');
                start = Date.now();
                return get(ep.url());
            })
            .then(body => {
                let time = Date.now() - start;
                let result = ep.getChannels(body);
                ypInfos = ypInfos.concat(result[1]);
                events = events.concat(result[2]);
                logger.debug('End EP Request. ' + time + 'ms, ' + result[0].length + ' channel(s), ' + result[1].length + ' info(s)');

                logger.debug('sum is ' + channels.count() + 'channel(s)');
                channels = channels.orderBy(x => x.uptimeMin); // 新しい順に並べる
                this.channels = channels.toArray();
                this.ypInfos = ypInfos.toArray();
                this.events = events.toArray();
            })
            .catch(e => {
                logger.error(e);
            });
    }
}

function get(url: string) {
    return new Promise<string>((resolve, reject) => {
        http.get(url, (res: http.ClientResponse) => {
            let body = '';
            res.setEncoding('utf8');
            res.on('data', (chunk: string) => {
                body += chunk;
            });
            res.on('end', (res: any) => {
                resolve(body);
            });
        });
    });
}
