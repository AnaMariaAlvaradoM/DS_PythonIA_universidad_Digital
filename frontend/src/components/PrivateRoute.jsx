import { Navigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children, rolesPermitidos }) {


    const { usuario } = useAuth();

    if (!usuario) {
        return <Navigate to="/login" replace />;

    }

    if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
        return <Navigate to="/no-autorizado" replace />;

    }
    return children;
}