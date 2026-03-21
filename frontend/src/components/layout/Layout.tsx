import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Apply user's custom theme color
  useEffect(() => {
    if (user?.primaryColor) {
      document.documentElement.style.setProperty('--primary', user.primaryColor);
    } else {
      // Reset to default if no custom color
      document.documentElement.style.removeProperty('--primary');
    }
  }, [user?.primaryColor]);

  const handleLogout = async () => {
    try {
      await logout();
      addToast({
        type: 'success',
        message: 'Successfully logged out',
      });
      navigate('/login');
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Failed to logout',
      });
    }
  };

  return (
    <div className={styles.layout}>
      <a href="#main-content" className={styles.skipToMain}>
        Skip to main content
      </a>
      
      <header className={styles.header} role="banner">
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            {user?.companyLogo ? (
              <img
                src={user.companyLogo}
                alt={user.companyName ||  'Company Logo'}
                className={styles.logoImage}
                style={{ maxHeight: '40px', objectFit: 'contain' }}
              />
            ) : (
              <>
                <svg
                  className={styles.logoIcon}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h1 className={styles.logoText}>
                  {user?.companyName || 'Patient Records'}
                </h1>
              </>
            )}
          </div>

          <nav className={styles.nav} role="navigation" aria-label="Main navigation">
            <button
              onClick={() => navigate('/')}
              className={styles.navButton}
              aria-label="Dashboard"
            >
              <svg
                className={styles.navIcon}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Dashboard
            </button>
            <button
              onClick={() => navigate('/profile')}
              className={styles.navButton}
              aria-label="Profile Settings"
            >
              <svg
                className={styles.navIcon}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Profile
            </button>
          </nav>

          <div className={styles.userSection}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.fullName}</span>
              <span className={styles.userEmail}>{user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className={styles.logoutButton}
              aria-label="Logout from your account"
            >
              <svg
                className={styles.buttonIcon}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main id="main-content" className={styles.main} role="main" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
