import type { Platform } from '@/lib/types'

const LABEL: Record<Platform, string> = {
  xiaohongshu: '小紅書',
  instagram: 'IG',
  facebook: 'FB',
}

const DOT: Record<Platform, string> = {
  xiaohongshu: 'bg-error',
  instagram: 'bg-primary',
  facebook: 'bg-blue-400',
}

const TEXT: Record<Platform, string> = {
  xiaohongshu: 'text-error',
  instagram: 'text-primary',
  facebook: 'text-blue-400',
}

export default function PlatformBadge({ platform, tag = false }: { platform: Platform; tag?: boolean }) {
  if (tag) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-surface-container-low label-caps">
        <span className={`w-1.5 h-1.5 rounded-full ${DOT[platform]}`} />
        {LABEL[platform]}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`w-1.5 h-1.5 rounded-full ${DOT[platform]}`} />
      <span className={`label-caps ${TEXT[platform]}`}>{LABEL[platform]}</span>
    </span>
  )
}
