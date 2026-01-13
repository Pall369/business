import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { Student, AttendanceRecord } from '../../types'
import { Download, Printer } from 'lucide-react'

interface BatchReportProps {
  onClose: () => void
}

export function BatchReport({ onClose }: BatchReportProps) {
  const [students] = useLocalStorage<Student[]>('students', [])
  const [attendance] = useLocalStorage<AttendanceRecord[]>('attendance', [])

  const calculateAttendancePercentage = (studentId: string): number => {
    const studentRecords = attendance.filter(record => record.studentId === studentId)
    if (studentRecords.length === 0) return 100
    
    const presentDays = studentRecords.filter(record => 
      record.status === 'present' || record.status === 'late'
    ).length
    
    return Math.round((presentDays / studentRecords.length) * 100)
  }

  const getStatusColor = (percentage: number) => {
    if (percentage >= 85) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    if (percentage >= 70) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  }

  const getStatusText = (percentage: number) => {
    if (percentage >= 85) return 'Excellent'
    if (percentage >= 70) return 'Good'
    return 'Low'
  }

  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Batch', 'Course', 'Attendance %', 'Status'],
      ...students.map(student => [
        student.name,
        student.batch,
        student.course,
        calculateAttendancePercentage(student.id) + '%',
        getStatusText(calculateAttendancePercentage(student.id))
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `batch-report-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Batch Attendance Report</DialogTitle>
          <DialogDescription>
            Attendance overview for all students as of {new Date().toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {students.filter(s => calculateAttendancePercentage(s.id) >= 85).length}
              </div>
              <div className="text-sm text-green-800 dark:text-green-200">Excellent</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {students.filter(s => {
                  const p = calculateAttendancePercentage(s.id)
                  return p >= 70 && p < 85
                }).length}
              </div>
              <div className="text-sm text-yellow-800 dark:text-yellow-200">Good</div>
            </div>
            <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {students.filter(s => calculateAttendancePercentage(s.id) < 70).length}
              </div>
              <div className="text-sm text-red-800 dark:text-red-200">Low Attendance</div>
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Attendance %</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map(student => {
                  const percentage = calculateAttendancePercentage(student.id)
                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.batch}</TableCell>
                      <TableCell>{student.course}</TableCell>
                      <TableCell>{percentage}%</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(percentage)}>
                          {getStatusText(percentage)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}