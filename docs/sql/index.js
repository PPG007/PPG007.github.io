export default {
  sidebar: {
    '/sql': [
      {
        children: [
          '/sql/docs/select.md',
          '/sql/docs/insert.md',
          '/sql/docs/update.md',
          '/sql/docs/delete.md',
          '/sql/docs/database.md',
        ],
        text: 'SQL',
      },
    ],
  },
  navbar: {
    text: 'SQL',
    link: '/sql',
    group: '数据库',
  },
};
