
import { Platform } from 'react-native'
import messaging from '@react-native-firebase/messaging'

class FCMService {

  // we use this method to register notification service in our app.
  // we call this method in componetDidMount() so, we app load we get permission to 
  // display notification.
  register = (onRegister, onNotification, onOpenNotification) => {
    this.checkPermission(onRegister)
    // when register function call that time we create notification listener 
    this.createNoitificationListeners(onRegister, onNotification, onOpenNotification)
  }

  registerAppWithFCM = async () => {
    if (Platform.OS === 'ios') {
      await messaging().registerDeviceForRemoteMessages();
      await messaging().setAutoInitEnabled(true);
    }
  }

  checkPermission = (onRegister) => {
    messaging().hasPermission()
      .then(enabled => {
        if (enabled) {
          //user has permission
          this.getToken(onRegister)
        } else {
          //user don't have permission
          this.requestPermission(onRegister)
          
        }
      }).catch(error => {
        console.log("Permission rejected", error)
      })
  }

  getToken = (onRegister) => {
    messaging().getToken()
      .then(fcmToken => {
        if (fcmToken) {
          onRegister(fcmToken)
        } else {
          console.log("User does not have a device token")
        }
      }).catch(error => {
        console.log("getToken rejected ", error)
      })
  }

  requestPermission = (onRegister) => {
    messaging().requestPermission()
      .then(() => {
        this.getToken(onRegister)
      }).catch(error => {
        console.log("Requested persmission rejected ", error)
      })
  }

  deletedToken = () => {
    messaging().deleteToken()
      .catch(error => {
        console.log("Delected token error ", error)
      })
  }

  createNoitificationListeners = (onRegister, onNotification, onOpenNotification) => {

    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage) {
        const notification = remoteMessage.notification
        onOpenNotification(notification)
      }
    })

    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        const notification = remoteMessage.notification
        onOpenNotification(notification)
      }
    })

    // This listener triggered when app is closed and we click,tapped and opened notification 
    this.messageListener = messaging().onMessage(async remoteMessage => {
      if (remoteMessage) {
        let notification = null
        if (Platform.OS === 'ios') {
          notification = remoteMessage.data.notification
        }
        else {
          notification = remoteMessage.notification
        }
        onNotification(notification)
      }
    })

    messaging().onTokenRefresh(fcmToken => {
      onRegister(fcmToken)
    })
  }

  unRegister = () => {
    this.messageListener
  }
  pushNotificationByUser = async (body) => {
    const message = {
      notification: {
        title: "Test FCM push notification",
        body: body
      }
    }
    await messaging().sendMessage(message).
      then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });
  }
}
export const fcmService = new FCMService()