const { Router } = require("express");
const { check } = require("express-validator");

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

// Como segundo argumento con los middlewares

router.get("/", usuariosGet);

router.put("/:id", usuarioPut);

router.post(
	"/",
	[
		check("nombre", "El nombre es obligatorio").not().isEmpty(),
		check("correo", "El correo no es válido").isEmail(),
		check(
			"password",
			"El password es obligatorio, debe ser mas de 6 letra"
		).isLength({ min: 6 }),
		check("rol", "No es un rol válido").isIn(["ADMIN_ROLE", "USER_ROLE"]),
	],
	validarCampos,
	usuariosPost
);

router.patch("/", usuarioPatch);

router.delete("/", usuarioDelete);

module.exports = router;
