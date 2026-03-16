import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: [
        'basic.md',
        'component.md',
        'install.md',
        'manage.md',
        'pod.md',
        'deployment.md',
        'service.md',
        'ingress.md',
        'secret.md',
        'storage.md',
        'configMap.md',
        'job.md',
        'statefulSet.md',
        'daemonSet.md',
        'kuberesolver.md',
      ],
    },
  ],
  text: 'Kubernetes',
  icon: 'logos:kubernetes',
  dir: __dirname,
};

export default config;
