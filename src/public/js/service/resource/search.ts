import * as Enumerable from 'linq';
import * as express from 'express';
import * as functions from '../../infrastructure/functions';
import YPWatcher from '../../infrastructure/ypwatcher';

export function controller(ypWatcher: YPWatcher) {
    return {
        index: (req: express.Request, res: express.Response) => {
            functions.requirePortConnectable(
                req,
                () => {
                    let channel = Enumerable.from(ypWatcher.channels)
                        .where(x => x.name === req.param('name'))
                        .firstOrDefault();
                    res.send({
                        portConnectable: true,
                        id: channel.id,
                        ip: channel.ip,
                        type: channel.type
                    });
                },
                () => {
                    res.send({
                        portConnectable: false,
                        id: '',
                        ip: '',
                        type: ''
                    });
                },
                () => {
                    res.send(500);
                });
        }
    };
}
