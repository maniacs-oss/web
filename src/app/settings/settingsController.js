﻿angular
    .module('bit.settings')

    .controller('settingsController', function ($scope, $state, $uibModal, apiService, toastr, authService) {
        $scope.model = {
            profile: {},
            twoFactorEnabled: false,
            email: null
        };

        $scope.$on('$viewContentLoaded', function () {
            apiService.accounts.getProfile({}, function (user) {
                $scope.model = {
                    profile: {
                        name: user.Name,
                        masterPasswordHint: user.MasterPasswordHint,
                        culture: user.Culture
                    },
                    email: user.Email,
                    twoFactorEnabled: user.TwoFactorEnabled
                };

                if (user.Organizations) {
                    var orgs = [];
                    for (var i = 0; i < user.Organizations.length; i++) {
                        // Only confirmed
                        if (user.Organizations[i].Status !== 2) {
                            continue;
                        }

                        orgs.push({
                            id: user.Organizations[i].Id,
                            name: user.Organizations[i].Name,
                            status: user.Organizations[i].Status,
                            type: user.Organizations[i].Type
                        });
                    }

                    $scope.model.organizations = orgs;
                }
            });
        });

        $scope.generalSave = function () {
            $scope.generalPromise = apiService.accounts.putProfile({}, $scope.model.profile, function (profile) {
                authService.setUserProfile(profile).then(function (updatedProfile) {
                    toastr.success('Account has been updated.', 'Success!');
                });
            }).$promise;
        };

        $scope.passwordHintSave = function () {
            $scope.passwordHintPromise = apiService.accounts.putProfile({}, $scope.model.profile, function (profile) {
                authService.setUserProfile(profile).then(function (updatedProfile) {
                    toastr.success('Account has been updated.', 'Success!');
                });
            }).$promise;
        };

        $scope.changePassword = function () {
            $uibModal.open({
                animation: true,
                templateUrl: 'app/settings/views/settingsChangePassword.html',
                controller: 'settingsChangePasswordController'
            });
        };

        $scope.changeEmail = function () {
            $uibModal.open({
                animation: true,
                templateUrl: 'app/settings/views/settingsChangeEmail.html',
                controller: 'settingsChangeEmailController'
            });
        };

        $scope.createOrganization = function () {
            $uibModal.open({
                animation: true,
                templateUrl: 'app/settings/views/settingsCreateOrganization.html',
                controller: 'settingsCreateOrganizationController'
            });
        };

        $scope.viewOrganization = function (id) {
            $state.go('backend.org.dashboard', { orgId: id });
        };

        $scope.twoFactor = function () {
            var twoFactorModal = $uibModal.open({
                animation: true,
                templateUrl: 'app/settings/views/settingsTwoFactor.html',
                controller: 'settingsTwoFactorController'
            });

            twoFactorModal.result.then(function (enabled) {
                if (enabled === null) {
                    return;
                }

                $scope.model.twoFactorEnabled = enabled;
            });
        };

        $scope.sessions = function () {
            $uibModal.open({
                animation: true,
                templateUrl: 'app/settings/views/settingsSessions.html',
                controller: 'settingsSessionsController'
            });
        };

        $scope.delete = function () {
            $uibModal.open({
                animation: true,
                templateUrl: 'app/settings/views/settingsDelete.html',
                controller: 'settingsDeleteController'
            });
        };
    });
