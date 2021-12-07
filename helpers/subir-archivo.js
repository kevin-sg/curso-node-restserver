const path = require("path");
const { v4: uuidv4 } = require("uuid");

const subirArchivo = (
	file,
	extensionValidas = ["png", "jpg", "jpeg", "gif"],
	carpeta = ""
) => {
	return new Promise((resolve, reject) => {
		// Saber extención
		const { archivo } = file;
		const nombreCortado = archivo.name.split(".");
		const extension = nombreCortado[nombreCortado.length - 1];

		// Validar la extensión
		if (!extensionValidas.includes(extension)) {
			return reject(
				`La extensión ${extension} no es permitida - ${extensionValidas}`
			);
		}

		const nombreTemp = uuidv4() + "." + extension;

		const uploadPath = path.join(
			__dirname,
			"../uploads/",
			carpeta,
			nombreTemp
		);

		archivo.mv(uploadPath, (err) => {
			if (err) reject(err);

			resolve(nombreTemp);
		});
	});
};

module.exports = { subirArchivo };
