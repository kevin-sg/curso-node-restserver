const { Router } = require("express");
const { check } = require("express-validator");

const {
	cargarArchivos,
	mostrarImagen,
	actualizarImagenCloudinary,
} = require("../controllers/uploads");

const { colecionesPermitidas } = require("../helpers");

const { validarCampos, validaArchivoSubir } = require("../middlewares");

const router = Router();

router.post("/", validaArchivoSubir, cargarArchivos);

router.put(
	"/:coleccion/:id",
	[
		validaArchivoSubir,
		check("id", "No es un ID válido").isMongoId(),
		check("coleccion").custom((c) =>
			colecionesPermitidas(c, ["usuarios", "productos"])
		),
		validarCampos,
	],
	actualizarImagenCloudinary
);

router.get(
	"/:coleccion/:id",
	[
		check("id", "No es un ID válido").isMongoId(),
		check("coleccion").custom((c) =>
			colecionesPermitidas(c, ["usuarios", "productos"])
		),
		validarCampos,
	],
	mostrarImagen
);

module.exports = router;
