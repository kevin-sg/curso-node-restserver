require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { dbConection } = require("../database/config");

class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT;

		this.paths = {
			auth: "/api/auth",
			buscar: "/api/buscar",
			usuarios: "/api/usuarios",
			categorias: "/api/categorias",
			productos: "/api/productos",
		};

		// Conectar a base de datos
		this.conectarDB();

		// Middlewares -> son funciones que se ejecutan antes de llamar
		// a un controlador o sea seguir con al ejecucion de mis peticiones
		this.middlewares();

		// Rutas de app
		this.routes();
	}

	async conectarDB() {
		await dbConection();
	}

	middlewares() {
		// CORS
		this.app.use(cors());

		// Lectura y parseo del body
		this.app.use(express.json());

		// Directorio Público
		this.app.use(express.static("public"));
	}

	routes() {
		this.app.use(this.paths.auth, require("../routes/auth"));
		this.app.use(this.paths.buscar, require("../routes/buscar"));
		this.app.use(this.paths.usuarios, require("../routes/usuarios"));
		this.app.use(this.paths.categorias, require("../routes/categorias"));
		this.app.use(this.paths.productos, require("../routes/productos"));
	}

	listen() {
		this.app.listen(this.port, () =>
			console.log(`Server in PORT: ${this.port}`)
		);
	}
}

module.exports = Server;
