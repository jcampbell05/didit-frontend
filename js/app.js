import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Navigator } from 'react-native';

import Notification from './notification';
import TransitionNavigation from './transition-navigation';
import NetworkOperation from './network-operation';
import { applicationState } from './reducers/application-state';
import { applicationSceneForName, configurationForSceneName } from './reducers/application-scene';

import {
  loginWithDigits,
  signUpWithName,
  sendDidIt,
  uploadContacts,
  sendReply
} from './actions';

import {
  receivedDidIt,
  dismissedDidIt
} from './events';

class App extends Component {

  constructor(props) {
   super(props);

   this.login = this.login.bind(this);
   this.signUp = this.signUp.bind(this);
   this.sendDidIt = this.sendDidIt.bind(this);
   this.sceneForProps = this.sceneForProps.bind(this);
   this.unwindScene = this.unwindScene.bind(this);
   this.dismissDidIt = this.dismissDidIt.bind(this);
   this.sendHighFive = this.sendHighFive.bind(this);
   this.sendEyeRoll = this.sendEyeRoll.bind(this);
   this.didReceiveNotification = this.didReceiveNotification.bind(this);

   this.style = props.style;
  }

  //FIXME:
  // - Does this belong elsewhere ?
  // - Unit Test?
  componentWillMount() {

    if (this.props.profile) {
      this.props.dispatch(uploadContacts(this.props.profile["api-key"]));
    }

    Notification.addEventListener('notification', this.didReceiveNotification);
    Notification.addEventListener('remoteNotificationAction', (action) => {

      switch (action.identifier) {
        case 'HIGH_FIVE_IDENTIFIER':
        this.sendHighFive()
        break
        case 'EYE_ROLL_IDENTIFIER':
        this.sendEyeRoll()
        break
      }
    });

    Notification.requestPermissions();
  }

  render() {
    return (
      <NetworkOperation loading={this.props.isLoading} error={this.props.error}>
        <TransitionNavigation {...this.props} sceneForProps={this.sceneForProps} configurationForTransition={this.configurationForTransition} unwindScene={this.unwindScene}/>
      </NetworkOperation>
    )
  }

  sceneForProps(props) {
    return {
      component: applicationSceneForName(this, props.scene, props),
      type: props.scene
    }
  }

  configurationForTransition(prevScene, newScene) {
    switch (newScene.content.type) {
      case 'DID_IT':
      return Navigator.SceneConfigs.FloatFromBottom
    }

    var configuration = Navigator.SceneConfigs.PushFromRight

    if (prevScene.content.type == 'DID_IT' && newScene.content.type == 'SEND_DID_IT') {
      configuration.pop = true
    }

    configuration.gestures = {}
    return configuration
  }

  unwindScene(scene) {
    if (scene.content.type == 'DID_IT') {
      this.dismissDidIt()
    }
  }

  login(session) {
    this.props.dispatch(loginWithDigits(session));
  }

  signUp(name) {
    this.props.dispatch(signUpWithName(this.props.session, name, Notification.protocol()));
  }

  sendDidIt() {
    this.props.dispatch(sendDidIt(this.props.profile["api-key"]));
  }

  dismissDidIt() {
    this.props.dispatch(dismissedDidIt());
  }

  // FIXME: This is getting a bit long.
  sendHighFive() {
    alert("high five")
    return
    this.props.dispatch(sendReply(this.props.profile["api-key"], this.props.didit));
  }

  sendEyeRoll() {
    alert("eye roll")
    return
    this.props.dispatch(sendReply(this.props.profile["api-key"], this.props.didit));
  }

  didReceiveNotification(notification) {
    this.props.dispatch(receivedDidIt(notification));
  }
}

module.exports = connect(applicationState)(App);
