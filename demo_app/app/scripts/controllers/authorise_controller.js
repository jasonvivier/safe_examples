/**
 * Authorisation controller
 */
window.maidsafeDemo.controller('AuthoriseCtrl', [ '$scope', '$rootScope', '$state', 'safeApiFactory', function($scope, $rootScope, $state, safe) {
  'use strict';
  $scope.authorisationTasks = {
    state: {
      'AUTHORISING': 'authorising',
      'INITIALISING': 'initialising'
    },
    messages: {
      'AUTHORISING': 'Waiting for response...',
      'INITIALISING': 'Initialising...'
    },
    currentState: null
  };

  // initialization
  $scope.init = function() {
    var createPvtDirCb = function(err, res) {
      if (err) {
        console.error(err);
        return $rootScope.prompt.show('Initialisation Error', 'Failed to create private directory', function() {
          window.uiUtils.closeApp();
        }, {
          title: 'Reason',
          ctx: err.data.description
        });
      }
      $state.go('home');
      console.log(res);
    };

    var createPubDirCb = function(err, res) {
      if (err) {
        console.error(err);
        return $rootScope.prompt.show('Initialisation Error', 'Failed to create public directory', function() {
          window.uiUtils.closeApp();
        }, {
          title: 'Reason',
          ctx: err.data.description
        });
      }
      safe.createDir('/private', true, '', false, createPvtDirCb);
    };

    var getDirCb = function(err, res) {
      if (err) {
        console.error(err);
        return $rootScope.prompt.show('Initialisation Error', 'Failed to get home directory', function() {
          window.uiUtils.closeApp();
        }, {
          title: 'Reason',
          ctx: err.data.description
        });
      }
      console.log('Get Dir');
      console.log(res);
      if (res.subDirectories.length === 0) {
        safe.createDir('/public', false, '', false, createPubDirCb);
      } else {
        $state.go('home');
      }
    };

    var getDnsCb = function(err, res) {
      if (err) {
        console.error(err)
        return $rootScope.prompt.show('Initialisation Error', 'Failed to get DNS', function() {
          window.uiUtils.closeApp();
        }, {
          title: 'Reason',
          ctx: err.data.description
        });
      }
      console.log(res);
      if (res.length !== 0) {
        safe.setUserLongName(res[0]);
      }
      safe.getDir(getDirCb, '/');
    };

    var authoriseCb = function(err, res) {
      if (err) {
        console.error(err);
        return;
      }
      $scope.authorisationTasks.currentState = $scope.authorisationTasks.state.INITIALISING;
      console.log('Application authorised');
      console.log(res);
      safe.getDns(getDnsCb);
    };
    $scope.authorisationTasks.currentState = $scope.authorisationTasks.state.AUTHORISING;
    safe.authorise(authoriseCb);
  };
} ]);
