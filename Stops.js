import React, { Component, PropTypes } from 'react'
import { View, Text, TouchableHighlight } from 'react-native'

export default class Stops extends Component {

  constructor(props) {
    super(props)
    
    this.next = this.next.bind(this)
    this.cancel = this.cancel.bind(this)
  }

  
  next() {
    //if on the last step, go to the timeline
    let step === 3

    if(step) {
      this.props.navigator.push({
        name: route
      })
    }
  }

  
  cancel() {

  }


  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.instructions}>BUSWOLF</Text>

        <TouchableHighlight onPress={this.cancel}>
          <Text>Cancel</Text>
        </TouchableHighlight>

        <TouchableHighlight onPress={this.next}>
          <Text>Next</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

Stops.propTypes = {
  navigator: React.PropTypes.element
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