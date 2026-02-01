'use client'

import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import ConfirmationPopup from '@/components/global/confimation-popup'

interface DeleteTaskButtonProps {
  taskId: string
}

const DeleteTaskButton = ({ taskId }: DeleteTaskButtonProps) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    try {
      setLoading(true)

      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast.success("task Delete successfully!");
      }
    } catch {
      toast.error('Failed to delete task')
    } finally {
      router.refresh()
      setLoading(false)
    }
  }

  return (
    <ConfirmationPopup
      title="Delete task"
      description="This action cannot be undone. Are you sure?"
      onAction={handleDelete}
      trigger={
        <Button variant="ghost" disabled={loading}>
          <Trash2 className="text-destructive" />
        </Button>
      }
    />
  )
}

export default DeleteTaskButton
