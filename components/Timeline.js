import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import { View, Text, TouchableHighlight, StyleSheet, Dimensions } from 'react-native'
import { STYLE } from '../constants.js'

export default class Timeline extends Component {

  constructor(props) {
    super(props)

    this.nodes = this.nodes.bind(this)
    this.getTimeScale = this.getTimeScale.bind(this)
  }

  time(date) {
    return moment(date).format('h:mm A')
  }


  wait(date) {
    let now = moment()
    let arrival = moment(date)
    let duration = arrival.diff(now, 'm')
    let message

    switch(duration) {
      case duration < 1:
        message = 'DUE'
        break
      case duration === 1:
        message = '1 MIN'
        break
      default:
        message = duration + ' MINS'
    }

    return {duration: duration, message: message}
  }


  //build a bus node with time, circle, and wait
  nodes(arrivals, scale) {
    return arrivals.map((arrival, i) => {
      let t = this.time(arrival.estimated)
      let w = this.wait(arrival.estimated).message
      let screenSize = Dimensions.get('window')

      let position = {

      }

      let textStyle = i === 0 ? styles.whiteText : undefined
      let borderStyle = i === 0 ? styles.whiteBorder : undefined

      return (
        <View style={[styles.node, position]} key={i}>
          <View style={styles.labelHolder}>
            <Text style={[styles.time, styles.label, styles.rightAlign, textStyle]}>{t}</Text>
          </View>
          <View style={[styles.circle, borderStyle]}></View>
          <View style={styles.labelHolder}>
            <Text style={[styles.mins, styles.label, textStyle]}>{w}</Text>
          </View>
        </View>
      )
    })
  }


  //calc how long the track needs to represent in 30 increment minutes
  getTimeScale(arrivals) {
    //the duration of the longest wait
    let longest = 0

    //get the arrival with the longest wait time
    arrivals.forEach((item) => {
      longest = Math.max(this.wait(item.estimated).duration, longest)
    })

    return Math.ceil(longest / 30) * 30
  }


  render() {
    //sort arrivals by estimated arrival time (lowest first)
    let arrivals = this.props.data.arrival.sort((a, b) => {
      return a - b
    })
    let timeScale = this.getTimeScale(arrivals)
    let nodes = this.nodes(arrivals, timeScale)

    let screenSize = Dimensions.get('window')
    console.log('screenSize '+screenSize)

    centerTrack = {
      left: screenSize.width / 2 - 1.5
    }

    return (
      <View style={styles.container}>
        <View style={[styles.track, centerTrack]}></View>

        <View style={styles.node}>
          <View style={[styles.circle, styles.nowCircle]}></View>
        </View>

        {nodes}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  track: {
    width: 3,
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: STYLE.inactive
  },
  node: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  rightAlign: {
    textAlign: 'right'
  },
  labelHolder: {
    width: 130
  },
  label: {
    fontFamily: 'Avenir',
    fontWeight: '600',
    letterSpacing: 0.6,
    fontSize: 18,
    color: STYLE.inactive
  },
  circle: {
    backgroundColor: STYLE.background,
    width: 16,
    height: 16,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: STYLE.inactive,
    marginRight: 14,
    marginLeft: 14,
    marginTop: 3.4
  },
  nowCircle: {
    backgroundColor: STYLE.inactive,
    borderColor: STYLE.inactive,
    marginTop: 0
  },
  whiteText: {
    color: STYLE.white
  },
  whiteBorder: {
    borderColor: STYLE.white
  }
})