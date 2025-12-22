import styles from './settings-styles.module.css'

function Settings() {
	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Settings</h2>
			<p className={styles.description}>adjust your preferences here bestie</p>
		</div>
	)
}

export default Settings