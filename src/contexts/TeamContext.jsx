import { createContext, useContext, useState, useEffect } from 'react'
import { getUserTeams } from '../services/team'

const TeamContext = createContext(null)
const STORAGE_KEY = 'hs-current-team'

export function TeamProvider({ children }) {
  const [teams, setTeams] = useState([])
  const [currentTeamId, setCurrentTeamId] = useState(() => localStorage.getItem(STORAGE_KEY))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUserTeams().then(list => {
      setTeams(list)
      // Se não tem time salvo, usa o primeiro como default
      if (!currentTeamId || !list.find(t => t.id === currentTeamId)) {
        const firstId = list[0]?.id
        if (firstId) {
          setCurrentTeamId(firstId)
          localStorage.setItem(STORAGE_KEY, firstId)
        }
      }
      setLoading(false)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const switchTeam = (teamId) => {
    if (!teams.find(t => t.id === teamId)) return
    setCurrentTeamId(teamId)
    localStorage.setItem(STORAGE_KEY, teamId)
  }

  const createTeam = ({ name, type, color }) => {
    const newTeam = {
      id: `t-${Date.now()}`,
      name,
      type,
      color,
      plan: 'lite',          // novos times começam no Lite
      role: 'admin',
      totalMembers: 1,
      pendingPosts: 0,
    }
    setTeams(prev => [...prev, newTeam])
    setCurrentTeamId(newTeam.id)
    localStorage.setItem(STORAGE_KEY, newTeam.id)
    return newTeam
  }

  const currentTeam = teams.find(t => t.id === currentTeamId) || teams[0] || null

  return (
    <TeamContext.Provider value={{
      teams, currentTeam, loading,
      switchTeam, createTeam,
    }}>
      {children}
    </TeamContext.Provider>
  )
}

export const useTeam = () => useContext(TeamContext)
