const { Router } = require("express");
const { check } = require("express-validator");
const {
	crearProductos,
	obtenerProducto,
	obtenerProductoById,
	actualizarProducto,
	borrarProducto,
} = require("../controllers/productos");

const { existeProducto, existeCategoria } = require("../helpers/db-validators");

const { validarJWT, validarCampos, esAdminRole } = require("../middlewares");

const router = Router();

/**
 * {{url}}/api/Productos
 */

router.get("/", obtenerProducto);

router.get(
	"/:id",
	[
		check("id", "No es un ID válido").isMongoId(),
		check("id").custom(existeProducto),
		validarCampos,
	],
	obtenerProductoById
);

router.post(
	"/",
	[
		validarJWT,
		check("categoria", "No es un ID de Mongo").isMongoId(),
		check("categoria").custom(existeCategoria),
		validarCampos,
	],
	crearProductos
);

router.put(
	"/:id",
	[validarJWT, check("id").custom(existeProducto), validarCampos],
	actualizarProducto
);

router.delete(
	"/:id",
	[
		validarJWT,
		esAdminRole,
		check("id", "No es un ID válido").isMongoId(),
		check("id").custom(existeProducto),
		validarCampos,
	],
	borrarProducto
);

module.exports = router;
