const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: String,
    password: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
            count: {
                type: Number,
                required: true,
                default: 1
            },
            courseId: {
                type: Schema.Types.ObjectId,
                ref: 'Course',
                required: true
            }
        }
       ]
    }
})

userSchema.methods.addToCart = function (course){
    const items = [...this.cart.items]
    const idx = items.findIndex(c => {
        return c.courseId.toString() === course._id.toString()
    })
    //якщо індекс більше нуля то в корзині вже є такий курс і ми маємо збільшити кількість
    if(idx >=0){
        items[idx].count = items[idx].count + 1
    } else{
        // якщо індекс -1 то його нема в коризі, тоді ми запушим count і courseId в корзину
        items.push({
            courseId: course._id,
            count: 1
        })
        /*const newCart = {items :items}
        this.cart = newCart*/

        this.cart = {items}  // зручніший варіант
        return this.save()
    }
}


userSchema.methods.removeFromCart = function(id){
let items = [...this.cart.items]
const idx = items.findIndex(c =>c.courseId.toString() === id.toString())
    if (items[idx].count === 1){
        items.filter(c => c.courseId.toString() !== id.toString())
    } else{
        items[idx].count --
    }
    this.cart = {items}
    return this.save()

}


userSchema.methods.clearCart = function (){
    this.cart = {items: []}
    return this.save()
}



module.exports = model('User', userSchema)