import React from 'react'
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import Oauth from '../components/Oauth';
import { toast } from 'react-toastify';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default function SignIn() {
  const navigate = useNavigate()
  const [showPassowrd, setShowPassword] = React.useState(false)
  const [formData, setFormData] = React.useState({
    email: '',
    password: ''
  })
  const {email, password} = formData
  function handleChange(e){
    setFormData((prevState)=>{
      return {
      ...prevState, 
      [e.target.id]: e.target.value
    }
    })
  }
  async function handleSubmit(e){
    e.preventDefault()
    try {
      const auth = getAuth()
      const userCredentials = await signInWithEmailAndPassword(auth, email, password)
      if (userCredentials.user){
        toast.success("Sign in successfully")
        navigate("/")
      }

    } catch (error) {
      toast.error("Bad user credentials")
    }
  }
  return (
    <section>
        <h1 className='text-3xl text-center mt-6 mb-20 font-bold'>Sign In</h1>
        <div className='flex justify-center items-center flex-wrap'>
          <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6 items-center px-6 max-w-6xl'>
            <img className='w-full rounded-2xl'
            src="https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?q=80&w=1073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="key" />
          </div>
          <div className='w-full px-6 md:w-[67%] lg:w-[40%] lg:ml-20'>
            <form onSubmit={handleSubmit}>
              <input 
              className='w-full px-4 py-2 text-xl text-grey-700 bg-white border-grey-300
              rounded transition ease-in-out mb-6' 
              type="email" 
              id='email' 
              value={email}
              onChange={handleChange}
              placeholder='Email addres'
              />
              <div className='relative mb-6'>
                <input 
                className='w-full px-4 py-2 text-xl text-grey-700 bg-white border-grey-300
                rounded transition ease-in-out' 
                type={showPassowrd? 'text' : 'password'} 
                id='password' 
                value={password}
                onChange={handleChange}
                placeholder='Password'
                />
                {showPassowrd ? (
                  <FaEyeSlash className='absolute right-3 top-3 text-xl cursor-pointer' 
                    onClick={()=>setShowPassword((prevState)=>!prevState)}
                  />)
                  :
                  (<FaEye className='absolute right-3 top-3 text-xl cursor-pointer'
                    onClick={()=>setShowPassword((prevState)=>!prevState)}
                  />)
                }
              </div>
              <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6'>
                <p>Don't have an account?
                <Link to="/sign-up"
                  className='text-red-600 hover:text-red-700 transition duration-200
                  ease-in-out ml-1'
                >Register</Link>
                </p>
                <Link to="/forgot-password"
                className='text-red-600 hover:text-red-700 transition duration-200
                ease-in-out'
                >Forgot Password</Link>
              </div>
              <button type='submit' className='w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium 
              uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out
              hover:shadow-lg active:bg-blue-800'
              >Sign in</button>
              <div className='flex my-4 items-center 
              before:border-t  before:flex-1 before:border-grey-300
              after:border-t  after:flex-1 after:border-grey-300'>
                <p className='text-center font-semibold mx-4'>OR</p>
              </div>
              <Oauth />
            </form>
          </div>
        </div>
    </section>
  )
}
