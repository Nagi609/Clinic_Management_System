import { useEffect } from 'react'
import { getCurrentUser } from '@/lib/constants'

// This hook ensures the database is initialized by making a simple API call
export function useDatabaseInit() {
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const user = getCurrentUser()
        if (user) {
          // Make a simple API call to trigger database initialization
          await fetch('/api/patients', {
            headers: { 'x-user-id': user.id },
          }).catch(() => {
            // Ignore errors - we just need to trigger initialization
          })
        }
      } catch (error) {
        // Silently fail - this is just for initialization
        console.debug('Database initialization attempted')
      }
    }

    initializeDatabase()
  }, [])
}
