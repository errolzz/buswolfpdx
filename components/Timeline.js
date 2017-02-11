import React, { Component, PropTypes } from 'react'
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native'
import { STYLE, ROUTES, COPY, API } from '../constants.js'
import { getStopDetails, getDistance, getCurrentLocation } from '../services.js'

export default class Timeline extends Component {

  constructor(props) {
    super(props)

    this.getClosestStop = this.getClosestStop.bind(this)
    this.refresh = this.refresh.bind(this)
    this.back = this.back.bind(this)

    this.state = {
      stopId: undefined,
      closestStop: undefined,
      stopData: undefined
    }
  }

  componentDidMount() {
    let _this = this

    this.getClosestStop((stopData) => {
      this.setState({
        closestStop: stopData.id
      })

      //start refresh interval
      this.interval = setInterval(this.refresh, 15000)
      //initial data
      setTimeout(this.refresh, 200)
    })
  }

  //gets the closest stop based on current lat lng location
  getClosestStop(done) {
    let _this = this
    getCurrentLocation((loc) => {
      let distanceToFirst = getDistance(_this.props.stops[0].lat, _this.props.stops[0].lng, loc.lat, loc.lng)
      let distanceToSecond = getDistance(_this.props.stops[1].lat, _this.props.stops[1].lng, loc.lat, loc.lng)

      done(distanceToFirst < distanceToSecond ? _this.props.stops[0] : _this.props.stops[1])
    })
  }

  refresh() {
    let _this = this

    getStopDetails(this.state.closestStop)
      .then((data) => {
        if(data) {
          //valid stop id
          _this.setState({
            stopData: data
          })
        } else {
          //invalid stop id
          _this.setState({
            error: true
          })
        }
      })
  }


  back() {
    this.props.navigator.push({
      name: ROUTES.STOPS
    })
  }


  render() {
    let header
    if(this.state.stopData) {
      let address = this.state.stopData.location[0].desc.toUpperCase()
      let dir = '- ' + this.state.stopData.location[0].dir.toUpperCase() + ' -'

      header = (
        <View style={styles.header}>
          <Text style={styles.topText}>{address}</Text>
          <Text style={styles.topTextTwo}>{dir}</Text>
        </View>
      )
    }

    return (
      <View style={styles.container}>
        {header}

        <View style={styles.map}>
          <View style={styles.track}></View>

          <View style={styles.node, styles.nodeNow}>
            <View style={[styles.circle, style.filled]}></View>
          </View>

          <View style={[styles.node, styles.nodeNext]}>
            <Text style={[styles.time, styles.white]}></Text>
            <View style={styles.circle}></View>
            <Text style={[styles.mins, styles.white]}></Text>
          </View>

          <View style={[styles.node, styles.nodeLast]}>
            <Text style={[styles.time, styles.white]}></Text>
            <View style={styles.circle}></View>
            <Text style={[styles.mins, styles.white]}></Text>
          </View>
        </View>

        <View style={styles.weather}>

        </View>
        
        <View style={styles.backHolder}>
          <TouchableHighlight onPress={this.back} underlayColor={'transparent'}>
            <Text style={styles.back}>BACK</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

Timeline.propTypes = {
  navigator: React.PropTypes.object,
  stops: React.PropTypes.array
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: STYLE.background
  },
  header: {
    flex: 0.22,
    marginLeft: 30,
    marginRight: 30
  },
  node: {

  },
  circle: {

  },

  map: {
    flex: 0.54
  },
  weather: {
    flex: 0.12
  },
  backHolder: {
    flex: 0.12
  },
  topText: {
    textAlign: 'center',
    color: STYLE.inactive,
    paddingTop: 66,
    fontFamily: 'Avenir',
    fontWeight: '800',
    letterSpacing: 0.6,
    fontSize: 18
  },
  topTextTwo: {
    textAlign: 'center',
    color: STYLE.inactive,
    fontFamily: 'Avenir',
    fontSize: 15,
    textAlign: 'center',
    marginLeft: 30,
    letterSpacing: 0.6,
    marginRight: 30,
    fontWeight: '600'
  },
  back: {
    color: 'white',
    textAlign: 'center'
  }
})