const exphbs = require('express-handlebars');
const express = require('express');
const conn = require('./db/conn');
const path = require('path');

const app = express();

const User = require('./models/Users') // será mapeado automaticamente pelo sync() e criará a tabela User
const Address = require('./models/Adress')
//Handlebars
app.set('view engine' , 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars' , exphbs.engine({
    extname:'handlebars' ,
    defaultLayout : 'main' ,
    layoutsDir:  path.join(__dirname + '/views/layouts'), 
}))
//Receber Respostas do Body
app.use(
express.urlencoded({
extended:true
})
)
app.use(express.json())
// Config a pasta Public
app.use(express.static(__dirname + '/public'));


app.get("/users/create" ,  (req , res) =>{
    res.render("adduser")
})

app.post('/users/create' , async (req , res)=>{
    const name = req.body.name;
    const occupation = req.body.occupation;
    let newsletter = req.body.newsletter;

    if(newsletter === 'on'){
        newsletter = true
    } else {
        newsletter = false
    }

    await User.create({
        name , occupation , newsletter
    })

    res.redirect('/')
})

app.get('/users/:id' , async (req , res)=> {
    const id = req.params.id ;

    const user = await User.findOne( { 
        raw: true , where: { id : id}})

    res.render('userview' , { user })

})

app.get("/" , async (req , res) =>{
    const user = await User.findAll({raw : true})


    res.render("home" , {users : user} )
})



app.post('/users/delete/:id' , async (req , res )=>{

    const id = req.params.id;

    await User.destroy({where: {id: id} });

    res.redirect('/')
})

app.get('/users/edit/:id' , async (req , res )=>{

    try {
        const id = req.params.id;

    const user = await User.findOne({ include: Address , where: {id: id} });

    res.render('useredit' , { user : user.get({plain : true}) })
    }catch( err ) {
        console.log(err)
    }
})

app.post('/users/update' ,  async (req , res) => {
    const id = req.body.id ;
    const name = req.body.id;
    const occupation = req.body.occupation ;
    let newsletter = req.body.newsletter ;

    if(newsletter === 'on'){
        newsletter = true
    }else {
        newsletter = false }
    
    const userData = {
        id , name, occupation , newsletter
    }

    await User.update(userData , { where : {id : id}})

    res.redirect('/')
})

app.post('/address/create' , async (req , res )=> {
    const UserId = req.body.UserId;
    const street = req.body.street;
    const number = req.body.number;
    const city = req.body.city;
    const address = {
        UserId , street , number , city 
    }

    await Address.create(address);

    res.redirect(`/users/edit/${UserId}`);
})

app.post('/address/delete' , async (req , res)=>{
    const UserId = req.body.UserId;
    const id = req.body.id;

    await Address.destroy({
        where: {id : id}
    })

    res.redirect(`/users/edit/${UserId}`);
})



conn.sync().then(()=> {
    app.listen(3001)
}).catch((err) => console.log(err))
//Perceba que o sync() não irá funcionar se houver um sequelize.authenticate() no conn.js