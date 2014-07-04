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
      tags: '=',
      tagClicked: '&'
    },
    templateUrl: 'components/tagcloud/tagcloud.html',
    link: function link(scope, element) {
      var canvasId = scope.canvasId = 'canvas' + uniqueCanvasId.next(),
          started = false,
          starting = false;

      scope.$watchCollection('tags', function () {
        if (starting && !started) return;

        if (!started) {

          $timeout(function () {
            TagCanvas.Start(canvasId, null, {
              textColour: 'red',
              weight: true,
              weightFrom: 'data-weight',
              weightMode: 'size',
              weightSize: 0.6,
              clickToFront: 300,
              // freezeActive: true,
              // freezeDecel: true,
              // inverse: true
              dragControl: true
            });
            started = true;
          }, 500);
          starting = true;

        } else {

          $timeout(function () {
            TagCanvas.Update(canvasId);
          });

        }
      });

      var canvas = element.find('canvas');
      canvas.css('width', '100%').css('height', '100%');

      function resize() {
        if (canvas.prop('offsetWidth') && canvas.prop('offsetHeight')) {
          canvas
            .attr('width', canvas.prop('offsetWidth'))
            .attr('height', canvas.prop('offsetHeight'));
        }
      }
      var resizeInterval = $interval(resize, 500);
      resize();

      scope.$on('$destroy', function () {
        $interval.cancel(resizeInterval);
        TagCanvas.Stop(canvasId);
      });
    }
  };
});