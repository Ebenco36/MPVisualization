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

const ROUTES = [
  // Other pages starts here
  {
    path: '/metamp-about',
    name: 'metamp-about',
    component: metaMPAboutView,
    meta: {
      layout: "DashboardLayout",
      requiresAuth: true
    }
  },
  {
    path: '/faq',
    name: 'faq',
    component: FaqView,
    meta: {
      layout: "DashboardLayout",
      requiresAuth: true
    }
  },
  {
    path: '/make-submission/:reason?',
    name: 'make-submission',
    component: submissionView,
    meta: {
      layout: "DashboardLayout",
      requiresAuth: true
    }
  },
  {
    path: '/usecase',
    name: 'usecase',
    component: useCaseView,
    meta: {
      layout: "DashboardLayout",
      requiresAuth: true
    }
  },
  {
    path: '/use-cases/:view?',
    name: 'use-cases',
    component: useCasesView,
    meta: {
      layout: "DashboardLayout",
      requiresAuth: true
    }
  },
  {
    path: '/ai-prediction',
    name: 'ai-prediction',
    component: AIView,
    meta: {
      layout: "DashboardLayout",
      requiresAuth: true
    }
  },
  // other pages ends here

  {
    path: '/admin-feedback',
    name: 'admin-feedback',
    component: AdminFeedbacksView,
    meta: {
      layout: "DashboardLayout",
      requiresAuth: true
    }
  },
  {
    path: '/admin-user-responses',
    name: 'admin-user-responses',
    component: AdminUserResponsesView,
    meta: {
      layout: "DashboardLayout",
      requiresAuth: true
    }
  },
  {
    path: '/welcome',
    name: 'welcome',
    component: WelcomeView,
    meta: {
      layout: "PlainLayout",
      requiresAuth: true
    }
  },
  {
    path: '/admin-feedback',
    name: 'admin-feedback',
    component: AdminFeedbacksView,
    meta: {
      layout: "DashboardLayout",
      requiresAuth: true
    }
  },
  {
    path: '/admin-user-responses',
    name: 'admin-user-responses',
    component: AdminUserResponsesView,
    meta: {
      layout: "DashboardLayout",
      requiresAuth: true
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: {
      layout: "DashboardLayout",
      requiresAuth: true
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/dashboard/UserProfile.vue'),
    meta: {
      layout: "DashboardLayout",
      requiresAuth: true
    }
  },
  {
    path: '/summary',
    name: 'summary',
    component: () => import('../views/dashboard/summary/Overview.vue'),
    meta: {
      layout: "DashboardLayout",
      requiresAuth: true
    }
  },
  {
    path: '/summary/:id',
    name: 'summary-details',
    component: () => import('../views/dashboard/summary/Details.vue'),
    meta: {
      layout: "DashboardLayout",
      requiresAuth: true
    }
  },
  {
    path: '/details/:pdb_code',
    name: 'details',
    component: () => import('../views/dashboard/Details.vue'),
    meta: {
      layout: "DashboardLayout",
      requiresAuth: true
    }
  },
  {
    path: '/evaluation',
    name: 'evaluation',
    component: TrainingView,
    meta: {
      layout: "DashboardLayout",
      requiresAuth: true
    }
  },
  {
    path: '/evaluation_old',
    component: () => import('../views/dashboard/EvaluationView.vue'),
    meta: {
      layout: "DashboardLayout",
      requiresAuth: true
    }
  },
  {
    path: '/exploration',
    component: () => import('../views/dashboard/Exploration.vue'),
    meta: {
      layout: "DashboardLayout",
      requiresAuth: true
    }
  },
  { path: '/tab/:id', name: 'tab', component: () => import('@/components/Tab.vue') },
  {
    path: '/tutorial',
    component: () => import('../views/tutorial/ML.vue'),
    meta: {
      layout: "DashboardLayout",
      requiresAuth: true
    }
  },
  {
    path: '/variables/:key?',
    component: () => import('../views/dashboard/VariableView.vue'),
    meta: {
      layout: "DashboardLayout",
      requiresAuth: true
    }
  },
  {
    path: '/databaseTable',
    component: () => import('../views/dashboard/DatabaseTable.vue'),
    meta: {
      layout: "DashboardLayout",
      requiresAuth: true
    }
  },
  {
    path: '/molecular-viewer/:pdb_code?',
    component: () => import('../views/dashboard/MolecularViewer.vue'),
    meta: {
      layout: "DashboardLayout",
      requiresAuth: true
    }
  },
  {
    path: '/details-2',
    component: () => import('../views/details2.vue'),
    meta: {
      layout: "DashboardLayout",
      requiresAuth: true
    }
  },
  {
    path: '/test-viewer',
    component: () => import('../views/dashboard/TestView.vue'),
    meta: {
      layout: "DashboardLayout",
      requiresAuth: true
    }
  },
  {
    path: '/about',
    component: () => import('../views/dashboard/AboutView.vue'),
    meta: {
      layout: "DashboardLayout",
      requiresAuth: true
    }
  },
  {
    path: '/contact',
    component: () => import('../views/dashboard/ContactView.vue'),
    meta: {
      layout: "DashboardLayout",
      requiresAuth: true
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/dashboard/AboutView.vue'),
    meta: {
      layout: "DashboardLayout",
      requiresAuth: true
    }
  },
  {
    path: '/sunburst',
    name: 'sunburst',
    component: () => import('../views/dashboard/SunBurstView.vue'),
    meta: {
      layout: "DashboardLayout",
      requiresAuth: true
    }
  },
  {
    path: '/machine-learning-prediction',
    name: 'machine-learning-prediction',
    component: () => import('../views/MLView.vue'),
    meta: {
      layout: "DashboardLayout",
      requiresAuth: true
    }
  },
  {
    path: '/machine-learning-prediction-',
    name: 'machine-learning-prediction-',
    component: () => import('../views/MLView2.vue'),
    meta: {
      layout: "DashboardLayout",
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: {
      layout: "AuthLayout",
        requiresAuth: false
    }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('../views/onboarding/SignupView.vue'),
    meta: {
      layout: "AuthLayout",
        requiresAuth: false
    }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../views/onboarding/ForgotPassword.vue'),
    meta: {
      layout: "AuthLayout",
        requiresAuth: false
    }
  },
  {
    path: '/timer-test',
    name: 'timerTest',
    component: () => import('../views/TimerVue.vue'),
    meta: {
      layout: "DashboardLayout",
        requiresAuth: true
    }
  },
  {
    path: '/',
    redirect: '/dashboard'
  }
  // {
  //   path: "/:pathMatch(.*)*",
  //   redirect: '/login'
  // }
]

export default ROUTES