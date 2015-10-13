import CookieInfrastructure from '../../infrastructure/cookieinfrastructure';
import UserInfo from '../entity/userinfo';

export default class UserInfoRepos {
    constructor(private cookieIs: CookieInfrastructure) {
    }

    get() {
        return new UserInfo(this.cookieIs.getSet('favoriteChannels'));
    }

    put(value: UserInfo) {
        this.cookieIs.put('favoriteChannels', value.favoriteChannels);
    }
}
