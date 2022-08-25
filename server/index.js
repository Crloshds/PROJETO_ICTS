const express = require("express");
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const { application } = require("express");

app.use(cors()); /* Algo que tem que ser feito ao fazer requisicoes ao backend */
app.use(express.json());

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: '',
    database: 'products',
});

app.get('/products', (req, res) => {

    db.query('SELECT * FROM produto',(err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result);
        }
    }
    );
});

app.get('/products/:id', (req, res) => {
    const id = req.params.id;

    db.query('SELECT * FROM produto WHERE id = ?',
    [id],(err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result);
        }
    }
    );
});


app.post('/products/create', (req, res) => {
    const product = req.body.product;
    const description = req.body.description;
    const price = req.body.price;
    const dataCriacao = new Date();

    db.query('INSERT INTO produto (nome, descricao, preco, data_criacao) VALUES (?,?,?,?)', 
    [product, description, price, dataCriacao], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send("Valores inseridos");
        }
    }
    );
});

app.put('/products/update', (req, res) => {
    const id = req.body.id;
    const product = req.body.product;
    const description = req.body.description;
    const price = req.body.price;
    const dataCriacao = req.body.dataCriacao;
    const dataModi = new Date();

    db.query('UPDATE produto SET nome= ?, descricao= ?, preco= ?, data_criacao= ?, data_atualizacao= ? WHERE id= ?;', 
    [product, description, price, dataCriacao, dataModi, id], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send("Valores atualizados com sucesso");
        }
    }
    );
});

app.delete('/products/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM products.produto WHERE id= ?;', 
    [id], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send("Produto removido");
        }
    }
    );
});

/*------------------------------------------------------------------------------------------------------------------------------------ */



app.get('/compras', (req, res) => {

    db.query('SELECT * from compra',(err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result);
        }
    }
    );
});

app.get('/compras/:id', (req, res) => {


    db.query('SELECT * FROM produto',(err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result);
        }
    }
    );
});


app.post('/compras/create', (req, res) => {
    const total = req.body.total;
    const dataCriacao = new Date();
    const tipoPagamento = req.body.tipoPagamento;
    const status = req.body.status;
    const listaProduto = req.body.listaProduto;

    db.query('INSERT INTO compra (total, tipo_pagamento, status, data_criacao) VALUES (?,?,?,?)', 
        [total, tipoPagamento, status, dataCriacao], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                db.query('SELECT max(id) as ultimoId FROM compra',(err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        let compraId = result[0].ultimoId;
                        for (const i in listaProduto) { 

                            db.query('INSERT INTO controle_compra_produto (produto_id, compra_id, quantidade) VALUES (?,?,?)', 
                            [listaProduto[i].produtoId, compraId, listaProduto[i].quantidade], (err, result) => {
                                if (err) {
                                    console.log(err);
                                }
                            });
                        }
                        res.send("Compra Registrada");
                    }           
                });
            }
        });
});

app.put('/compras/update', (req, res) => {
    const id = req.body.id;
    const total = req.body.total;
    const dataCriacao = req.body.dataCriacao;
    const tipoPagamento = req.body.tipoPagamento;
    const status = req.body.status;
    const listaProduto = req.body.listaProduto;

    db.query('UPDATE compra SET total = ?, tipo_pagamento = ?, status = ?, data_criacao = ? WHERE id= ?;', 
        [total, tipoPagamento, status, dataCriacao, id], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                db.query('DELETE FROM controle_compra_produto WHERE compra_id = ?;', 
                [id], (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        for (const i in listaProduto) { 

                            db.query('INSERT INTO controle_compra_produto (produto_id, compra_id, quantidade) VALUES (?,?,?)', 
                            [listaProduto[i].produtoId, id, listaProduto[i].quantidade], (err, result) => {
                                if (err) {
                                    console.log(err);
                                }
                            });
                        }
                        res.send("Valores atualizados com sucesso");
                    }           
                });
            }
        });
});

app.delete('/compras/:id', (req, res) => {
    const id = req.params.id;

    db.query('DELETE FROM controle_compra_produto WHERE compra_id = ?;', 
    [id], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            db.query('DELETE FROM compra WHERE id= ?;', 
            [id], (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    res.send("Produto removido");
                }
            }
            );
        }
    }
    );
});

app.listen(3001, ()=> {
    console.log("Yey, your server is running on port 3001");
});