const Koa = require('koa')
const Router = require('@koa/router')
const https = require('https');
const { PrismaClient } = require('@prisma/client')
const request = require('request');
const { koaBody } = require('koa-body');

const app = new Koa()
const router = new Router()

const prisma = new PrismaClient({
  log : [
    {
      emit: 'event',
      level: 'query'
    }
  ]
})
prisma.$use(async (params, next) => {
  const before = Date.now()
  const result = await next(params)
  const after = Date.now()
  // console.log(
  //   `Query ${params.model}.${params.action} took ${after - before}ms`,
  // )
  console.log(params,result)
  // return {
  //   code : 2000,
  //   data: result
  // }

  return result
})
prisma.$on('query', (e) => {
  console.log('Query: ' + e.query)
  console.log('Params: ' + e.params)
  console.log('Duration: ' + e.duration + 'ms')
})

app.use(koaBody())
/**
 * 注册
 */
router.post('/signup', async (ctx) => {
  const { userName, password } = ctx.request.body
  const newUser = await prisma.user.create({
    data: {
      password,
      userName
    },
  })
  ctx.body = {
    data: newUser.id,
    code: "0000",
    msg: "success"
  }
})
router.post('/sign', async (ctx) => {
  const { userName, password } = ctx.request.body
  const user = await prisma.user.findUnique({
    where: {
      userName
    },
  })
  if(user.password !== password) {
    ctx.body = {
      data: null,
      code: "0000",
      msg: "密码错误"
    }
  }else{
    ctx.body = {
      data: {id:user.id, userName: user.userName},
      code: "0000",
    }
  }
})

router.post('/study', async (ctx) => {
  const { type, errorCounts} =  ctx.request.body
  const model  =  `${type}Study`
  // Chinese English
  if(type !== 'Chinese' ||  type !== 'English'){
    ctx.body = {
      code: "0000",
      msg: "类型错误"
    }
    return 
  }
  
  // 判断是否已经入库，如果已有则只进行更新数据库表操作，否则创建新记录
  
  const user = await prisma[model].create({
    data:{
      begineTime: new Date(),
      // errorCounts Int
      errorCounts
    }
  })
  
  ctx.body = {
    data: {},
    code: "0000",
  }
})


const fetchBaidu = async (word) => {
 return  new Promise((resolve) => {
      url = "https://hanyu.baidu.com/s?wd=" + word + '&ptype=zici';
      request(encodeURI(url), { json: true }, (err, res, body) => {
      if (err) { return console.log(err); }
      resolve(body)
    });
  })
}
const formatData = (data) =>{
  const proString = data.split(`<div id="word-header" class="header-info">`)[1]
  const lastString = proString.split('</ul>')[0]
  // bishun
  let temp = lastString.match(/<img id="word_bishun" class="bishun" data-gif="https:\/\/hanyu-word-gif\.cdn\.bcebos\.com\/(.*?)\.gif" src="/);
  let bishun = temp ? temp[1] : '';
  // pinyin
  let str2= lastString.split(`<div class="pronounce" id="pinyin">`)[1]
  let pinyin = str2.match(/<b>(.*?)<\/b>/)[1]
  
  // fayin
  let fayin = str2.match(/<a herf="#" url="https:\/\/hanyu-word-pinyin-short.cdn.bcebos.com\/(.*?)\.mp3" class="mp3-play">/)[1];
  let main3 = str2.split('<li id="radical">')[1];
  let radical = main3.match(/<span>(.*?)<\/span>/)[1];
  main3 = main3.split('<label>笔 画</label>')[1];
  let bihua = main3.match(/<span>(.*?)<\/span>/)[1];
  return {
    bishun,
    fayin,
    radical,
    pinyin,
    bihua
  }
}
router.get('/ziyi', async (ctx) => {
  const { word } = ctx.query

  let _data = await fetchBaidu(word)

  _data = formatData(_data)
  // 将文字对应的 拼音 笔画 插入到汉字数据表中
  const newPost = await prisma.hanzi.create({
    data: {
      ..._data,
      chinese: word
    }
  })
  ctx.body = _data
})

router.get('/getWords',async(ctx)=>{
  const data = await prisma.hanzi.findMany()
  ctx.body = data
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(3008, () =>
  console.log(`
🚀 Server ready at: http://localhost:3008
⭐️ See sample requests: https://github.com/prisma/prisma-examples/tree/latest/javascript/rest-koa#using-the-rest-api`),
)
