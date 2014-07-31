angular.module('starter.services', [])

.factory('UserService', function ($kinvey) {
    var currentUser = null;

    return {
        /**
         *
         * @returns {*}
         */
        activeUser: function () {
            if (currentUser === null) {
                currentUser = "user";
            }
            return currentUser;
        },
        /**
         *
         * @param {String} _username
         * @param {String} _password
         * @returns {*}
         */
        login: function (_username, _password) {
            //Kinvey login starts
            var promise = $kinvey.User.login({
                username: _username,
                password: _password
            });

            promise.then(function (response) {
                //return User.build(response);
            }, function (error) {
                //Kinvey login finished with error
                console.log("Error login " + error.description);
            });

            return promise;
        }
    };

});