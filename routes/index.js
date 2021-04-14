const Router = require('@koa/router')
const {
  nanoid
} = require('nanoid');
const {
  connection
} = require('./../db/index')

const router = new Router()

const handleNanoId = async (ctx, url) => {

  let _nanoid = nanoid(8)
  const idSql = `SELECT * FROM links where short_url= '${_nanoid}'`

  let [rows]= await connection.promise().query(idSql)
  if (rows?.length == 0) {
    const addSql = `INSERT INTO links (short_url, long_url) VALUES ("${_nanoid}", "${url}")`
    await connection.promise().query(addSql)
    ctx.body = {
      status: 200,
      msg: '',
      data: {
        short_url:`${ctx.request.protocol}://${ctx.request.host}/${_nanoid}`,
        long_url: url
      }
    }
    return null
  }
  handleNanoId(ctx, url)
}

router.post('/short', async (ctx, next) => {
  const body = ctx.request.body
  

  let url = body.url;

  if (!url) {
    res.body = {
      status: 400,
      msg: 'Missing required parameter: url.'
    }
    return null
  }

  if (!/^https?:\/\//.test(url)) {
    res.body = {
      status: 400,
      msg: 'Illegal format: url.'
    }
    return null
  }

  const sql = `SELECT * FROM links where long_url='${url}'`
  let [rows]= await connection.promise().query(sql)
  if (rows?.length == 0) {
    await handleNanoId(ctx, url)
    return null
  }

  ctx.body = {
    status: 200,
    msg: '',
    data: {
      short_url: `${ctx.request.protocol}://${ctx.request.host}/${rows[0].short_url}`,
      long_url: rows[0].long_url
    }
  }
})

router.get('/:url', async (ctx, next) => {
  let { url }= ctx.params
  if(!url) {
    ctx.body= {
      status: 400,
      msg: 'Missing required parameter: short url.'
    }
    return null
  }

  let sql= `SELECT * FROM links where short_url= '${url}'`
  let [rows]= await connection.promise().query(sql)
  ctx.redirect(rows[0].long_url)

})

module.exports = router.routes()