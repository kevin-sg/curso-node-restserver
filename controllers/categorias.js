const { request, response } = require("express");
const { Categoria } = require("../models");
const Usuario = require("../models/usuario");

// obtenerCategoria - paginado - total - populate
const obtenerCategoria = async (req = request, res = response) => {
	try {
		// Paginado
		const { desde = 0, limite = 4 } = req.query;

		const query = { estado: true };

		const populate = {
			path: "usuario",
			select: "nombre correo rol",
		};

		const [total, categorias] = await Promise.all([
			Categoria.countDocuments(query),
			Categoria.find(query)
				.sort({ nombre: 1 })
				.populate(populate)
				.skip(Number(desde))
				.limit(Number(limite)),
		]);

		res.json({ total, categorias });
	} catch (e) {
		console.error(e);
		res.status(401).json({ msg: "Error de peticion" });
	}
};

// obtenerCategoria - populate {}
const obtenerCategoriaById = (req, res) => {
	//
};

const crearCategorias = async (req = request, res = response) => {
	//
	const nombre = req.body.nombre.toUpperCase();

	const categoriaDB = await Categoria.findOne({ nombre });

	// Si no ecuentra la categoria
	if (categoriaDB) {
		return res.status(400).json({
			msg: `La categoria ${categoriaDB}, ya existe`,
		});
	}

	// Generar la data -> nombre y ID de ref.
	const data = {
		nombre,
		usuario: req.usuario._id,
	};

	const categoria = new Categoria(data);

	// Guardar DB
	await categoria.save();

	res.status(201).json(categoria);
};

// actualizarCategoria

// borrarCategoria - estado:false

module.exports = { crearCategorias, obtenerCategoria };
