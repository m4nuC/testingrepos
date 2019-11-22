(function IIFE() {
  'use strict';

  /////////////////////////////

  function NotificationService(
    $rootScope,
    InitialSettings,
    LumsitesBaseService,
    NotificationFactory,
    NotificationSettings,
    User,
    Utils
  ) {
    'ngInject';

    var service = LumsitesBaseService.createLumsitesBaseService(
      NotificationFactory,
      {
        autoInit: false,
        objectIdentifier: 'uid'
      }
    );

    /////////////////////////////
    //                         //
    //    Private attributes   //
    //                         //
    /////////////////////////////

    /**
     * The fields and properties to be listed in the response of the notification.list endpoint.
     *
     * @type {Object}
     */
    var _PROJECTION = {
      list: {
        items: {
          actions: {
            senderDetails: {
              apiProfile: {
                profilePicture: true,
                thumbnail: true,
                thumbnailPhotoUrl: true
              },
              firstName: true,
              lastName: true,
              uid: true
            }
          },
          digest: true,
          notification: {
            actionCount: true,
            contentDetails: {
              endDate: true,
              postStatusDetails: {
                title: true
              },
              slug: true,
              title: true,
              type: true
            },
            description: true,
            externalKey: true,
            group: true,
            groupName: true,
            instanceDetails: {
              slug: true
            },
            instanceId: true,
            link: true,
            parentContentDetails: {
              slug: true,
              title: true
            },
            parentId: true,
            priority: true,
            thumbnail: true,
            title: true,
            type: true,
            uid: true,
            unreadNotificationCount: true,
            updatedAt: true,
            url: true
          }
        }
      }
    };

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The list key identifier for the unread notifications.
     *
     * @type {string}
     */
    service.KEY_UNREAD = 'unread';

    /**
     * The different kind of entities that can be related to notifications.
     *
     * @type {Object}
     */
    service.EXTERNAL_KEY_KIND = {
      content: 'Content'
    };

    /**
     * The maximum number of notifications to fetch at each call.
     *
     * @type {number}
     * @constant
     * @readonly
     */
    service.MAX_NOTIFICATION_NUMBER = 30;

    /**
     * The default parameters to apply to the notification list.
     *
     * @type {Object}
     */
    service.DEFAULT_LIST_PARAMS = {
      isRead: false,
      maxResults: service.MAX_NOTIFICATION_NUMBER,
      sortOrder: '-priority'
    };

    /**
     * Contains various indicators about the state of the service.
     *
     * @type {Object}
     */
    service.is = {
      initialized: false,
      initializing: false
    };

    /**
     * The number current unread notification count.
     *
     * @type {number}
     */
    service.unreadNotificationCount = 0;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * List notifications with the given parameters.
     *
     * @param  {Object}        params                        An object of parameters to pass to the list endpoint.
     * @param  {Function}      [cb]                          A callback function to execute on success.
     * @param  {Function}      [errCb]                       A callback function to execute on error.
     * @param  {string}        [listKey]                     A list identifier.
     * @param  {Object|string} [projection=_PROJECTION.list] The fields to use in the projection on the list call.
     * @return {Promise}       The promise of the call to the server if any is done.
     *
     * @override
     */
    function filterize(params, cb, errCb, listKey, projection) {
      projection = projection || _PROJECTION.list;

      return LumsitesBaseService.proto.prototype.filterize.call(
        service,
        params,
        cb,
        errCb,
        listKey,
        projection
      );
    }

    /**
     * Get the icon for a given notification.
     *
     * @param  {Object} notificationType The notification type to get an icon for.
     * @return {string} The name of the icon for a given notification.
     */
    function getIcon(notificationType) {
      return _.get(NotificationSettings[notificationType], 'icon', '');
    }

    /**
     * Get a map of all the types of notifications.
     *
     * @return {Object} A map of notification types.
     */
    function getNotificationTypes() {
      return InitialSettings.NOTIFICATION_TYPES || {};
    }

    /**
     * Check if the list of unread notifications contains notifications related to a given entity.
     *
     * @param  {string}  id The id of the content to check.
     * @return {boolean} Whether the entity has unread notifications that are related to it.
     */
    function hasUnreadNotifications(id) {
      var unreadNotifications = _.map(
        service.displayList(service.KEY_UNREAD),
        'notification'
      );

      if (angular.isUndefinedOrEmpty([unreadNotifications, id], 'some')) {
        return false;
      }

      return _.includes(_.map(unreadNotifications, 'externalKey'), id);
    }

    /**
     * Set all notifications as read or all notifications for a given entity.
     *
     * @param {string} [uid] The identifier of an entity we want all notifications to be marked as read.
     */
    function setAllAsRead(uid) {
      if (!User.isConnected()) {
        return;
      }

      var unreadNotificationGroups = service.displayList(service.KEY_UNREAD);
      var params = {};
      var isSetAllAsReadForEntity = angular.isDefinedAndFilled(uid);

      if (uid === -1 || service.unreadNotificationCount === 0) {
        return;
      }

      var unreadNotificationGroupsBackup = angular.fastCopy(
        unreadNotificationGroups
      );

      if (isSetAllAsReadForEntity) {
        angular.extend(params, {
          externalKey: uid,
          externalKeyKind: service.EXTERNAL_KEY_KIND.content
        });

        // Remove all the notificationGroups that are related to the entity right away so it feels 'instant'.
        var filteredList = unreadNotificationGroups.filter(
          function filterNotificationGroup(notificationGroup) {
            return notificationGroup.notification.externalKey !== uid;
          }
        );

        service._services[service.KEY_UNREAD]._list = filteredList;
      } else {
        service._services[service.KEY_UNREAD]._list = [];
        service.unreadNotificationCount = 0;
      }

      NotificationFactory.setAllAsRead(
        params,
        function onSetAllAsReadSuccess(response) {
          if (
            angular.isDefinedAndFilled(response.notificationIds) &&
            isSetAllAsReadForEntity
          ) {
            service.init();
          }
        },
        function onSetAllAsReadError() {
          // If error, rollback to the previous list.
          service._services[
            service.KEY_UNREAD
          ]._list = unreadNotificationGroupsBackup;
        }
      );
    }

    /**
     * Call the API to set a specific notification as read and update the local list.
     *
     * @param {Object}  notificationGroup        The notification to be marked as read.
     * @param {string}  [listKey='unread']       The identifier of the list the notification needs to be removed
     *                                           from.
     * @param {boolean} [isFirstOfPriorityGroup] Indicates if the notification being marked as read.
     */
    function setAsRead(notificationGroup, listKey, isFirstOfPriorityGroup) {
      listKey = listKey || service.KEY_UNREAD;

      var unreadNotificationGroups = service.displayList(listKey);

      if (
        angular.isUndefinedOrEmpty(
          [unreadNotificationGroups, _.get(notificationGroup, 'digest')],
          'some'
        )
      ) {
        return;
      }

      var notification = notificationGroup.notification;

      var notificationGroupIndex = _.findIndex(
        unreadNotificationGroups,
        function findNotificationGroupIndex(item) {
          return item.notification.uid === notification.uid;
        }
      );

      if (notificationGroupIndex < 0) {
        return;
      }

      var notificationsCount = 1;

      if (notification.type === service.getNotificationTypes().CUSTOM) {
        // Child notification will decrement the parent notification count.
        if (angular.isDefinedAndFilled(notification.parentId)) {
          $rootScope.$broadcast(
            'notifications__child-set-as-read',
            notification.parentId,
            -1
          );

          // Parent notification will decrement the global count by all its unread notification count.
        } else {
          notificationsCount = notification.unreadNotificationCount;
        }
      }

      // Remove the notification straight away, even before the call is done.
      unreadNotificationGroups.splice(notificationGroupIndex, 1);

      service.unreadNotificationCount -= notificationsCount;

      if (isFirstOfPriorityGroup) {
        $rootScope.$broadcast(
          'notifications__first-set-as-read',
          _.get(
            unreadNotificationGroups[notificationGroupIndex],
            'notification.uid'
          )
        );
      }

      NotificationFactory.setAsRead(
        {
          uid: notification.uid
        },
        angular.noop,
        function onSetAsReadError() {
          // If error, rollback and re-add the notification where it was.
          unreadNotificationGroups.splice(
            notificationGroupIndex,
            0,
            notificationGroup
          );
          service.unreadNotificationCount += notificationsCount;
        }
      );
    }

    /////////////////////////////

    service.filterize = filterize;
    service.getIcon = getIcon;
    service.getNotificationTypes = getNotificationTypes;
    service.hasUnreadNotifications = hasUnreadNotifications;
    service.setAllAsRead = setAllAsRead;
    service.setAsRead = setAsRead;

    /////////////////////////////

    /**
     * Initialize the controller.
     */
    service.init = function init() {
      if (!User.isConnected()) {
        return;
      }

      service.is.initializing = true;

      service.initializationPromise = service.promiseFilterize(
        service.DEFAULT_LIST_PARAMS,
        service.KEY_UNREAD
      );

      service.initializationPromise
        .then(function onNotificationListSuccess() {
          $rootScope.$broadcast('notifications-loaded');
          var notificationList = _.get(
            service._services,
            service.KEY_UNREAD + '._list',
            []
          );
          service.unreadNotificationCount = notificationList.length;
        })
        .catch(Utils.displayServerError)
        .finally(function onInitPromiseFinally() {
          service.is.initialized = true;
          service.is.initializing = false;
        });
    };

    return service;
  }

  /////////////////////////////

  angular.module('Services').service('Notification', NotificationService);
})();
