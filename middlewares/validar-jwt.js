const { response, request } = require("express");
const jwt = require("jsonwebtoken");

const Usuario = require("../models/usuario");

const validarJWT = async (req = request, res = response, next) => {
	const token = req.header("x-token");

	if (!token)
		return res.status(401).json({ msg: "No hay Token en la petición" });

	try {
		const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

		// Leer el usuario que corresponde al uid
		const usuario = await Usuario.findById(uid);
		if (!usuario) {
			return res.status(401).json({ msg: "Usuario no existente" });
		}

		// Verificar si el uid tiene estado en true
		if (!usuario.estado) {
			return res.status(401).json({ msg: "Token no válido" });
		}

		req.usuario = usuario;

		next();
	} catch (e) {
		console.error(e);
		res.status(4041).json({
			msg: "Token lo válido",
		});
	}
};

module.exports = { validarJWT };
