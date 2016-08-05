'use strict';

angular

    .module('syba-club', [])

    .run(['$rootScope', function ($rootScope) {

        /* --- MODELS --- */

        // $rootScope.apiUrl;
        // $rootScope.nascent;
        // $rootScope.user;

        /* --- FUNCTIONS --- */

        $rootScope.initialize = function () {

            $rootScope.apiUrl = 'http://api.syba.club/';

            $rootScope.nascent = false;

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
        // $scope.lectureDays;
        // $scope.lectureHours;
        // $scope.lectureMinutes;
        // $scope.lectures;
        // $scope.newLecture;
        // $scope.newLectureTime;

        /* --- FUNCTIONS --- */

        $scope.initialize = function () {

            $scope.credentials = {
                username: '',
                password: ''
            };

            $scope.lectureDays = [
                { name: 'Sunday', value: 0 },
                { name: 'Monday', value: 1 },
                { name: 'Tuesday', value: 2 },
                { name: 'Wednesday', value: 3 },
                { name: 'Thursday', value: 4 },
                { name: 'Friday', value: 5 },
                { name: 'Saturday', value: 6 }
            ];

            $scope.lectureHours = [
                { name: '11 AM', value: 11 },
                { name: '12 PM', value: 12 },
                { name: '1 PM', value: 13 },
                { name: '2 PM', value: 14 },
                { name: '3 PM', value: 15 },
                { name: '4 PM', value: 16 },
                { name: '5 PM', value: 17 }
            ];

            $scope.lectureMinutes = [
                { name: '00', value: 0 },
                { name: '15', value: 15 },
                { name: '30', value: 30 },
                { name: '45', value: 45 },
            ];

            $scope.lectures = [];

            $scope.newLecture = {
                faculty: '',
                when: null,
                poster: null
            };

            $scope.newLectureTime = {
                day: moment().day(),
                hour: 11,
                minute: 0
            };

            $scope.getLectures();

        };

        $scope.addLecture = function () {

            $rootScope.nascent = true;

            var day = $scope.newLectureTime.day >= moment().day() ? $scope.newLectureTime.day : $scope.newLectureTime.day + 7;

            $scope.newLecture.when = moment().day(day).hour($scope.newLectureTime.hour).minute($scope.newLectureTime.minute).second(0).millisecond(0).toISOString();

            $scope.newLecture.poster = $rootScope.user.id;

            $http.post($rootScope.apiUrl + 'lecture', $scope.newLecture).then(function (response) {

                $scope.getLectures();

                $rootScope.nascent = false;

            }, function () {

                $rootScope.nascent = false;

                alert('Couldn\'t add lecture.');

            });

        };

        $scope.deleteLecture = function (id) {

            $rootScope.nascent = true;

            $http.delete($rootScope.apiUrl + 'lecture/' + id).then(function (response) {

                $scope.getLectures();

                $rootScope.nascent = false;

            }, function () {

                $rootScope.nascent = false;

                alert('Couldn\'t delete lecture.');

            });

        };

        $scope.getLectures = function () {

            $rootScope.nascent = true;

            $http.get($rootScope.apiUrl + 'lecture?limit=5&populate=poster&sort=createdAt DESC').then(function (response) {

                angular.forEach(response.data, function (lecture) {

                    lecture.when = moment(lecture.when).format("h:mm A, dddd, Mo MMMM");

                    lecture.createdAt = moment(lecture.createdAt).fromNow();

                });

                $scope.lectures = response.data;

                $rootScope.nascent = false;

            }, function () {

                $rootScope.nascent = false;

                alert('Couldn\'t get lectures.');

            });

        };

        $scope.login = function () {

            $rootScope.nascent = true;

            $http.get($rootScope.apiUrl + 'faculty?username=' + $scope.credentials.username + '&password=' + $scope.credentials.password).then(function (response) {

                if (response.data.length === 1) {

                    localStorage.user = JSON.stringify(response.data[0]);

                    $rootScope.initializeUser();

                    $rootScope.nascent = false;

                } else {

                    $rootScope.nascent = false;

                    alert('Couldn\'t login.');

                }

            }, function () {

                $rootScope.nascent = false;

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