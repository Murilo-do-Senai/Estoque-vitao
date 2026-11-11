import * as estoqueModel from "../model/estoqueModel.js"
import { conexao } from "../config/SQL.js";

export const listarEstoque = async (req,res) => {
 try {
    const lista = await estoqueModel.ListaEstoque();

    res.status(200).json(lista);
    
 } catch (error) {
    res.status(500).json({msg:"Ouve um erro ao listar"})
    console.log(error);
 }
}

export const listarEstoqueId = async (req,res) => {
    const id = req.params.id;
 try {
    const listaId = await estoqueModel.ListaEstoqueId(id);

    if(!id) return res.status(404).json({msg:"produto não encontrado"})

    res.status(200).json(listaId);
    
 } catch (error) {
    res.status(500).json({msg:"Ouve um erro ao listar"})
    console.log(error);
 }
}

export const listarEstoqueCategoria = async (req,res) => {
    const {categoria} = req.params;
 try {
   if(!categoria){
            return res.status(400).json({msg:"é necessario preencher os campos"})
        }

    const lista = await estoqueModel.ListaEstoqueCategoria(categoria);

    if(!lista|| lista.length === 0) return res.status(404).json({msg:"catgoria não registrada",categoria})

    res.status(200).json(lista);
    
 } catch (error) {
    res.status(500).json({msg:"Ouve um erro ao listar"})
    console.log(error);
 }
}

export const registroProduto = async (req,res) =>{
    const {nome,medida,unidade,valor,quantidade,categoria} = req.body;

    try {
        if(!nome || !medida || !unidade || !valor || !quantidade || !categoria){
            res.status(400).json({msg:"é necessario preencher todos os campos"})
        }

        const [rows] = await conexao.query("SELECT * FROM estoque WHERE nome = ?", [nome]);

        if (rows.length > 0) {
            return res.status(400).json({ messagem: "produto ja cadastrado" })
        };

    const id = await estoqueModel.RegistroProduto(nome,medida,unidade,valor,quantidade,categoria);

    res.status(201).json({msg:"Registrado com sucesso",id})
        
    } catch (error) {
    res.status(500).json({msg:"Ouve um erro ao registrar"})
    console.log(error);
    }
}

export const atualizarProduto = async (req,res) =>{
    const id = req.params.id;
    const {nome,medida,unidade,valor,categoria} = req.body;
    try {

        if(!nome || !medida || !unidade || !valor || !categoria){
            return res.status(400).json({msg:"é necessario preencher todos os campos"})
        }

        const atualizar = await estoqueModel.AtualizarProduto(nome,medida,unidade,valor,categoria,id);

        if(!atualizar) return res.status(404).json({msg:"produto não encontrado",id})
        
        res.status(200).json({msg:"produto atualizado com sucesso"})
    } catch (error) {
    res.status(500).json({msg:"Ouve um erro ao atualizar"})
    console.log(error);  
    }
}

export const deletarProduto = async (req,res)=>{
    const id = req.params.id;
    try {
        const deletar = await estoqueModel.DeletarProduto(id);

        if(!deletar) return res.stauts(404).json({msg:"produto não encontrado",id});

        res.status(200).json({msg:"produto removido com sucesso"})
        
    } catch (error) {
    res.status(500).json({msg:"Ouve um erro ao deletar"})
    console.log(error);   
    }
}

export const AdicionarTirar = async (req,res) =>{
        const id = req.params.id;
        const {entrada,saida} = req.body;
    try {

        const adicionar = await estoqueModel.AdicionarTirar(entrada,saida,id);

      if(!adicionar) return res.status(400).json({msg:"é necessario preencher os campos",entrada,saida})

        res.status(200).json({msg:"Processo concluido com sucesso",entrada,saida,id})
    } catch (error) {
    res.status(500).json({msg:"Ouve um erro ao adicionar ou tirar"})
    console.log(error); 
    }
}

export const listarHistorico = async (req,res) => {
 try {
    const listaH = await estoqueModel.ListarHistorico();

    console.log(listaH)

    res.status(200).json(listaH);

 } catch (error) {
    res.status(500).json({msg:"Ouve um erro ao listar"})
    console.log(error);
 }
}

export const listarHistoricoId = async (req,res) => {
    const id_produto = req.params.id_produto;
 try {
    const lista = await estoqueModel.ListarHistoricoId(id_produto);

    if(!lista) return res.status(404).json({msg:"Produto não encontrado"})

    res.status(200).json(lista);
    
 } catch (error) {
    res.status(500).json({msg:"Ouve um erro ao listar"})
    console.log(error);
 }
}

export const listarHistoricoData = async (req,res) => {
    const dataInicial = req.query.dataInicial;
   const dataFinal = req.query.dataFinal;
 try {
    const lista = await estoqueModel.ListarHistoricoData(dataInicial,dataFinal);

    res.status(200).json(lista);
    
 } catch (error) {
    res.status(500).json({msg:"Ouve um erro ao listar"})
    console.log(error);
 }
}

export const listarHistoricoSaida = async (req,res) => {
   const dataInicial = req.query.dataInicial;
   const dataFinal = req.query.dataFinal;
   
 try {
   const lista = await estoqueModel.ListarHistoricoSaida(dataInicial, dataFinal);

    res.status(200).json(lista);
    
 } catch (error) {
    res.status(500).json({msg:"Ouve um erro ao listar"})
    console.log(error);
 }
}

