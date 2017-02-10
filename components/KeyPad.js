import React, { Component, PropTypes } from 'react'
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native'
import { STYLE } from '../constants.js'

export default class KeyPad extends Component {

  constructor(props) {
    super(props);
    
    this.keys = this.keys.bind(this)
    this.createKey = this.createKey.bind(this)
  }
  
  keys(start, end) {
    let k = []
    for(let i=start; i<end; i++) {
      k.push(this.createKey(i))
    }
    return k
  }

  createKey(value) {
    return (
      <TouchableHighlight key={value} onPress={(e) => {this.props.select(value)}} underlayColor={'transparent'} style={styles.button}>
        <Text style={[styles.buttonValue, STYLE.greenText]}>{value}</Text>
      </TouchableHighlight>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.spacer}></View>
        <View style={styles.holder}>
          <View style={styles.keyRow}>{this.keys(0, 5)}</View>
          <View style={styles.keyRow}>{this.keys(5, 10)}</View>
        </View>
        <View style={styles.spacer}></View>
      </View>
    )
  }
}

React.propTypes = {
  select: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 120
  },
  holder: {
    flex: 0.92,
    flexDirection: 'column'
  },
  spacer: {
    flex: 0.04
  },
  keyRow: {
    height: 60,
    flexDirection: 'row'
  },
  button: {
    flex: 0.2,
    height: 60,
    justifyContent: 'center'
  },
  buttonValue: {
    fontSize: 26,
    textAlign: 'center',
    fontFamily: 'Avenir',
    fontWeight: '800'
  }
})

