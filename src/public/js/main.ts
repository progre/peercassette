/// <reference path="typings.d.ts"/>
declare const Silverlight: any;
import * as IndexCtrler from './module/indexctrler';
import * as PlayerCtrler from './module/playerctrler';
import * as directives from './module/directives';

const root = '/';

const app = angular.module('app', ['ngRoute', 'ngAnimate', 'ngCookies']);

app.config([
    '$routeProvider', '$locationProvider', '$sceDelegateProvider',
    ($routeProvider: ng.route.IRouteProvider, $locationProvider: ng.ILocationProvider, $sceDelegateProvider: ng.ISCEDelegateProvider) => {
        $routeProvider
            .when(root, {
                templateUrl: root + 'html/index.html', controller: 'IndexCtrler'
            }).when(root + 'info.html', {
                templateUrl: root + 'html/info.html'
            }).when(root + 'channel/:name', {
                templateUrl: root + 'html/player.html', controller: 'PlayerCtrler'
            }).otherwise({
                templateUrl: root + 'html/404.html'
            });
        $sceDelegateProvider.resourceUrlWhitelist(['self', 'http:**']); // iframeのクロスドメイン許可
    }
]);

app.controller('IndexCtrler', IndexCtrler);
app.controller('PlayerCtrler', PlayerCtrler);
app.directive('player', directives.player);
app.directive('channellist', directives.channelList);

angular.bootstrap(<any>document, ['app']);
