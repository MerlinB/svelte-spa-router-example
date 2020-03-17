<h2 class="routetitle">Nested router</h2>

<!-- This nested router adds a prefix /nested to all routes -->
<Router {routes} prefix="/nested" />

<script>
// Import the router component
// Normally, this would be import: `import Router from 'svelte-spa-router'`
import Router from 'svelte-spa-router'

// Routes
import Wild from './Wild'
import NotFound from './NotFound'

// Nested routes, but note the prefix /nested passed to the router above
const routes = {
    // Wildcard parameter
    '/wild': Wild,
    '/wild/*': Wild,

    // Catch-all, must be last
    '*': NotFound
}
</script>
