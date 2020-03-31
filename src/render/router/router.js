const index = resolve => require(['@/page/index'], resolve)

export const routers = [
  { path: '/', redirect: 'index' },
  { path: '/index', name: 'index', component: index },
]
