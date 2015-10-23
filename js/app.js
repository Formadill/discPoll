var discPoll = angular.module('discPoll', ['ngAnimate', 'firebase', 'ngRoute'])
.factory('argFactory', function ($firebaseArray, $routeParams, $firebaseObject) {
    
    return {
        getArgs: function (opt, id) {
            var ref = new Firebase('https://discpoll.firebaseio.com/Discussions/' + id);
            return $firebaseArray(ref.child('Options').child('Option' + opt).child('Arguments'));
        },
        addArgs: function (m, s, opt, id, weight) {
            var ref = new Firebase('https://discpoll.firebaseio.com/Discussions/' + id);
            var newRef = ref.child('Options').child('Option' + opt).child('Arguments').push({
                'mainText': m,
                'secondText': s,
                'id': '',
                'opt': opt,
                'votes': [parseInt(weight)]
            });

            var _id = newRef.key();
            ref.child('Options').child('Option' + opt).child('Arguments').child(_id).child('id').set(_id);
        },
        getDiscs: function () {
            var ref = new Firebase('https://discpoll.firebaseio.com/Discussions');
            return $firebaseArray(ref);
        },
        addDisc: function (name, opt1, opt2) {
            var ref = new Firebase('https://discpoll.firebaseio.com/Discussions');
            var newRef = ref.push({
                    'id': '',
                    'name': name,
                    "Options": {
                        "Option1": {
                            "Arguments": {
                                '1': {
                                }
                            },
                            'name': opt1,
                        },
                        "Option2": {
                            "Arguments": {
                                '1': {
                                }
                            },
                            'name': opt2,
                        }
                    }
                    
            });
            var _id = newRef.key();
            ref.child(_id).child('id').set(_id);
        },
        getCurDisc: function (id) {
            var ref = new Firebase('https://discpoll.firebaseio.com/Discussions/');
            return $firebaseObject(ref.child(id));
        }
    };
});

discPoll.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
            .when('/',
            {
                controller: 'homeController',
                templateUrl: 'partials/home.html'
            })            
            .when('/discussion/:discussionId',
            {
                controller: 'argController',
                templateUrl: 'partials/disc.html'
            })
            .when('/discussion/:discussionId/results',
            {
                controller: 'argController',
                templateUrl: 'partials/results.html'
            })
            .otherwise({ redirectTo: '/'});
}]);

discPoll.controller('argController', ['$scope', 'argFactory', '$routeParams', function ($scope, argFactory, $routeParams) {
    $scope.opt1arguments = argFactory.getArgs(1, $routeParams.discussionId);
    $scope.opt2arguments = argFactory.getArgs(2, $routeParams.discussionId);
    $scope.discussion = argFactory.getCurDisc($routeParams.discussionId);

    $scope.updateFact = function () {
        $scope.opt1arguments = argFactory.getArgs(1, $routeParams.discussionId);
        $scope.opt2arguments = argFactory.getArgs(2, $routeParams.discussionId);
        $scope.discussion = argFactory.getCurDisc($routeParams.discussionId);
    };

    $scope.addArg = function (opt) {
        argFactory.addArgs($scope.newArg.mainText, $scope.newArg.secondText, opt, $routeParams.discussionId, $scope.newArg.Weight);
    };

    $scope.sendWeight = function () {
        $('.select_weight').each(function () {
            var val = $(this).val();
            if (val != '') {
                var opt = $(this).parent().attr('id').split('|')[1];
                var id = $(this).parent().attr('id').split('|')[0];
                var ref = new Firebase('https://discpoll.firebaseio.com/Discussions/' + $routeParams.discussionId + '/Options/Option' + opt + '/Arguments/' + id);
                ref.once("value", function (snapshot) {
                    var data = snapshot.val();
                    var arr = data['votes'];
                    arr.push(parseInt(val));
                    ref.child('votes').set(arr);
                });
            }
        });
    };
}]);

discPoll.controller('homeController', ['$scope', 'argFactory', function ($scope, argFactory) {
    $scope.discussions = argFactory.getDiscs();

    $scope.addDisc = function () {
        argFactory.addDisc($scope.newDisc.name, $scope.newDisc.opt1, $scope.newDisc.opt2);
    }
}]);