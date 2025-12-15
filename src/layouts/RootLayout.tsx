import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';

export default function RootLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((v) => !v);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <header>
        <div
          className="container"
          style={{
            padding: '12px 0',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <div className="flex items-center gap-md">
            <Link
              to="/"
              style={{
                textDecoration: 'none',
                color: 'var(--color-text-primary)',
                fontWeight: 700,
              }}
            >
              ColorVerse
            </Link>
            <div style={{ marginLeft: 'auto', position: 'relative' }}>
              <button
                onClick={toggleMenu}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="btn"
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                }}
              >
                メニュー
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.16, ease: 'easeOut' }}
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      boxShadow: 'var(--shadow-md)',
                      minWidth: 220,
                      padding: '8px',
                      zIndex: 1060,
                    }}
                    role="menu"
                  >
                    <nav style={{ display: 'grid', gap: 8 }}>
                      <NavLink
                        to="/"
                        end
                        style={({ isActive }) => ({
                          color: isActive ? 'var(--color-primary)' : 'var(--color-text-primary)',
                        })}
                        onClick={closeMenu}
                      >
                        Home
                      </NavLink>
                      <NavLink
                        to="/picker"
                        style={({ isActive }) => ({
                          color: isActive ? 'var(--color-primary)' : 'var(--color-text-primary)',
                        })}
                        onClick={closeMenu}
                      >
                        Picker
                      </NavLink>
                      <NavLink
                        to="/convert"
                        style={({ isActive }) => ({
                          color: isActive ? 'var(--color-primary)' : 'var(--color-text-primary)',
                        })}
                        onClick={closeMenu}
                      >
                        Convert
                      </NavLink>
                      <NavLink
                        to="/theory"
                        style={({ isActive }) => ({
                          color: isActive ? 'var(--color-primary)' : 'var(--color-text-primary)',
                        })}
                        onClick={closeMenu}
                      >
                        Theory
                      </NavLink>
                      <NavLink
                        to="/image"
                        style={({ isActive }) => ({
                          color: isActive ? 'var(--color-primary)' : 'var(--color-text-primary)',
                        })}
                        onClick={closeMenu}
                      >
                        Image
                      </NavLink>
                    <NavLink
                      to="/camera"
                      style={({ isActive }) => ({
                        color: isActive ? 'var(--color-primary)' : 'var(--color-text-primary)',
                      })}
                      onClick={closeMenu}
                    >
                      Camera
                    </NavLink>
                    </nav>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  onClick={closeMenu}
                  aria-hidden="true"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.16 }}
                  style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'black',
                    zIndex: 1050,
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>
      <main className="section">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <footer>
        <div
          className="container"
          style={{
            padding: '12px 0',
            borderTop: '1px solid var(--color-border)',
            textAlign: 'center',
            color: 'var(--color-text-secondary)',
          }}
        >
          © {new Date().getFullYear()} ColorVerse
        </div>
      </footer>
    </div>
  );
}
