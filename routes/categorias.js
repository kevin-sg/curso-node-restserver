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

// Obtener todas las categorias - publico
router.get("/", obtenerCategoria);

// Obtener una categoria por ID - publico
router.get(
	"/:id",
	[check("id").custom(existeCategoria), validarCampos],
	obtenerCategoriaById
);

// Crear categoria - privada - cualquier persona con un token válido
router.post(
	"/",
	[
		validarJWT,
		check("nombre", "El nombre es obligatorio").not().isEmpty(),
		validarCampos,
	],
	crearCategorias
);

// Actualizar - privada - cualquier con token válido
router.put(
	"/:id",
	[
		validarJWT,
		check("id", "No es un ID válido").isMongoId(),
		check("nombre", "El nombre es obligatorio").not().isEmpty(),
		check("estado", "El estado es obligatorio").not().isEmpty(),
		validarCampos,
		check("rol").custom(esAdminRole),
	],
	actualizarCategoria
);

// Borrar una categoria - Admin
router.delete(
	"/:id",
	[
		validarJWT,
		check("id", "No es un ID válido").isMongoId(),
		validarCampos,
		check("rol").custom(esAdminRole),
	],
	borrarCategoria
);

module.exports = router;
