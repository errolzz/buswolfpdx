import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import { View, Text, TouchableHighlight, StyleSheet, Dimensions } from 'react-native'
import { STYLE } from '../constants.js'

export default class Timeline extends Component {

  constructor(props) {
    super(props)

    this.nodes = this.nodes.bind(this)
  }

  time(date) {
    return moment(date).format('h:mm A')
  }


  wait(date) {
    let now = moment()
    let arrival = moment(date)
    let duration = Math.max(0, Number(arrival.diff(now, 'm')))
    let message

    if(duration < 1) {
      message = 'DUE'
    } else if(duration === 1) {
      message = '1 MIN'
    } else {
      message = duration + ' MINS'
    }

    return {duration: duration, message: message}
  }


  //build a bus node with time, circle, and wait
  nodes(arrivals, scale) {
    let nodeFlexs = []
    let nodes = arrivals.map((arrival, i) => {
      let t = this.time(arrival.estimated)
      let w = this.wait(arrival.estimated).message
      let duration = this.wait(arrival.estimated).duration

      if(i === 1) {
        duration -= this.wait(arrivals[0].estimated).duration
      }

      let position = {
        flex: Math.max(0.1, duration / scale)
      }

      nodeFlexs.push(duration / scale)

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

    let totalNodeFlex = 0
    for(let i=0; i<nodeFlexs.length; i++) {
      totalNodeFlex += nodeFlexs[i]
    }

    let spacer = (
      <View style={{flex: 1 - totalNodeFlex}} key={3}>
      </View>
    )

    nodes.push(spacer)
    return nodes
  }


  render() {
    let timeScale = 30 //minutes

    //console.log(this.props.data)
    if(!this.props.data.arrival) {
      return (
        <View style={styles.noBusContainer}>
          <Text style={styles.noBus}>SCHEDULE UNAVAILABLE</Text>
        </View>
      )
    }

    //sort arrivals by estimated arrival time (lowest first)
    let arrivals = this.props.data.arrival.sort((a, b) => {
      return a - b
    })
    //make sure the bus is actually there
    arrivals = arrivals.filter((item) => {
      let wait = this.wait(item.estimated).duration <= timeScale
      return item.vehicleID && item.departed && wait
    })

    
    let nodes = this.nodes(arrivals, timeScale)
    let screenSize = Dimensions.get('window')

    centerTrack = {
      left: screenSize.width / 2 - 1.5
    }
    centerNow = {
      left: screenSize.width / 2 - 8
    }

    return (
      <View style={styles.container}>
        <View style={[styles.track, centerTrack]}></View>

        <View style={[styles.now, centerNow]}>
          <View style={[styles.circle, styles.nowCircle]}></View>
        </View>
        <View style={{flex:1}}>
          {nodes}
        </View>
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
  now: {
    position: 'absolute',
    top: 0
  },
  node: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end'
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
    bottom: 5
  },
  nowCircle: {
    backgroundColor: STYLE.inactive,
    borderColor: STYLE.inactive,
    marginRight: 0,
    marginLeft: 0,
  },
  whiteText: {
    color: STYLE.white
  },
  whiteBorder: {
    borderColor: STYLE.white
  },
  noBusContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  noBus: {
    textAlign: 'center',
    fontFamily: 'Avenir',
    fontWeight: '800',
    letterSpacing: 0.6,
    fontSize: 20,
    color: STYLE.red
  }
})