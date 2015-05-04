angular.module('website').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/views/home/home.html',
    "<div id=home>Home content</div>"
  );

}]);
