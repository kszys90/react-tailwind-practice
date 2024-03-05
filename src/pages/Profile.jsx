import { getAuth, updateProfile } from 'firebase/auth'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {db} from '../firebase'
import { doc, updateDoc } from 'firebase/firestore';

export default function Profile() {
  const navigate = useNavigate()
  const auth = getAuth()
  const [changeDetail, setChangeDetail]= React.useState(false)
  const [formData, setFormData] = React.useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })
  const {name, email} = formData

  function handleEdit (){
    changeDetail && onSubmit()
    setChangeDetail(prevState => !prevState)
  }

  function handleChange(e){
    setFormData((prevState)=>({
      ...prevState, [e.target.id]: e.target.value
    }))
  }
  function handleLogout(){
    auth.signOut()
    navigate('/')
  }

  async function onSubmit(){
  try {
    if (auth.currentUser.displayName!==name){
      await updateProfile(auth.currentUser, {displayName: name})
    }
    const docRef=doc(db,"users", auth.currentUser.uid)
    await updateDoc(docRef,{
      name,
    })
    toast.success("Profile successfully updated")
    
  } catch (error) {
    toast.error("Could not update the profile details")
}
  }
  return (
    <>
      <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
        <h1 className='text-3xl text-center mt-6'>My Profile</h1> 
        <div className='w-full md:w-[50%] mt-6 px-3'>
          <form>

            <input type="text" id="name" value={name} 
              className={`w-full px-4 py-2 text-xl text-grey-700 bg white
              border-grey-300 rounded transition ease-in-out ${changeDetail && 'bg-red-200'}`}
              onChange={handleChange}
              disabled={!changeDetail}

            />
            <input type="email" id="email" value={email} 
                className={`my-6 w-full px-4 py-2 text-xl text-grey-700 bg white
                border-grey-300 rounded transition ease-in-out ${changeDetail && 'bg-red-200'}`}
                onChange={handleChange}
                disabled={!changeDetail}

            />
            <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg'>
              <p className='flex items-center mb-6 '>Do you want to change your name?
                <span onClick={handleEdit}
                className='text-red-600 hover:text-red-700 transition ease-in-out
                duration-200 ml-1 cursor-pointer'>
                  {changeDetail? 'Apply' : 'Edit'}
                  </span>
              </p>
              <p className='text-blue-600 hover:text-blue-800 transition duration-200
              ease-in-out cursor-pointer'
              onClick={handleLogout}
              >
                Sign out
                </p>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}
