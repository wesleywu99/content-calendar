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
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 active:scale-[0.98] transition-all"
      >
        新增構想
      </button>
      {open && <GenerateModal onClose={() => setOpen(false)} />}
    </>
  )
}
