
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{
        path: '',
        name:'Index',
        component: () => import('pages/IndexPage.vue')
    },{
      path: 'location',
      name:'Location',
      component: () => import('components/LocationBased.vue')
    },{
      path: 'marker',
      name:'Marker',
      component: () => import('components/MarkerBased.vue')
    }]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
