const { Router } = require("express");
const { check } = require("express-validator");
const {
	crearCategorias,
	obtenerCategoria,
	obtenerCategoriaById,
	actualizarCategoria,
	borrarCategoria,
} = require("../controllers/categorias");

const { existeCategoria } = require("../helpers/db-validators");

const { validarJWT, validarCampos, esAdminRole } = require("../middlewares");

const router = Router();

/**
 * {{url}}/api/categorias
 */

router.get("/", obtenerCategoria);

router.get(
	"/:id",
	[
		check("id", "No es un ID válido").isMongoId(),
		check("id").custom(existeCategoria),
		validarCampos,
	],
	obtenerCategoriaById
);

router.post(
	"/",
	[
		validarJWT,
		check("nombre", "El nombre es obligatorio").not().isEmpty(),
		validarCampos,
	],
	crearCategorias
);

router.put(
	"/:id",
	[
		validarJWT,
		check("id", "No es un ID válido").isMongoId(),
		check("nombre", "El nombre es obligatorio").not().isEmpty(),
		check("id").custom(existeCategoria),
		validarCampos,
	],
	actualizarCategoria
);

router.delete(
	"/:id",
	[
		validarJWT,
		esAdminRole,
		check("id", "No es un ID válido").isMongoId(),
		check("id").custom(existeCategoria),
		validarCampos,
	],
	borrarCategoria
);

module.exports = router;
