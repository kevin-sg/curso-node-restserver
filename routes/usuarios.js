const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/validar-campos");
const {
	esRoleValido,
	emailExiste,
	existeUsuarioId,
} = require("../helpers/db-validators");

const {
	usuariosGet,
	usuarioPut,
	usuariosPost,
	usuarioPatch,
	usuarioDelete,
} = require("../controllers/usuarios");

const router = Router();

// Rutas

// File 9 - video 13

// Como segundo argumento con los middlewares
router.get("/", usuariosGet);

router.put(
	"/:id",
	[
		check("id", "No es un ID válido").isMongoId(),
		check("id").custom(existeUsuarioId),
		check("rol").custom(esRoleValido),
		validarCampos,
	],
	usuarioPut
);

router.post(
	"/",
	[
		check("nombre", "El nombre es obligatorio").not().isEmpty(),
		check(
			"password",
			"El password es obligatorio, debe ser mas de 6 letra"
		).isLength({ min: 6 }),
		check("correo").custom(emailExiste),
		check("rol").custom(esRoleValido),
		validarCampos,
	],
	usuariosPost
);

router.delete(
	"/:id",
	[
		check("id", "No es un ID válido").isMongoId(),
		check("id").custom(existeUsuarioId),
		validarCampos,
	],
	usuarioDelete
);

router.patch("/", usuarioPatch);

module.exports = router;
