import React, { Component, PropTypes } from 'react'
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native'

export default class Stops extends Component {

  constructor(props) {
    super(props)
    
    this.next = this.next.bind(this)
    this.cancel = this.cancel.bind(this)
  }

  
  next() {
    //if on the last step, go to the timeline
    let step = 3

    console.log('NEXT!')

    /*if(step) {
      this.props.navigator.push({
        name: route
      })
    }*/
  }

  
  cancel() {
    console.log('CANCEL!')
  }


  render() {
    return (
      <View style={styles.container}>
        
        <Text style={styles.instructions}>BUSWOLF</Text>

        <TouchableHighlight onPress={this.cancel} underlayColor={'transparent'} style={[styles.roundy, styles.redBorder]}>
          <Text style={styles.redText}>NO</Text>
        </TouchableHighlight>

        <TouchableHighlight onPress={this.next} underlayColor={'transparent'} style={[styles.roundy, styles.greenBorder]}>
          <Text style={styles.greenText}>YES</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

Stops.propTypes = {
  navigator: React.PropTypes.object
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  roundy: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2
  },
  redBorder: {
    borderColor: 'red'
  },
  greenBorder: {
    borderColor: 'green'
  },
  redText: {
    textAlign: 'center',
    color: 'red'
  },
  greenText: {
    textAlign: 'center',
    color: 'green'
  },
  instructions: {
    textAlign: 'center',
    color: 'red',
    marginBottom: 5,
  },
})