import { Outlet, useLocation, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import { getRoleFromToken } from '../../utils/auth';

const Layout = () => {
    const location = useLocation();
    const isAdminMode = location.pathname.startsWith('/admin');

    if (isAdminMode) {
        return <Outlet />;
    }

    const role = getRoleFromToken();
    if (role === 'ROLE_PENDING' && !location.pathname.startsWith('/signup/complete') && !location.pathname.startsWith('/auth/callback')) {
        return <Navigate to="/signup/complete" replace />;
    }

    return (
        <div className="flex flex-col min-h-screen bg-background-color text-text-main font-sans">
            <Navbar />

            <main className="flex-1 w-full relative">
                <div className="w-full h-full">
                    <Outlet />
                </div>
            </main>

            <footer className="bg-surface-color border-t border-border-color py-4 mt-auto">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-text-muted text-sm font-medium">
                        &copy; {new Date().getFullYear()} Mossy Store. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
