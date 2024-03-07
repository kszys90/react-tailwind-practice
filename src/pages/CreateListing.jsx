import React from 'react'

export default function CreateListing() {
  const [formData,setFormData]=React.useState({
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false
  })
  const {type, name, bedrooms, bathrooms,parking, furnished} = formData
  function handleChange(){

  }
  return (
    <main className='max-w-md px-2 mx-auto'>
      <h1 className='text-3xl text-center mt-6 font-bold'>Create a Listing</h1>
      <form >
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
          value="sell" onClick={handleChange}
          className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg
          focus:shadow-lg active:shadow-lg tansition duration-150 ease w-full 
          ${type==="sale"? 'bg-white text-black' : 'bg-slate-600 text-white'}`}
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
          focus:shadow-lg active:shadow-lg tansition duration-150 ease w-full mr-3
          ${!parking===true? 'bg-white text-black' : 'bg-slate-600 text-white'}`}
          >
            Yes
          </button>
          <button type="button" id="type" 
          value={false} onClick={handleChange}
          className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg
          focus:shadow-lg active:shadow-lg tansition duration-150 ease w-full 
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
          focus:shadow-lg active:shadow-lg tansition duration-150 ease w-full mr-3
          ${!furnished==true? 'bg-white text-black' : 'bg-slate-600 text-white'}`}
          >
            Yes
          </button>
          <button type="button" id="furnished" 
          value={false} onClick={handleChange}
          className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg
          focus:shadow-lg active:shadow-lg tansition duration-150 ease w-full 
          ${furnished? 'bg-white text-black' : 'bg-slate-600 text-white'}`}
          > No
          </button>
        </div>
        
      </form>
    </main>
  )
}
