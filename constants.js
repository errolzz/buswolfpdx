
let TRIMET_APP_ID = '048A702DCBC791CACA54AE4B5'
let WEATHER_APP_ID = 'e00252cdb80ea68e108a14782282bc00'

export const API = {  
  TRIMET_ARRIVALS_FOR: 'https://developer.trimet.org/ws/v2/arrivals?appID=' + TRIMET_APP_ID + '&locIDs=',
  CURRENT_WEATHER_FOR: 'http://api.openweathermap.org/data/2.5/weather?units=imperial&appid=' + WEATHER_APP_ID
}

export const ROUTES = {
  SPLASH: 'Splash',
  SETUP: 'Setup',
  STOP_INFO: 'StopInfo'
}

export const COPY = {
  SETUP_TOP_TEXT: [
    'FIRST STOP ID',
    'CONFIRM FIRST STOP',
    'SECOND STOP ID',
    'CONFIRM SECOND STOP'
  ],
  SETUP_NEXT: 'NEXT',
  SETUP_CONFIRM_YES: 'YES',
  SETUP_CONFIRM_NO: 'NO'
}

export const STYLE = {
  background: '#2d353c',
  inactive: '#495e6c',
  white: '#f4f4f4',
  green: '#71cc96',
  red: '#e06565',

  greenText: {
    color: '#71cc96'
  },
  greenBorder: {
    borderColor: '#71cc96'
  },
  redText: {
    color: '#e06565'
  },
  redBorder: {
    borderColor: '#e06565'
  },
  whiteText: {
    color: '#f4f4f4'
  }
}