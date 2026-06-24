'use client'
import { useState } from 'react'
import GenerateModal from './GenerateModal'

export default function GenerateButton({ variant = 'compact' }: { variant?: 'compact' | 'full' }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          variant === 'full'
            ? 'w-full flex items-center justify-center gap-2 bg-on-primary-fixed-variant text-white py-3 rounded-lg text-[18px] font-medium leading-[1.4] tracking-[-0.01em] hover:opacity-90 transition-opacity'
            : 'flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-[13px] font-semibold hover:bg-primary-container transition-all'
        }
      >
        {variant === 'full' && <span className="material-symbols-outlined">add</span>}
        {variant === 'full' ? 'Generate Content' : 'Generate Content'}
      </button>
      {open && <GenerateModal onClose={() => setOpen(false)} />}
    </>
  )
}
