import { Student, AttendanceRecord, TrainingRecord } from '../types'

export function initializeData() {
  // Initialize batches if not exists
  if (!localStorage.getItem('batches')) {
    const batches = ['BCA-Sem3', 'Python-BatchA', 'MCA-Sem1']
    localStorage.setItem('batches', JSON.stringify(batches))
  }

  // Initialize students if not exists
  if (!localStorage.getItem('students')) {
    const students: Student[] = [
      { id: '1', name: 'John Doe', batch: 'BCA-Sem3', course: 'BCA', contact: 'john@example.com' },
      { id: '2', name: 'Jane Smith', batch: 'BCA-Sem3', course: 'BCA', contact: 'jane@example.com' },
      { id: '3', name: 'Mike Johnson', batch: 'Python-BatchA', course: 'Python', contact: 'mike@example.com' },
      { id: '4', name: 'Sarah Williams', batch: 'Python-BatchA', course: 'Python', contact: 'sarah@example.com' },
      { id: '5', name: 'Tom Brown', batch: 'MCA-Sem1', course: 'MCA', contact: 'tom@example.com' },
      { id: '6', name: 'Emily Davis', batch: 'MCA-Sem1', course: 'MCA', contact: 'emily@example.com' },
    ]
    localStorage.setItem('students', JSON.stringify(students))
  }

  // Initialize attendance if not exists
  if (!localStorage.getItem('attendance')) {
    localStorage.setItem('attendance', JSON.stringify([]))
  }

  // Initialize trainings if not exists
  if (!localStorage.getItem('trainings')) {
    localStorage.setItem('trainings', JSON.stringify([]))
  }
}

export function calculateAttendancePercentage(studentId: string): number {
  const attendance = JSON.parse(localStorage.getItem('attendance') || '[]')
  const studentRecords = attendance.filter((record: AttendanceRecord) => record.studentId === studentId)
  if (studentRecords.length === 0) return 100
  
  const presentDays = studentRecords.filter((record: AttendanceRecord) => 
    record.status === 'present' || record.status === 'late'
  ).length
  
  return Math.round((presentDays / studentRecords.length) * 100)
}