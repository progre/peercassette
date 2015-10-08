﻿/// <reference path="typings.d.ts"/>
declare var Silverlight: any;
import IndexCtrler = require('./module/indexctrler');
import PlayerCtrler = require('./module/playerctrler');
import directives = require('./module/directives');

var root = '/';

var app = angular.module('app', ['ngRoute', 'ngAnimate', 'ngCookies']);

app.config([
    '$routeProvider', '$locationProvider', '$sceDelegateProvider',
    ($routeProvider: ng.route.IRouteProvider, $locationProvider: ng.ILocationProvider, $sceDelegateProvider: ng.ISCEDelegateProvider) => {
        $locationProvider.html5Mode(true);
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
        $sceDelegateProvider.resourceUrlWhitelist(['self', 'http:**']);// iframeのクロスドメイン許可
    }
]);

app.controller('IndexCtrler', IndexCtrler);
app.controller('PlayerCtrler', PlayerCtrler);
app.directive('player', directives.player);
app.directive('channellist', directives.channelList);

angular.bootstrap(<any>document, ['app']);
