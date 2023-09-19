
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{
        path: '',
        name:'Index',
        component: () => import('pages/IndexPage.vue')
    },{
      path: 'start/:action',
      name:'Start',
      props: true,
      component: () => import('pages/InitializeAction.vue')
    },{
        path: ':eventType/:id',
        name:'ArEvent',
        props: true,
        component: () => import('pages/ArEvent.vue')
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
