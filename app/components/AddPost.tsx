'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'

export default function CreatePost() {
  const [title, setTitle] = useState('')
  const [isDisabled, setIsDisabled] = useState(false)
  // let toastPostID: string

  //validade in posts/addPost.tsx

  // create a post here
  const { mutate } = useMutation(
    async (title: string) => await axios.post('/api/posts/addPost', { title }),
    {
      onError: (error) => {
        if (error instanceof AxiosError) {
          // toast.error(error?.response?.data.message, { id: toastPostID })
          toast.error(error?.response?.data.message)
        }
        setIsDisabled(false)
      },
      onSuccess: (data) => {
        // toast.success('Post has been made successfully', { id: toastPostID })
        toast.success('Post has been made successfully')
        setTitle('')
        setIsDisabled(false)
      },
    }
  )

  const submitPost = async (e: React.FormEvent) => {
    e.preventDefault()
    // toastPostID = toast.loading('Creating your post', { id: toastPostID })
    setIsDisabled(true)
    mutate(title)
  }

  return (
    <form onSubmit={submitPost} className='p-8 my-8 bg-white rounded-md'>
      <div className='flex-col my-4 flexx'>
        <textarea
          onChange={(e) => setTitle(e.target.value)}
          name='title'
          value={title}
          placeholder='whats on your mind?'
          className='p-4 my-2 text-lg bg-gray-200 rounded-md'
        ></textarea>
      </div>
      <div className='flex items-center justify-between gap-2'>
        <p
          className={`font-bold text-sm ${
            title.length > 300 ? 'text-red-700' : 'text-gray-700'
          }`}
        >{`${title.length}/300`}</p>
        <button
          disabled={isDisabled}
          className='px-6 py-2 text-sm text-white bg-teal-600 rounded-xl disabled:opacity-25'
          type='submit'
        >
          Create a post
        </button>
      </div>
    </form>
  )
}
