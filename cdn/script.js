// 1. Define route components.
// These can be imported from other files
const Home = { template: `<div>   <!--jumbotron-->
<article>
  <hgroup>
    <h1>liz</h1>
    <h2>my place to write down everything code</h2>
  </hgroup>
  <!--end jumbotron-->
</article>
<input
  type="search"
  id="search"
  name="search"
  placeholder="Search"
  style="font-size: larger"
/>
<div style="text-align: center">
  <a href="/add" class="secondary">or add new</a>
</div>
<!--main-->
<br><br>
<hr>
<br>
<section>
  <h3>Latest notes</h3>
  <div class="row">
    <article class="col-sm-6 col-md-4 col-lg-3 col-xl-2">hi</article>
  </div>
</section></div>` }
const About = { template: '<div>About</div>' }

// 2. Define some routes
// Each route should map to a component.
// We'll talk about nested routes later.
const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = VueRouter.createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: VueRouter.createWebHashHistory(),
  routes, // short for `routes: routes`
})

// 5. Create and mount the root instance.
const app = Vue.createApp({})
// Make sure to _use_ the router instance to make the
// whole app router-aware.
app.use(router)

app.mount('#app')

// Now the app has started!