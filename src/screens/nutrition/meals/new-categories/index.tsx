import { ArrowLeft } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router'
const NewCategories = () => {
  const navigate = useNavigate();
  return (
    <div className='p-6 h-full'>
      <div className='bg-white p-5 h-full'>
        <h2 className='flex gap-2'>
          <ArrowLeft onClick={()=> navigate(-1)} className='text-white cursor-pointer bg-rose-600 p-1 w-[30px] h-[30px] rounded'/>
          <span className='text-2xl font-bold text-gray-900'>New Categories</span>
        </h2>
        <form className='p-10 max-w-3xl mx-auto'>
          <div className='flex items-center justify-center flex-col'>
            <div className='form-group mb-9 w-full flex items-center gap-4'>
              <label className='w-24 inline-block' htmlFor="">Name</label>
              <input type="text" name="" id="" className='border w-full rounded p-2' />
            </div>
          <div className='form-group self-end flex gap-2'>
            <button className='border-2 border-rose-600 transition text-gray-500 px-4 py-2 rounded-lg hover:text-white hover:bg-rose-600'>Save As Draft</button>

            <button className='bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-600'>Save & Publish</button>
          </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewCategories