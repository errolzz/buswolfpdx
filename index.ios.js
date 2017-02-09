/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import { AppRegistry, StyleSheet, Text, View } from 'react-native'
import Stops from './Stops.js'

export default class BusWolfPDX extends Component {

  constructor(props) {
    super(props)
    this.renderScene = this.renderScene.bind(this)
  }


  renderScene(route, navigator) {
    if(route.name == 'Stops') {
      return <Stops navigator={navigator} />
    }
    if(route.name == 'Timeline') {
      return <Timeline navigator={navigator} />
    }
  }


  render() {
    return (
      <Navigator
        style={{ flex:1 }}
        initialRoute={{ name: 'Stops' }}
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
