import React, { Component, PropTypes } from 'react'
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native'
import { STYLE, ROUTES, COPY, API } from '../constants.js'
import { getStopDetails } from '../services.js'
import KeyPad from './KeyPad.js'

export default class Stops extends Component {

  constructor(props) {
    super(props)
    
    this.next = this.next.bind(this)
    this.cancel = this.cancel.bind(this)
    this.getSetupView = this.getSetupView.bind(this)
    this.getEnterStopView = this.getEnterStopView.bind(this)
    this.getConfirmStopView = this.getConfirmStopView.bind(this)
    this.verifyStopId = this.verifyStopId.bind(this)
    this.backspace = this.backspace.bind(this)
    this.keyPress = this.keyPress.bind(this)

    this.state = {
      step: 0,
      stopId: '',
      stopData: undefined,
      error: false
    }
  }

  
  //move to the next view
  //enter > confirm > enter > confirm > route to timeline screen
  next() {
    //if on the last step, go to the timeline
    let nextStep = this.state.step < 4 ? this.state.step + 1 : this.state.step
    
    if(nextStep === 1 || nextStep === 3) {
      //user entered stop id
      this.verifyStopId(nextStep)
    } else if(nextStep === 2) {
      this.setState({
        stopId: '',
        step: nextStep
      })
    } else {
      //setup complete, move to timeline screen
      this.props.navigator.push({
        name: ROUTES.TIMELINE
      })
    }
  }


  //check that the stop id is real
  //if not real error the text
  verifyStopId(nextStep) {
    let _this = this

    getStopDetails(this.state.stopId)
      .then((data) => {
        if(data.location) {
          //valid stop id
          _this.setState({
            error: false,
            step: nextStep,
            stopData: data.location
          })
        } else {
          //invalid stop id
          _this.setState({
            error: true
          })
        }
      })
  }

  
  //the entered stop was wrong
  //go back a step
  cancel() {
    this.setState({
      step: this.state.step - 1
    })
  }


  keyPress(value) {
    this.setState({
      stopId: this.state.stopId + value,
      error: false
    })
  }

  backspace() {
    let numbers = String(this.state.stopId)
    numbers = numbers.substring(0, numbers.length - 1)

    this.setState({
      stopId: numbers,
      error: false
    })
  }


  //show either enter stop view or confirm stop view
  getSetupView() {
    let view

    if(this.state.step === 0 || this.state.step === 2) {
      view = this.getEnterStopView()
    } else {
      view = this.getConfirmStopView()
    }

    return view
  }


  //build enter stop view
  getEnterStopView() {
    //unique error styling for invalid stop id
    let stopIdStyles = [styles.stopId]
    if(this.state.error) stopIdStyles.push(STYLE.redText)

    return (
      <View style={styles.enterStop}>
        <TouchableHighlight onPress={this.backspace} underlayColor={'transparent'}>
          <Text style={stopIdStyles}>{this.state.stopId}</Text>
        </TouchableHighlight>

        <KeyPad select={this.keyPress} />

        <View style={styles.center}>
          <TouchableHighlight onPress={this.next} underlayColor={'transparent'} style={[styles.roundButton, STYLE.greenBorder]}>
            <Text style={[styles.buttonValue, STYLE.greenText]}>{COPY.STOPS_NEXT}</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }


  //build confirm stop view
  getConfirmStopView() {
    let address = this.state.stopData[0].desc + ' (' + this.state.stopData[0].dir + ')'
    return (
      <View style={styles.confirmStop}>
        <Text style={STYLE.whiteText}>{address}</Text>
        <TouchableHighlight onPress={this.cancel} underlayColor={'transparent'} style={[styles.roundButton, STYLE.redBorder]}>
          <Text style={[styles.buttonValue, STYLE.redText]}>{COPY.STOPS_CONFIRM_NO}</Text>
        </TouchableHighlight>

        <TouchableHighlight onPress={this.next} underlayColor={'transparent'} style={[styles.roundButton, STYLE.greenBorder]}>
          <Text style={[styles.buttonValue, STYLE.greenText]}>{COPY.STOPS_CONFIRM_YES}</Text>
        </TouchableHighlight>
      </View>
    )
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.setup}>
          <Text style={styles.topText}>{COPY.STOPS_TOP_TEXT[this.state.step]}</Text>
          {this.getSetupView()}
        </View>
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
    backgroundColor: STYLE.background
  },
  topText: {
    textAlign: 'center',
    color: STYLE.inactive,
    marginTop: 70,
    marginBottom: 10,
    fontFamily: 'Avenir',
    fontWeight: '800',
    letterSpacing: 0.6,
    fontSize: 18
  },
  roundButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3.5
  },
  buttonValue: {
    textAlign: 'center',
    fontFamily: 'Avenir',
    fontWeight: '800',
    paddingTop: 28,
    fontSize: 20
  },
  stopId: {
    fontFamily: 'Avenir',
    fontWeight: '800',
    fontSize: 100,
    height: 130,
    textAlign: 'center',
    color: STYLE.white
  },
  center: {
    alignItems: 'center'
  }
})