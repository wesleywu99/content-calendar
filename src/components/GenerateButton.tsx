'use client'
import { useState } from 'react'
import GenerateModal from './GenerateModal'

export default function GenerateButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-zinc-900 rounded-lg shadow-sm transition-all duration-150 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 active:scale-95"
      >
        新增創意
      </button>
      {open && <GenerateModal onClose={() => setOpen(false)} />}
    </>
  )
}
