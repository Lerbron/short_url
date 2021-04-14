const Koa = require('koa');
const bodyParser = require("koa-bodyparser");
const Router = require('@koa/router')

const IndexRouter = require('./routes/index');

const port= process.argv.port || 3003


const app = new Koa();
app.use(bodyParser())

const router= new Router()
app.use(IndexRouter)
app.use(router.routes())
  .use(router.allowedMethods())

app.listen(port, () => {
  console.log("server started on port " + port);
});