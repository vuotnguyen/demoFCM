/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  Alert,
  Button, StyleSheet, TextInput, View
} from 'react-native';
import { fcmService } from './src/FCMServices';
import { localNotyficationServices } from './src/LocalNotyficationServices';


const App = () => {
  console.log('app');
  const [text, onChangeText] = React.useState("");
  React.useEffect(() => {
    fcmService.register(onRegister, onNotification, onOpenNotification)
    localNotyficationServices.configure(onOpenNotification)

    function onRegister(token) {
      console.log('token ', token);
    }
    function onNotification(notify) {
      console.log('notifi ',notify);
      const options = {
        soundName: 'default',
        playSound: true,
        largeIcon: "logo_phucthanh",
        smallIcon: "logo_phucthanh",
        vibrate: true,
        vibration:500 ,
        priority:"hight",
        importance: "hight"
      }
      localNotyficationServices.showNotyfication(
        0,
        notify.title,
        notify.body,
        notify,
        options
      )
    }
    function onOpenNotification(notify) {
      console.log('notifi ', notify);
      Alert.alert("Open Notification", notify.body)
    }
    return () => {
      fcmService.unRegister()
      localNotyficationServices.unRegister()
    }
  }, []);

  return (
    <View>
      <TextInput
        onChangeText={onChangeText}
        placeholder={'nhập thông báo'}></TextInput>
      <Button onPress={() => {
        // fcmService.pushNotificationByUser(text)
      }} title={'Push thông báo'} />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
