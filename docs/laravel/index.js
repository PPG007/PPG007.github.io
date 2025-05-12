module.exports.default = {
  sidebar: {
    '/laravel': [
      {
        children: [
            '/laravel/docs/start.md',
            '/laravel/docs/deploy.md',
        ],
        text: 'Laravel',
      },
    ],
  },
  navbar: {
    text: 'Laravel',
    link: '/laravel',
    group: 'PHP',
  },
};
