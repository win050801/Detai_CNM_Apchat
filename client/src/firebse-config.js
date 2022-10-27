import {initializeApp} from 'firebase/app'
import {getAuth,createUserWithEmailAndPassword} from 'firebase/auth'
const firebaseConfig = {
    apiKey: "AIzaSyCfpmsnZZ6rIFVMDO-O_3GB18jJPY42kXY",
  authDomain: "client-b2e5f.firebaseapp.com",
  projectId: "client-b2e5f",
  storageBucket: "client-b2e5f.appspot.com",
  messagingSenderId: "687998968888",
  appId: "1:687998968888:web:e9dc10398bfbfa6a1cb2cd"
}

export const app = initializeApp(firebaseConfig)

export const auth = getAuth(app);