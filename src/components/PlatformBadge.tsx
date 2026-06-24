import type { Platform } from '@/lib/types'

const LABEL: Record<Platform, string> = {
  xiaohongshu: '小紅書',
  instagram: 'IG',
  facebook: 'FB',
}

const CLS: Record<Platform, string> = {
  xiaohongshu: 'bg-xhs/10 text-xhs',
  instagram: 'bg-ig/10 text-ig',
  facebook: 'bg-fb/10 text-fb',
}

export default function PlatformBadge({ platform }: { platform: Platform }) {
  return (
    <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full ${CLS[platform]}`}>
      {LABEL[platform]}
    </span>
  )
}
