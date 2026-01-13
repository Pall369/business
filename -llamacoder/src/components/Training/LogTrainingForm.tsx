import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { TrainingRecord } from '../../types'

interface LogTrainingFormProps {
  onClose: () => void
}

export function LogTrainingForm({ onClose }: LogTrainingFormProps) {
  const [trainings, setTrainings] = useLocalStorage<TrainingRecord[]>('trainings', [])
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    batch: '',
    topic: '',
    duration: '1',
    notes: '',
    fileLink: ''
  })

  const batches = ['BCA-Sem3', 'Python-BatchA', 'MCA-Sem1']

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newTraining: TrainingRecord = {
      id: `${Date.now()}`,
      ...formData,
      duration: parseInt(formData.duration)
    }

    setTrainings([...trainings, newTraining])
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Log Training Session</DialogTitle>
          <DialogDescription>
            Record the training topic and materials for today's session
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="batch">Batch</Label>
            <Select value={formData.batch} onValueChange={(value) => setFormData(prev => ({ ...prev, batch: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select batch" />
              </SelectTrigger>
              <SelectContent>
                {batches.map(batch => (
                  <SelectItem key={batch} value={batch}>{batch}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              value={formData.topic}
              onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
              placeholder="e.g., React Hooks, Data Structures"
              required
            />
          </div>

          <div>
            <Label htmlFor="duration">Duration</Label>
            <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 hour</SelectItem>
                <SelectItem value="2">2 hours</SelectItem>
                <SelectItem value="3">3 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes about the session..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="fileLink">File/Link (Optional)</Label>
            <Input
              id="fileLink"
              value={formData.fileLink}
              onChange={(e) => setFormData(prev => ({ ...prev, fileLink: e.target.value }))}
              placeholder="https://example.com/materials"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save Training Log
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}