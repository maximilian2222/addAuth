const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/cours')
const cardRouter = require('./routes/card')
const ordersRouter = require('./routes/orders')
const User = require('./models/user')



const app = express()
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use( async (req,res, next)=>{
  try{
    const user = await User.findById('62b0b88fdd7e81d682a77c64')
    req.user = user
    next()
  }catch (e) {
    console.log(e)
  }
})


app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card',cardRouter)
app.use('/orders',ordersRouter)



const PORT = process.env.PORT || 5000


const start = async () => {
  try {
    await mongoose.connect( 'mongodb+srv://qwerty:12345@cluster0.vu6zqpz.mongodb.net/Shop')
    const candidate = await User.findOne()
    if(!candidate){
      const user = new User({
        email: 'maxooon@gmail.com',
        name: 'Max',
        cart: {items: []}
      })
     await user.save()
      }
    app.listen(PORT,  () => console.log(`server started on port ${PORT} `))
  } catch (e) {
    console.log(e)
  }
}
start()





/*
async function start() {
  try {
    const url = `mongodb+srv://qwerty:12345@cluster0.vu6zqpz.mongodb.net/Shop`
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useFindAndModify: false
    })
    const candidate = await User.findOne()
    if(!candidate){
      const user = new User({
        email: 'maxooon@gmail.com',
        name: 'Max',
        cart: {items: []}
      })
      await user.save()
    }
    app.listen(PORT, () => {
      console.log(`server is running in ${PORT}`)
    })
  } catch (e) {
    console.log(e)
  }
}


start()*/
