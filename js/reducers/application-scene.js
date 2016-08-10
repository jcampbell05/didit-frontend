import React from 'react';
import { Navigator } from 'react-native';
import Login from '../components/login';
import Signup from '../components/signup';
import SendDidIt from '../components/sendDidIt';
import DidIt from '../components/didIt';

function applicationSceneNameForState(state) {
  if (state.didit) {
    return 'DID_IT'
  } else if (state.profile) {
    return 'SEND_DID_IT'
  } else if (state.signup) {
    return 'SIGN_UP'
  } else {
    return 'LOG_IN'
  }
}

function applicationSceneForName(parent, sceneName, props) {
  switch (sceneName) {
    case 'DID_IT':
    return ( <DidIt didit={props.didit} onDismiss={parent.dismissDidIt} onSendHighFive={parent.sendHighFive} onSendEyeRoll={parent.sendEyeRoll} style={parent.style}/> )

    case 'SEND_DID_IT':
    return ( <SendDidIt onSendDidIt={parent.sendDidIt} style={parent.style}/> )

    case 'SIGN_UP':
    return ( <Signup onSignUp={parent.signUp} style={parent.style}/> )

    default:
    return ( <Login onLogin={parent.login} style={parent.style}/> )
  }
}

function configurationForSceneName(sceneName) {
  switch (sceneName) {
    case 'DID_IT':
    return Navigator.SceneConfigs.FloatFromBottom
  }

  return null
}

module.exports = {
  applicationSceneNameForState,
  applicationSceneForName,
  configurationForSceneName
}
