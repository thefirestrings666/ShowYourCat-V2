import firebase from 'firebase/app'
import 'firebase/auth'

// The configuration below is not sensitive data. You can serenely add your config here
const config = {
  apiKey: 'AIzaSyBGlqikkou5LwRt6mS0ZgYTbSvae9xvx10',
  authDomain: 'showyourcat-v2.firebaseapp.com',
  databaseURL: 'https://showyourcat-v2.firebaseio.com',
  projectId: 'showyourcat-v2',
  storageBucket: 'showyourcat-v2.appspot.com',
  messagingSenderId: '741862458276',
  appId: '1:741862458276:web:a71430b9884ba0404df731',
  measurementId: 'G-C3XDMH83QV'
}

firebase.initializeApp(config)
