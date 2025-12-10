import NotFound from '../components/NotFound.vue';
import PaginaInicio from '../components/PaginaInicio.vue';
import GestionClientes from '../components/GestionClientes.vue';
import Noticias from '../components/Noticias.vue';
import { createRouter, createWebHistory } from 'vue-router';
import AvisoLegal from '../components/AvisoLegal.vue';
import PoliticaPrivacidad from '../components/PoliticaPrivacidad.vue';
import Modelos from '../components/Modelos.vue';
import CitasTaller from '../components/CitasTaller.vue';
import TablaLogin from '../components/TablaLogin.vue';
import Ventas from '../components/Ventas.vue';
import Contacto from '../components/Contacto.vue';

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
    },
    {
        path: '/taller',
        name: 'Taller',
        component: CitasTaller
    },
    {
        path: '/login',
        name: 'Login',
        component: TablaLogin
    },
    {
        path: '/ventas',
        name: 'Ventas',
        component: Ventas
    },
    {
        path: '/contacto',
        name: 'Contacto',
        component: Contacto
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;