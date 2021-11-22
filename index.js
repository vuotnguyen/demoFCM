/**
 * @format
 */
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json'
import PushNotification from "react-native-push-notification";
import messaging from '@react-native-firebase/messaging';


PushNotification.createChannel(
    {
        channelId: "not2", // (required)
        channelName: "Channel", // (required),
        
    },
    (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
);
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

  function HeadlessCheck({ isHeadless }) {
    if (isHeadless) {
      // App has been launched in the background by iOS, ignore
      return null;
    }
  
    return <App />;
  }

AppRegistry.registerComponent(appName, () => HeadlessCheck);
