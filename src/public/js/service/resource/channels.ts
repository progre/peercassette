import {getLogger} from 'log4js';
const logger = getLogger('server');
import * as Enumerable from 'linq';
import * as express from 'express';
import * as functions from '../../infrastructure/functions';
import YPWatcher from '../../infrastructure/ypwatcher';

// classにしたいけど、thisが上手く作用しないので無理
export function controller(ypWatcher: YPWatcher) {
    return {
        index: (req: express.Request, res: express.Response) => {
            let channels = Enumerable.from(ypWatcher.channels)
                .select(x => {
                    if (x.name.indexOf('(要帯域チェック)') >= 0) {
                        x = x.clone();
                        x.id = '00000000000000000000000000000000';
                        x.ip = '';
                        x.name = '（このチャンネルはp@では再生できません）';
                        x.genre = '';
                        x.desc = '';
                        x.comment = '';
                    }
                    return x;
                });
            functions.requirePortConnectable(
                req,
                () => {
                    logger.debug('チャンネル数: ' + channels.count());
                    res.send({
                        portConnectable: true,
                        channels: channels.toArray(),
                        ypInfos: ypWatcher.ypInfos,
                        events: ypWatcher.events
                    });
                },
                () => {
                    res.send({
                        portConnectable: false,
                        channels: channels.select(x => {
                            let channel = x.clone();
                            channel.id = '00000000000000000000000000000000';
                            channel.ip = '';
                            if (channel.bandType !== '' && channel.bandType !== 'Free') {
                                channel.name = '（このチャンネルの情報はPeerCast導入後に表示されます）';
                                channel.genre = '';
                                channel.desc = '';
                                channel.comment = '';
                            }
                            return channel;
                        }).toArray(),
                        ypInfos: ypWatcher.ypInfos,
                        events: ypWatcher.events
                    });
                },
                () => {
                    res.send(500);
                });
        },
        show: (req: express.Request, res: express.Response) => {
            functions.requirePortConnectable(
                req,
                () => {
                    let id = req.params.channel;
                    let channel = Enumerable.from(ypWatcher.channels)
                        .where(x => x.id === id)
                        .firstOrDefault();
                    if (channel == null) {
                        res.send(404);
                        return;
                    }
                    res.send({
                        portConnectable: true,
                        channel: channel
                    });
                },
                () => {
                    res.send({ portConnectable: false });
                },
                () => {
                    res.send(500);
                });
        }
    };
}
