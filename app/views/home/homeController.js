/* Controllers */
class HomeController {
    constructor(HomeService) {
        this.HomeService = HomeService;
    }
}

angular.module('website').controller('HomeController', HomeController);

