/**
 * Created by Sébastien on 18/05/2014.
 */
angular.module('website').config(function ($routeProvider, $locationProvider) {


    $routeProvider.when('/', {
        templateUrl: 'app/views/home/home.html',
        controller: 'HomeController',
        controllerAs: 'home'
    });

    $locationProvider.html5Mode(true);
    $routeProvider.otherwise({redirectTo: '/'});

});
