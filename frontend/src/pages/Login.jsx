import { useState }     from 'react';
import { useNavigate }  from 'react-router-dom';

import { useAuth }      from '../context/AuthContext';

import { loginUsuario } from '../services/api';

export default function Login() {

    const [email,    setEmail]    = useState('');
    const [password, setPassword] = useState('');

    const [error,   setError]   = useState('');

    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate  = useNavigate();

    const handleSubmit = async () => {
        setError('');

        setLoading(true);

        try {
            const response = await loginUsuario({ email, password });

            login(response.data);

            if (response.data.rol === 'admin') {
                navigate('/admin');
            } else {
                navigate('/estudiante');
            }

        } catch (err) {
            setError('Credenciales incorrectas. Verifica tu email y contraseña.');
  
        } finally {
            setLoading(false);

        }
    };

    return (
        <div className="min-h-screen bg-indigo-950 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">

                <h1 className="text-2xl font-bold text-indigo-900 mb-2">
                    Universidad Digital
                </h1>
                <p className="text-gray-500 mb-8">Inicia sesión en tu cuenta</p>

                {}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-4">

                    {}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}

                            placeholder="correo@universidad.edu"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Tu contraseña"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {}
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                        {}
                    </button>

                </div>
            </div>
        </div>
    );
}
