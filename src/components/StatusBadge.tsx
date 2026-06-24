import { STATUS_LABEL } from '@/lib/domain/status'
import type { ContentStatus } from '@/lib/types'

const CLS: Record<ContentStatus, string> = {
  idea: 'text-on-surface-variant bg-surface-container',
  draft: 'text-on-surface-variant bg-surface-container',
  review: 'text-orange-600 bg-orange-50 border border-orange-100',
  approved: 'text-green-600 bg-green-50 border border-green-100',
}

export default function StatusBadge({ status }: { status: ContentStatus }) {
  return (
    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${CLS[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  )
}
