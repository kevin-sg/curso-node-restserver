const { response } = require("express");
const { ObjectId } = require("mongoose").Types;
const { Usuario, Categoria, Producto } = require("../models");

const coleccionesPermitidas = ["usuarios", "categorias", "productos", "roles"];

const buscarUsuario = async (termino = "", res = response) => {
	const esMongoID = ObjectId.isValid(termino); // TRUE

	if (esMongoID) {
		const usuario = await Usuario.findById(termino);
		return res.json({ results: usuario ? [usuario] : [] });
	}

	const regex = new RegExp(termino, "i");

	const data = {
		$or: [{ nombre: regex }, { correo: regex }],
		$and: [{ estado: true }],
	};

	const [total, usuarios] = await Promise.all([
		Usuario.count(data),
		Usuario.find(data),
	]);

	res.json({ results: { total, usuarios } });
};

const buscarCategoria = async (termino, res = response) => {
	const esMongoID = ObjectId.isValid(termino); // TRUE

	if (esMongoID) {
		const categoria = await Categoria.findById(termino);
		return res.json({ results: categoria ? [categoria] : [] });
	}

	const regex = new RegExp(termino, "i");

	const [total, categorias] = await Promise.all([
		Categoria.count({ nombre: regex, estado: true }),
		Categoria.find({ nombre: regex, estado: true }),
	]);

	res.json({ results: { total, categorias } });
};

const buscarProducto = async (termino, res = response) => {
	const esMongoID = ObjectId.isValid(termino); // TRUE

	if (esMongoID) {
		const producto = await Producto.findById(termino)
			.populate("usuario", "nombre")
			.populate("categoria", "nombre");
		return res.json({ results: producto ? [producto] : [] });
	}

	const regex = new RegExp(termino, "i");

	const [total, productos] = await Promise.all([
		Producto.count({ nombre: regex, estado: true }),
		Producto.find({ nombre: regex, estado: true })
			.populate("usuario", "nombre")
			.populate("categoria", "nombre"),
	]);

	res.json({ results: { total, productos } });
};

const buscar = (req, res = response) => {
	const { coleccion, termino } = req.params;

	if (!coleccionesPermitidas.includes(coleccion)) {
		return res.status(400).json({
			msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`,
		});
	}

	switch (coleccion) {
		case "usuarios":
			buscarUsuario(termino, res);
			break;
		case "categorias":
			buscarCategoria(termino, res);
			break;
		case "productos":
			buscarProducto(termino, res);
			break;

		default:
			res.status(500).json({
				msg: "Se le olvido hacer la busqueda",
			});
	}
};

module.exports = { buscar };
