angular.module('tagcloud', [])
.constant('uniqueCanvasId', {
  current: 0,
  next: function next() {
    return this.current++;
  }
})
.directive('tagCloud', function (uniqueCanvasId, $timeout) {
  return {
    restrict: 'E',
    scope: {
      tags: '='
    },
    templateUrl: 'components/tagcloud/tagcloud.html',
    link: function link(scope) {
      var canvasId = scope.canvasId = 'canvas' + uniqueCanvasId.next(),
          started = false;

      scope.$watchCollection('tags', function () {
        if (started) {
          $timeout(function () {
            TagCanvas.Update(canvasId);
          });
        } else {
          $timeout(function () {
            TagCanvas.Start(canvasId, null, {
              textColour: 'red',
              weight: true,
              weightFrom: 'data-weight',
              weightMode: 'size',
              weightSize: 0.6
            });
          });
          started = true;
        }
      });
    }
  };
});