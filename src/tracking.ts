import posthog from "posthog-js"
import { H } from 'highlight.run';

H.init('kgr584ne', {
	serviceName: "integra-frontend",
	tracingOrigins: true,
	networkRecording: {
		enabled: true,
		recordHeadersAndBody: true,
		urlBlocklist: [],
	},
});


// initialize posthog
posthog.init('phc_4EjwMD5UQLhUwSFd1YZvXgIOsHSAoz4WUjfRN8HXNzO', { 
    api_host: 'https://eu.posthog.com',
    persistence: 'memory',
    bootstrap: {
        // distinctID: 
    }
})

export { posthog }