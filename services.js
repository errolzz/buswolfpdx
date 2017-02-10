import { API } from './constants'


export function getStopDetails(stopId) {
  return fetch(API.TRIMET_ARRIVALS_FOR + stopId)
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson.resultSet
    })
    .catch((error) => {
      console.error(error)
    })
}