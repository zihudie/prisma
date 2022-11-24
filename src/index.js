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

router.post('/signup', async (ctx) => {
  const { name, email, posts } = ctx.request.body

  const postData = posts
    ? posts.map((post) => {
      return { title: post.title, content: post.content || undefined }
    })
    : []

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      posts: {
        create: postData,
      },
    },
  })

  ctx.status = 201 // Created
  ctx.body = newUser
})

router.post('/post', async (ctx) => {
  const { title, content, email } = ctx.request.body
  const newPost = await prisma.post.create({
    data: {
      title,
      content,
      author: { connectOrCreate: { 
        where : {
          email
        },
        create:{
          email,
          name:"setphior"
        }
       }
      }
    },
    
  })
  ctx.status = 201 // Created
  ctx.body = newPost
})

router.put('/post/:id/views', async (ctx) => {
  const id = Number(ctx.params.id)

  try {
    const post = await prisma.post.update({
      where: {
        id,
      },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    })

    ctx.body = post
  } catch {
    ctx.status = 404
    ctx.body = { error: `Post with ID ${id} does not exist in the database` }
  }
})

router.put('/publish/:id', async (ctx) => {
  const id = Number(ctx.params.id)
  const postToUpdate = await prisma.post.findUnique({
    where: {
      id
    },
  })

  if (!postToUpdate) {
    ctx.status = 404
    ctx.body = { error: `Post with ID ${id} does not exist in the database` }
    return
  }

  const updatedPost = await prisma.post.update({
    where: {
      id,
    },
    data: {
      published: !postToUpdate.published,
    },
  })

  ctx.body = updatedPost
})

router.delete('/post/:id', async (ctx) => {
  const id = Number(ctx.params.id)
  try {
    const deletedPost = await prisma.post.delete({
      where: {
        id,
      },
    })

    ctx.body = deletedPost
  } catch {
    ctx.status = 404
    ctx.body = { error: `Post with ID ${id} does not exist in the database` }
  }
})

router.get('/users', async (ctx) => {
  const users = await prisma.user.findMany()

  ctx.body = users
})

router.get('/user/:id/drafts', async (ctx) => {
  const id = Number(ctx.params.id)

  const drafts = await prisma.user
    .findUnique({
      where: {
        id,
      },
    })
    .posts({
      where: { published: false },
    })

  ctx.body = drafts
})

router.get('/post/:id', async (ctx) => {
  const id = Number(ctx.params.id)
  const post = await prisma.post.findUnique({
    where: {
      id
    },
  })

  ctx.body = post
})

router.get('/getViews', async (ctx) => {
  const post = await prisma.user.findMany({
    where: {
      posts:{
        some:{
          viewCount:{
            gt:1
          }
        }
      }
    },
    // include: {
    //   posts: true
    // }
  })

   ctx.status = 404
   ctx.body = { error: `Post with ID does not exist in the database` }
  // ctx.body = post
})


 // viewCount: viewCount >1
router.get('/getPosts', async (ctx) => {
  const post = await prisma.user.findUnique({
    where: {
      id:3
    },
    // include: {
    //   posts: true
    // }
  })
  ctx.body = post
})

router.get('/feed', async (ctx) => {
  const { searchString, skip, take, orderBy } = ctx.query

  const or = searchString
    ? {
      OR: [
        { title: { contains: searchString } },
        { content: { contains: searchString } },
      ],
    }
    : {}

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      ...or,
    },
    include: { author: true },
    take: Number(take) || undefined,
    skip: Number(skip) || undefined,
    orderBy: {
      updatedAt: orderBy || undefined,
    },
  })
  ctx.body = posts
})

// app.post('/user/:id/profile', async (req, res) => {
//   console.log("res...",res)
//   const { id } = req.params
//   const { bio } = req.body

//   const profile = await prisma.profile.create({
//     data: {
//       bio,
//       user: {
//         connect: {
//           id: Number(id)
//         }
//       }
//     }
//   })

//   res.send(profile)
// })

// 请求百度汉字api 获取对应汉字的释义

router.get('/ziyi1', async (ctx) => {
  const { word } = ctx.query
  let _data
  url = "https://hanyu.baidu.com/s?wd=" + word + '&ptype=zici';
  const __data = await https.get(url, (resp) => {
    let data = '';
    // A chunk of data has been received.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      // const  _r = JSON.parse(data)
      // ctx.body = {data}
      _data = data+''
      console.log(1)
      return _data
    });
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  })
  console.log(2)
   
  ctx.body = {data:_data}
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
  const lastString = proString.split(`<div class="content means imeans" data-group="imeans" id="basicmean-wrapper">`)[0]
  return lastString
}
router.get('/ziyi', async (ctx) => {
  const { word } = ctx.query

  let _data = await fetchBaidu(word)

  _data = formatData(_data)
   
  ctx.body = {data:_data}
  
})



app.use(router.routes()).use(router.allowedMethods())

app.listen(3008, () =>
  console.log(`
🚀 Server ready at: http://localhost:3008
⭐️ See sample requests: https://github.com/prisma/prisma-examples/tree/latest/javascript/rest-koa#using-the-rest-api`),
)
