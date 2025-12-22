import { useAuth0 } from '@auth0/auth0-react'
import styles from './home-styles.module.css'

function Home() {
	const { user, logout } = useAuth0()

	const handleLogout = () => {
		logout({ logoutParams: { returnTo: window.location.origin } })
	}

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h1 className={styles.greeting}>Welcome back, {user?.email}</h1>
				<button className={styles.logoutButton} onClick={handleLogout}>
					Logout
				</button>
			</div>
		</div>
	)
}

export default Home