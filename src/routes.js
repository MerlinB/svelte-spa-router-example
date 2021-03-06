// Import the "wrap" function
// Normally, this would be import: `import {wrap} from 'svelte-spa-router'`
import {wrap} from 'svelte-spa-router'

// Components
import Home from './routes/Home'
import Name from './routes/Name'
import Wild from './routes/Wild'
import Regex from './routes/Regex'
import Lucky from './routes/Lucky'
import Nested from './routes/Nested'
import NotFound from './routes/NotFound'

// This demonstrates how to pass routes as a POJO (Plain Old JavaScript Object) or a JS Map
// In this code sample we're using both (controlling at runtime what's enabled, by checking for the 'routemap=1' querystring parameter) just because we are using this code sample for tests too
// In your code, you'll likely want to choose one of the two options only
let routes
const urlParams = new URLSearchParams(window.location.search)
if (!urlParams.has('routemap')) {
    // The simples way to define routes is to use a dictionary.
    // This is a key->value pair in which the key is a string of the path.
    // The path is passed to regexparam that does some transformations allowing the use of params and wildcards
    routes = {
        // Exact path
        '/': Home,
    
        // Allow children to also signal link activation
        '/brand': Home,
        
        // Using named parameters, with last being optional
        '/hello/:first/:last?': Name,
    
        // Wildcard parameter
        '/wild': Wild,
        // Special route that has custom data that will be passed to the `routeLoaded` event
        '/wild/data': wrap(Wild, {hello: 'world'}),
        '/wild/*': Wild,

        // This route has a pre-condition function that lets people in only 50% of times, and a second pre-condition that is always true
        // The second argument is a custom data object that will be passed to the `conditionsFailed` event if the pre-conditions fail
        '/lucky': wrap(Lucky,
            {foo: 'bar'},
            (detail) => {
                // If there's a querystring parameter, override the random choice (tests need to be deterministic)
                if (detail.querystring == 'pass=1') {
                    return true
                }
                else if (detail.querystring == 'pass=0') {
                    return false
                }
                // Random
                return (Math.random() > 0.5)
            },
            (detail) => {
                // This pre-condition is executed only if the first one succeeded
                // eslint-disable-next-line no-console
                console.log('Pre-condition 2 executed', detail.location, detail.querystring, detail.userData)

                // Always succeed
                return true
            }
        ),

        // This component contains a nested router
        // Note that we must match both '/nested' and '/nested/*' for the nested router to work (or look below at doing this with a Map and a regular expression)
        '/nested': Nested,
        '/nested/*': Nested,
    
        // Catch-all, must be last
        '*': NotFound,
    }
}
else {
    routes = new Map()

    // Exact path
    routes.set('/', Home)

    // Allow children to also signal link activation
    routes.set('/brand', Home)

    // Using named parameters, with last being optional
    routes.set('/hello/:first/:last?', Name)

    // Wildcard parameter
    routes.set('/wild', Wild)
    // Special route that has custom data that will be passed to the `routeLoaded` event
    routes.set('/wild/data', wrap(Wild, {hello: 'world'}))
    routes.set('/wild/*', Wild)

    // This route has a pre-condition function that lets people in only 50% of times (and a second pre-condition that is always true)
    // The second argument is a custom data object that will be passed to the `conditionsFailed` event if the pre-conditions fail
    routes.set('/lucky', wrap(Lucky,
        {foo: 'bar'},
        (detail) => {
            return (Math.random() > 0.5)
        },
        (detail) => {
            // This pre-condition is executed only if the first one succeeded
            // eslint-disable-next-line no-console
            console.log('Pre-condition 2 executed', detail.location, detail.querystring, detail.userData)
            return true
        }
    ))

    // Regular expressions
    routes.set(/^\/regex\/(.*)?/i, Regex)
    routes.set(/^\/(pattern|match)(\/[a-z0-9]+)?/i, Regex)

    // This component contains a nested router
    // Thanks to being able to define routes via regular expressions, this allows us to use a single line rather than 2 ('/nested' and '/nested/*')
    routes.set(/^\/nested(\/(.*))?/, Nested)

    // Catch-all, must be last
    routes.set('*', NotFound)
}

export default routes
