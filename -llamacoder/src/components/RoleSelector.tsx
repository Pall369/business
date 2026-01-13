import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { User, GraduationCap, Shield } from 'lucide-react'

interface RoleSelectorProps {
  currentRole: 'admin' | 'trainer' | 'student'
  onRoleChange: (role: 'admin' | 'trainer' | 'student') => void
}

export function RoleSelector({ currentRole, onRoleChange }: RoleSelectorProps) {
  const roles = [
    { value: 'admin', label: 'Admin', icon: Shield },
    { value: 'trainer', label: 'Trainer', icon: User },
    { value: 'student', label: 'Student', icon: GraduationCap },
  ]

  return (
    <Select value={currentRole} onValueChange={onRoleChange}>
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {roles.map((role) => {
          const Icon = role.icon
          return (
            <SelectItem key={role.value} value={role.value}>
              <div className="flex items-center space-x-2">
                <Icon className="h-4 w-4" />
                <span>{role.label}</span>
              </div>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}