import { useState, useEffect, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

interface ProvisionedRouteProps {
	children: ReactNode
}

interface InstanceResponse {
	status: 'provisioned' | 'unprovisioned'
	instance_endpoint?: string | null
	email?: string
	createdAt?: string
	subId?: string
}

function ProvisionedRoute({ children }: ProvisionedRouteProps) {
	const { getAccessTokenSilently } = useAuth0()
	const [isProvisioned, setIsProvisioned] = useState<boolean | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const checkProvisionStatus = async () => {
			try {
				const token = await getAccessTokenSilently()
				const apiUrl = import.meta.env.VITE_API_BASE_URL
				
				const response = await fetch(`${apiUrl}/api/instance`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})

				if (!response.ok) {
					throw new Error('api call failed no cap')
				}

				const data: InstanceResponse = await response.json()
				setIsProvisioned(data.status === 'provisioned')
			} catch (error) {
				console.error('provision check failed:', error)
				setIsProvisioned(false)
			} finally {
				setIsLoading(false)
			}
		}

		checkProvisionStatus()
	}, [getAccessTokenSilently])

	if (isLoading) {
		return (
			<div style={{ 
				display: 'flex', 
				justifyContent: 'center', 
				alignItems: 'center', 
				height: '100vh' 
			}}>
				checking your instance fr fr
			</div>
		)
	}

	if (isProvisioned === false) {
		return <Navigate to="/unprovisioned" replace />
	}

	return <>{children}</>
}

export default ProvisionedRoute