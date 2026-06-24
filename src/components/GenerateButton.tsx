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
        className="rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white"
      >
        生成內容
      </button>
      {open && <GenerateModal onClose={() => setOpen(false)} />}
    </>
  )
}
