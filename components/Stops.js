import React, { Component, PropTypes } from 'react'
import { View, Text, TouchableHighlight, StyleSheet, AsyncStorage } from 'react-native'
import { STYLE, ROUTES, COPY, API } from '../constants.js'
import { getStopDetails, saveStops } from '../services.js'
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
      error: false,
      firstStop: undefined
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
      //save first confirmed stop
      let confirmed = {
        id: this.state.stopData.id,
        lat: this.state.stopData.lat,
        lgn: this.state.stopData.lng
      }

      //save first stop, clear stop display, go next
      this.setState({
        stopId: '',
        step: nextStep,
        firstStop: confirmed
      })
    } else {
      //last step before showing timeline

      //build second stop data
      let confirmed = {
        id: this.state.stopData.id,
        lat: this.state.stopData.lat,
        lgn: this.state.stopData.lng
      }

      //the new stops to save
      stopsToSave = [this.state.firstStop, confirmed]

      //save the confirmed stops to storage
      saveStops(stopsToSave)
      
      //setup complete, move to timeline screen
      setTimeout(() => {
        this.props.navigator.push({
          name: ROUTES.TIMELINE,
          stops: stopsToSave
        })
      }, 300)
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
            stopData: data.location[0]
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
    let newId = this.state.stopId.length < 6 ? this.state.stopId + value : this.state.stopId

    this.setState({
      stopId: newId,
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

    //show next button
    let next
    if(this.state.stopId.length > 0 && Number(this.state.stopId) !== 0) {
      next = (
        <View style={styles.nextHolder}>
          <TouchableHighlight onPress={this.next} underlayColor={'transparent'} style={[styles.roundButton, STYLE.greenBorder]}>
            <Text style={[styles.buttonValue, STYLE.greenText]}>{COPY.STOPS_NEXT}</Text>
          </TouchableHighlight>
        </View>
      )
    }

    return (
      <View style={styles.body}>
        <TouchableHighlight onPress={this.backspace} underlayColor={'transparent'}>
          <Text style={stopIdStyles}>{this.state.stopId}</Text>
        </TouchableHighlight>

        <View style={styles.keyHolder}>
          <KeyPad select={this.keyPress} />
        </View>

        {next}
      </View>
    )
  }


  //build confirm stop view
  getConfirmStopView() {
    let address = this.state.stopData.desc.toUpperCase()
    let dir = '- ' + this.state.stopData.dir.toUpperCase() + ' -'

    return (
      <View style={styles.body}>
        <View style={styles.confirmAddress}>
          <Text style={styles.addressText}>{address}</Text>
          <Text style={styles.directionText}>{dir}</Text>
        </View>
        <View style={styles.confirmActions}>
          <TouchableHighlight onPress={this.cancel} underlayColor={'transparent'} style={[styles.roundButton, STYLE.redBorder]}>
            <Text style={[styles.buttonValue, STYLE.redText]}>{COPY.STOPS_CONFIRM_NO}</Text>
          </TouchableHighlight>

          <TouchableHighlight onPress={this.next} underlayColor={'transparent'} style={[styles.roundButton, STYLE.greenBorder]}>
            <Text style={[styles.buttonValue, STYLE.greenText]}>{COPY.STOPS_CONFIRM_YES}</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.topText}>{COPY.STOPS_TOP_TEXT[this.state.step]}</Text>
        </View>
        {this.getSetupView()}
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
  header: {
    flex: 0.16
  },
  body: {
    flex: 0.84
  },
  topText: {
    textAlign: 'center',
    color: STYLE.inactive,
    paddingTop: 72,
    fontFamily: 'Avenir',
    fontWeight: '800',
    letterSpacing: 0.6,
    fontSize: 18
  },
  roundButton: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3.5
  },
  buttonValue: {
    textAlign: 'center',
    fontFamily: 'Avenir',
    fontWeight: '800',
    paddingTop: 31,
    fontSize: 21
  },
  stopId: {
    fontFamily: 'Avenir',
    fontWeight: '800',
    fontSize: 100,
    height: 130,
    textAlign: 'center',
    color: STYLE.white
  },
  keyHolder: {
    flex: 0.28
  },
  nextHolder: {
    alignItems: 'center',
    flex: 0.32
  },
  confirmAddress: {
    flex: 0.43
  },
  addressText: {
    color: STYLE.white,
    fontSize: 21,
    textAlign: 'center',
    paddingTop: 26,
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 6,
    fontWeight: '800'
  },
  directionText: {
    color: STYLE.white,
    fontSize: 17,
    textAlign: 'center',
    marginLeft: 30,
    marginRight: 30,
    fontWeight: '600'
  },
  confirmActions: {
    flex: 0.3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 30,
    marginLeft: 30
  }
})