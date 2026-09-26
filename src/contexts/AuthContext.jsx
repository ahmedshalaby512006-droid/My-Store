import { useState } from 'react'
import { AuthContext } from './AuthContextValue.js'

const USERS_KEY = 'atelier-users'
const SESSION_KEY = 'atelier-session'

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]') } catch { return [] }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null') } catch { return null }
  })

  const signIn = (account) => {
    const activeUser = { name: account.name, email: account.email }
    localStorage.setItem(SESSION_KEY, JSON.stringify(activeUser))
    setUser(activeUser)
    return activeUser
  }

  const register = ({ name, email, password }) => {
    const users = getUsers()
    if (users.some((entry) => entry.email.toLowerCase() === email.toLowerCase())) return { error: 'An account with this email already exists.' }
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, { name, email, password }]))
    return { user: signIn({ name, email }) }
  }

  const login = (email, password) => {
    const account = getUsers().find((entry) => entry.email.toLowerCase() === email.toLowerCase() && entry.password === password)
    return account ? { user: signIn(account) } : { error: 'Email or password is incorrect.' }
  }

  const logout = () => { localStorage.removeItem(SESSION_KEY); setUser(null) }
  return <AuthContext.Provider value={{ user, register, login, logout }}>{children}</AuthContext.Provider>
}

