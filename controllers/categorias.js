const { request, response } = require("express");
const { Categoria } = require("../models");

const obtenerCategoria = async (req = request, res = response) => {
	try {
		const { desde = 0, limite = 5 } = req.query;

		const [total, categorias] = await Promise.all([
			Categoria.countDocuments({ estado: true }),
			Categoria.find({ estado: true })
				.sort({ nombre: 1 })
				.populate("usuario", "nombre")
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

		const categoria = await Categoria.findById(id).populate(
			"usuario",
			"nombre"
		);

		if (!categoria.estado) {
			return res.status(401).json({ msg: "La categoria esta bloqueada" });
		}

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
		const { estado, usuario, ...data } = req.body;

		data.nombre = data.nombre.toUpperCase();
		data.usuario = req.usuario._id;

		const categoria = await Categoria.findByIdAndUpdate(id, data, {
			new: true,
		});

		res.json(categoria);
	} catch (e) {
		console.error(e);
		res.status(401).json({ msg: "Error de peticion" });
	}
};

const borrarCategoria = async (req = request, res = response) => {
	try {
		const { id } = req.params;

		const categoria = await Categoria.findByIdAndUpdate(id, {
			estado: false,
		});
		if (!categoria.estado) {
			return res.status(401).json({
				msg: `La categoria ${categoria.nombre} esta bloqueada`,
			});
		}

		res.json({ msg: `Categoria ${categoria.nombre} bloqueda!` });
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
