/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import { AppRegistry, StyleSheet, Text, View, Navigator, AsyncStorage } from 'react-native'
import { ROUTES } from './constants.js'
import Splash from './components/Splash.js'
import Setup from './components/Setup.js'
import StopInfo from './components/StopInfo.js'


export default class BusWolfPDX extends Component {

  constructor(props) {
    super(props)
    this.renderScene = this.renderScene.bind(this)
  }

  renderScene(route, navigator) {
    if(route.name == ROUTES.SPLASH) {
      return <Splash navigator={navigator} />
    }
    if(route.name == ROUTES.SETUP) {
      return <Setup navigator={navigator} />
    }
    if(route.name == ROUTES.STOP_INFO) {
      return <StopInfo navigator={navigator} stops={route.stops} />
    }
  }


  render() {
    return (
      <Navigator
        style={{ flex: 1 }}
        initialRoute={{ name: ROUTES.SPLASH }}
        renderScene={ this.renderScene } />
    )
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
})

AppRegistry.registerComponent('BusWolfPDX', () => BusWolfPDX)
