import NotFound from '../components/NotFound.vue';
import PaginaInicio from '../components/PaginaInicio.vue';
import GestionClientes from '../components/GestionClientes.vue';
import Noticias from '../components/Noticias.vue';
import { createRouter, createWebHistory } from 'vue-router';

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
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;