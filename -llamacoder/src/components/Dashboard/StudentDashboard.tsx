import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Alert, AlertDescription } from '../ui/alert'
import { TrendingUp, AlertTriangle, Calendar, BookOpen } from 'lucide-react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { Student, AttendanceRecord, TrainingRecord } from '../../types'
import { AttendanceChart } from '../Attendance/AttendanceChart'

export function StudentDashboard() {
  const [students] = useLocalStorage<Student[]>('students', [])
  const [attendance] = useLocalStorage<AttendanceRecord[]>('attendance', [])
  const [trainings] = useLocalStorage<TrainingRecord[]>('trainings', [])

  // Simulate current student (first student in list)
  const currentStudent = students[0] || { id: '1', name: 'John Doe', batch: 'BCA-Sem3', course: 'BCA', contact: 'john@example.com' }
  
  const studentAttendance = attendance.filter(record => record.studentId === currentStudent.id)
  const attendancePercentage = studentAttendance.length > 0 
    ? Math.round((studentAttendance.filter(a => a.status === 'present' || a.status === 'late').length / studentAttendance.length) * 100)
    : 100

  const studentTrainings = trainings.filter(training => {
    const attendanceRecord = attendance.find(a => 
      a.studentId === currentStudent.id && 
      a.date === training.date && 
      (a.status === 'present' || a.status === 'late')
    )
    return attendanceRecord
  })

  const isLowAttendance = attendancePercentage < 70

  return (
    <div className="space-y-6">
      {/* Student Info Card */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-900 dark:text-white">
            Welcome back, {currentStudent.name}!
          </CardTitle>
          <CardDescription>
            {currentStudent.course} • {currentStudent.batch}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Attendance Alert */}
      {isLowAttendance && (
        <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            Your attendance is below 70%. Please ensure regular attendance to maintain good academic standing.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendancePercentage}%</div>
            <p className="text-xs text-muted-foreground">
              {studentAttendance.length} days recorded
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions Attended</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentTrainings.length}</div>
            <p className="text-xs text-muted-foreground">
              Training sessions completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Badge variant={attendancePercentage >= 85 ? "default" : attendancePercentage >= 70 ? "secondary" : "destructive"}>
              {attendancePercentage >= 85 ? "Excellent" : attendancePercentage >= 70 ? "Good" : "Needs Improvement"}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Keep up the great work!
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Attendance Trend</CardTitle>
          <CardDescription>Your attendance over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <AttendanceChart studentId={currentStudent.id} />
        </CardContent>
      </Card>

      {/* Recent Training Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Recent Training Topics</span>
          </CardTitle>
          <CardDescription>Topics you've attended recently</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {studentTrainings.slice(-5).reverse().map((training, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {training.topic}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {training.duration} hours • {training.notes ? 'Notes available' : 'No notes'}
                  </div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(training.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}