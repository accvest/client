import { useState, useEffect } from 'react'
import { get, set } from 'idb-keyval'
import { toast } from 'sonner'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Trash2 } from 'lucide-react'
import styles from './configure-styles.module.css'

const CATEGORIES = ['ALPHA', 'MODERATE', 'GROWTH'] as const
type Category = typeof CATEGORIES[number]

interface Position {
	id: string
	symbol: string
	category: Category | ''
	riseTarget: string
	lotDepth: string
	lotLimit: string
}

const createEmptyPosition = (): Position => ({
	id: crypto.randomUUID(),
	symbol: '',
	category: '',
	riseTarget: '',
	lotDepth: '',
	lotLimit: '',
})

function Configure() {
	const [positions, setPositions] = useState<Position[]>([])
	const [_, setEditedRows] = useState<Set<string>>(new Set())

	useEffect(() => {
		loadPositions()
	}, [])

	const loadPositions = async () => {
		try {
			// TODO: Replace with API call
			// const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/positions`, {
			//   headers: { Authorization: `Bearer ${token}` }
			// })
			// const data = await response.json()
			
			const stored = await get<Position[]>('accvest_positions')
			if (stored && stored.length > 0) {
				setPositions(stored)
			} else {
				setPositions([createEmptyPosition()])
			}
		} catch (error) {
			console.error('failed to load positions:', error)
			setPositions([createEmptyPosition()])
		}
	}

	const saveToStorage = async (updatedPositions: Position[]) => {
		const nonEmptyPositions = updatedPositions.filter(p => 
			p.symbol || p.category || p.riseTarget || p.lotDepth || p.lotLimit
		)
		await set('accvest_positions', nonEmptyPositions)
	}

	const handleFieldChange = (id: string, field: keyof Position, value: string) => {
		const updatedPositions = positions.map(pos => {
			if (pos.id !== id) return pos

			let processedValue = value

			if (field === 'symbol') {
				processedValue = value.toUpperCase()
			} else if (field === 'riseTarget' && value && !value.endsWith('%')) {
				processedValue = value.replace(/[^0-9.]/g, '')
			} else if (field === 'lotDepth') {
				processedValue = value.replace(/[^0-9]/g, '')
			} else if (field === 'lotLimit') {
				processedValue = value.replace(/[^0-9.]/g, '')
			}

			return { ...pos, [field]: processedValue }
		})

		setPositions(updatedPositions)
		setEditedRows(prev => new Set(prev).add(id))
		saveToStorage(updatedPositions)
	}

	const isRowComplete = (position: Position): boolean => {
		return !!(
			position.symbol &&
			position.category &&
			position.riseTarget &&
			position.lotDepth &&
			position.lotLimit
		)
	}

	const handleSaveRow = async (id: string) => {
		const position = positions.find(p => p.id === id)
		if (!position) return

		try {
			// TODO: API call to save individual position
			// const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/positions/${id}`, {
			//   method: 'PUT',
			//   headers: {
			//     'Content-Type': 'application/json',
			//     Authorization: `Bearer ${token}`
			//   },
			//   body: JSON.stringify(position)
			// })
			// if (!response.ok) throw new Error('save failed')

			setEditedRows(prev => {
				const next = new Set(prev)
				next.delete(id)
				return next
			})
			
			toast.success('Entry saved successfully fr fr')
		} catch (error) {
			console.error('save failed:', error)
			toast.error('Failed to save position no cap')
		}
	}

	const handleAddPosition = () => {
		setPositions([...positions, createEmptyPosition()])
	}

	const handleDeleteRow = async (id: string) => {
		const updatedPositions = positions.filter(p => p.id !== id)
		setPositions(updatedPositions.length > 0 ? updatedPositions : [createEmptyPosition()])
		setEditedRows(prev => {
			const next = new Set(prev)
			next.delete(id)
			return next
		})
		await saveToStorage(updatedPositions)

		// TODO: API call to delete position
		// await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/positions/${id}`, {
		//   method: 'DELETE',
		//   headers: { Authorization: `Bearer ${token}` }
		// })

		toast.success('Entry deleted')
	}

	const formatDisplay = (field: keyof Position, value: string): string => {
		if (field === 'riseTarget' && value) {
			return value.endsWith('%') ? value : `${value}%`
		}
		if (field === 'lotLimit' && value) {
			return value.startsWith('$') ? value : `$${value}`
		}
		return value
	}

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h2 className={styles.title}>Configure AccVest</h2>
				<button className={styles.addBtn} onClick={handleAddPosition}>
					+ Add
				</button>
			</div>

			<div className={styles.tableWrapper}>
				<table className={styles.table}>
					<thead>
						<tr>
							<th>SYMBOL</th>
							<th>CATEGORY</th>
							<th>RISE TARGET</th>
							<th>LOT DEPTH</th>
							<th>LOT LIMIT</th>
							<th>ACTIONS</th>
						</tr>
					</thead>
					<tbody>
						{positions.map((position) => (
							<tr key={position.id}>
								<td>
									<input
										type="text"
										className={styles.input}
										value={position.symbol}
										onChange={(e) => handleFieldChange(position.id, 'symbol', e.target.value)}
										placeholder="AAPL"
									/>
								</td>
								<td>
									<Select
										value={position.category}
										onValueChange={(value) => handleFieldChange(position.id, 'category', value)}
									>
										<SelectTrigger className={styles.selectTrigger}>
											<SelectValue placeholder="Select" />
										</SelectTrigger>
										<SelectContent>
											{CATEGORIES.map((cat) => (
												<SelectItem key={cat} value={cat}>
													{cat}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</td>
								<td>
									<input
										type="text"
										className={styles.input}
										value={formatDisplay('riseTarget', position.riseTarget)}
										onChange={(e) => handleFieldChange(position.id, 'riseTarget', e.target.value)}
										placeholder="5%"
									/>
								</td>
								<td>
									<input
										type="text"
										className={styles.input}
										value={position.lotDepth}
										onChange={(e) => handleFieldChange(position.id, 'lotDepth', e.target.value)}
										placeholder="10"
									/>
								</td>
								<td>
									<input
										type="text"
										className={styles.input}
										value={formatDisplay('lotLimit', position.lotLimit)}
										onChange={(e) => handleFieldChange(position.id, 'lotLimit', e.target.value)}
										placeholder="$1000"
									/>
								</td>
								<td>
									<div className={styles.actions}>
										{isRowComplete(position) && (
											<button
												className={styles.saveBtn}
												onClick={() => handleSaveRow(position.id)}
											>
												Save
											</button>
										)}
										<button
											className={styles.deleteBtn}
											onClick={() => handleDeleteRow(position.id)}
											title="Delete position"
										>
											<Trash2 size={16} />
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default Configure