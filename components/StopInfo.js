import React, { Component, PropTypes } from 'react'
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native'
import { STYLE, ROUTES, COPY, API } from '../constants.js'
import { getStopDetails, getDistance, getCurrentLocation } from '../services.js'
import Timeline from './Timeline.js'

export default class StopInfo extends Component {

  constructor(props) {
    super(props)

    this.getClosestStop = this.getClosestStop.bind(this)
    this.refresh = this.refresh.bind(this)
    this.back = this.back.bind(this)

    this.state = {
      stopId: undefined,
      stopData: undefined
    }
  }

  componentDidMount() {
    let _this = this

    //start refresh interval
    this.interval = setInterval(this.refresh, 15000)
    
    //initial data
    this.refresh()

    //get weather
    this.weather()
  }


  //get the latest arrival times to the closest stop
  refresh() {
    let _this = this

    this.getClosestStop((stopData) => {
      getStopDetails(stopData.id)
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
    })
  }


  //gets the closest stop based on current lat lng location
  getClosestStop(done) {
    getCurrentLocation((loc) => {
      let distanceToFirst = getDistance(this.props.stops[0].lat, this.props.stops[0].lng, loc.lat, loc.lng)
      let distanceToSecond = getDistance(this.props.stops[1].lat, this.props.stops[1].lng, loc.lat, loc.lng)

      done(distanceToFirst < distanceToSecond ? this.props.stops[0] : this.props.stops[1])
    })
  }


  //go back to the setup flow
  back() {
    //stop the refresh
    clearInterval(this.interval)

    //switch to stops screen
    this.props.navigator.push({
      name: ROUTES.STOPS
    })
  }


  //gets the weather
  weather() {

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

    let timeline = this.state.stopData ? <Timeline data={this.state.stopData} /> : undefined

    return (
      <View style={styles.container}>
        {header}

        <View style={styles.timeline}>
          {timeline}
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

StopInfo.propTypes = {
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
  timeline: {
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