angular.module('starter.services', ['kinvey'])

.service('UserService', function ($kinvey) {
    this.getActiveUser = function(){
        var output = null;
        console.log("getting active user");
            var promise = $kinvey.User.me();

        return promise;
        }






});