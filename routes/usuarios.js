const { Router } = require("express");
const router = Router();
const {
	usuariosGet,
	usuarioPut,
	usuariosPost,
	usuarioPatch,
	usuarioDelete,
} = require("../controllers/usuarios");

// Rutas

router.get("/", usuariosGet);

router.put("/:id", usuarioPut);

router.post("/", usuariosPost);

router.patch("/", usuarioPatch);

router.delete("/", usuarioDelete);

module.exports = router;
