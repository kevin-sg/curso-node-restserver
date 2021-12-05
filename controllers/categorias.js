const { request, response } = require("express");
const { Categoria } = require("../models");

const obtenerCategoria = async (req = request, res = response) => {
	try {
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

const obtenerCategoriaById = async (req = request, res = response) => {
	try {
		const { id } = req.params;
		const populate = {
			path: "usuario",
			select: "nombre correo rol",
		};

		const categoria = await Categoria.findById(id).populate(populate);

		res.json({ categoria });
	} catch (e) {
		console.error(e);
		res.status(401).json({ msg: "Error de peticion" });
	}
};

const crearCategorias = async (req = request, res = response) => {
	const nombre = req.body.nombre.toUpperCase();

	const categoriaDB = await Categoria.findOne({ nombre });

	// Si ecuentra la categoria
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

const actualizarCategoria = async (req = request, res = response) => {
	try {
		const { id } = req.params;
		const nombre = req.body.nombre.toUpperCase();
		const { estado } = req.body;

		const existeCategoria = await Categoria.findById(id);
		if (!existeCategoria) {
			return res.status(400).json({
				msg: "La categoria no existe",
			});
		}

		const payload = { nombre, estado };

		const categoria = await Categoria.findByIdAndUpdate(id, payload, {
			new: true,
		});

		res.json({ categoria });
	} catch (e) {
		console.error(e);
		res.status(401).json({ msg: "Error de peticion" });
	}
};

const borrarCategoria = async (req = request, res = response) => {
	try {
		const { id } = req.params;

		const payload = { estado: false };

		const categoria = await Categoria.findByIdAndUpdate(id, payload, {
			new: true,
		});

		res.json({ categoria });
	} catch (e) {
		console.error(e);
		res.status(401).json({ msg: "Error al borrar" });
	}
};

module.exports = {
	crearCategorias,
	obtenerCategoria,
	obtenerCategoriaById,
	actualizarCategoria,
	borrarCategoria,
};
