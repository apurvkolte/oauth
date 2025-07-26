import { initializeApp } from "firebase/app";
import {
    getAuth,
    GoogleAuthProvider,
    FacebookAuthProvider,
    TwitterAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
} from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_APIKEY,
    authDomain: process.env.REACT_APP_AUTHDOMAIN,
    projectId: process.env.REACT_APP_PROJECTID,
    storageBucket: process.env.REACT_APP_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
    appId: process.env.REACT_APP_APPID,
    measurementId: process.env.REACT_APP_MEASUREMENTID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const providers = {
    google: new GoogleAuthProvider(),
    facebook: new FacebookAuthProvider(),
    twitter: new TwitterAuthProvider(),
    github: new GithubAuthProvider(),
};

export { auth, signInWithPopup, providers };
