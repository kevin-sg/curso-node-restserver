const { Router } = require("express");
const { check } = require("express-validator");

const {
	validarCampos,
	validarJWT,
	esAdminRole,
	tieneRole,
} = require("../middlewares");

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
			"El password es obligatorio, debe ser más de 6 letras"
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
		validarJWT,
		// esAdminRole,
		tieneRole("ADMIN_ROLE", "VENTAS_ROLE"),
		check("id", "No es un ID válido").isMongoId(),
		check("id").custom(existeUsuarioId),
		validarCampos,
	],
	usuarioDelete
);

router.patch("/", usuarioPatch);

module.exports = router;
