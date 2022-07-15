import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserPage from '../views/UserPage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'users',
    component: HomeView
  },
  {
    path: '/user-page/:id',
    name: 'user',
    component: UserPage,
	props: true
  }
]

const router = new VueRouter({
  routes
})

export default router
