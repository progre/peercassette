import * as http from 'http';
import * as express from 'express';
import {getLogger} from 'log4js';
const logger = getLogger('server');

export function requirePortConnectable(req: express.Request, onConnectable: Function, onUnconnectable: Function, onError: Function) {
    let session: any = (<any>req).session;
    if (session.portConnectable) {
        onConnectable();
        return;
    }
    let ip = req.headers['x-forwarded-for'] || req.ip;
    let port = session.port || 7144;
    logger.debug(ip + ':' + port + 'のポート開放状況は不明です');
    checkPort(ip, port)
        .then(val => {
            if (val) {
                logger.debug('ポートが開放されていることを確認しました');
                session.portConnectable = true;
                onConnectable();
                return;
            }
            logger.debug('ポートは解放されていません');
            onUnconnectable();
        }).catch((e: any) => {
            logger.debug('ポート開放状況の確認中にエラーが発生しました');
            logger.error(e);
            onError();
        });
}

function checkPort(ip: string, port: number) {
    return new Promise<boolean>((resolve, reject) => {
        http.get(
            'http://' + ip + ':' + port,
            () => {
                resolve(true);
            }).on('error', () => {
                resolve(false);
            });
    });
}
