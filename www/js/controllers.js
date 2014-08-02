angular.module('starter.controllers', ['kinvey'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $kinvey, $state, UserService) {



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
     getData();

function getData(){
    var query = new $kinvey.Query();
    query.limit(3);
    query.descending('_id');
var promise = $kinvey.DataStore.find('spottings',query,{relations:{locatie: 'locaties', groep : 'groepen', spotter: 'user'}});
        promise.then(
            function(response){
                $scope.spottings = response;
                $scope.$broadcast('scroll.refreshComplete');
            }, function(error){
                console.log("error retreiving spottings: " + error.description)
            }
        );
}/*
$scope.spottings = [
    { title: 'Chiro Sjima', id: 1, location : "Schelle", spotter: "Jan Peeters", points: "10" },
    { title: 'Chiro Vrolijke Kring', id: 2, location : "Leopoldsburg", spotter: "Dirk Janssens", points: "5"  },
    { title: 'Chiro Ekyrpak', id: 3, location : "Antwerpen", spotter: "Jo Bridts", points: "10"  },
    { title: 'Chiro Hamburgers', id: 4, location : "Leuven", spotter: "Merijn Vandegeuchte", points: "10"  },
    { title: 'Chiro Hamont', id: 5, location : "Gent", spotter: "Jos Cleymans", points: "20"  },

  ];
*/

        $scope.doRefresh = function(){
            getData();

        }
        $scope.newSpotting = function(){
            $state.go('app.spotting');
        }
$scope.addSpotting = function(spotting){
    //calculate points
    spotting.points = 5;
    if(spotting.groep !== undefined){
        if (spotting.groep.naam !== null){
        console.log("5pts voor naam");

        spotting.points += 5;
        }
    }
    if (spotting.lift === true){
        console.log("10pts voor lift")
        spotting.points += 15;
    }
    if (spotting.spel === true){
        console.log("10pts voor spel")
        spotting.points += 10;
    }
    spotting.spotter = $kinvey.getActiveUser();
    /*if (EIGENGROEP){
        spotting.points = spottings.points / 2;
    }*/
    if (spotting.spotter.totalpoints === null){
        spotting.spotter.totalpoints = 0;
    }
    spotting.spotter.totalpoints += spotting.points;

    var promise = $kinvey.DataStore.save('spottings', spotting, {relations: {locatie: 'locaties', groep : 'groepen', spotter: 'user'}});
    promise.then(
        function(response){
            console.log("created spotting " + response);
            $state.go('app.playlists');
        }, function(error){
            console.log("something went wrong: " + error.description)
        }
    )

}
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})
    .controller('loginCtrl', function($scope, $stateParams, $kinvey, $state, $location) {
        var user = $kinvey.getActiveUser();
        if (user !== null){

                console.log("found user, redirect");
                $state.go("app.playlists");
            }else{
                console.log("no user found: " );
            }



        $scope.doLogin = function(data){
            console.log('login with user ' + data.name);
            console.log('and pwd ' + data.password);
            var promise = $kinvey.User.login({
               username : data.name,
                password : data.password
            });
            promise.then(function(response){
                console.log('user found ' + response);
                //$state.go('app.playlists',{},{location:"replace"});
                $location.url('/app/playlists',"replace");
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

        };
        $scope.register = function(){
            $state.go('register')
        }
        $scope.login = function(){
            $state.go('login')
        }
        $scope.facebook = function(){
            var promise = $kinvey.Social.connect(null, 'facebook', {
                create: 'true'
            });
            promise.then(
                function(){
                    console.log('FB-login success');
                    $state.transitionTo('app.playlists');
                }, function(error){
                    console.log("FB-error" + error.description);
                }
            );
        }
        $scope.twitter = function(){
            var promise = $kinvey.Social.connect(null, 'google', {
                create: 'true'
            });
            promise.then(
                function(){
                    console.log('Twitter-login success');
                    $state.transitionTo('app.playlists');
                }, function(error){
                    console.log("Twitter-error" + error.description);
                }
            );
        }


    })
    .controller('SettingsCtrl', function($scope, $stateParams,$kinvey,$state) {
        var user = $kinvey.getActiveUser();
        if (user !==null){

                $scope.user = user;
        }else{
                console.log("no user, to login");
                $state.go('login');
            }

        $scope.updateUser =function(user){
            var promise = $kinvey.User.update(user);
            promise.then(
                function(response){
                    console.log("user updated");
                    $state.go('app.playlists');
                }, function(error){
                    console.log("update failed: " + error.description);
                }
            )
        }

    })
    .controller('ScoreCtrl', function($scope, $kinvey, $state ) {
//check if we can see this
        getData();

        function getData(){

            var query = new $kinvey.Query();
            var secondquery = new $kinvey.Query();
            query.limit(50);
            query.descending('totalpoints');
            query.exists('first_name');
            secondquery.exists('last_name');
            query.or(secondquery);
            var promise = $kinvey.User.find(query);


            promise.then(
                function(response){
                    $scope.users = response;
                    console.info(response);
                    $scope.$broadcast('scroll.refreshComplete');
                }, function(error){
                    console.log("error retreiving spottings: " + error.description)
                }
            );
        }

        $scope.doRefresh = function(){
            getData();
        }
    })
