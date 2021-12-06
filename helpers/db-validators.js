const Role = require("../models/role");
const { Usuario, Categoria, Producto } = require("../models");

const esRoleValido = async (rol = "") => {
	// Verificar el rol del usuario
	const existeRol = await Role.findOne({ rol });
	if (!existeRol) {
		throw new Error(`El rol ${rol} no está registrado en la DB`);
	}
};

const emailExiste = async (correo = "") => {
	// Verificar si el correo existe
	const existeEmail = await Usuario.findOne({ correo });
	if (existeEmail) {
		throw new Error(`El ${correo} ya está registrado`);
	}
};

const existeUsuarioId = async (id) => {
	const existeUsuario = await Usuario.findById(id);
	if (!existeUsuario) {
		throw new Error(`El id no existe: ${id}`);
	}
};

const existeCategoria = async (id) => {
	const existeCategoria = await Categoria.findById(id);

	if (!existeCategoria) {
		throw new Error(`El id no existe: ${id}`);
	}
};

const existeProducto = async (id) => {
	const existeProducto = await Producto.findById(id);

	if (!existeProducto) {
		throw new Error(`El id no existe: ${id}`);
	}
};

module.exports = {
	esRoleValido,
	emailExiste,
	existeUsuarioId,
	existeCategoria,
	existeProducto,
};
