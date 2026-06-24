import type { Platform } from '@/lib/types'

const META: Record<Platform, { label: string; color: string; bgColor: string }> = {
  xiaohongshu: {
    label: '小紅書',
    color: 'text-error',
    bgColor: 'bg-error/10',
  },
  instagram: {
    label: 'Instagram',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
  },
  facebook: {
    label: 'Facebook',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
}

export default function PlatformBadge({ platform, tag = false }: { platform: Platform; tag?: boolean }) {
  const meta = META[platform]
  if (!meta) return <span>{platform}</span>

  if (tag) {
    return (
      <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-medium ${meta.bgColor} ${meta.color}`}>
        {meta.label}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`w-1.5 h-1.5 rounded-full ${meta.color === 'text-error' ? 'bg-error' : meta.color === 'text-pink-600' ? 'bg-pink-600' : 'bg-blue-600'}`} />
      <span className={`text-[10px] font-medium ${meta.color}`}>{meta.label}</span>
    </span>
  )
}
