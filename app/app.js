// Declare app level module which depends on filters, and services
angular.module('website', [
    //Angular modules
    'ngRoute', 'ngTouch', "ngAnimate", 'pascalprecht.translate'
]);

angular.module('website').config(function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: '/i18n/locale-',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage('fr');
});