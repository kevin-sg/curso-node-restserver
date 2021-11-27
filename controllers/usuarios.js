const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");

// Controlador

const usuariosGet = (req = request, res = response) => {
	const { q, nombre = "No name", appkey, limit } = req.query;

	res.json({
		msg: "get API - controlador",
		q,
		nombre,
		appkey,
		limit,
	});
};

const usuariosPost = async (req = request, res = response) => {
	const { nombre, correo, password, rol } = req.body;

	const usuario = new Usuario({ nombre, correo, password, rol });

	// Verificar si el correo existe
	const existeEmail = await Usuario.findOne({ correo });
	if (existeEmail) {
		return res.status(400).json({ msg: "El correo ya está registrado" });
	}

	// Encriptar la contraseña
	// genSaltSync -> numero de vueltas, a mayor numero sera mas lento
	const salt = bcryptjs.genSaltSync(10);
	usuario.password = bcryptjs.hashSync(password, salt); //hashSync -> para encriptar

	// guardar en MongoDB
	await usuario.save();

	res.json({
		msg: "post API - controlador",
		usuario,
	});
};

const usuarioPut = (req = request, res = response) => {
	const { id } = req.params;

	res.status(400).json({
		msg: "put API - controlador",
		id,
	});
};

const usuarioPatch = (req = request, res = response) => {
	res.json({
		msg: "patch API - controlador",
	});
};

const usuarioDelete = (req = request, res = response) => {
	res.json({
		msg: "delete API - controlador",
	});
};

module.exports = {
	usuariosGet,
	usuariosPost,
	usuarioPut,
	usuarioPatch,
	usuarioDelete,
};
