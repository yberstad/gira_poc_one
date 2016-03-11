/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import React, {AppRegistry, StyleSheet, View, Text} from 'react-native';
//import hooks from 'feathers-hooks';
//import {client as feathers} from 'feathers';
//import {client as socketio} from 'feathers-socketio';
//import {socket.io as io} from 'socket.io-client';

import hooks from 'feathers-hooks';
import feathers from 'feathers/client'
import socketio from 'feathers-socketio/client'

// A hack so that you can still debug. Required because react native debugger runs in a web worker, which doesn't have a window.navigator attribute.
if (window.navigator && Object.keys(window.navigator).length == 0) {
  window = Object.assign(window, { navigator: { userAgent: 'ReactNative' }});
}
var io = require('socket.io-client/socket.io');


class gira_poc_one extends React.Component {
    constructor(props) {
        super(props);
        const options = {transports: ['websocket'], forceNew: true};
        const socket = io('http://localhost:3030', options);

        this.state = {connected: false};
        this.app = feathers()
            .configure(socketio(socket))
            .configure(hooks());
    }

    componentDidMount(){
        // Get the message service that uses a websocket connection
        const messageService = this.app.service('messages');
        messageService.on('created', message => console.log('Someone created a message', message));
    }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('gira_poc_one', () => gira_poc_one);
