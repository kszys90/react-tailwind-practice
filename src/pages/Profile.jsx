import { getAuth, updateProfile } from 'firebase/auth'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {db} from '../firebase'
import { collection, doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { FcHome } from "react-icons/fc";
import ListingItem from '../components/ListingItem'


export default function Profile() {
  const navigate = useNavigate()
  const auth = getAuth()
  const [listings, setListings]=React.useState(null)
  const [loading, setLoading]=React.useState(false)
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
  React.useEffect((()=>{
    async function fetchUserListings(){
      setLoading(true)
      const listingRef = collection(db, "listings")
      const q = query(listingRef, 
        where("userRef", "==", auth.currentUser.uid), 
        orderBy("timestamp", "desc"))

      const querySnap = await getDocs(q)
      let listings = []
      querySnap.forEach((doc)=>{
        return listings.push({
          id: doc.id,
          data: doc.data()
        })})
      setListings(listings)
      setLoading(false)
    } 
    fetchUserListings()
   }),[auth.currentUser.uid])

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
          <button type="submit" className='w-full bg-blue-600 text-white uppercase px-7 py-3 text-sm font-medium
          rounded shadow-md hover:bg-blue-700 duration-150 ease-in-out hover:shadow-lg
          active:bg-blue-800'>
            <Link to={"/create-listing"} className='flex justify-center items-center'>
              <FcHome className='mr-2 text-3xl bg-red-200 rounded-full border-2'/>
              Sell or rent your home
            </Link>
          </button>
        </div>
      </section>
      <div className=''>
        {!loading && listings && listings.length > 0 && (
          <>
            <h2 className='text-2xl text-center font-semibold my-6'>My Listings</h2>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl-grid-cols-5 mt-6 mb-6'>
              {listings.map((listing)=>(
                  <ListingItem key={listing.id} id={listing.id} listing={listing.data} />
              ))}

            </ul>

          </>
        )}
      </div>
    </>
  )
}
