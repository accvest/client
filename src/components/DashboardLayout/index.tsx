import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import styles from './dashboard-layout-styles.module.css'

const navItems = [
	{ label: 'Home / Overview', path: '/home/overview' },
	{ label: 'Alpaca Connect', path: '/home/alpaca-connect' },
	{ label: 'Configure', path: '/home/configure' },
	{ label: 'AccuVest', path: '/home/accvest' },
	{ label: 'Settings', path: '/home/settings' },
	{ label: 'Upgrade +', path: '/home/upgrade' },
]

function DashboardLayout() {
	const { user, logout } = useAuth0()
	const navigate = useNavigate()
	const location = useLocation()
	const [mobileOpen, setMobileOpen] = useState(false)

	const handleLogout = () => {
		logout({ logoutParams: { returnTo: window.location.origin } })
	}

	const handleNavClick = (path: string) => {
		navigate(path)
		setMobileOpen(false)
	}

	const isActive = (path: string) => {
        if (path === '/home/overview') {
            return location.pathname === '/home' || location.pathname === '/home/overview'
        }
        if (path === '/home') return false
        return location.pathname === path
    }

	const NavContent = () => (
		<nav className={styles.nav}>
			{navItems.map((item) => (
				<button
					key={item.path}
					className={`${styles.navItem} ${isActive(item.path) ? styles.navItemActive : ''}`}
					onClick={() => handleNavClick(item.path)}
				>
					{item.label}
				</button>
			))}
		</nav>
	)

	return (
		<div className={styles.container}>
			{/* Desktop Sidebar */}
			<aside className={styles.sidebar}>
				<div className={styles.logo}>LOGO</div>
				<NavContent />
			</aside>

			{/* Main Content */}
			<div className={styles.main}>
				{/* Header */}
				<header className={styles.header}>
					{/* Mobile Menu Button */}
					<Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
						<SheetTrigger asChild>
							<Button variant="ghost" size="icon" className={styles.mobileMenuBtn}>
								<Menu />
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className={styles.mobileSheet}>
							<div className={styles.logo}>LOGO</div>
							<NavContent />
						</SheetContent>
					</Sheet>

					<h1 className={styles.welcomeText}>WELCOME &lt;{user?.email?.split('@')[0]?.toUpperCase() || 'USER'}&gt;</h1>
					
					<button className={styles.logoutBtn} onClick={handleLogout}>
						Logout
					</button>
				</header>

				{/* Content Area */}
				<main className={styles.content}>
					<Outlet />
				</main>
			</div>
		</div>
	)
}

export default DashboardLayout