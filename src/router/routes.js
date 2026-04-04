import AdminFeedbacksView from '../views/AdminFeedbacks.vue'
import AdminUserResponsesView from '../views/AdminUserResponses.vue'
import DashboardView from '../views/dashboard/DashboardView.vue'
import TrainingView from '../views/dashboard/TrainingView.vue'
import LoginView from '../views/onboarding/LoginView.vue'
import WelcomeView from '../views/WelcomeView.vue'

import metaMPAboutView from '../views/dashboard/metaMPAboutView.vue'
import submissionView from '../views/forms/submission.vue'
import FaqView from '../views/faq/index.vue'
import useCasesView from '../views/useCases/index.vue'
import useCaseView from '../views/useCases/useCase.vue'
import AIView from '../views/useCases/AI.vue'
import ErrorPageView from '../views/ErrorPage.vue'

const dashboardMeta = {
  layout: 'DashboardLayout',
  requiresAuth: true
}

const authMeta = {
  layout: 'AuthLayout',
  requiresAuth: false
}

const plainMeta = {
  layout: 'PlainLayout',
  requiresAuth: true
}

const ROUTES = [
  {
    path: '/metamp-about',
    name: 'metamp-about',
    component: metaMPAboutView,
    meta: dashboardMeta
  },
  {
    path: '/faq',
    name: 'faq',
    component: FaqView,
    meta: dashboardMeta
  },
  {
    path: '/make-submission/:reason?',
    name: 'make-submission',
    component: submissionView,
    meta: dashboardMeta
  },
  {
    path: '/usecase',
    name: 'usecase',
    component: useCaseView,
    meta: dashboardMeta
  },
  {
    path: '/use-cases/:view?',
    name: 'use-cases',
    component: useCasesView,
    meta: dashboardMeta
  },
  {
    path: '/ai-prediction',
    name: 'ai-prediction',
    component: AIView,
    meta: dashboardMeta
  },
  {
    path: '/admin-feedback',
    name: 'admin-feedback',
    component: AdminFeedbacksView,
    meta: dashboardMeta
  },
  {
    path: '/admin-user-responses',
    name: 'admin-user-responses',
    component: AdminUserResponsesView,
    meta: dashboardMeta
  },
  {
    path: '/welcome',
    name: 'welcome',
    component: WelcomeView,
    meta: plainMeta
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: dashboardMeta
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/dashboard/UserProfile.vue'),
    meta: dashboardMeta
  },
  {
    path: '/summary',
    name: 'summary',
    component: () => import('../views/dashboard/summary/Overview.vue'),
    meta: dashboardMeta
  },
  {
    path: '/summary/:id',
    name: 'summary-details',
    component: () => import('../views/dashboard/summary/Details.vue'),
    meta: dashboardMeta
  },
  {
    path: '/details/:pdb_code',
    name: 'details',
    component: () => import('../views/dashboard/Details.vue'),
    meta: dashboardMeta
  },
  {
    path: '/evaluation',
    name: 'evaluation',
    component: TrainingView,
    meta: dashboardMeta
  },
  {
    path: '/evaluation_old',
    name: 'evaluation-old',
    component: () => import('../views/dashboard/EvaluationView.vue'),
    meta: dashboardMeta
  },
  {
    path: '/exploration',
    name: 'exploration',
    component: () => import('../views/dashboard/Exploration.vue'),
    meta: dashboardMeta
  },
  { path: '/tab/:id', name: 'tab', component: () => import('@/components/Tab.vue') },
  {
    path: '/tutorial',
    name: 'tutorial',
    component: () => import('../views/tutorial/ML.vue'),
    meta: dashboardMeta
  },
  {
    path: '/variables/:key?',
    name: 'variables',
    component: () => import('../views/dashboard/VariableView.vue'),
    meta: dashboardMeta
  },
  {
    path: '/databaseTable',
    name: 'database-table',
    component: () => import('../views/dashboard/DatabaseTable.vue'),
    meta: dashboardMeta
  },
  {
    path: '/molecular-viewer/:pdb_code?',
    name: 'molecular-viewer',
    component: () => import('../views/dashboard/MolecularViewer.vue'),
    meta: dashboardMeta
  },
  {
    path: '/details-2',
    name: 'details-2',
    component: () => import('../views/details2.vue'),
    meta: dashboardMeta
  },
  {
    path: '/test-viewer',
    name: 'test-viewer',
    component: () => import('../views/dashboard/TestView.vue'),
    meta: dashboardMeta
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('../views/dashboard/ContactView.vue'),
    meta: dashboardMeta
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/dashboard/AboutView.vue'),
    meta: dashboardMeta
  },
  {
    path: '/sunburst',
    name: 'sunburst',
    component: () => import('../views/dashboard/SunBurstView.vue'),
    meta: dashboardMeta
  },
  {
    path: '/machine-learning-prediction',
    name: 'machine-learning-prediction',
    component: () => import('../views/MLView2.vue'),
    meta: dashboardMeta
  },
  {
    path: '/machine-learning-prediction-',
    name: 'machine-learning-prediction-',
    component: () => import('../views/MLView2.vue'),
    meta: dashboardMeta
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: authMeta
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('../views/onboarding/SignupView.vue'),
    meta: authMeta
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('../views/onboarding/ForgotPassword.vue'),
    meta: authMeta
  },
  {
    path: '/timer-test',
    name: 'timer-test',
    component: () => import('../views/TimerVue.vue'),
    meta: dashboardMeta
  },
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: ErrorPageView,
    meta: authMeta
  }
]

export default ROUTES
