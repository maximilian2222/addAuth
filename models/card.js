const path = require('path')
const fs = require('fs')
const {json} = require("express");


const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'card.json'
)

class Card {
    static async add(course) {
        const card = await Card.fetch()

        const idx = card.courses.findIndex(c => c.id === course.id)
        const candidate = card.courses[idx]

        if (candidate) {
            //такий курс вже є
            candidate.count++
            card.courses[idx] = candidate
        } else {
            //потрібно добавити курс
            course.count = 1
            card.courses.push(course)
        }
        card.price += +course.price     // ціна всіх курсів
        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(card), err => {
                if (err) {
                    reject(err)
                } else {
                    resolve(card)
                }
            })
        })
    }




    static async remove (id){
        const card = await Card.fetch()
        const idx = card.courses.findIndex(c => c.id === id)
        const course = card.courses[idx]

        if(course.count === 1){
            //то видалити
            card.courses = card.courses.filter(c => c.id !==id)
        }else{
            // замінити кількість
            card.courses[idx].count--
        }
        // перераховуєм ціну
        card.price -= course.price
        //перезаписуєм кошик //вже є ця функція
        card.price += +course.price     // ціна всіх курсів
        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(card), err => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }


   static async fetch(){
        return new Promise((resolve, reject)=>{
            fs.readFile(p, "utf-8", (err, content) => {
                if (err){
                    reject(err)
                } else {
                    resolve(JSON.parse(content))
                }
            })

       })


    }
}

module.exports = Card