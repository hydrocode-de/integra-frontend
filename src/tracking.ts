import posthog from "posthog-js"

// initialize posthog
posthog.init('phc_4EjwMD5UQLhUwSFd1YZvXgIOsHSAoz4WUjfRN8HXNzO', { 
    api_host: 'https://eu.posthog.com',
    persistence: 'memory',
    bootstrap: {
        // distinctID: 
    }
})

export { posthog }