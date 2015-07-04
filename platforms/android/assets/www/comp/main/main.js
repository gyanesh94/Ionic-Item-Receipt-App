ionic_app.controller('main_controller', function ($scope, $rootScope, $state, $cordovaFile, $cordovaToast, switch_preffered_language, app_settings, login_sid) {

    $scope.log_out = function () {
        document.cookie = "sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
        $rootScope.$broadcast('log_out_event', {
            message: 'logout'
        });
        $cordovaFile.removeFile(cordova.file.dataDirectory, "sid.txt")
            .then(function (success) {
                login_sid.sid = '';
                $state.transitionTo('main.login');
            }, function (error) {});
    };

    // update app settings file
    $scope.update_app_settings_file = function (data) {
        document.addEventListener('deviceready', function () {
            $cordovaFile.writeFile(cordova.file.dataDirectory, "app_settings.txt", JSON.stringify(data), true)
                .then(function (success) {
                    $cordovaToast.show("Settings Updated", 'short', 'bottom');
                }, function (error) {
                    $cordovaToast.show("Settings Not Updated", 'short', 'bottom');
                });
        });
    };

    $scope.app_settings_copy = angular.copy(app_settings);

    // function update server base url
    $scope.update_server_base_url = function () {
        app_settings.server_base_url = $scope.app_settings_copy.server_base_url;
        $scope.update_app_settings_file(app_settings);
    };

    $scope.switch_to_english = function () {
        switch_preffered_language.translate_language('en');
    };

    $scope.switch_to_hindi = function () {
        switch_preffered_language.translate_language('hi');
    };
});