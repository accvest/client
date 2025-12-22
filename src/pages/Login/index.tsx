import { useAuth0 } from '@auth0/auth0-react'
import styles from './login-styles.module.css'

function Login() {
	const { loginWithRedirect } = useAuth0()

	const handleLogin = () => {
		loginWithRedirect()
	}

	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<h1 className={styles.title}>Login to continue to AccVest</h1>
				<button className={styles.loginButton} onClick={handleLogin}>
					Login
				</button>
			</div>
		</div>
	)
}

export default Login