import { createRouter, createWebHistory } from 'vue-router';
import ModList from '../views/ModList.vue';
import ModConfig from '../views/ModConfig.vue';
import Console from '../views/Console.vue';
import ServerList from '../views/ServerList.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/mods'
    },
    {
      path: '/servers',
      name: 'servers',
      component: ServerList
    },
    {
      path: '/mods',
      name: 'mods',
      component: ModList
    },
    {
      path: '/config',
      name: 'config',
      component: ModConfig
    },
    {
      path: '/console',
      name: 'console',
      component: Console
    }
  ]
});

export default router;