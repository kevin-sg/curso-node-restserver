const path = require("path");
const fs = require("fs");

// Server IMG
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require("express");

const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require("../models");

const cargarArchivos = async (req, res = response) => {
	try {
		const nombre = await subirArchivo(req.files, undefined, "imgs");

		res.json({ nombre });
	} catch (msg) {
		res.status(400).json({ msg });
	}
};

// Forma Local
/* const actualizarImagen = async (req, res = response) => {
	// id = usuarios || productos
	const { id, coleccion } = req.params;

	let modelo;

	switch (coleccion) {
		case "usuarios":
			modelo = await Usuario.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un usuario con el id: ${id}`,
				});
			}
			break;

		case "productos":
			modelo = await Producto.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un usuario con el id: ${id}`,
				});
			}
			break;

		default:
			return res.status(500).json({ msg: "Se me olvidó validar esto" });
	}

	// Limpiar imágenes previas
	if (modelo.img) {
		// Ruta de imagen del servidor
		const pathImagen = path.join(
			__dirname,
			"../uploads",
			coleccion,
			modelo.img
		);
		// Si el archivo existe --> Borrar archivo
		if (fs.existsSync(pathImagen)) fs.unlinkSync(pathImagen);
	}

	try {
		// Subir archivo a DB
		const nombre = await subirArchivo(req.files, undefined, coleccion);
		modelo.img = nombre;

		await modelo.save();

		res.json(modelo);
	} catch (msg) {
		res.status(400).json({ msg });
	}
}; */

// Server Cloudinary
const actualizarImagenCloudinary = async (req, res = response) => {
	// id = usuarios || productos
	const { id, coleccion } = req.params;

	let modelo;

	switch (coleccion) {
		case "usuarios":
			modelo = await Usuario.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un usuario con el id: ${id}`,
				});
			}
			break;

		case "productos":
			modelo = await Producto.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un usuario con el id: ${id}`,
				});
			}
			break;

		default:
			return res.status(500).json({ msg: "Se me olvidó validar esto" });
	}

	// Limpiar imágenes previas del servidor
	if (modelo.img) {
		const nombreArr = modelo.img.split("/");
		const nombre = nombreArr[nombreArr.length - 1];
		const [public_id] = nombre.split(".");
		// Eliminar del server por el id de la img
		cloudinary.uploader.destroy(public_id);
	}

	const { tempFilePath } = req.files.archivo;
	const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
	modelo.img = secure_url;
	await modelo.save();

	res.json(modelo);
};

const mostrarImagen = async (req, res = response) => {
	// id = usuarios || productos
	const { id, coleccion } = req.params;

	let modelo;

	switch (coleccion) {
		case "usuarios":
			modelo = await Usuario.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un usuario con el id: ${id}`,
				});
			}
			break;

		case "productos":
			modelo = await Producto.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un usuario con el id: ${id}`,
				});
			}
			break;

		default:
			return res.status(500).json({ msg: "Se me olvidó validar esto" });
	}

	// Limpiar imágenes previas
	if (modelo.img) {
		// Ruta de imagen del servidor
		const pathImagen = path.join(
			__dirname,
			"../uploads",
			coleccion,
			modelo.img
		);

		// Si el archivo existe --> Envia el archivo
		if (fs.existsSync(pathImagen)) return res.sendFile(pathImagen);
	}

	// Ruta de no imagen
	const pathNotImagen = path.join(__dirname, "../assets/no-image.jpg");

	res.sendFile(pathNotImagen);
};

module.exports = { cargarArchivos, actualizarImagenCloudinary, mostrarImagen };
