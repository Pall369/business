export interface Student {
  id: string
  name: string
  batch: string
  course: string
  contact: string
}

export interface AttendanceRecord {
  id: string
  studentId: string
  date: string
  status: 'present' | 'absent' | 'late'
  batch: string
}

export interface TrainingRecord {
  id: string
  date: string
  batch: string
  topic: string
  duration: number
  notes: string
  fileLink: string
}