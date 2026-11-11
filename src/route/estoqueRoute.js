import {Router} from 'express';
import * as estoqueController from "../controller/estoqueController.js";

const router = Router();


router.get("/",estoqueController.listarEstoque);
router.get("/id/:id",estoqueController.listarEstoqueId);
router.get("/categoria/:categoria",estoqueController.listarEstoqueCategoria);
router.post("/registro",estoqueController.registroProduto);
router.put("/:id",estoqueController.atualizarProduto);
router.delete("/:id",estoqueController.deletarProduto);
router.put("/movimento/:id",estoqueController.AdicionarTirar);
//////////////////////////////./////////////////////////////////
router.get("/historico",estoqueController.listarHistorico);
router.get("/historico/id/:id_produto",estoqueController.listarHistoricoId);
router.get("/historico/data",estoqueController.listarHistoricoData);
router.get("/historico/saida",estoqueController.listarHistoricoSaida);



export default router;