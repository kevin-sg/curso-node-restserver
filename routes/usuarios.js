const { Router } = require("express");
const { check } = require("express-validator");
const Role = require("../models/role");

const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();
const {
	usuariosGet,
	usuarioPut,
	usuariosPost,
	usuarioPatch,
	usuarioDelete,
} = require("../controllers/usuarios");

// Rutas

// File 9 - video 13

// Como segundo argumento con los middlewares

router.get("/", usuariosGet);

router.put("/:id", usuarioPut);

router.post(
	"/",
	[
		check("nombre", "El nombre es obligatorio").not().isEmpty(),
		check(
			"password",
			"El password es obligatorio, debe ser mas de 6 letra"
		).isLength({ min: 6 }),
		check("correo", "El correo no es válido").isEmail(),
		check("rol").custom(async (rol = "") => {
			// Error personalizado
			const existeRol = await Role.findOne({ rol });
			if (!existeRol) {
				throw new Error(`El rol ${rol} no está registrado en la DB`);
			}
		}),
	],
	validarCampos,
	usuariosPost
);

// check("rol", "No es un rol válido").isIn(["ADMIN_ROLE", "USER_ROLE"]),

router.patch("/", usuarioPatch);

router.delete("/", usuarioDelete);

module.exports = router;
