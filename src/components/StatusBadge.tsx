import { STATUS_LABEL } from '@/lib/domain/status'
import type { ContentStatus } from '@/lib/types'

const CLS: Record<ContentStatus, string> = {
  idea: 'bg-zinc-100 text-zinc-500',
  draft: 'bg-amber-50 text-amber-600',
  review: 'bg-blue-50 text-blue-600',
  approved: 'bg-emerald-50 text-emerald-600',
}

export default function StatusBadge({ status }: { status: ContentStatus }) {
  return (
    <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-md tracking-wide ${CLS[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  )
}
