'use client'

import React from 'react'
import { useFormStatus } from 'react-dom'

interface SubmitButtonProps {
  text?: string
  loadingText?: string
  className?: string
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  text = "Submit",
  loadingText = "Processing...",
  className = "",
}) => {
  const { pending } = useFormStatus()
  
  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full px-3 py-2 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-blue-300 
      disabled:cursor-not-allowed transition-colors ${className}`}
    >
      {pending ? loadingText : text}
    </button>
  )
}

export default SubmitButton