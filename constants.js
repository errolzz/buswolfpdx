
let TRIMET_APP_ID = '048A702DCBC791CACA54AE4B5'

export const API = {  
  TRIMET_ARRIVALS_FOR: 'https://developer.trimet.org/ws/v2/arrivals?appID=' + TRIMET_APP_ID + '&locIDs='
}

export const ROUTES = {
  STOPS: 'Stops',
  TIMELINE: 'Timeline'
}

export const COPY = {
  STOPS_TOP_TEXT: [
    'FIRST STOP ID',
    'CONFIRM FIRST STOP',
    'SECOND STOP ID',
    'CONFIRM SECOND STOP'
  ],
  STOPS_NEXT: 'NEXT',
  STOPS_CONFIRM_YES: 'YES',
  STOPS_CONFIRM_NO: 'NO'
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