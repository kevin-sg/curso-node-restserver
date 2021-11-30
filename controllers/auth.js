const { request, response } = require("express");
const bcryptjs = require("bcryptjs");

const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const Usuario = require("../models/usuario");

const login = async (req = request, res = response) => {
	const { correo, password } = req.body;

	try {
		// Verificar si email existe
		const usuario = await Usuario.findOne({ correo });
		if (!usuario) {
			return res.status(400).json({
				msg: "Usuario / Password no son correctos - correo",
			});
		}

		// Si el usuario está activo
		if (!usuario.estado) {
			return res.status(400).json({
				msg: "Usuario / Password no son correctos - estado:false",
			});
		}

		// Verificar la contraseña
		const validPassword = bcryptjs.compareSync(password, usuario.password);
		if (!validPassword) {
			return res.status(400).json({
				msg: "Usuario / Password no son correctos - password",
			});
		}

		// Generar el Token
		const token = await generarJWT(usuario.id);

		res.json({
			usuario,
			token,
		});
	} catch (e) {
		console.error(e);
		return res.json(500).json({ msg: "Hable con el administrador" });
	}
};

const googleSignin = async (req, res = response) => {
	const { id_token } = req.body;

	try {
		const googleUser = await googleVerify(id_token);

		console.log(googleUser);

		res.json({ msg: "Todo ok! Google signin", id_token });
	} catch (e) {
		res.status(400).json({ msg: "Token de Google no es válido" });
	}
};

module.exports = { login, googleSignin };
