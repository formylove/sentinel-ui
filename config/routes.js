export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        routes: [
          {
            path: '/',
            redirect: '/pull-requests',
          },
          {
            path: '/pull-requests/:id',
            name: '',
            component: './PullRequest/PullRequestItem',
          },
          {
            name: 'Pull Requests',
            path: '/pull-requests',
            component: './PullRequest/PullRequest',
          },
          // {
          //   name: 'Rule Classification',
          //   path: '/rule-classification',
          //   authority: ['ROOT'],
          //   component: './RuleClassification/RuleClassification'
          // },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
