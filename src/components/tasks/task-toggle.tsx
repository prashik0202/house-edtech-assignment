'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface TaskToggleProps {
  taskId: string
  completed: boolean
}

const TaskToggle = ({ taskId, completed }: TaskToggleProps) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleToggle = async (checked: boolean) => {
    try {
      setLoading(true)

      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: checked }),
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
      checked={completed}
      disabled={loading}
      onCheckedChange={(checked) => handleToggle(Boolean(checked))}
    />
  )
}

export default TaskToggle
