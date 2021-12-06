const { request, response } = require("express");
const { Producto } = require("../models");

const obtenerProducto = async (req = request, res = response) => {
	try {
		const { desde = 0, limite = 5 } = req.query;

		const [total, Productos] = await Promise.all([
			Producto.countDocuments({ estado: true }),
			Producto.find({ estado: true })
				.sort({ nombre: 1 })
				.populate("usuario", "nombre")
				.populate("categoria", "nombre")
				.skip(Number(desde))
				.limit(Number(limite)),
		]);

		res.json({ total, Productos });
	} catch (e) {
		console.error(e);
		res.status(401).json({ msg: "Error de peticion" });
	}
};

const obtenerProductoById = async (req = request, res = response) => {
	try {
		const { id } = req.params;

		const producto = await Producto.findById(id)
			.populate("usuario", "nombre")
			.populate("categoria", "nombre");

		if (!producto.estado) {
			return res.status(401).json({ msg: "La Producto esta bloqueada" });
		}

		res.json(producto);
	} catch (e) {
		console.error(e);
		res.status(401).json({ msg: "Error de peticion" });
	}
};

const crearProductos = async (req = request, res = response) => {
	const { estado, usuario, ...body } = req.body;

	const productoDB = await Producto.findOne({ nombre: body.nombre });

	// Si ecuentra la Producto
	if (productoDB) {
		return res.status(400).json({
			msg: `La Producto ${productoDB.nombre}, ya existe`,
		});
	}

	// Generar la data
	const data = {
		...body,
		nombre: body.nombre.toUpperCase(),
		usuario: req.usuario._id,
	};

	const producto = new Producto(data);

	// Guardar DB
	await producto.save();

	res.status(201).json(producto);
};

const actualizarProducto = async (req = request, res = response) => {
	try {
		const { id } = req.params;
		const { estado, usuario, ...data } = req.body;

		if (data.nombre) {
			data.nombre = data.nombre.toUpperCase();
		}
		data.usuario = req.usuario._id;

		const producto = await Producto.findByIdAndUpdate(id, data, {
			new: true,
		});

		res.json(producto);
	} catch (e) {
		console.error(e);
		res.status(401).json({ msg: "Error de peticion" });
	}
};

const borrarProducto = async (req = request, res = response) => {
	try {
		const { id } = req.params;

		const producto = await Producto.findByIdAndUpdate(
			id,
			{
				estado: false,
			},
			{ new: true }
		);

		res.json({ msg: `Producto ${producto.nombre} bloqueda!` });
	} catch (e) {
		console.error(e);
		res.status(401).json({ msg: "Error al borrar" });
	}
};

module.exports = {
	crearProductos,
	obtenerProducto,
	obtenerProductoById,
	actualizarProducto,
	borrarProducto,
};
