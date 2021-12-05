const { Router } = require("express");
const { check } = require("express-validator");
const {
	crearCategorias,
	obtenerCategoria,
} = require("../controllers/categorias");

const { validarJWT, validarCampos } = require("../middlewares");

const router = Router();

/**
 * {{url}}/api/categorias
 */

// Obtener todas las categorias - publico
router.get("/", obtenerCategoria);

// Obtener una categoria por ID - publico
router.get(
	"/:id",
	[
		check("id", "Ingrese un ID válido").isMongoId,
		// check('id').custom(existeCategoria)
	],
	obtenerCategoria
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
router.put("/:id", (req, res) => {
	res.json("put ID");
});

// Borrar una categoria - Admin
router.delete("/:id", (req, res) => {
	res.json("Delete");
});

module.exports = router;
