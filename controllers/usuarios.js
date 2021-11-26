const { response, request } = require("express");

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

const usuariosPost = (req, res = response) => {
	const body = req.body;

	res.json({
		msg: "post API - controlador",
		body,
	});
};

const usuarioPut = (req, res = response) => {
	const { id } = req.params;

	res.status(400).json({
		msg: "put API - controlador",
		id,
	});
};

const usuarioPatch = (req, res = response) => {
	res.json({
		msg: "patch API - controlador",
	});
};

const usuarioDelete = (req, res = response) => {
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
