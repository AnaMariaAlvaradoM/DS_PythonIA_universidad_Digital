import { useState, useEffect } from 'react';
import { useNavigate }         from 'react-router-dom';
import { useAuth }             from '../context/AuthContext';
import {
    getMaterias,
    crearMateria,
    eliminarMateria,
} from '../services/api';

export default function DashboardAdmin() {

    const [materias, setMaterias] = useState([]);
  

    const [loading, setLoading]   = useState(true);


    const [error, setError]       = useState('');

    const [nombre,   setNombre]   = useState('');
    const [codigo,   setCodigo]   = useState('');
    const [creditos, setCreditos] = useState('');
    const [creando,  setCreando]  = useState(false);
 

    const { usuario, logout } = useAuth();
    const navigate            = useNavigate();

    const cargarMaterias = async () => {
        try {
            const response = await getMaterias();
            setMaterias(response.data);
            
            setError('');
        } catch (err) {
            setError('No se pudieron cargar las materias. Verifica que el servidor esté activo.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarMaterias();
    }, []);

    const handleCrear = async () => {
       
        if (!nombre.trim() || !codigo.trim() || !creditos) {
            setError('Completa todos los campos antes de crear la materia.');
            return;
        }

        setCreando(true);
        setError('');

        try {
            await crearMateria({
                nombre:   nombre.trim(),
                codigo:   codigo.trim().toUpperCase(),
                creditos: parseInt(creditos),

            });

   
            setNombre('');
            setCodigo('');
            setCreditos('');

            await cargarMaterias();


        } catch (err) {
            setError(err.response?.data?.detail || 'No se pudo crear la materia.');

        } finally {
            setCreando(false);
        }
    };
    const handleEliminar = async (id) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar esta materia?')) return;
 

        try {
            await eliminarMateria(id);
            await cargarMaterias();

        } catch (err) {
            setError(err.response?.data?.detail || 'No se pudo eliminar la materia.');
        }
    };

    const handleLogout = () => {
        logout();

        navigate('/login');

    };

    return (
        <div className="min-h-screen bg-slate-50">

            {}
            <nav className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
                <span className="font-semibold text-indigo-950 text-base">
                    Universidad Digital
                </span>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-800">
                        {usuario?.rol?.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-sm text-slate-600">{usuario?.rol}</span>
                    <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-medium">
                        admin
                    </span>
                    <button
                        onClick={handleLogout}
                        className="text-xs text-slate-500 border border-slate-300 rounded-md px-3 py-1.5 hover:bg-slate-50 transition-colors"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </nav>

            {}
            <main className="max-w-5xl mx-auto px-6 py-8">

                <div className="mb-6">
                    <h1 className="text-xl font-semibold text-slate-900">Panel de administración</h1>
                    <p className="text-sm text-slate-500 mt-1">Gestión del sistema académico</p>
                </div>

                {}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-5">
                        {error}
                    </div>
                )}

                {}
                {loading ? (
                    <div className="text-center py-16 text-slate-400 text-sm">
                        Cargando materias...
                    </div>
                ) : (
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

                        {}
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="font-medium text-slate-800">Materias</h2>
                            <span className="text-xs text-slate-400">{materias.length} registros</span>
                        </div>

                        {}
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="text-left px-6 py-3 text-slate-500 font-medium">Nombre</th>
                                    <th className="text-left px-6 py-3 text-slate-500 font-medium">Código</th>
                                    <th className="text-left px-6 py-3 text-slate-500 font-medium">Créditos</th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {materias.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-10 text-slate-400">
                                            No hay materias registradas. Crea la primera usando el formulario de abajo.
                                        </td>
                                    </tr>
                                ) : (
                                    materias.map(materia => (
                                        <tr key={materia.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 text-slate-900 font-medium">{materia.nombre}</td>
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                                                    {materia.codigo}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-full">
                                                    {materia.creditos} cr
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleEliminar(materia.id)}
                                                    className="text-xs text-red-600 border border-red-200 rounded-md px-3 py-1.5 hover:bg-red-50 transition-colors"
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        {/* Formulario de creación */}
                        <div className="px-6 py-5 border-t border-slate-100 bg-slate-50">
                            <p className="text-xs font-medium text-slate-500 mb-3 uppercase tracking-wide">
                                Agregar materia nueva
                            </p>
                            <div className="flex gap-3 items-end flex-wrap">

                                <div className="flex-1 min-w-36">
                                    <label className="block text-xs text-slate-500 mb-1">Nombre</label>
                                    <input
                                        type="text"
                                        value={nombre}
                                        onChange={e => setNombre(e.target.value)}
                                        placeholder="Ej: Álgebra Lineal"
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    />
                                </div>

                                <div className="w-32">
                                    <label className="block text-xs text-slate-500 mb-1">Código</label>
                                    <input
                                        type="text"
                                        value={codigo}
                                        onChange={e => setCodigo(e.target.value)}
                                        placeholder="MAT202"
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    />
                                </div>

                                <div className="w-24">
                                    <label className="block text-xs text-slate-500 mb-1">Créditos</label>
                                    <input
                                        type="number"
                                        value={creditos}
                                        onChange={e => setCreditos(e.target.value)}
                                        placeholder="3"
                                        min="1"
                                        max="10"
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    />
                                </div>

                                <button
                                    onClick={handleCrear}
                                    disabled={creando}
                                    className="bg-indigo-800 hover:bg-indigo-900 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {creando ? 'Creando...' : 'Crear materia'}
                                </button>

                            </div>
                        </div>

                    </div>
                )}
            </main>
        </div>
    );
}