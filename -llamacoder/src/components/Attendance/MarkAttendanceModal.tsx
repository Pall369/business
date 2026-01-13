import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { Student, AttendanceRecord } from '../../types'
import { Check, X, Clock } from 'lucide-react'

interface MarkAttendanceModalProps {
  onClose: () => void
}

export function MarkAttendanceModal({ onClose }: MarkAttendanceModalProps) {
  const [students] = useLocalStorage<Student[]>('students', [])
  const [attendance, setAttendance] = useLocalStorage<AttendanceRecord[]>('attendance', [])
  const [selectedBatch, setSelectedBatch] = useState('BCA-Sem3')
  const [attendanceStatus, setAttendanceStatus] = useState<Record<string, 'present' | 'absent' | 'late'>>({})

  const batches = Array.from(new Set(students.map(s => s.batch)))
  const filteredStudents = students.filter(s => s.batch === selectedBatch)
  const today = new Date().toISOString().split('T')[0]

  const handleMarkAttendance = () => {
    const newRecords: AttendanceRecord[] = filteredStudents.map(student => ({
      id: `${today}-${student.id}`,
      studentId: student.id,
      date: today,
      status: attendanceStatus[student.id] || 'present',
      batch: selectedBatch
    }))

    // Remove existing records for today and this batch
    const filteredAttendance = attendance.filter(record => 
      !(record.date === today && record.batch === selectedBatch)
    )

    setAttendance([...filteredAttendance, ...newRecords])
    onClose()
  }

  const getStatusIcon = (status: 'present' | 'absent' | 'late') => {
    switch (status) {
      case 'present':
        return <Check className="h-4 w-4 text-green-600" />
      case 'absent':
        return <X className="h-4 w-4 text-red-600" />
      case 'late':
        return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mark Attendance</DialogTitle>
          <DialogDescription>
            Record attendance for {selectedBatch} on {new Date().toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Batch Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Select Batch</label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            >
              {batches.map(batch => (
                <option key={batch} value={batch}>{batch}</option>
              ))}
            </select>
          </div>

          {/* Student List */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Students ({filteredStudents.length})</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredStudents.map(student => (
                <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {student.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {student.course}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {(['present', 'late', 'absent'] as const).map(status => (
                      <Button
                        key={status}
                        variant={attendanceStatus[student.id] === status ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAttendanceStatus(prev => ({
                          ...prev,
                          [student.id]: status
                        }))}
                        className={`${
                          status === 'present' ? 'bg-green-600 hover:bg-green-700' :
                          status === 'late' ? 'bg-yellow-600 hover:bg-yellow-700' :
                          'bg-red-600 hover:bg-red-700'
                        } ${attendanceStatus[student.id] === status ? '' : 'bg-opacity-20'}`}
                      >
                        {getStatusIcon(status)}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleMarkAttendance}>
              Save Attendance
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}