import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog'
import { Badge } from '../ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Users, Calendar, TrendingUp, AlertCircle, Plus, Edit, Trash2, Save, X } from 'lucide-react'
import { BatchReport } from '../Reports/BatchReport'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { Student, AttendanceRecord } from '../../types'

export function AdminDashboard() {
  const [students, setStudents] = useLocalStorage<Student[]>('students', [])
  const [attendance, setAttendance] = useLocalStorage<AttendanceRecord[]>('attendance', [])
  const [showBatchReport, setShowBatchReport] = useState(false)
  const [showStudentForm, setShowStudentForm] = useState(false)
  const [showBatchForm, setShowBatchForm] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [newBatch, setNewBatch] = useState('')
  const [batches, setBatches] = useLocalStorage<string[]>('batches', [])
  
  const [studentForm, setStudentForm] = useState({
    name: '',
    batch: '',
    course: '',
    contact: ''
  })

  const getBatchCount = () => {
    const uniqueBatches = new Set(students.map(s => s.batch))
    return uniqueBatches.size || 1
  }

  const todayAttendance = attendance.filter(record => {
    const recordDate = new Date(record.date).toDateString()
    const today = new Date().toDateString()
    return recordDate === today
  })

  const attendanceRate = students.length > 0 
    ? Math.round((todayAttendance.filter(a => a.status === 'present' || a.status === 'late').length / 
                  (students.length * getBatchCount())) * 100)
    : 0

  const calculateAttendancePercentage = (studentId: string): number => {
    const studentRecords = attendance.filter(record => record.studentId === studentId)
    if (studentRecords.length === 0) return 100
    
    const presentDays = studentRecords.filter(record => 
      record.status === 'present' || record.status === 'late'
    ).length
    
    return Math.round((presentDays / studentRecords.length) * 100)
  }

  const handleAddStudent = () => {
    if (studentForm.name && studentForm.batch && studentForm.course && studentForm.contact) {
      const newStudent: Student = {
        id: Date.now().toString(),
        ...studentForm
      }
      
      if (editingStudent) {
        setStudents(students.map(s => s.id === editingStudent.id ? { ...newStudent, id: editingStudent.id } : s))
        setEditingStudent(null)
      } else {
        setStudents([...students, newStudent])
      }
      
      setStudentForm({ name: '', batch: '', course: '', contact: '' })
      setShowStudentForm(false)
    }
  }

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student)
    setStudentForm({
      name: student.name,
      batch: student.batch,
      course: student.course,
      contact: student.contact
    })
    setShowStudentForm(true)
  }

  const handleDeleteStudent = (studentId: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter(s => s.id !== studentId))
      setAttendance(attendance.filter(a => a.studentId !== studentId))
    }
  }

  const handleAddBatch = () => {
    if (newBatch && !batches.includes(newBatch)) {
      setBatches([...batches, newBatch])
      setNewBatch('')
      setShowBatchForm(false)
    }
  }

  const handleDeleteBatch = (batch: string) => {
    if (confirm(`Are you sure you want to delete batch "${batch}"? This will also delete all students in this batch.`)) {
      setBatches(batches.filter(b => b !== batch))
      const studentsInBatch = students.filter(s => s.batch === batch)
      setStudents(students.filter(s => s.batch !== batch))
      setAttendance(attendance.filter(a => !studentsInBatch.some(s => s.id === a.studentId)))
    }
  }

  const getBatchStats = (batch: string) => {
    const batchStudents = students.filter(s => s.batch === batch)
    const totalStudents = batchStudents.length
    const avgAttendance = totalStudents > 0 
      ? Math.round(batchStudents.reduce((sum, s) => sum + calculateAttendancePercentage(s.id), 0) / totalStudents)
      : 0
    return { totalStudents, avgAttendance }
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {students.length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900 dark:text-green-100">
              Today's Attendance
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {attendanceRate}%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-100">
              Active Batches
            </CardTitle>
            <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {getBatchCount()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900 dark:text-orange-100">
              Low Attendance
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {students.filter(s => calculateAttendancePercentage(s.id) < 70).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Batches Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Batch Management</CardTitle>
                <CardDescription>Manage training batches</CardDescription>
              </div>
              <Button onClick={() => setShowBatchForm(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Batch
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {batches.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No batches added yet</p>
              ) : (
                batches.map((batch) => {
                  const stats = getBatchStats(batch)
                  return (
                    <div key={batch} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{batch}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {stats.totalStudents} students • {stats.avgAttendance}% avg attendance
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={stats.avgAttendance >= 85 ? 'default' : stats.avgAttendance >= 70 ? 'secondary' : 'destructive'}>
                          {stats.avgAttendance}%
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteBatch(batch)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <Button onClick={() => setShowStudentForm(true)} className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Add New Student
              </Button>
              <Button onClick={() => setShowBatchReport(true)} variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Batch Reports
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Training
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Export Student Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Student Management</CardTitle>
              <CardDescription>View and manage all students</CardDescription>
            </div>
            <Button onClick={() => setShowStudentForm(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No students added yet. Click "Add Student" to get started.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => {
                  const attendancePercent = calculateAttendancePercentage(student.id)
                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.batch}</TableCell>
                      <TableCell>{student.course}</TableCell>
                      <TableCell>{student.contact}</TableCell>
                      <TableCell>
                        <Badge variant={attendancePercent >= 85 ? 'default' : attendancePercent >= 70 ? 'secondary' : 'destructive'}>
                          {attendancePercent}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditStudent(student)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteStudent(student.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Student Form Dialog */}
      <Dialog open={showStudentForm} onOpenChange={setShowStudentForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingStudent ? 'Edit Student' : 'Add New Student'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={studentForm.name}
                onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                placeholder="Enter student name"
              />
            </div>
            <div>
              <Label htmlFor="batch">Batch</Label>
              <Input
                id="batch"
                value={studentForm.batch}
                onChange={(e) => setStudentForm({ ...studentForm, batch: e.target.value })}
                placeholder="e.g., BCA-Sem3"
              />
            </div>
            <div>
              <Label htmlFor="course">Course</Label>
              <Input
                id="course"
                value={studentForm.course}
                onChange={(e) => setStudentForm({ ...studentForm, course: e.target.value })}
                placeholder="e.g., BCA"
              />
            </div>
            <div>
              <Label htmlFor="contact">Contact</Label>
              <Input
                id="contact"
                value={studentForm.contact}
                onChange={(e) => setStudentForm({ ...studentForm, contact: e.target.value })}
                placeholder="Email or phone"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowStudentForm(false)
              setEditingStudent(null)
              setStudentForm({ name: '', batch: '', course: '', contact: '' })
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddStudent}>
              {editingStudent ? <Save className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              {editingStudent ? 'Update' : 'Add'} Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Batch Form Dialog */}
      <Dialog open={showBatchForm} onOpenChange={setShowBatchForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Batch</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="batchName">Batch Name</Label>
              <Input
                id="batchName"
                value={newBatch}
                onChange={(e) => setNewBatch(e.target.value)}
                placeholder="e.g., Python-BatchA"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowBatchForm(false)
              setNewBatch('')
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddBatch}>
              <Plus className="h-4 w-4 mr-2" />
              Add Batch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showBatchReport && (
        <BatchReport onClose={() => setShowBatchReport(false)} />
      )}
    </div>
  )
}