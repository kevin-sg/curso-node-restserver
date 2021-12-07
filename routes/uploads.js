const { Router } = require("express");
const { check } = require("express-validator");

const { cargarArchivos, actualizarImagen } = require("../controllers/uploads");

const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.post("/", cargarArchivos);

router.put(
	"/:coleccion/:id",
	[
		check("id", "No es un ID válido").isMongoId(),
		// check("coleccion").custom((c) =>
		// 	colecionesPermitidas(c, ["usuarios", "productos"])
		// ),
		validarCampos,
	],
	actualizarImagen
);

module.exports = router;
