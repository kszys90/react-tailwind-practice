import React from 'react'
import Spinner from '../components/Spinner'
import { toast } from 'react-toastify'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getAuth } from 'firebase/auth';
import {v4 as uuidv4} from 'uuid'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';


export default function CreateListing() {
  const navigate = useNavigate()
  const auth = getAuth()
  // eslint-disable-next-line no-unused-vars
  const [geoLocationEnabled, setGeolocationEnabled] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [formData,setFormData]=React.useState({
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: '',
    description: '',
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    latitude: 0,
    longitude: 0,
    images: null
  })
  const {type, name, bedrooms, bathrooms,parking, furnished, address: adress, description, offer
  ,regularPrice, discountedPrice, latitude, longitude, images} = formData

  function handleChange(e){
    let boolean = null;
    if(e.target.value==="true"){
      boolean = true
    }
    if(e.target.value==="false"){
      boolean = false
    }
    // for files
    if(e.target.files){
      setFormData(prevState=>({
        ...prevState,
        images: e.target.files
        
      }))
    }
    // for text/bool/number
    if(!e.target.files){
      setFormData(prevState=>({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value
      }))
    }
  }
  async function handleSubmit(e){
    e.preventDefault()
    setLoading(true)
    if(discountedPrice >=regularPrice){
      setLoading(false)
      toast.error("Discounted price needs to be lesser than regular price")
      return
    }
    if(images.legth > 6){
      setLoading(false)
      toast.error("Maximum 6 images are allowed")
      return
    }
    let geolocation = {}
    if(geoLocationEnabled){
      setLoading(false)
      toast.error("Using paid google cloud api is not included. Example of use is in realtor clone udemy course")
      return
    }else {
      geolocation.lat = latitude
      geolocation.lng = longitude
    }
    async function storeImage(image){
      return new Promise((resolve,reject)=>{
        const storage = getStorage()
        const fileName=`${auth.currentUser.uid}-${image.name}-${uuidv4()}`
        const storageRef = ref(storage,fileName)
        const uploadTask = uploadBytesResumable(storageRef, image)
        uploadTask.on('state_changed', 
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            // eslint-disable-next-line default-case
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
            }
          }, 
          (error) => {
            // Handle unsuccessful uploads
            reject(error)
          }, 
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
        })
    }
    const imgUrls = await Promise.all(
      [...images]
      .map((image)=>storeImage(image)))
      .catch((error)=>{
        setLoading(false)
        toast.error("Images not uploaded")
        return
      })
    const formDataCopy = {
      ...formData,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid
    }
    delete formDataCopy.images
    !formDataCopy.offer && delete formDataCopy.discountedPrice

    const docRef= await addDoc(collection(db, "listings"), formDataCopy)
    setLoading(false)
    toast.success("Listing added")
    navigate(`/category/${formDataCopy.type}/${docRef.id}}`)
  }
  if (loading){
    return <Spinner />
  }
  return (
    <main className='max-w-md px-2 mx-auto'>
      <h1 className='text-3xl text-center mt-6 font-bold'>Create a Listing</h1>
      <form onSubmit={handleSubmit}>
        <p className='text-lg mt-6 font-semibold'>Sell / Rent</p>
        <div className='flex justify-between mt-3'>
          <button type="button" id="type" 
          value="sell" onClick={handleChange}
          className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg
          focus:shadow-lg active:shadow-lg tansition duration-150 ease w-full mr-3
          ${type==="rent"? 'bg-white text-black' : 'bg-slate-600 text-white'}`}
          >
            Sell
          </button>
          <button type="button" id="type" 
          value="rent" onClick={handleChange}
          className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg
          focus:shadow-lg active:shadow-lg tansition duration-150 ease w-full 
          ${type==="sell"? 'bg-white text-black' : 'bg-slate-600 text-white'}`}
          >
            Rent
          </button>
        </div>
        <p className='text-lg mt-6 font-semibold'>Name</p>
        <input type="text" id="name" value={name} onChange={handleChange} placeholder="Name"
          maxLength="32" minLength="10" required className='w-full px-4 py-2 text-xl text-grey-700
          bg-white border border-grey-300 rounded tansition duration-150 ease-in-out
          focus:text-grey-700 focus:bg-white focus:border-grey-700'
        />
        <div className='flex space-x-6 mb-6 mt-6'>
          <div className=''>
            <p className='text-lg font-semibold'>Beds</p>
            <input type="number" id="bedrooms" value={bedrooms} onChange={handleChange}
              min="1" max='50' required className='px-4 py-2 text-xl text-grey-700 bg-white
              border border-gray-700 rounded transition diration-150 ease-in-out
              focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center w-full'/>
          </div>
          <div className=''>
            <p className='text-lg font-semibold'>Baths</p>
            <input type="number" id="bathrooms" value={bathrooms} onChange={handleChange}
              min="1" max='50' required className='px-4 py-2 text-xl text-grey-700 bg-white
              border border-gray-700 rounded transition diration-150 ease-in-out
              focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center w-full'/>
          </div>
        </div>
        <p className='text-lg mt-6 font-semibold'>Parking spot</p>
        <div className='flex justify-between mt-3'>
          <button type="button" id="parking" 
          value={true} onClick={handleChange}
          className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg
          focus:shadow-lg active:shadow-lg transition duration-150 ease w-full mr-3
          ${parking!==true? 'bg-white text-black' : 'bg-slate-600 text-white'}`}
          >
            Yes
          </button>
          <button type="button" id="parking" 
          value={false} onClick={handleChange}
          className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg
          focus:shadow-lg active:shadow-lg transition duration-150 ease w-full 
          ${parking? 'bg-white text-black' : 'bg-slate-600 text-white'}`}
          >
            No
          </button>
        </div>
        <p className='text-lg mt-6 font-semibold'>Furnished</p>
        <div className='flex justify-between mt-3'>
          <button type="button" id="furnished" 
          value={true} onClick={handleChange}
          className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg
          focus:shadow-lg active:shadow-lg transition duration-150 ease w-full mr-3
          ${!furnished===true? 'bg-white text-black' : 'bg-slate-600 text-white'}`}
          >
            Yes
          </button>
          <button type="button" id="furnished" 
          value={false} onClick={handleChange}
          className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg
          focus:shadow-lg active:shadow-lg transition duration-150 ease w-full 
          ${furnished? 'bg-white text-black' : 'bg-slate-600 text-white'}`}
          > No
          </button>
        </div>
        <p className='text-lg mt-6 font-semibold'>Adress</p>
        <textarea type="text" id="address" value={adress} onChange={handleChange} placeholder="Adress"
          required className='w-full px-4 py-2 text-xl text-grey-700
          bg-white border border-grey-300 rounded transition duration-150 ease-in-out
          focus:text-grey-700 focus:bg-white focus:border-grey-700'
        />
        {!geoLocationEnabled && (
          <div className='flex space-x-6 justify-start mb-6 mt-6'>
            <div className=''>
              <p className='text-xl font-semibold'>Latitude</p>
              <input type="number" id="latitude" value={latitude} onChange={handleChange} 
              required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border
              border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white
              focus:text-grey-700 focus:border-slate-600 text-center' min='-90' max='90' />
            </div>
            <div className=''>
              <p className='text-xl font-semibold'>Longitude</p>
              <input type="number" id="longitude" value={longitude} onChange={handleChange} 
              required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border
              border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white
              focus:text-grey-700 focus:border-slate-600 text-center' min='-180' max='180' />
            </div>
          </div>
        )}
        <p className='text-lg font-semibold'>Description</p>
        <textarea type="text" id="description" value={description} onChange={handleChange} placeholder="Description"
          required className='w-full px-4 py-2 text-xl text-grey-700
          bg-white border border-grey-300 rounded transition duration-150 ease-in-out
          focus:text-grey-700 focus:bg-white focus:border-grey-700'
        />
         <p className='text-lg mt-6 font-semibold'>Offer</p>
        <div className='flex justify-between mt-3'>
          <button type="button" id="offer" 
          value={true} onClick={handleChange}
          className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg
          focus:shadow-lg active:shadow-lg transition duration-150 ease w-full mr-3
          ${offer!==true? 'bg-white text-black' : 'bg-slate-600 text-white'}`}
          >
            Yes
          </button>
          <button type="button" id="offer" 
          value={false} onClick={handleChange}
          className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg
          focus:shadow-lg active:shadow-lg transition duration-150 ease w-full 
          ${offer? 'bg-white text-black' : 'bg-slate-600 text-white'}`}
          > No
          </button>
        </div>
        <div >
            <p className='text-lg font-semibold mt-6'>Regular Price</p>
          <div className='flex justify-between items-center mb-6 space-x-6 '>
            <div className='flex justify-between items-center w-full'>
              <input type="number" id="regularPrice" value={regularPrice} onChange={handleChange} 
              min="50" max="400000000" required className='w-full px-4 py-2 text-xl text-grey-700
              bg-white border border-grey-300 rounded transition duration-150 ease-in-out
              focus:text-grey:700 focus:bg-white focus:border-slate-600 text-center'/>
            </div>
            {type==="rent" && (
              <div className='flex justify-center items-center'> 
                <p className='text-md w-full whitespace-nowrap'>$ / Month</p>
              </div>
            )}
          </div>
        </div>
        {offer && (
              <div >
                  <p className='text-lg font-semibold mt-6'>Discounted price</p>
                <div className='flex justify-between items-center mb-6 space-x-6 '>
                  <div className='flex justify-between items-center w-full'>
                    <input type="number" id="discountedPrice" value={discountedPrice} onChange={handleChange} 
                    min="50" max="400000000" required className='w-full px-4 py-2 text-xl text-grey-700
                    bg-white border border-grey-300 rounded transition duration-150 ease-in-out
                    focus:text-grey:700 focus:bg-white focus:border-slate-600 text-center'/>
                  </div>
                  {type==="rent" && (
                    <div className='flex justify-center items-center'> 
                      <p className='text-md w-full whitespace-nowrap'>$ / Month</p>
                    </div>
                  )}
                </div>
              </div>
        )}
        <div className='mb-6'>
          <p className='text-lg font-semibold'>Images</p>
          <p className='text-gray-600'>the first image will be the cover (max 6)</p>
          <input type="file" id="images" onChange={handleChange} accept=".jpg,.png,.jpeg"
          multiple required className='w-full px-3 py-1.5 text-gray-700 bg-white
          border border-gray-300 transition rounded duration-150 ease-in-out 
          focus:bg-white focus:slate-600'
          />
        </div>
        <button className='mb-6 w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm
        uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700
        focus:shadow-lg active:bg-blue-800 active-shadow-lg transition duration-150 ease-in-out'>
          Create Listing
        </button>
      </form>
    </main>
  )
}
