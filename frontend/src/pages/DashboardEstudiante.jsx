import { useState, useEffect } from 'react';
import { useNavigate }         from 'react-router-dom';
import { useAuth }             from '../context/AuthContext';
import { getMisMaterias }      from '../services/api';

export default function DashboardEstudiante() {

    const [materias, setMaterias] = useState([]);


    const [loading, setLoading]   = useState(true);
    const [error,   setError]     = useState('');

    const { usuario, logout } = useAuth();
    const navigate            = useNavigate();

    const cargarMisMaterias = async () => {
        try {
            const response = await getMisMaterias();
            setMaterias(response.data);

        } catch (err) {
            setError('No se pudieron cargar tus materias. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarMisMaterias();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-emerald-50">

            {/* Navbar */}
            <nav className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
                <span className="font-semibold text-emerald-950 text-base">
                    Universidad Digital
                </span>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-semibold text-emerald-800">
                        {usuario?.id?.toString().padStart(2, '0') || 'ES'}
                    </div>
                    <span className="text-sm text-slate-600">Mi cuenta</span>
                    <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
                        estudiante
                    </span>
                    <button
                        onClick={handleLogout}
                        className="text-xs text-slate-500 border border-slate-300 rounded-md px-3 py-1.5 hover:bg-slate-50 transition-colors"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </nav>

            {/* Contenido */}
            <main className="max-w-4xl mx-auto px-6 py-8">

                <div className="mb-8">
                    <h1 className="text-xl font-semibold text-slate-900">
                        Hola, bienvenido
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Tus materias inscritas para este período académico
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-5">
                        {error}
                    </div>
                )}

                {/* Cargando */}
                {loading ? (
                    <div className="text-center py-16 text-slate-400 text-sm">
                        Cargando tus materias...
                    </div>
                ) : materias.length === 0 ? (

                    <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
                        <div className="text-3xl mb-3">📚</div>
                        <p className="text-slate-600 font-medium">No tienes materias inscritas este período.</p>
                        <p className="text-slate-400 text-sm mt-1">
                            Contacta al administrador para gestionar tu inscripción.
                        </p>
                    </div>
                ) : (

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {materias.map(inscripcion => (
                            <div
                                key={inscripcion.id}
                                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-emerald-300 transition-colors"
                            >
                                {/* Código de la materia */}
                                <p className="text-xs font-semibold text-emerald-700 tracking-wide uppercase mb-2">
                                    {inscripcion.nombre_materia
                                        ? inscripcion.nombre_materia.split(' ').map(w => w[0]).join('').slice(0, 4)
                                        : 'MAT'}
                                </p>

                                {/* Nombre de la materia */}
                                <h3 className="font-semibold text-slate-900 mb-1 leading-snug">
                                    {inscripcion.nombre_materia || 'Materia'}
                                </h3>

                                {/* Período */}
                                <p className="text-xs text-slate-400 mb-4">
                                    Período {inscripcion.periodo}
                                </p>

                                {/* Créditos */}
                                <div className="flex items-center justify-between">
                                    <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-full">
                                        {inscripcion.creditos_materia} créditos
                                    </span>
                                    <span className="text-xs text-slate-400">
                                        Inscrito
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </main>
        </div>
    );
}