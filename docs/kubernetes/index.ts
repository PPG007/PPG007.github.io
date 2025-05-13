import { BarConfig } from '../.vuepress/types';

const config: BarConfig = {
  sidebar: {
    '/kubernetes': [
      {
        children: [
          '/kubernetes/docs/basic.md',
          '/kubernetes/docs/component.md',
          '/kubernetes/docs/install.md',
          '/kubernetes/docs/manage.md',
          '/kubernetes/docs/pod.md',
          '/kubernetes/docs/deployment.md',
          '/kubernetes/docs/service.md',
          '/kubernetes/docs/ingress.md',
          '/kubernetes/docs/secret.md',
          '/kubernetes/docs/storage.md',
          '/kubernetes/docs/configMap.md',
          '/kubernetes/docs/job.md',
          '/kubernetes/docs/statefulSet.md',
          '/kubernetes/docs/daemonSet.md',
          '/kubernetes/docs/kuberesolver.md',
        ],
        text: 'Kubernetes',
      },
    ],
  },
  navbar: {
    text: 'Kubernetes',
    link: '/kubernetes',
    group: '云相关',
  },
};

export default config;
