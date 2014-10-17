
angular.module('rvRulesEngineApp', ['rvRuler'])
  .controller('Example1', function ($scope, rvRules) {

    $scope.data = {
      user: {
        first: "John",
        last: "Anderson",
        email: "janderson@example.com",
        password: "password"
      }
    };

    $scope.rules = [
      {
        kind: "Basic",
        params: {
          comparison: "eq",
          path: "data.user.first",
          match: "John",
        }
      }
    ];
  })
  .controller('Example2', function ($scope, rvRules) {

    $scope.data = {
      user: {
        first: "John",
        last: "Anderson",
        email: "janderson@example.com",
        password: "password"
      }
    };

    $scope.rules = [
      {
        kind: "Regex",
        params: {
          comparison: "match",
          path: "data.user.email",
          match: "janderson@example.com",
          pattern: "janderson@example.com",
          flags: 'i'
        }
      }
    ];
  })
  .controller('Example3', function ($scope, rvRules) {

    $scope.data = {
      user: {
        first: "John",
        last: "Anderson",
        email: "janderson@example.com",
        password: "password"
      }
    };

    $scope.rules = [
      {
        kind: "Basic",
        params: {
          comparison: "eq",
          path: "data.user.first",
          match: "John",
        }
      }
    ];
  })
  .directive('comparison', function(rvRules) {
    return {
      restrict: 'E',
      scope: {
        title: '@title',
        data: '=data',
        rule: '=rule'
      },
      controller: function ($scope) {
        $scope.run = function () {
          $scope.result = rvRules.setRules($scope.rule).exec($scope.data, function () {
            console.log('Yes! The ruler equated this to true');
          }, function () {
            console.log('The test failed');
          });
        };
      },
      template: "<div>" +
                  "<h4 class='pull-left'>{{title}}</h4>" +
                  "<button class='btn btn-default' ng-click='run()'>" +
                    "Process" +
                  "</button>" +
                "</div>" +
                "<div style='margin-top: 30px; overflow:auto;'>" +
                  "<div id='result'>{{result}}</div>" +
                  "<pre class='pull-left'>{{ data | json }}</pre>" +
                  "<pre class='pull-left'>{{ rule | json }}</pre>" +
                "</div>"
    };
  });

