const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");

// Controlador

const usuariosGet = async (req = request, res = response) => {
	const { limite = 5, desde = 0 } = req.query;

	// Usuario activos (true)
	const query = { estado: true };

	// Hacer la paginación && Mostrar total de usuarios
	const [total, usuarios] = await Promise.all([
		Usuario.countDocuments(query),
		Usuario.find(query).skip(Number(desde)).limit(Number(limite)),
	]);

	res.json({ total, usuarios });
};

const usuariosPost = async (req = request, res = response) => {
	const { nombre, correo, password, rol } = req.body;

	const usuario = new Usuario({ nombre, correo, password, rol });

	// genSaltSync -> numero de vueltas, a mayor numero sera mas lento
	const salt = bcryptjs.genSaltSync(10);
	usuario.password = bcryptjs.hashSync(password, salt); //hashSync -> para encriptar

	// guardar en MongoDB
	await usuario.save();

	res.json({ msg: "post API - usuarioPost", usuario });
};

const usuarioPut = async (req = request, res = response) => {
	const { id } = req.params;
	const { _id, password, google, correo, ...resto } = req.body;

	// TODO validar cotraseña de DB
	if (password) {
		// genSaltSync -> numero de vueltas, a mayor numero sera mas lento
		const salt = bcryptjs.genSaltSync(10);
		resto.password = bcryptjs.hashSync(password, salt); //hashSync -> para encriptar
	}

	// Busca el ID y actualiza
	const usuario = await Usuario.findByIdAndUpdate(id, resto);

	res.json(usuario);
};

const usuarioPatch = (req = request, res = response) => {
	res.json({
		msg: "patch API - usuarioPatch",
	});
};

const usuarioDelete = async (req = request, res = response) => {
	const { id } = req.params;

	const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

	res.json(usuario);
};

module.exports = {
	usuariosGet,
	usuariosPost,
	usuarioPut,
	usuarioPatch,
	usuarioDelete,
};
