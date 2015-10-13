import * as Enumerable from 'linq';
import CookieInfrastructure from '../infrastructure/cookieinfrastructure';
import UserInfoRepos from '../domain/repos/userinforepos';
import UserInfo from '../domain/entity/userinfo';

export = IndexCtrler;
var IndexCtrler = [
    '$scope', '$http', '$cookies',
    ($scope: any, $http: ng.IHttpService, $cookies: any) => {
        let userInfoRepos = new UserInfoRepos(new CookieInfrastructure($cookies));
        let userInfo = userInfoRepos.get();

        $http.get('/api/1/channels')
            .then(response => {
                let data: any = response.data;
                $scope.portConnectable = data.portConnectable;
                $scope.channels = Enumerable.from(<any[]>data.channels)
                    .select(x => addPropertiesForView(x, userInfo))
                    .orderBy(x => x.favorite ? 1 : 2)
                    .toArray();
                $scope.ypInfos = data.ypInfos.map((x: any) => addPropertiesForView(x, userInfo));
                $scope.events = data.events.map((x: any) => addPropertiesForView(x, userInfo));
            })
            .catch(reason => {
                console.error(reason);
            });

        $scope.isClickable = (channel: any) => $scope.portConnectable
            && channel.id !== '00000000000000000000000000000000';
    }
];

function addPropertiesForView(x: any, userInfo: UserInfo) {
    x.line1 = x.name;
    if (x.genre === '' && x.desc === '') {
        x.line2 = '';
    } else {
        let line = [x.genre, x.desc]
            .filter(x => x.length > 0)
            .join(' - ');
        x.line2 = '[' + line + ']';
    }
    x.line3 = x.comment;
    x.favorite = userInfo.favoriteChannels.has(x.name);
    return x;
}
