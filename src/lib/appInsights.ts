import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';
import { createBrowserHistory } from 'history';

const browserHistory = createBrowserHistory();
const reactPlugin = new ReactPlugin();

const appInsights = new ApplicationInsights({
   config: {
      connectionString: process.env.NEXT_PUBLIC_APPLICATIONINSIGHTS_CONNECTION_STRING,
      enableAutoRouteTracking: true,
      disableFetchTracking: false,
      enableCorsCorrelation: true,
      enableRequestHeaderTracking: true,
      enableResponseHeaderTracking: true,
      extensions: [reactPlugin],
      extensionConfig: {
         [reactPlugin.identifier]: { history: browserHistory },
      },
   },
});

if (process.env.NEXT_PUBLIC_APPLICATIONINSIGHTS_CONNECTION_STRING) {
   appInsights.loadAppInsights();

   appInsights.addTelemetryInitializer((envelope) => {
      envelope.tags = envelope.tags || {};
      envelope.tags['ai.cloud.role'] = 'language-pipeline-frontend';
   });

   console.log('Application Insights initialized');
} else {
   console.log('Application Insights not initialized - connection string missing');
}

export { reactPlugin, appInsights };
