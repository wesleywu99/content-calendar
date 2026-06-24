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
            ? 'w-full flex items-center justify-center gap-2 bg-on-primary-fixed-variant text-on-primary py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity'
            : 'flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-md font-medium text-sm hover:bg-primary-container transition-all'
        }
      >
        {variant === 'full' && <span className="material-symbols-outlined">add</span>}
        {variant === 'full' ? '新增構想' : '生成內容'}
      </button>
      {open && <GenerateModal onClose={() => setOpen(false)} />}
    </>
  )
}
