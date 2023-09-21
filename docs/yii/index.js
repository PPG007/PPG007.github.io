module.exports.default = {
  sidebar: {
    '/yii': [
      {
        children: [
          '/yii/docs/start.md',
          '/yii/docs/structure.md',
          '/yii/docs/request.md',
          '/yii/docs/concepts.md',
          '/yii/docs/database.md',
          '/yii/docs/formatting.md',
        ],
        text: 'Yii'
      }
    ]
  },
  navbar: {
    text: 'Yii',
    link: '/yii',
    group: 'PHP'
  }
}
