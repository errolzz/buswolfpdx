import React, { Component, PropTypes } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { getSavedStops, getStopDetails } from '../services.js'
import { ROUTES, STYLE } from '../constants.js'

export default class Splash extends Component {

  constructor(props) {
    super(props);

    this.validateSavedStops = this.validateSavedStops.bind(this)
    this.routeWithStops = this.routeWithStops.bind(this)
  }

  componentDidMount() {
    //get the users saved stops
    getSavedStops((stops) => {
      if(!stops) {
        this.routeWithStops(false)
        return
      }

      if(stops.length === 0) {
        //if there are no saved stops
        this.routeWithStops(false)
      } else {
        //if there are saved stops
        this.validateSavedStops(stops)
      }
    })
  }

  validateSavedStops(stops) {
    //validate saved stops
    let _this = this
    let valid = true

    //instant fail cases
    if(stops.length === 1) {
      this.routeWithStops(false)
      return
    } else if(!stops[0].id || !stops[1].id) {
      this.routeWithStops(false)
      return
    }

    //sequentially check the saved stops
    getStopDetails(stops[0].id)
      .then((data) => {
        if(!data.location) {
          //first stop not valid
          _this.routeWithStops(false)
        } else {
          //first stop is valid
          getStopDetails(stops[1].id)
            .then((data) => {
              if(!data.location) {
                //second stop is invalid
                _this.routeWithStops(false)
              } else {
                //both stops are valid
                _this.routeWithStops(true, stops)
              }
            })
        }
      })
  }

  routeWithStops(hasValidStops, stops) {
    //default to either stops or timeline based on if stops are already saved
    let route = hasValidStops ? ROUTES.STOP_INFO : ROUTES.SETUP

    setTimeout(() => {
      this.props.navigator.push({
        name: route,
        stops: stops
      })
    }, 200)
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.logo}>BUS WOLF PDX</Text>
      </View>
    )
  }
}

Splash.propTypes = {
  navigator: React.PropTypes.object
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: STYLE.background,
    justifyContent: 'center'
  },
  logo: {
    color: STYLE.inactive,
    fontSize: 20,
    fontFamily: 'Avenir',
    fontWeight: '800',
    textAlign: 'center'
  }
})