import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider }          from './context/AuthContext';

import PrivateRoute              from './components/PrivateRoute';
import Login                    from './pages/Login';
import DashboardAdmin           from './pages/DashboardAdmin';
import DashboardEstudiante      from './pages/DashboardEstudiante';

export default function App() {
    return (
        <AuthProvider>
            {}

            <BrowserRouter>
                <Routes>
                    {}
                    <Route path="/login" element={<Login />} />
                    {}

                    {}
                    <Route
                        path="/admin"
                        element={
                            <PrivateRoute rolesPermitidos={['admin']}>
                                <DashboardAdmin />
                            </PrivateRoute>

                        }
                    />

                    {}
                    <Route
                        path="/estudiante"
                        element={
                            <PrivateRoute rolesPermitidos={['estudiante']}>
                                <DashboardEstudiante />
                            </PrivateRoute>
                        }
                    />

                    {}
                    <Route path="/" element={<Navigate to="/login" />} />
                    {}

                    <Route
                        path="/no-autorizado"
                        element={
                            <div className="min-h-screen flex items-center justify-center bg-red-50">
                                <div className="text-center">
                                    <h1 className="text-4xl font-bold text-red-700 mb-4">403</h1>
                                    <p className="text-red-600 text-xl">No tienes permiso para ver esta página.</p>
                                </div>
                            </div>
                        }
                    />

                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}