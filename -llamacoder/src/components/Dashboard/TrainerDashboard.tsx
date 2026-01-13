import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { MarkAttendanceModal } from '../Attendance/MarkAttendanceModal'
import { LogTrainingForm } from '../Training/LogTrainingForm'
import { Calendar, Users, BookOpen, Clock } from 'lucide-react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { TrainingRecord } from '../../types'

export function TrainerDashboard() {
  const [showAttendanceModal, setShowAttendanceModal] = useState(false)
  const [showTrainingForm, setShowTrainingForm] = useState(false)
  const [trainings] = useLocalStorage<TrainingRecord[]>('trainings', [])

  const todaySchedule = [
    { time: '09:00 AM - 10:00 AM', batch: 'BCA-Sem3', topic: 'React Hooks', logged: true },
    { time: '11:00 AM - 01:00 PM', batch: 'Python-BatchA', topic: 'Data Structures', logged: false },
    { time: '02:00 PM - 03:00 PM', batch: 'MCA-Sem1', topic: 'Database Design', logged: false },
  ]

  const todayTrainings = trainings.filter(t => {
    const trainingDate = new Date(t.date).toDateString()
    const today = new Date().toDateString()
    return trainingDate === today
  })

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span>Mark Attendance</span>
            </CardTitle>
            <CardDescription>
              Record attendance for today's sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setShowAttendanceModal(true)}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Mark Attendance Now
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span>Log Training</span>
            </CardTitle>
            <CardDescription>
              Document training topics and materials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setShowTrainingForm(true)}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Log Training Session
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Today's Schedule</span>
          </CardTitle>
          <CardDescription>Your training sessions for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todaySchedule.map((session, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-4">
                  <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {session.batch}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {session.time}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {session.topic}
                  </div>
                  {session.logged ? (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                      Logged
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full">
                      Pending
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Training Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Training Logs</CardTitle>
          <CardDescription>Topics covered in recent sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todayTrainings.slice(-5).reverse().map((training, index) => (
              <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {training.topic}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {training.batch} • {training.duration} hours
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(training.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {showAttendanceModal && (
        <MarkAttendanceModal onClose={() => setShowAttendanceModal(false)} />
      )}

      {showTrainingForm && (
        <LogTrainingForm onClose={() => setShowTrainingForm(false)} />
      )}
    </div>
  )
}