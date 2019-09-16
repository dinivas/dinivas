export const SideMenu = [
  {
    group: 'Compute',
    menus: [
      {
        name: 'compute-instance',
        label: 'Instances',
        routerLink: ['/compute/instances'],
        svgIcon: 'server',
        icon: null,
        isPinned: false
      },
      {
        name: 'compute-image',
        label: 'Images',
        routerLink: ['/compute/images'],
        svgIcon: 'disc',
        icon: null,
        isPinned: false
      },
      {
        name: 'compute-instance',
        label: 'Disks',
        routerLink: ['/compute/disks'],
        svgIcon: 'hard_drive',
        icon: null,
        isPinned: false
      }
    ]
  },
  {
    group: 'Cluster',
    menus: [
      {
        name: 'cluster-kubernetes',
        label: 'Kubernetes',
        routerLink: ['/cluster/kubernetes'],
        svgIcon: 'kubernetes',
        icon: null,
        isPinned: false
      },
      {
        name: 'cluster-openshift',
        label: 'Openshift',
        routerLink: ['/cluster/openshift'],
        svgIcon: 'openshift',
        icon: null,
        isPinned: false
      },
      {
        name: 'cluster-docker-swarm',
        label: 'Docker Swarm',
        routerLink: ['/cluster/dockerswarm'],
        svgIcon: 'docker',
        icon: null,
        isPinned: false
      }
    ]
  },
  {
    group: 'Networking',
    menus: [
      {
        name: 'network-radius',
        label: 'Managed Radius',
        routerLink: ['/network', 'radius'],
        isRouteMatchExact: true,
        svgIcon: 'radius',
        icon: null,
        isPinned: false
      },
      {
        name: 'network-discovery',
        label: 'Service Discovery',
        routerLink: ['/network', 'consul'],
        isRouteMatchExact: true,
        svgIcon: 'consul',
        icon: null,
        isPinned: false
      }
    ]
  },
  {
    group: 'Messaging',
    menus: [
      {
        name: 'messaging-rabbitmq',
        label: 'Managed RabbitMQ',
        routerLink: ['/messaging', 'rabbitmq'],
        svgIcon: 'rabbitmq',
        icon: null,
        isPinned: false
      },
      {
        name: 'messaging-kafka',
        label: 'Managed Kafka',
        routerLink: ['/messaging', 'kafka'],
        svgIcon: 'kafka',
        icon: null,
        isPinned: false
      },
      {
        name: 'messaging-mosquitto',
        label: 'Managed MQTT (IOT)',
        routerLink: ['/messaging', 'mqtt'],
        svgIcon: null,
        icon: 'router',
        isPinned: false
      }
    ]
  },
  {
    group: 'Storage',
    menus: [
      {
        name: 'storage-postgresql',
        label: 'Managed PostgresSQL',
        routerLink: ['/storage', 'postgresql'],
        svgIcon: 'postgresql',
        icon: null,
        isPinned: false
      },
      {
        name: 'storage-mongodb',
        label: 'Managed MongoDB',
        routerLink: ['/storage', 'mongodb'],
        svgIcon: 'mongodb',
        icon: null,
        isPinned: false
      },
      {
        name: 'storage-redis',
        label: 'Managed Redis',
        routerLink: ['/storage', 'redis'],
        svgIcon: 'redis',
        icon: null,
        isPinned: false
      },
      {
        name: 'storage-elasticsearch',
        label: 'Managed Elasticsearch',
        routerLink: ['/storage', 'elasticsearch'],
        svgIcon: 'elasticsearch',
        icon: null,
        isPinned: false
      },
      {
        name: 'storage-mino',
        label: 'Cloud storage',
        routerLink: ['/storage', 'minio'],
        svgIcon: 'minio',
        icon: null,
        isPinned: false
      }
    ]
  },
  {
    group: 'Build & Deploy',
    menus: [
      {
        name: 'build-jenkins',
        label: 'Managed Jenkins',
        routerLink: ['/build', 'jenkins'],
        svgIcon: 'jenkins',
        icon: null,
        isPinned: false
      },
      {
        name: 'build-gitlab',
        label: 'Managed Gitlab',
        routerLink: ['/build', 'gitlab'],
        svgIcon: 'gitlab',
        icon: null,
        isPinned: false
      },
      {
        name: 'build-droneci',
        label: 'Managed DroneCI',
        routerLink: ['/build', 'droneci'],
        svgIcon: 'drone',
        icon: null,
        isPinned: false
      },
      {
        name: 'registry-harbor',
        label: 'Harbor registry',
        routerLink: ['/build','harbor'],
        isRouteMatchExact: true,
        svgIcon: 'harbor',
        icon: null,
        isPinned: false
      },
      {
        name: 'registry-nexus',
        label: 'Nexus registry',
        routerLink: ['/nexus'],
        isRouteMatchExact: true,
        svgIcon: null,
        icon: 'folder',
        isPinned: false
      }
    ]
  },
  {
    group: 'Ansible',
    menus: [
      {
        name: 'ansible-galaxy',
        label: 'Galaxy',
        routerLink: ['/build', 'ansible', 'galaxy'],
        svgIcon: 'ansible',
        icon: null,
        isPinned: false
      },
      {
        name: 'ansible-history',
        label: 'History',
        routerLink: ['/build', 'ansible', 'history'],
        svgIcon: 'ara',
        icon: null,
        isPinned: false
      }
    ]
  },
  {
    group: 'Monitoring',
    menus: [
      {
        name: 'monitoring-dashboard',
        label: 'Dashboard',
        routerLink: ['/monitoring', 'dashboard'],
        isRouteMatchExact: true,
        svgIcon: null,
        icon: 'folder',
        isPinned: false
      },
      {
        name: 'monitoring-logging',
        label: 'Logging',
        routerLink: ['/monitoring', 'logging'],
        isRouteMatchExact: true,
        svgIcon: null,
        icon: 'notes',
        isPinned: false
      },
      {
        name: 'monitoring-tracing',
        label: 'Tracing',
        routerLink: ['/monitoring', 'tracing'],
        isRouteMatchExact: true,
        svgIcon: null,
        icon: 'folder',
        isPinned: false
      }
    ]
  },
  {
    group: 'Security',
    menus: [
      {
        name: 'security-iam',
        label: 'IAM',
        routerLink: ['/iam-admin'],
        svgIcon: null,
        icon: 'security',
        isPinned: false
      },
      {
        name: 'ansible-history',
        label: 'Managed Vault',
        routerLink: ['/vault'],
        isRouteMatchExact: true,
        svgIcon: null,
        icon: 'folder',
        isPinned: false
      }
    ]
  }
];
