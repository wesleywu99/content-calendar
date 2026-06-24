import { STATUS_LABEL } from '@/lib/domain/status'
import type { ContentStatus } from '@/lib/types'

const CLS: Record<ContentStatus, string> = {
  idea: 'bg-zinc-100 text-zinc-600',
  draft: 'bg-amber-50 text-amber-700',
  review: 'bg-blue-50 text-blue-700',
  approved: 'bg-emerald-50 text-emerald-700',
}

export default function StatusBadge({ status }: { status: ContentStatus }) {
  return (
    <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full ${CLS[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  )
}
