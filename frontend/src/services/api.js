import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000'
});

api.interceptors.request.use(config =>{
    const token = localStorage.getItem('token');
    if(token){
        config.headers.Authorization = 'Bearer ${token}'
    }
    return config;
});



export const loginUsuario = (datos) => api.post('/usuarios/login', datos);

export const getMisMaterias = () => api.get('/inscripciones/mis-materias');

export const getMaterias        = ()         => api.get('/materias/');
export const crearMateria       = (datos)    => api.post('/materias/', datos);
export const actualizarMateria  = (id, datos)=> api.put(`/materias/${id}`, datos);
export const eliminarMateria    = (id)       => api.delete(`/materias/${id}`);

export const getUsuarios       = ()      => api.get('/usuarios/');
export const getInscripciones  = ()      => api.get('/inscripciones/');
export const crearInscripcion  = (datos) => api.post('/inscripciones/', datos);

export default api;
