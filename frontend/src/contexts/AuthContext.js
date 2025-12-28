import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

const BACKEND_URL = 'http://localhost:8000'

const handleResponse = async (response) => {
    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.error || 'Request failed')
    }
    return data
}

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('accessToken')
        const storedUser = localStorage.getItem('user')

        if (token && storedUser) {
            setIsAuthenticated(true)
            setUser(JSON.parse(storedUser))
        }
    }, [])

    const login = async (credentials) => {
        setLoading(true)
        try {
            const response = await fetch(`${BACKEND_URL}/api/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
                credentials: 'include',
            })

            const data = await handleResponse(response)
            setIsAuthenticated(true)
            setUser(data.user)
            if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken)
                localStorage.setItem('user', JSON.stringify(data.user)) // Store user data
            }
            return data
        } finally {
            setLoading(false)
        }
    }

    const signup = async (userData) => {
        setLoading(true)
        try {
            const response = await fetch(`${BACKEND_URL}/api/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
                credentials: 'include',
            })

            const data = await handleResponse(response)
            setIsAuthenticated(true)
            setUser(data.user)
            if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken)
                localStorage.setItem('user', JSON.stringify(data.user)) // Store user data
            }
            return data
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        try {
            await fetch(`${BACKEND_URL}/api/logout/`, {
                method: 'POST',
                credentials: 'include',
            })
            setIsAuthenticated(false)
            setUser(null)
            localStorage.removeItem('accessToken')
            localStorage.removeItem('user') // Clear user data
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                login,
                logout,
                signup,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
