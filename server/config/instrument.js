// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node"
import {nodeProfilingIntegration} from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://fe9e9ba02bc0e184e18787ee76c3f0cb@o4511377639079936.ingest.us.sentry.io/4511377644781568",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  integrations: [
    nodeProfilingIntegration(),
    Sentry.modulesIntegration()
  ],

  //tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  sendDefaultPii: true,
});
Sentry.profiler.startProfiler();