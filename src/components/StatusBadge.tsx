import { STATUS_LABEL } from '@/lib/domain/status'
import type { ContentStatus } from '@/lib/types'

const CLS: Record<ContentStatus, string> = {
  idea: 'bg-gray-100 text-gray-500',
  draft: 'bg-amber-50 text-amber-700',
  review: 'bg-blue-50 text-blue-700',
  approved: 'bg-green-50 text-green-700',
}

export default function StatusBadge({ status }: { status: ContentStatus }) {
  return (
    <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full ${CLS[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  )
}
