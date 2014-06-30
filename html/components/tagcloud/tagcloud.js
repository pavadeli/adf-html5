angular.module('tagcloud', [])
.constant('uniqueCanvasId', {
  current: 0,
  next: function next() {
    return this.current++;
  }
})
.directive('tagCloud', function (uniqueCanvasId, $timeout, $interval) {
  return {
    restrict: 'E',
    scope: {
      tags: '='
    },
    templateUrl: 'components/tagcloud/tagcloud.html',
    link: function link(scope, element) {
      var canvasId = scope.canvasId = 'canvas' + uniqueCanvasId.next(),
          started = false;

      scope.$watchCollection('tags', function () {
        if (!started) {

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

        } else {

          $timeout(function () {
            TagCanvas.Update(canvasId);
          });

        }
      });

      var canvas = element.find('canvas');
      canvas
        .css('width', '100%')
        .css('height', '100%');

      var resizeInterval = $interval(function () {
        canvas
          .attr('width', canvas.prop('offsetWidth'))
          .attr('height', canvas.prop('offsetHeight'));
      }, 500);

      scope.$on('$destroy', function () {
        $interval.cancel(resizeInterval);
        TagCanvas.Stop(canvasId);
      });
    }
  };
});