import React, { Component, PropTypes } from 'react'
import { View, Text, TouchableHighlight, StyleSheet, StatusBar } from 'react-native'
import { STYLE, ROUTES, COPY, API } from '../constants.js'
import { getStopDetails, getDistance, getCurrentLocation, getCurrentWeather } from '../services.js'
import Timeline from './Timeline.js'

export default class StopInfo extends Component {

  constructor(props) {
    super(props)

    this.getClosestStop = this.getClosestStop.bind(this)
    this.refresh = this.refresh.bind(this)
    this.weather = this.weather.bind(this)
    this.back = this.back.bind(this)

    this.state = {
      stopId: undefined,
      stopData: undefined,
      weatherCondition: undefined,
      weatherTemperature: undefined,
      weatherSet: false
    }
  }

  componentDidMount() {
    let _this = this

    //start refresh interval
    this.arrivalInterval = setInterval(this.refresh, 15000)
    
    //initial data
    this.refresh()

    //start weather interval
    this.weatherInterval = setInterval((this.weather), 60000)
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

          //if needed, get initial weather
          if(!this.state.weatherSet) {
            console.log('INITIAL WEATHER')
            this.setState({
              weatherSet: true
            })
            setTimeout(this.weather, 500)
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
    clearInterval(this.arrivalInterval)
    clearInterval(this.weatherInterval)

    //switch to stops screen
    this.props.navigator.push({
      name: ROUTES.SETUP
    })
  }


  //gets the weather
  weather() {
    getCurrentWeather(this.state.stopData.location[0].lat, this.state.stopData.location[0].lng)
      .then((data) => {
        this.setState({
          weatherCondition: data.weather[0].main.toUpperCase(),
          weatherTemperature: Math.round(Number(data.main.temp))
        })
      })
  }


  //gets a color based on temperature
  getTempColor(temp) {
    if(temp < 30) {
      return '#a4a4ff' //ice blue
    } else if(temp < 44) {
      return '#63aee0' //light blue
    } else if(temp < 60) {
      return '#aeaeae' //gray
    } else if(temp < 84) {
      return '#f58343' //orange
    } else {
      return STYLE.red //red
    }
  }


  render() {
    let header
    //if there is a header
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

    let weather
    if(this.state.weatherTemperature) {
      //get the temp color
      let tempColor = this.getTempColor(this.state.weatherTemperature)

      weather = (
        <View style={styles.weather}>
          <View style={{marginRight: 5}}>
            <Text style={styles.condition}>{this.state.weatherCondition}</Text>
          </View>
          <View style={{marginLeft: 5}}>
            <Text style={[styles.temperature, {color: tempColor}]}>{this.state.weatherTemperature + 'F'}</Text>
          </View>
        </View>
      )
    }

    //if there is a timeline
    let timeline = this.state.stopData ? <Timeline data={this.state.stopData} /> : undefined

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        {header}

        <View style={styles.timeline}>
          {timeline}
        </View>

        <View style={styles.weatherHolder}>
          {weather}
        </View>
        
        <View style={styles.backHolder}>
          <TouchableHighlight onPress={this.back} underlayColor={'transparent'} style={styles.touchBack}>
            <Text style={styles.innerBack}>X</Text>
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
    flex: 0.5
  },
  weatherHolder: {
    flex: 0.16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  backHolder: {
    flex: 0.12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  weather: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  condition: {
    fontFamily: 'Avenir',
    fontWeight: '800',
    letterSpacing: 0.6,
    fontSize: 18,
    color: STYLE.white
  },
  temperature: {
    fontFamily: 'Avenir',
    fontWeight: '800',
    letterSpacing: 0.6,
    fontSize: 18
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
  touchBack: {
    width: 60, 
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  innerBack: {
    fontFamily: 'Helvetica',
    fontWeight: '200',
    fontSize: 18,
    textAlign: 'center',
    color: STYLE.inactive
  }
})