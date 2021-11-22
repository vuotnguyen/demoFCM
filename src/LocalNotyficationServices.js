import PushNotification from "react-native-push-notification";
import { Platform } from "react-native";
import { Importance } from "react-native-push-notification";

class LocalNotyficationServices{
    configure = (onOpenNotyfication) =>{
        PushNotification.configure({
            onRegister: function (token){
                console.log('Local Noty register ', token);
            },
            onNotification: function (notification){
                if(!notification?.data){
                    console.log(notification.data);
                    return
                }
                notification.userInteraction = true
                onOpenNotyfication(Platform.OS === 'ios' ? notification.data.item : notification.data)

                // if(Platform.OS === 'ios'){
                //     notification.finish(PushNotificationIOS.FetchResult.NoData)
                // }
            },
            popInitialNotification: true,
            requestPermissions: true,
        })

    }
    unRegister = () =>{
        PushNotification.unregister()
    }
    showNotyfication = (id,title,message,data, option) =>{
        
        PushNotification.localNotification({
            ...this.buildAndroidNotyfication(id, title,message,data,option),
            ...this.buildIOSNotyfication(id, title,message,data,option),
            channelId: "not2",
            title: title || "",
            message: message || "",
            playSound: option.playSound || false,
            soundName: option.soundName || 'default',
            userInteraction: true
        })
    }
    buildAndroidNotyfication = (id, title, message, data, option) =>{
        return {
            id: id,
            autoCancel: true,
            largeIcon: option.largeIcon || "ic_launcher",
            smallIcon: option.smallIcon || "ic_notification",
            bigText: message || "",
            // subText: "subtext",
            vibrate: option.vibrate || true,
            vibration: option.vibration || 300,
            priority: option.priority || "hight",
            importance: option.importance || "hight",
            data: data,
        }
    }

    buildIOSNotyfication = (id, title, message, data ={}, option ={}) =>{
        return {
            alertAction: option.alertAction || 'view',
            category: option.category || "",
            userInfo: {
                id: id, 
                item: data,
            }
        }
    }
    cancelAllLocalNotyfication = () =>{
        if(Platform.OS === 'ios'){
            PushNotification.removeAllDeliveredNotifications();
        }else{
            PushNotification.cancelAllLocalNotifications();
        }
    }
    removeDeliveredNotificationByID = (notificationID) =>{
        PushNotification.cancelLocalNotifications({id: notificationID})
    }
    
}
export const localNotyficationServices = new LocalNotyficationServices()