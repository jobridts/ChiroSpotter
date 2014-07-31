angular.module('starter.controllers', ['kinvey'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $kinvey, $state) {
        $scope.logout = function(){
            var user = $kinvey.getActiveUser();
            if(null !== user) {
                var promise = $kinvey.User.logout();
                console.log("user logged out")
               promise.then(function(response){
                   $state.go('login',{},{location:'replace'})
               });

            }
        }
    })

.controller('PlaylistsCtrl', function($scope, $kinvey, $state ) {
//check if we can see this


$scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})
    .controller('loginCtrl', function($scope, $stateParams, $kinvey, $state, $location) {
        var promise = $kinvey.User.me();
        promise.then(
            function(response){
                $state.go('app.playlists');
            }
        )

        $scope.doLogin = function(data){
            console.log('login with user ' + data.name);
            console.log('and pwd ' + data.password);
            var promise = $kinvey.User.login({
               username : data.name,
                password : data.password
            });
            promise.then(function(response){
                console.log('user found ' + response);
                $state.go('app.playlists',{},{location:false});
                //$location.url('/app/playlists',"replace");
                }, function(error){
                $scope.errors = true;
                $scope.errorText = error.description;
                console.log("oh oh: " + error.description);
            })
        }
        $scope.doRegister = function(login){
            console.log("creating user with username " + login.name + "and pwd " + login.password);
            var promise = $kinvey.User.signup({
                username : login.name,
                password : login.password,
                email : login.email
            });
            console.log(promise);
            promise.then(
                function(response){
                    console.log(response);
                    $state.go('app.playlists',{},{location:'replace'});
            }, function(error){

                console.log('ERROR' + error.description);
            })
            /*promise.then(function(User){
                console.log("user created");
            }, function(error){
                console.log("couldnt create user: " +error.response);
            });*/
        };
        $scope.register = function(){
            $state.go('register')
        }
        $scope.login = function(){
            $state.go('login')
        }


    })
