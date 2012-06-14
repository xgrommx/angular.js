
panelApp.controller('PerfCtrl', function PerfCtrl($scope, appContext) {

  $scope.enable = false;

  $scope.timeline = [];

  $scope.histogram = [];

  $scope.clearHistogram = function () {
    appContext.clearHistogram();
  };

  var first = true;
  $scope.$watch('enable', function (newVal, oldVal) {

    // prevent refresh on initial pageload
    if (first) {
      first = false;
    } else {
      appContext.debug(newVal);
    }
    if (newVal) {
      //updateTimeline();
      updateHistogram();
    }
  });

  $scope.log = false;
  
  $scope.$watch('log', function (newVal, oldVal) {
    appContext.setLog(newVal);
    
    appContext.watchRefresh(function () {
      appContext.setLog(newVal);
    });
  });

  $scope.inspect = function () {
    appContext.inspect(this.val.id);
  };

  var updateTimeline = function () {
    appContext.getTimelineInfo(function (info) {
      $scope.$apply(function () {
        $scope.timeline = info;
      });
      if ($scope.enable) {
        setTimeout(updateTimeline, 500);
      }
    });
  };

  var updateHistogram = function () {
    appContext.getHistogramInfo(function (info) {
      $scope.$apply(function () {
        info = info.sort(function (a, b) {
          return b.time - a.time;
        });
        var total = 0;
        info.forEach(function (elt) {
          total += elt.time;
        });
        info.forEach(function (elt) {
          elt.time = elt.time.toPrecision(3);
          elt.percent = (100 * elt.time / total).toPrecision(3);
        });

        $scope.histogram = info;
      });
      if ($scope.enable) {
        setTimeout(updateHistogram, 1000);
      }
    })
  }

  var updateTree = function () {
    appContext.getDebugInfo(function (info) {
      if (!info || info.roots.length === 0) {
        setTimeout(updateTree, 50);
        return;
      }

      $scope.$apply(function () {
        var rootIdPairs = [];
        info.roots.forEach(function (item) {
          rootIdPairs.push({
            label: item,
            value: item
          });
        });
        $scope.roots = rootIdPairs;
        if (rootIdPairs.length === 0) {
          $scope.selectedRoot = null;
        } else {
          $scope.selectedRoot = rootIdPairs[0].value;
        }
        $scope.trees = info.trees;
      });
    });
  };

  updateTree();
  appContext.watchRefresh(updateTree);
});
