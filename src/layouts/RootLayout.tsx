import { Link, NavLink, Outlet } from "react-router-dom";

export default function RootLayout() {
	return (
		<div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
			<header>
				<div className="container" style={{ padding: "12px 0", borderBottom: "1px solid var(--color-border)" }}>
					<div className="flex items-center gap-md">
						<Link to="/" style={{ textDecoration: "none", color: "var(--color-text-primary)", fontWeight: 700 }}>
							ColorVerse
						</Link>
						<nav className="flex gap-md">
							<NavLink to="/" end style={({ isActive }) => ({ color: isActive ? "var(--color-primary)" : "var(--color-text-primary)" })}>Home</NavLink>
							<NavLink to="/picker" style={({ isActive }) => ({ color: isActive ? "var(--color-primary)" : "var(--color-text-primary)" })}>Picker</NavLink>
							<NavLink to="/convert" style={({ isActive }) => ({ color: isActive ? "var(--color-primary)" : "var(--color-text-primary)" })}>Convert</NavLink>
							<NavLink to="/theory" style={({ isActive }) => ({ color: isActive ? "var(--color-primary)" : "var(--color-text-primary)" })}>Theory</NavLink>
							<NavLink to="/image" style={({ isActive }) => ({ color: isActive ? "var(--color-primary)" : "var(--color-text-primary)" })}>Image</NavLink>
						</nav>
					</div>
				</div>
			</header>
			<main className="section">
				<div className="container">
					<Outlet />
				</div>
			</main>
			<footer>
				<div className="container" style={{ padding: "12px 0", borderTop: "1px solid var(--color-border)", textAlign: "center", color: "var(--color-text-secondary)" }}>
					© {new Date().getFullYear()} ColorVerse
				</div>
			</footer>
		</div>
	);
}


