// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'kinvey','starter.controllers', 'starter.services', 'ui.router'])
    .run(['$ionicPlatform', '$kinvey', '$rootScope', '$state',  function ($ionicPlatform, $kinvey, $rootScope, $state) {

        console.log($ionicPlatform);

        $ionicPlatform.ready(function () {
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

            // Kinvey initialization starts
            var promise = $kinvey.init({
                appKey: 'kid_PVqVWVBBJm',
                appSecret: '4237a05cf29a4190badb959df87ed0d5'
            });
            $rootScope.count = 1;
            promise.then(function () {
                // Kinvey initialization finished with success
                console.log("Kinvey init with success");
                determineBehavior($kinvey, $state, $rootScope);

                // setup the stateChange listener
                $rootScope.$on("$stateChangeStart", function (event, toState /*, toParams, fromState, fromParams*/) {
                    if (toState.name !== 'signin') {
                       determineBehavior($kinvey, $state, $rootScope);
                    }
                });

            }, function (errorCallback) {
                // Kinvey initialization finished with error
                console.log("Kinvey init with error: " + JSON.stringify(errorCallback));
                determineBehavior($kinvey, $state, $rootScope);
            });
        });
    }])



.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('login', {
      url : "/login",
      templateUrl: "templates/login.html",
      controller: "loginCtrl"
    })
      .state('register', {
          url : "/register",
          templateUrl: "templates/register.html",
          controller: "loginCtrl"
      })
    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })

    .state('app.search', {
      url: "/search",
      views: {
        'menuContent' :{
          templateUrl: "templates/search.html"
        }
      }
    })

    .state('app.browse', {
      url: "/browse",
      views: {
        'menuContent' :{
          templateUrl: "templates/browse.html"
        }
      }
    })
    .state('app.playlists', {
      url: "/playlists",
      views: {
        'menuContent' :{
          templateUrl: "templates/playlists.html",
          controller: 'PlaylistsCtrl'
        }
      }
    })

    .state('app.single', {
      url: "/playlists/:playlistId",
      views: {
        'menuContent' :{
          templateUrl: "templates/playlist.html",
          controller: 'PlaylistCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
//inject instances (not Providers) into run blocks


//function selects the desired behavior depending on whether the user is logged or not
function determineBehavior($kinvey, $state, $rootScope ) {
   if ($rootScope.count < 5){
       $rootScope.count++;
    var promise = $kinvey.User.me();
    promise.then(
        function(response){
            console.log('found active user');
            $state.go("app.playlists");
    }, function(error){
            console.log(error.description);
            $state.go('login');
    });
   }

}

