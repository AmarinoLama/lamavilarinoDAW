import NotFound from '../components/NotFound.vue';
import PaginaInicio from '../components/PaginaInicio.vue';
import GestionClientes from '../components/GestionClientes.vue';
import Noticias from '../components/Noticias.vue';
import { createRouter, createWebHistory } from 'vue-router';
import AvisoLegal from '../components/AvisoLegal.vue';
import PoliticaPrivacidad from '../components/PoliticaPrivacidad.vue';
import Modelos from '../components/Modelos.vue';

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
    },
    {
        path: '/politica-privacidad',
        name: 'Política de Privacidad',
        component: PoliticaPrivacidad
    },
    {
        path: '/modelos',
        name: 'Modelos',
        component: Modelos
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;