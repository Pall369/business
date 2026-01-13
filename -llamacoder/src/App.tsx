import { useState, useEffect } from 'react'
import { RoleSelector } from './components/RoleSelector'
import { AdminDashboard } from './components/Dashboard/AdminDashboard'
import { TrainerDashboard } from './components/Dashboard/TrainerDashboard'
import { StudentDashboard } from './components/Dashboard/StudentDashboard'
import { useDarkMode } from './hooks/useDarkMode'
import { initializeData } from './lib/storage'
import { Moon, Sun } from 'lucide-react'
import { Button } from './components/ui/button'

type Role = 'admin' | 'trainer' | 'student'

function App() {
  const [currentRole, setCurrentRole] = useState<Role>('admin')
  const { isDark, toggleDark } = useDarkMode()

  useEffect(() => {
    initializeData()
  }, [])

  const renderDashboard = () => {
    switch (currentRole) {
      case 'admin':
        return <AdminDashboard />
      case 'trainer':
        return <TrainerDashboard />
      case 'student':
        return <StudentDashboard />
      default:
        return <AdminDashboard />
    }
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Attendance Tracker
              </h1>
              <RoleSelector currentRole={currentRole} onRoleChange={setCurrentRole} />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDark}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderDashboard()}
      </main>
    </div>
  )
}

export default App