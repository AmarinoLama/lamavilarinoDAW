import NotFound from '../components/NotFound.vue';
import PaginaInicio from '../components/PaginaInicio.vue';
import GestionClientes from '../components/GestionClientes.vue';
import Noticias from '../components/Noticias.vue';
import { createRouter, createWebHistory } from 'vue-router';
import AvisoLegal from '../components/AvisoLegal.vue';

const routes = [
    {
        path: '/',
        name: 'Inicio',
        component: PaginaInicio
    },
    {
        path: '/clientes',
        name: 'GestionClientes',
        component: GestionClientes
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    },        
    {
        path: '/noticias',
        name: 'Noticias',
        component: Noticias
    },
    {
        path: '/aviso-legal',
        name: 'Aviso Legal',
        component: AvisoLegal
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;