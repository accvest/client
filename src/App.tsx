import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import Login from './pages/Login'
import DashboardLayout from './components/DashboardLayout'
import Overview from './pages/Home/Overview'
import AlpacaConnect from './pages/Home/AlpacaConnect'
import Configure from './pages/Home/Configure'
import Settings from './pages/Home/Settings'
import Upgrade from './pages/Home/Upgrade'
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
						<DashboardLayout />
					</ProtectedRoute>
				}
			>
				<Route index element={<Overview />} />
				<Route path="overview" element={<Overview />} />
				<Route path="alpaca-connect" element={<AlpacaConnect />} />
				<Route path="configure" element={<Configure />} />
				<Route path="settings" element={<Settings />} />
				<Route path="upgrade" element={<Upgrade />} />
			</Route>
		</Routes>
	)
}

export default App