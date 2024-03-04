import React from 'react'
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { toast } from 'react-toastify';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function Oauth() {
  const navigate = useNavigate()
  async function onGoogleClick (){
    try {
      const auth = getAuth()
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      
      const docRef = doc(db,"users", user.uid)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()){
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timeStamp: serverTimestamp()
        })
      
      }
      navigate('/')
    } catch (error) {
      toast.error("Could not authorize with google")
    }
  }
  return (
    <button 
    type="button"
    onClick={onGoogleClick}
    className='flex items-center justify-center w-full bg-red-600 text-white
    px-7 py-3 uppercase text-sm font-medium hover:bg-red-700 active:bg-red-800
    shadow-md hover:shadow-lg transition duration-150 ease-in-out rounded'
    >
        <FcGoogle className='text-2xl rounded bg-white mr-2' />
        Continue with Google
    </button>
  )
}
