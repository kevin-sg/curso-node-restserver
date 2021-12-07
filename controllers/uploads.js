const { response } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");

const cargarArchivos = async (req, res = response) => {
	// Si no hay archivos o si la longitud es 0
	if (
		!req.files ||
		!Object.keys(req.files).length === 0 ||
		!req.files.archivo
	) {
		res.status(400).json({ msg: "No hay archivos que subir" });
		return;
	}

	try {
		// Archivos
		// const nombre = await subirArchivo(req.files, ["txt", "md"], "textos");
		const nombre = await subirArchivo(req.files, undefined, "imgs");

		res.json({ nombre });
	} catch (msg) {
		res.status(400).json({ msg });
	}
};

const actualizarImagen = async (req, res = response) => {
	const { id, coleccion } = req.params;

	res.json({ id, coleccion });
};

module.exports = { cargarArchivos, actualizarImagen };
