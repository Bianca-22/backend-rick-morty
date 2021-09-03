const express = require("express");
const mongodb = require("mongodb");
require("dotenv").config();

const ObjectId = mongodb.ObjectId;

(async () => {
    const dbUser = process.env.DB_USER;
    const dbPassword = process.env.DB_PASSWORD;
    const dbName = process.env.DB_NAME;
	const dbChar = process.env.DB_CHAR;

    const app = express();
    app.use(express.json());

    const port = process.env.PORT || 3000;
    const connectionString = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.${dbChar}.mongodb.net/${dbName}?retryWrites=true&w=majority`;
    const options = {
        useUnifiedTopology: true
    };

    const client = await mongodb.MongoClient.connect(connectionString, options);
    const db = client.db("personagens_db");
    const personagens = db.collection("personagens");

    const getPersonagensValidos = () => personagens.find({}).toArray();
    const getPersonagemById = async(id) => personagens.findOne({_id: ObjectId(id)});
    
    app.all("/*", (req, res, next) => {
		res.header("Access-Control-Allow-Origin", "*");

		res.header("Access-Control-Allow-Methods", "*");

		res.header(
			"Access-Control-Allow-Headers",
			"Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization"
		);

		next();
	});

    app.get('/', (req,res) => {
        res.send({info: "Hey Guys!!"})
    });

    app.get('/personagens', async (req,res) => {
        res.send(await getPersonagensValidos())
    });

    app.get('/personagens/:id', async (req, res) =>{
        const id = req.params.id;
        const personagem = await getPersonagemById(id);
        res.send(personagem);
    });

    app.post('/personagens', async(req,res) =>{
        const objeto = req.body;
        
        if(!objeto || !objeto.nome || !objeto.imageUrl){
            res.send("Preencha todos os campos.");
            return;
        };

        const result = await personagens.insertOne(objeto);

		console.log(result);

		if (result.acknowledged == false) {
			res.send("Ocorreu um erro");
			return;
		}

        res.send(objeto)
    });

    app.put("/personagens/:id", async (req, res) => {
		const id = req.params.id;
		const objeto = req.body;

		if (!objeto || !objeto.nome || !objeto.imageUrl) {
			res.send("Preencha todos os campos.");
			return;
		}

		const quantidadePersonagens = await personagens.countDocuments({
			_id: ObjectId(id),
		});

		if (quantidadePersonagens !== 1) {
			res.send("Personagem não encontrado");
			return;
		}

		const result = await personagens.updateOne(
			{
				_id: ObjectId(id),
			},
			{
				$set: objeto,
			}
		);

		if (result.modifiedCount !== 1) {
			res.send("Ocorreu um erro ao atualizar o personagem");
			return;
		}
		res.send(await getPersonagemById(id));
	});

	app.delete("/personagens/:id", async (req, res) => {
		const id = req.params.id;

		const quantidadePersonagens = await personagens.countDocuments({
			_id: ObjectId(id),
		});
		
		if (quantidadePersonagens !== 1) {
			res.send("Personagem não encontrao");
			return;
		}
		
		const result = await personagens.deleteOne({
			_id: ObjectId(id),
		});
		
		if (result.deletedCount !== 1) {
			res.send("Ocorreu um erro ao remover o personagem");
			return;
		}

		res.send("Personagem removido com sucesso!");
	});

    app.listen(port, ()=>{
    console.info(`App rodando em http://localhost:${port}`)
    });
})();
