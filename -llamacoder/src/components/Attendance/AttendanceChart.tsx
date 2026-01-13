import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { AttendanceRecord } from '../../types'

interface AttendanceChartProps {
  studentId: string
}

export function AttendanceChart({ studentId }: AttendanceChartProps) {
  const [attendance] = useLocalStorage<AttendanceRecord[]>('attendance', [])

  // Generate last 30 days data
  const generateChartData = () => {
    const data = []
    const today = new Date()
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayAttendance = attendance.find(a => 
        a.studentId === studentId && a.date === dateStr
      )
      
      data.push({
        date: date.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
        present: dayAttendance && (dayAttendance.status === 'present' || dayAttendance.status === 'late') ? 1 : 0,
        absent: dayAttendance && dayAttendance.status === 'absent' ? 1 : 0
      })
    }
    
    return data
  }

  const chartData = generateChartData()

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            interval={4}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            domain={[0, 1]}
            ticks={[0, 1]}
            tickFormatter={(value) => value === 1 ? 'Present' : 'Absent'}
          />
          <Tooltip 
            formatter={(value: number) => value === 1 ? 'Present' : 'Absent'}
          />
          <Bar dataKey="present" fill="#10b981" />
          <Bar dataKey="absent" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}