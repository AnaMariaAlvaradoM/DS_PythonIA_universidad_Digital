import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const rol   = localStorage.getItem('rol');
        const id    = localStorage.getItem('usuario_id');

        if (token) {

            setUsuario({ token, rol, id });
        }
    }, []);

    const login = (data) => {

        localStorage.setItem('token',      data.access_token);
        localStorage.setItem('rol',        data.rol);
        localStorage.setItem('usuario_id', String(data.usuario_id));

        setUsuario({
            token: data.access_token,
            rol:   data.rol,
            id:    data.usuario_id,
        });

    };

    const logout = () => {
        localStorage.clear();
        setUsuario(null);
    };

    return (
        <AuthContext.Provider value={{ usuario, login, logout }}>
            {children}
            {}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);