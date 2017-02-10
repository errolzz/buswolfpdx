import { AsyncStorage } from 'react-native'
import { API } from './constants'


//get arrivals from trimet api
export function getStopDetails(stopId) {
  return fetch(API.TRIMET_ARRIVALS_FOR + stopId)
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson.resultSet
    })
    .catch((error) => {
      //nope
    })
}


//save users stops
export function saveStops(stops) {
  try {
    AsyncStorage.setItem('STOPS', JSON.stringify(stops))
  } catch (error) {
    // Error saving data
  }
}


//get users stops
export function getSavedStops(done) {
  try {
    AsyncStorage.getItem('STOPS').then((stops) => {
      done(JSON.parse(stops))
    })
  } catch (error) {
    // Error retrieving data
  }
}


//get the distance between two lat lng locations as the crow flys
//from http://www.movable-type.co.uk/scripts/latlong.html
export function getDistance(lat1, lng1, lat2, lng2) {
  var R = 6371e3 // metres
  var φ1 = lat1 * Math.PI / 180
  var φ2 = lat2 * Math.PI / 180
  var Δφ = (lat2-lat1) * Math.PI / 180
  var Δλ = (lng2-lng1) * Math.PI / 180

  var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

  return R * c
}


//gets the devices current location
export function getCurrentLocation(done) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      done({lat: position.coords.latitude, lng: position.coords.longitude})
    },
    (error) => {
      //nope
    },
    {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
  )
}


