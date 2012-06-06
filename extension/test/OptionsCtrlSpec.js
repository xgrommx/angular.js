describe('panelApp', function () {

  beforeEach(module('panelApp'));
  beforeEach(module(function($provide) {
    $provide.factory('chromeExtension', createChromeExtensionMock);
    $provide.factory('appContext', function () {
      return {
        debug: jasmine.createSpy('inspect')
      };
    });
  }));

  describe('OptionsCtrl', function() {
    var ctrl, $scope, appContext, chromeExtension;

    beforeEach(inject(function(_$rootScope_, _appContext_, _chromeExtension_, $controller) {
      $scope = _$rootScope_;
      chromeExtension = _chromeExtension_;
      appContext = _appContext_;
      ctrl = $controller('OptionsCtrl', {$scope: $scope});
    }));


    it('should initialize debug state to false and send requst to chrome', function () {
      expect($scope.debugger.scopes).toBe(false);
      expect($scope.debugger.bindings).toBe(false);
      expect($scope.debugger.extra).toBe(false);

      $scope.$digest();

      expect(chromeExtension.sendRequest).toHaveBeenCalledWith('hideScopes');
      expect(chromeExtension.sendRequest).toHaveBeenCalledWith('hideBindings');
    });

    it('should notify chrome of state changes to the showScopes option', function () {
      $scope.$digest();
      chromeExtension.sendRequest.reset();

      $scope.debugger.scopes = true;
      $scope.$digest();

      expect(chromeExtension.sendRequest).toHaveBeenCalledWith('showScopes');
    });

    it('should notify chrome of state changes to the showBindings option', function () {
      $scope.$digest();

      chromeExtension.sendRequest.reset();

      $scope.debugger.bindings = true;
      $scope.$digest();

      expect(chromeExtension.sendRequest).toHaveBeenCalledWith('showBindings');
    });

    it('should not refresh upon initial panel load', function () {
      $scope.$digest();
      expect(appContext.debug).not.toHaveBeenCalled();
    });
  });
});