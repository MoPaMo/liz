// 1. Define route components.
// These can be imported from other files
const Home = {
  template: `<div>   <!--jumbotron-->
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
</section></div>`,
};
const About = { template: "<div>{{this.$root.message}}</div>" };
// the "new" component
const New = {
  template: `<div>
    <h1>New note</h1>
    <form @submit.prevent="onSubmit">
        <div class="form-group">
            <label for="header">Header</label>
            <input type="text" class="form-control" id="header" v-model="header" placeholder="Header">
        </div>
        <div class="form-group">
            <label for="topic">Topic</label>
            <input type="text" class="form-control" id="topic" v-model="topic" placeholder="Topic">
        </div>
        <div class="form-group">
            <label for="code">Code</label>
            <textarea class="form-control" id="code" v-model="code" placeholder="Code"></textarea>
        </div>
        <div class="form-group">
            <label for="notice">Notice</label>
            <textarea class="form-control" id="notice" v-model="notice" placeholder="Notice"></textarea>
        </div>
        <div class="form-group">
        <label for="pwd">Password</label>
        <input type="password" class="form-control" id="pwd" v-model="pwd" placeholder="Password">
    </div>
        <button type="submit" class="btn btn-primary" :aria-busy="loading">Submit</button>
    </form>
</div>`,
  data() {
    return {
      topic: "",
      code: "",
      header: "",
      notice: "",
      pwd: "",
      loading: false,
    };
  },
  methods: {
    onSubmit() {
      const params = {
        topic:this.topic,
        code:this.code,
        header:this.header,
        notice:this.notice,
        pwd:this.pwd,
      };
      //proceed only if all data is present
      if (params.topic && params.code && params.header && params.notice && params.pwd) {

      //check if connected to network
      if (!navigator.onLine) {
        return alert("Please connect to the internet");
      }
      this.loading = true;
      // ajax  post call to /api/entries
      axios
        .post("/api/entries", params)
        .then((response) => {
            this.loading = true;
          // redirect to new post
          this.$router.push({ path: `/entries/${response.data.LastId}` });
        })
        .catch((error) => {
          console.log(error);
        }); // end of axios.post
    }
  },
},
};
// the "entry" component
const Entry = {
  template: `<div>
    <h1>{{entry.topic}}</h1>
    <p>{{entry.header}}</p>
    <p>{{entry.notice}}</p>
    <p>{{entry.code}}</p>
</div>`,
  props: ["id"],
  // load data from server when component is loaded
    created() {
        axios
            .get(`/api/entries/${this.id}`)
            .then((response) => {
                this.entry = response.data.entries[0];
            })
            .catch((error) => {
                console.log(error);
            });
    }
};

// 2. Define some routes
// Each route should map to a component.
// We'll talk about nested routes later.
const routes = [
  { path: "/", component: Home },
  { path: "/about", component: About },
  { path: "/new", component: New },
  { path: "/entries/:id", component: Entry }
];

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = VueRouter.createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: VueRouter.createWebHashHistory(),
  routes, // short for `routes: routes`
});

// 5. Create and mount the root instance.
const app = Vue.createApp({
  data() {
    return {
      message: "Hello Vue!",
    };
  },
});
// Make sure to _use_ the router instance to make the
// whole app router-aware.
app.use(router);

app.mount("#app");

// Now the app has started!
