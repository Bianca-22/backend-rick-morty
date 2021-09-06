const express = require("express");
require("express-async-error");
require("dotenv").config();
var cors = require("cors");

const home = require("./components/home/home");
const readAll = require("./components/read_all/read_all");
const create = require("./components/create/create");
const update = require("./components/update/update");
const deletar = require("./components/delete/delete");
const readById = require("./components/read_by_id/read_by_id");

(async () => {
    const app = express();
    app.use(express.json());
	const port = process.env.PORT || 3000;

	// CORS - Novo
	app.use(cors());

	app.options("*", cors());

	// CORS - Antigo
		// app.all("/*", (req, res, next) => {
		// 	res.header("Access-Control-Allow-Origin", "*");
		// 	res.header("Access-Control-Allow-Methods", "*");
		// 	res.header(
		// 		"Access-Control-Allow-Headers",
		// 		"Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization"
		// 	);
		// 	next();
		// });

	app.use('/home', home);

    app.use('/read_all', readAll);

    app.use('/read_by_id', readById);

    app.use('/create', create);

    app.use('/update', update);

	app.use('/delete', deletar);

	app.all("*", function (req, res) {
		res.status(404).send({ message: "Endpoint was not found" });
	});

	app.use((error, req, res, next) => {
		res.status(error.status || 500).send({
			error: {
				status: error.status || 500,
				message: error.message || "Internal Server Error",
			},
		});
	});

    app.listen(port, ()=>{
    console.info(`App rodando em http://localhost:${port}/home`)
    });
})();
