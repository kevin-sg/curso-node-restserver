const { response } = require("express");

const validaArchivoSubir = (req, res = response, next) => {
	// Si no hay archivos o si la longitud es 0
	if (
		!req.files ||
		Object.keys(req.files).length === 0 ||
		!req.files.archivo
	) {
		return res.status(400).json({
			msg: "No hay archivos que subir - validarArchivoSubir",
		});
	}

	next();
};

module.exports = { validaArchivoSubir };
