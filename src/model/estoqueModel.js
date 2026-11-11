import {conexao} from '../config/SQL.js'

export async function ListaEstoque() {
    const [resultado] = await conexao.query(`
        SELECT id,nome,CONCAT(medida,' ',unidade) AS medida,
        saida,entrada,valor,quantidade,CONCAT(porcentagem,'%') AS porcentagem,categoria,
        quantidade * valor AS valor_total from vw_estoque 
        `)

        return resultado;
}

export async function ListaEstoqueId(id) {
    const [resultado] = await conexao.query(`
        select * from vw_estoque where id = ?
        `, [id])

        return resultado;
}

export async function ListaEstoqueCategoria(categoria) {
    const [resultado] = await conexao.query(`
        select * from vw_estoque where categoria = ?
        `, [categoria])

        return resultado;
}

export async function RegistroProduto(nome,medida,unidade,valor,quantidade,categoria) {
    const [resultado] = await conexao.query(`
        insert into estoque (nome,medida,unidade,valor,quantidade,categoria) values
        (?,?,?,?,?,?)
        `,[nome,medida,unidade || "cm",valor,quantidade,categoria || "Lazer"])

        return resultado.insertId;
}

export async function AtualizarProduto(nome,medida,unidade,valor,categoria,id) {
    const [resultado] = await conexao.query(`
        update estoque set nome =?,medida =?,unidade =?,valor =?,categoria =? where id = ?
        `,[nome,medida,unidade || "cm",valor,categoria || "Lazer",id])

        return resultado.affectedRows;
}

export async function DeletarProduto(id){
    const [resultado] = await conexao.query(`
        delete from estoque where id = ?
        `,[id])

        return resultado
}

export async function AdicionarTirar(entrada,saida,id) {
    const [resultado] = await conexao.query(
        `update estoque set entrada =?,saida = ? where id = ?`
    ,[entrada,saida,id])

    return resultado.affectedRows;
}

///////////////////////////////////////////////////////////////////

export async function ListarHistorico(tempo) {
    const [resultado] = await conexao.query(`
        select * from estoque_historico order by tempo DESC
        `,[tempo]);

        console.log(resultado)
        return resultado;
}

export async function ListarHistoricoId(id_produto) {
    const [resultado] = await conexao.query(`
        select * from estoque_historico where id_produto = ?
        `,[id_produto]);
        return resultado;
    
}

export async function ListarHistoricoData(dataInicial, dataFinal) {
    const [resultado] = await conexao.query(`
        select estoque.NOME,estoque.MEDIDA,estoque.UNIDADE,estoque_historico.entrada,estoque_historico.saida,
        estoque.valor * estoque_historico.saida AS valor_saida,estoque.valor * estoque_historico.entrada AS valor_entrada
        from estoque LEFT JOIN estoque_historico
        ON estoque.id = estoque_historico.Id_produto
        where estoque_historico.tempo >= ? AND estoque_historico.tempo < ?
        `,[dataInicial, dataFinal]);
        return resultado;
}

export async function ListarHistoricoSaida(dataInicial, dataFinal) {
    const [resultado] = await conexao.query(`
        SELECT estoque.nome,estoque.SAIDA, estoque_historico.saida * estoque.VALOR AS valor_saidas,
         estoque_historico.tempo 
        FROM estoque
        LEFT JOIN estoque_historico ON estoque_historico.Id_produto = estoque.id
        WHERE estoque_historico.tempo >= ? AND estoque_historico.tempo < ? ORDER BY estoque.SAIDA DESC
  );
        `,[dataInicial, dataFinal]);
        return resultado;
}
