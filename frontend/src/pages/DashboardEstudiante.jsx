import { useState, useEffect } from 'react';
import { useNavigate }         from 'react-router-dom';
import { useAuth }             from '../context/AuthContext';
import {
    getMisMaterias,   // materias ya inscritas del estudiante
    getMaterias,      // catálogo completo de materias disponibles
    crearInscripcion, // endpoint para inscribir al estudiante
} from '../services/api';

// Períodos académicos disponibles para selección
const PERIODOS = ['2025-1', '2025-2', '2026-1', '2026-2'];

export default function DashboardEstudiante() {

    // ── Estados: materias inscritas ───────────────────────────────────────
    const [materias, setMaterias] = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState('');

    // ── Estados: catálogo de materias disponibles ─────────────────────────
    const [catalogo,        setCatalogo]        = useState([]);
    const [loadingCat,      setLoadingCat]      = useState(true);
    const [errorCat,        setErrorCat]        = useState('');
    // errorPorMateria guarda el mensaje de error indexado por materia_id
    const [errorPorMateria, setErrorPorMateria] = useState({});
    // inscribiendoId rastrea qué botón está en estado "cargando"
    const [inscribiendoId,  setInscribiendoId]  = useState(null);
    // período elegido por el estudiante desde el selector
    const [periodo,         setPeriodo]         = useState('');
    // error de validación cuando no se ha seleccionado un período
    const [errorPeriodo,    setErrorPeriodo]    = useState('');

    const { usuario, logout } = useAuth();
    const navigate            = useNavigate();

    // ── Carga las materias ya inscritas del estudiante ────────────────────
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

    // ── Carga el catálogo completo de materias al montar ──────────────────
    const cargarCatalogo = async () => {
        try {
            const response = await getMaterias();
            setCatalogo(response.data);
        } catch (err) {
            setErrorCat('No se pudo cargar el catálogo de materias.');
        } finally {
            setLoadingCat(false);
        }
    };

    useEffect(() => {
        cargarMisMaterias();
        cargarCatalogo();
    }, []);

    // ── Inscribe al estudiante en una materia del catálogo ────────────────
    const handleInscribirse = async (materiaId) => {
        // Validar que el estudiante haya seleccionado un período antes de inscribirse
        if (!periodo) {
            setErrorPeriodo('Selecciona un período académico antes de inscribirte.');
            return;
        }

        setErrorPeriodo('');
        setErrorPorMateria(prev => ({ ...prev, [materiaId]: '' }));
        setInscribiendoId(materiaId);

        try {
            await crearInscripcion({
                usuario_id: parseInt(usuario.id), // viene de AuthContext, no de localStorage
                materia_id: materiaId,
                periodo,                          // período elegido por el estudiante
            });

            // Éxito: recargar la lista de materias inscritas
            await cargarMisMaterias();

        } catch (err) {
            const detalle = err.response?.data?.detail || 'No se pudo completar la inscripción.';
            // Guardar el error asociado a esta materia específica
            setErrorPorMateria(prev => ({ ...prev, [materiaId]: detalle }));
        } finally {
            setInscribiendoId(null);
        }
    };

    // ── Cierra sesión y redirige al login ─────────────────────────────────
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

            {/* Contenido principal */}
            <main className="max-w-4xl mx-auto px-6 py-8">

                {/* ── Sección: materias inscritas ────────────────────────────────── */}
                <div className="mb-8">
                    <h1 className="text-xl font-semibold text-slate-900">
                        Hola, bienvenido
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Tus materias inscritas para este período académico
                    </p>
                </div>

                {/* Error global de materias inscritas */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-5">
                        {error}
                    </div>
                )}

                {/* Estado de carga de materias inscritas */}
                {loading ? (
                    <div className="text-center py-16 text-slate-400 text-sm">
                        Cargando tus materias...
                    </div>
                ) : materias.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
                        <div className="text-3xl mb-3">📚</div>
                        <p className="text-slate-600 font-medium">No tienes materias inscritas este período.</p>
                        <p className="text-slate-400 text-sm mt-1">
                            Inscríbete en el catálogo de abajo.
                        </p>
                    </div>
                ) : (
                    // Grid de tarjetas de materias ya inscritas
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {materias.map(inscripcion => (
                            <div
                                key={inscripcion.id}
                                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-emerald-300 transition-colors"
                            >
                                {/* Abreviatura del nombre */}
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

                                {/* Créditos + estado */}
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

                {/* ── Sección: catálogo de materias disponibles ──────────────────── */}
                <div className="mt-10">

                    {/* Encabezado del catálogo */}
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-slate-900">Catálogo de materias</h2>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Selecciona un período y luego elige las materias a inscribir
                        </p>
                    </div>

                    {/* Selector de período académico — global para todo el catálogo */}
                    <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 mb-5 flex items-center gap-4 flex-wrap">
                        <label className="text-sm font-medium text-slate-700 whitespace-nowrap">
                            Período académico
                        </label>
                        <select
                            value={periodo}
                            onChange={e => {
                                setPeriodo(e.target.value);
                                setErrorPeriodo(''); // limpiar error al seleccionar
                            }}
                            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
                        >
                            <option value="">— Seleccionar período —</option>
                            {/* Generar las opciones desde la constante PERIODOS */}
                            {PERIODOS.map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>

                        {/* Aviso de período seleccionado */}
                        {periodo ? (
                            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-full font-medium">
                                Inscribiendo para: {periodo}
                            </span>
                        ) : (
                            // Advertencia si el estudiante intenta inscribirse sin elegir período
                            errorPeriodo && (
                                <span className="text-xs text-red-600">
                                    {errorPeriodo}
                                </span>
                            )
                        )}
                    </div>

                    {/* Estado de carga del catálogo */}
                    {loadingCat ? (
                        <div className="text-center py-10 text-slate-400 text-sm">
                            Cargando catálogo...
                        </div>
                    ) : errorCat ? (
                        // Error al cargar el catálogo
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg">
                            {errorCat}
                        </div>
                    ) : catalogo.length === 0 ? (
                        // Catálogo vacío
                        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-slate-400 text-sm">
                            No hay materias disponibles en este momento.
                        </div>
                    ) : (
                        // Grid de tarjetas del catálogo
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {catalogo.map(materia => (
                                <div
                                    key={materia.id}
                                    className="bg-white border border-slate-200 rounded-xl p-5 hover:border-emerald-300 transition-colors flex flex-col justify-between"
                                >
                                    <div>
                                        {/* Código de la materia */}
                                        <p className="text-xs font-semibold text-emerald-700 tracking-wide uppercase mb-2">
                                            {materia.codigo}
                                        </p>

                                        {/* Nombre */}
                                        <h3 className="font-semibold text-slate-900 leading-snug mb-1">
                                            {materia.nombre}
                                        </h3>

                                        {/* Créditos */}
                                        <span className="inline-block text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-full mb-4">
                                            {materia.creditos} créditos
                                        </span>
                                    </div>

                                    <div>
                                        {/* Mensaje de error específico de esta materia */}
                                        {errorPorMateria[materia.id] && (
                                            <p className="text-xs text-red-600 mb-2 leading-snug">
                                                {errorPorMateria[materia.id]}
                                            </p>
                                        )}

                                        {/* Botón inscribirse — onClick, nunca <form> */}
                                        <button
                                            onClick={() => handleInscribirse(materia.id)}
                                            disabled={inscribiendoId === materia.id}
                                            className="w-full text-sm font-medium bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg px-4 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {inscribiendoId === materia.id ? 'Inscribiendo...' : 'Inscribirse'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* ── Fin sección catálogo ──────────────────────────────────────── */}

            </main>
        </div>
    );
}