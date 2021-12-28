const RedisSidebar = {
  '/redis': [
    {
      text: 'Redis',
      children: [
        '/redis/docs/command.md',
        '/redis/docs/transaction.md',
        '/redis/docs/jedis.md',
        '/redis/docs/redis_template.md',
        '/redis/docs/config.md',
        '/redis/docs/persistent.md',
        '/redis/docs/subscribe_publish.md',
        '/redis/docs/master_slave.md',
        '/redis/docs/cluster.md',
        '/redis/docs/distributed_lock.md',
      ],
    },
  ],
}
module.exports.RedisSidebar = RedisSidebar
