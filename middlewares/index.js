const validarCampos = require("../middlewares/validar-campos");
const validarJWT = require("../middlewares/validar-jwt");
const esAdminRole = require("../middlewares/validar-roles");
const validaArchivoSubir = require("../middlewares/validar-archivo");

module.exports = {
	...validarCampos,
	...validarJWT,
	...esAdminRole,
	...validaArchivoSubir,
};
