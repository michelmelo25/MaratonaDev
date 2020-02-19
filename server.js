const express = require("express")
const server = express()

server.use(express.static('public'))

server.use(express.urlencoded({extended: true}))

const Pool = require('pg').Pool
const db = new Pool({
    user: 'shell2',
    password: '2343',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})


const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})


server.get("/", function(req, res){
    db.query("select * from donors", function(err, result) {
        if(err) return res.send("Erro no banco de dados.")

        const donors = result.rows
        return res.render("index.html", {donors})
    })
})

server.post("/", function(req,res) {
    const donor = {
        name: req.body.name, 
        email: req.body.email,
        blood: req.body.blood,
    }

    if (donor.name == "" || donor.email == "" || donor.blood == ""){
       return res.send("Todos os campos são obrigatorios.")
    }

    const query = `insert into donors ("name", "email", "blood") values ($1, $2, $3)`
    const values = [donor.name,donor.email,donor.blood]
    db.query(query, values, function(err) {
        if(err) return res.send("erro no banco de dados.")
        return res.redirect("/")
    })

})

server.listen(3000, function() {
    console.log("Servidor iniciado!")
})

