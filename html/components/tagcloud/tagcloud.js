angular.module('tagcloud', [])
.directive('tagCloud', function () {
  return {
    restrict: 'E',
    scope: {
      tags: '='
    },
    templateUrl: 'components/tagcloud/tagcloud.html'
  }
});