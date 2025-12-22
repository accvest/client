import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import Login from './pages/Login'
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
	const { isAuthenticated, isLoading } = useAuth0()

	if (isLoading) {
		return (
			<div style={{ 
				display: 'flex', 
				justifyContent: 'center', 
				alignItems: 'center', 
				height: '100vh' 
			}}>
				loading fr fr
			</div>
		)
	}

	return (
		<Routes>
			<Route
				path="/"
				element={
					isAuthenticated ? (
						<Navigate to="/home" replace />
					) : (
						<Navigate to="/login" replace />
					)
				}
			/>
			<Route
				path="/login"
				element={
					isAuthenticated ? (
						<Navigate to="/home" replace />
					) : (
						<Login />
					)
				}
			/>
			<Route
				path="/home"
				element={
					<ProtectedRoute>
						<Home />
					</ProtectedRoute>
				}
			/>
		</Routes>
	)
}

export default App