'use client';

import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';
import { createBrowserHistory } from 'history';

let appInsights: ApplicationInsights | null = null;
let reactPlugin: ReactPlugin | null = null;

if (typeof window !== 'undefined') {
   const browserHistory = createBrowserHistory();
   reactPlugin = new ReactPlugin();

   appInsights = new ApplicationInsights({
      config: {
         connectionString: process.env.NEXT_PUBLIC_APPLICATIONINSIGHTS_CONNECTION_STRING,
         enableAutoRouteTracking: true,
         disableFetchTracking: false,
         enableCorsCorrelation: true,
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

      console.log('Application Insights initialized on client');
   }
}

export const trackPageView = (name?: string, properties?: Record<string, unknown>) => {
   if (appInsights?.appInsights) {
      appInsights.trackPageView({ name, properties });
   }
};

export const trackEvent = (name: string, properties?: Record<string, unknown>) => {
   if (appInsights?.appInsights) {
      appInsights.trackEvent({ name, properties });
   }
};

export const trackException = (exception: Error, properties?: Record<string, unknown>) => {
   if (appInsights?.appInsights) {
      appInsights.trackException({ exception, properties });
   }
};

export { reactPlugin, appInsights };
