import { StatusMonitorConfiguration } from 'nest-status-monitor';

export const statusMonitorConfig: StatusMonitorConfiguration = {
  pageTitle: 'Dinivas server Monitoring Page',
  port: Number(process.env.port) || 3333,
  path: '/status-monitor',
  ignoreStartsWith: '/healt/alive',
  spans: [
    {
      interval: 1, // Every second
      retention: 60 // Keep 60 datapoints in memory
    },
    {
      interval: 5, // Every 5 seconds
      retention: 60
    },
    {
      interval: 15, // Every 15 seconds
      retention: 60
    }
  ],
  chartVisibility: {
    cpu: true,
    mem: true,
    load: true,
    responseTime: true,
    rps: true,
    statusCodes: true
  },
  healthChecks: []
};
