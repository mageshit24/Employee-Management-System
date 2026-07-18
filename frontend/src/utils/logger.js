// Thin wrapper around console.* that is a no-op in production builds.
//
// The original code logged raw employee objects and Axios error objects
// straight to the browser console (visible to anyone who opens DevTools,
// and often scraped by browser extensions or crash reporters that hoover
// up console output). Route all debug logging through here instead of
// console.* directly.
const isDev = import.meta.env.DEV

export const logger = {
    debug: (...args) => { if (isDev) console.debug(...args) },
    info: (...args) => { if (isDev) console.info(...args) },
    warn: (...args) => { if (isDev) console.warn(...args) },
    // Errors are still worth a console entry in production for real user
    // debugging via remote support, but never the raw payload/object - just
    // a short, safe message.
    error: (message) => { console.error(message) },
}
