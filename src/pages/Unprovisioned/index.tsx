import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import styles from './unprovisioned-styles.module.css'

function Unprovisioned() {
	const { logout } = useAuth0()
	const navigate = useNavigate()

	const handleLogout = () => {
		logout({ logoutParams: { returnTo: window.location.origin } })
	}

	const handleRefresh = () => {
		navigate('/home')
	}

	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<div className={styles.spinner}></div>
				<h1 className={styles.title}>Your instance is still being provisioned</h1>
				<p className={styles.subtitle}>please wait fr fr this might take a minute or two</p>
				
				<div className={styles.actions}>
					<button className={styles.refreshBtn} onClick={handleRefresh}>
						Check Again
					</button>
					<button className={styles.logoutBtn} onClick={handleLogout}>
						Logout
					</button>
				</div>
			</div>
		</div>
	)
}

export default Unprovisioned