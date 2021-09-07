const express = require("express");
require("dotenv").config();
require("express-async-errors");
var cors = require("cors");
//requires de endpoints
const home = require("./components/home/home");
const readAll = require("./components/read_all/read_all");
const readById = require("./components/read_by_id/read_by_id");
const del = require("./components/delete/delete");
const update = require("./components/update/update");
const criar = require("./components/create/create");

(async () => {
	const app = express();
	app.use(express.json());
	const port = process.env.PORT || 3000;

	//CORS
	app.use(cors());
	app.options("*", cors());

	//Criando a rota home
	app.use("/home", home);

	// criando a rota read-all
	app.use("/personagens/read-all", readAll);

	//[GET] getPersonagemById
	app.use("/personagens/read-by-id/", readById);

	//[POST] Adicona personagem
	app.use("/personagens/create/", criar);

	//[PUT] Atualizar personagem
	app.use("/personagens/update/", update);

	//[DELETE] Deleta um personagem
	app.use("/personagens/delete/", del);

	//Tratamento de erros
	//Middleware verificar endpoints
	app.all("*", function (req, res) {
		res.status(404).send({ message: "Endpoint was not found" });
	});

	//Middleware -> Tratamento de erro
	app.use((error, req, res, next) => {
		res.status(error.status || 500).send({
			error: {
				status: error.status || 500,
				message: error.message || "Internal Server Error",
			},
		});
	});

	app.listen(port, () => {
		console.info(`App rodando em http://localhost:${port}/home`);
	});
})();
