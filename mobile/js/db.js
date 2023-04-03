import { initializeApp } from 'firebase/app';
import {
  addDoc,
  getDocs,
  collection,
  deleteDoc,
  getFirestore,
  doc,
  updateDoc,
  getDoc,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAyacVFGoIKMMtkH7znpi1ESh2G0UlSKQI',
  authDomain: 'sound-micron-377214.firebaseapp.com',
  projectId: 'sound-micron-377214',
  storageBucket: 'sound-micron-377214.appspot.com',
  messagingSenderId: '71286093345',
  appId: '1:71286093345:web:127ea171b8d5531e945560',
};

initializeApp(firebaseConfig);

const db = getFirestore();
const SONGS_TABLE = 'songs';
const CONFIG = 'config';

export const getSongs = () => getDocs(collection(db, SONGS_TABLE));
export const getConfig = () => getDoc(doc(db, CONFIG, 'version'));
