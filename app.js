'use strict';

angular

    .module('syba-club', [])

    .run(['$rootScope', function ($rootScope) {

        /* --- MODELS --- */

        // $rootScope.user;

        /* --- FUNCTIONS --- */

        $rootScope.initialize = function () {

            $rootScope.initializeUser();

        };

        $rootScope.initializeUser = function () {

            if (localStorage.user) {

                $rootScope.user = JSON.parse(localStorage.user);

            } else {

                $rootScope.user = null;

            }

        };

        /* --- RUN --- */

        $rootScope.initialize();

    }])

    .controller('mainCtrl', ['$http', '$rootScope', '$scope', function ($http, $rootScope, $scope) {

        /* --- MODELS --- */

        // $scope.credentials;
        // $scope.lectures;

        /* --- FUNCTIONS --- */

        $scope.initialize = function () {

            $scope.credentials = {
                username: '',
                password: ''
            };

            $scope.lectures = [];

            $scope.getLectures();

        };

        $scope.getLectures = function () {

            $http.get('http://localhost:1337/lecture?limit=5&populate=poster').then(function (response) {

                $scope.lectures = response.data;

            }, function () {

                alert('Couldn\'t get lectures.');

            });

        };

        $scope.login = function () {

            $http.get('http://localhost:1337/faculty?username=' + $scope.credentials.username + '&password=' + $scope.credentials.password).then(function (response) {

                if (response.data.length === 1) {

                    var user = response.data[0];

                    localStorage.user = JSON.stringify({
                        username: user.username,
                        password: user.password
                    });

                    $rootScope.initializeUser();

                } else {

                    alert('Couldn\'t login.');

                }

            }, function () {

                alert('Couldn\'t login.');

            });

        };

        $scope.logout = function () {

            localStorage.clear('user');

            $rootScope.initializeUser();

        };

        /* --- RUN --- */

        $scope.initialize();

    }]);