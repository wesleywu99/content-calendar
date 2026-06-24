import type { Platform } from '@/lib/types'

const LABEL: Record<Platform, string> = {
  xiaohongshu: '小紅書',
  instagram: 'IG',
  facebook: 'FB',
}

const CLS: Record<Platform, string> = {
  xiaohongshu: 'bg-rose-50 text-rose-600',
  instagram: 'bg-violet-50 text-violet-600',
  facebook: 'bg-blue-50 text-blue-600',
}

export default function PlatformBadge({ platform }: { platform: Platform }) {
  return (
    <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full ${CLS[platform]}`}>
      {LABEL[platform]}
    </span>
  )
}
