import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1, padding: 0 }}>
                {/* Remove global container padding to allow full-width hero */}
                <div style={{ width: '100%' }}>
                    <Outlet />
                </div>
            </main>
            <footer style={{
                backgroundColor: 'var(--surface-color)',
                borderTop: '1px solid var(--border-color)',
                padding: '0.8rem 0',
                marginTop: 'auto'
            }}>
                <div className="container" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    &copy; {new Date().getFullYear()} Mossy Store. All rights reserved.
                </div>
            </footer>
        </div >
    );
};

export default Layout;
