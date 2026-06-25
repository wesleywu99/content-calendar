import { STATUS_LABEL } from '@/lib/domain/status'
import type { ContentStatus } from '@/lib/types'

const CLS: Record<ContentStatus, string> = {
  idea: 'text-slate-600 bg-slate-200',
  draft: 'text-zinc-600 bg-zinc-200',
  review: 'text-amber-800 bg-amber-200',
  approved: 'text-emerald-700 bg-emerald-200',
}

export default function StatusBadge({ status }: { status: ContentStatus }) {
  return (
    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${CLS[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  )
}
