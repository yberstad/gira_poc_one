'use strict';

import React, {AppRegistry, StyleSheet, View, Text, Component, AsyncStorage, TouchableHighlight} from 'react-native';
import hooks from 'feathers-hooks';
import feathers from 'feathers/client';
import socketio from 'feathers-socketio/client';
import authentication from 'feathers-authentication/client';
import localstorage from 'feathers-localstorage';

// A hack so that you can still debug. Required because react native debugger runs in a web worker, which doesn't have a window.navigator attribute.
if (window.navigator && Object.keys(window.navigator).length == 0) {
    window = Object.assign(window, {navigator: {userAgent: 'ReactNative'}});
}
var io = require('socket.io-client/socket.io');


class gira_poc_one extends Component {
    constructor(props) {
        super(props);
        const options = {transports: ['websocket'], forceNew: true};
        this.socket = io('http://localhost:3030', options);

        this.state = {connected: false};
        this.app = feathers()
            .configure(socketio(this.socket))
            .configure(hooks())
            .use('storage', localstorage({storage: AsyncStorage}))
            .configure(authentication());
    }

    componentDidMount() {
        this.socket.on('connect', () => {
            console.log('connect');
        });

        // Get the message service that uses a websocket connection
        const messageService = this.app.service('messages');
        messageService.on('created', message => console.log('Someone created a message', message));
    }

    login () {
        var _this = this
        this.setState({loading: true});
        this.app.authenticate({
            'type': 'local',
            'email': 'oyvindhabberstad@gmail.com',
            'password': '1234'
        }).then(function(result){
            console.log('Authenticated!', result);
            // Find our users on the server via sockets
            _this.app.service('users').find().then(function(users){
                console.log('Users!', users);
            });
        }).catch(function(error){
            console.log('Error authenticating!', error);
        });
    }

    logout () {
        return this.app.logout().then(() => {
            this._loggedIn = false;
        });
    }

    refreshToken (token) {
        return this.app.authenticate({
            type: 'token',
            token: token
        }).then(() => { this._loggedIn = true; });
    }
;
    render() {
        return (
            <View style={styles.container}>
                <TouchableHighlight onPress={this.login.bind(this)}
                                    underlayColor='transparent'
                                    style={styles.button}>
                    <Text>Login</Text>
                </TouchableHighlight>
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
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        marginLeft: 0,
        width: 50,
        height: 50
    },
});

AppRegistry.registerComponent('gira_poc_one', () => gira_poc_one);
