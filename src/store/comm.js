import types from './actionTypes'

let initState = {
  socketUrl: 'ws://192.168.169.84:9004',
  socket: null,
  fileTypes: new RegExp('(.jpg|.jpeg|.png|.gif|.doc|.docx|.xls|.xlsx|.zip|.rar|.txt)'),
  uploadConfig: {
    apiKey: "AIzaSyCCbGonXaF_fWOmj6RyXvn2ylzz_Enm95Y",
    authDomain: "ichat-161113.firebaseapp.com",
    databaseURL: "https://ichat-161113.firebaseio.com",
    projectId: "ichat-161113",
    storageBucket: "ichat-161113.appspot.com",
    messagingSenderId: "840705958023",
    appId: "1:840705958023:web:e66c68480bf09467951822",
    measurementId: "G-ENFY125P42",
    emial: 'a.yinnn@gmail.com',
    password: '12345qwert'
  },
  storegeRef: null,
  systemMsg: {},
  expertMsg: {}
}

function common (state = initState, action) {
  switch(action.type) {
    case types.SET_SOCKET:
      return {...state, ...action.data}
    case types.SET_SYS_MSG:
      return {...state, systemMsg: {...state.systemMsg, ...action.data}}
    case types.SET_EXPERT_MSG:
      return {...state, expertMsg: {...state.expertMsg, ...action.data}}
    case types.SET_STORAGE_REF:
      return {...state, storegeRef: action.data}
    default: return state
  }
}

export default common