'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface TaskToggleProps {
  taskId: string
  status: 'todo' | 'inprogress' | 'done'
}

const TaskToggle = ({ taskId, status }: TaskToggleProps) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleToggle = async (checked: boolean) => {
    try {
      setLoading(true)

      const newStatus = checked ? 'done' : 'todo'

      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        toast.success("Task Updated!")
      }

    } catch {
      toast.error('Failed to update task')
    } finally {
      setLoading(false)
      router.refresh()
    }
  }

  return (
    <Checkbox
      checked={status === 'done'}
      disabled={loading}
      onCheckedChange={(checked) => handleToggle(Boolean(checked))}
    />
  )
}

export default TaskToggle
