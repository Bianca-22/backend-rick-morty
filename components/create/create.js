const express = require("express");
const router = express.Router();
const mongodb = require("mongodb");
require("dotenv").config();
(async () => {
	const dbUser = process.env.DB_USER;
	const dbPassword = process.env.DB_PASSWORD;
	const dbName = process.env.DB_NAME;
	const dbChar = process.env.DB_CHAR;
	const connectionString = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.${dbChar}.mongodb.net/${dbName}?retryWrites=true&w=majority`;
	const options = {
		useUnifiedTopology: true,
	};
	const client = await mongodb.MongoClient.connect(connectionString, options);

	const db = client.db("personagens_db");
	const personagens = db.collection("personagens");

    //Middleware:
    router.use(function timelog(req, res, next) {
        next();
        //console.log("Time: ", Date.now());
    });

    router.post('/', async(req,res) =>{
        const objeto = req.body;
        
        if(!objeto || !objeto.nome || !objeto.imagemUrl){
            res.status(400).send({error: "Personagem inválido, preencha todos os campos."});
            return;
        };

        const result = await personagens.insertOne(objeto);

        if (result.acknowledged == false) {
            res.status(500).send({error: "Ocorreu um erro"});
            return;
        }

        res.send(objeto)
    });
})();


module.exports = router