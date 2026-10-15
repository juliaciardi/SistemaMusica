const express = require("express");
const cors = require("cors");
const conexao = require("./db.js");


const app = express();
const PORTA = 3000;


app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.status(200).json({ mensagem: "API Sistema de musicas funcionando" });
});


app.get("/artistas", (req, res) => {
    const sql = "SELECT * FROM artistas";
    conexao.query(sql, (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao listar artistas" });
        }
        res.status(200).json(resultado);
    });
});


app.get("/artistas/:id", (req, res) => {
    const id = Number(req.params.id);


    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ erro: "ID inválido" });
    }


    const sql = `SELECT * FROM artistas WHERE id = ?`;
    conexao.query(sql, [id], (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao buscar artista" });
        }
        if (resultado.length === 0) {
            return res.status(404).json({ erro: "Artista não encontrado" });
        }
        res.status(200).json(resultado[0]);
    });
});


app.get("/artistas/:id/musicas", (req, res) => {
    const id = Number(req.params.id);


    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ erro: "ID inválido" });
    }


    const sql = `
        SELECT musicas.*, artistas.nome AS artista_nome 
        FROM musicas
        INNER JOIN artistas ON musicas.artista_id = artistas.id
        WHERE artistas.id = ?
    `;


    conexao.query(sql, [id], (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao buscar músicas do artista" });
        }
        res.status(200).json(resultado);
    });
});


app.get("/artistas/:id/albuns", (req, res) => {
    const id = Number(req.params.id);


    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ erro: "ID inválido" });
    }


    const sql = `
        SELECT albuns.*, artistas.nome AS artista_nome 
        FROM albuns
        INNER JOIN artistas ON albuns.artista_id = artistas.id
        WHERE artistas.id = ?
    `;


    conexao.query(sql, [id], (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao buscar álbuns do artista" });
        }
        res.status(200).json(resultado);
    });
});


app.post("/artistas", (req, res) => {
    const { nome, genero, pais } = req.body;


    if (!nome || !genero || !pais) {
        return res.status(400).json({ erro: "Os campos nome, genero e pais são obrigatórios" });
    }


    const sql = `INSERT INTO artistas (nome, genero, pais) VALUES (?, ?, ?)`;
    conexao.query(sql, [nome, genero, pais], (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao cadastrar artista" });
        }
        res.status(201).json({
            mensagem: "Artista cadastrado com sucesso",
            id: resultado.insertId
        });
    });
});


app.delete("/artistas/:id", (req, res) => {
    const id = Number(req.params.id);


    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ erro: "ID inválido" });
    }


    const sql = `DELETE FROM artistas WHERE id = ?`;
    conexao.query(sql, [id], (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao excluir artista" });
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ msg: "Artista não encontrado" });
        }
        res.status(200).json({ msg: "Artista excluído com sucesso" });
    });
});


app.put("/artistas/:id", (req, res) => {
    const id = Number(req.params.id);
    const { nome, genero, pais } = req.body;


    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ erro: "ID inválido" });
    }


    if (!nome || !genero || !pais) {
        return res.status(400).json({ erro: "Os campos nome, genero e pais são obrigatórios" });
    }


    const sql = "UPDATE artistas SET nome = ?, genero = ?, pais = ? WHERE id = ?";


    conexao.query(sql, [nome, genero, pais, id], (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao atualizar artista" });
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ msg: "Artista não encontrado" });
        }
        res.status(200).json({ msg: "Artista atualizado com sucesso" });
    });
});


app.get("/albuns", (req, res) => {
    const sql = "SELECT * FROM albuns";
    conexao.query(sql, (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao listar álbuns" });
        }
        res.status(200).json(resultado);
    });
});


app.get("/albuns/:id", (req, res) => {
    const id = Number(req.params.id);


    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ erro: "ID inválido" });
    }


    const sql = `SELECT * FROM albuns WHERE id = ?`;
    conexao.query(sql, [id], (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao buscar álbum" });
        }
        if (resultado.length === 0) {
            return res.status(404).json({ erro: "Álbum não encontrado" });
        }
        res.status(200).json(resultado[0]);
    });
});


app.post("/albuns", (req, res) => {
    const { titulo, ano, artista_id } = req.body;


    if (!titulo || !ano || !artista_id) {
        return res.status(400).json({ erro: "Os campos titulo, ano e artista_id são obrigatórios" });
    }


    const sql = `INSERT INTO albuns (titulo, ano, artista_id) VALUES (?, ?, ?)`;
    conexao.query(sql, [titulo, ano, artista_id], (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao cadastrar álbum" });
        }
        res.status(201).json({
            mensagem: "Álbum cadastrado com sucesso",
            id: resultado.insertId
        });
    });
});


app.put("/albuns/:id", (req, res) => {
    const id = Number(req.params.id);
    const { titulo, ano, artista_id } = req.body;


    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ erro: "ID inválido" });
    }


    if (!titulo || !ano || !artista_id) {
        return res.status(400).json({ erro: "Os campos titulo, ano e artista_id são obrigatórios" });
    }


    const sql = "UPDATE albuns SET titulo = ?, ano = ?, artista_id = ? WHERE id = ?";
    conexao.query(sql, [titulo, ano, artista_id, id], (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao atualizar álbum" });
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ msg: "Álbum não encontrado" });
        }
        res.status(200).json({ msg: "Álbum atualizado com sucesso" });
    });
});


app.delete("/albuns/:id", (req, res) => {
    const id = Number(req.params.id);


    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ erro: "ID inválido" });
    }


    const sql = `DELETE FROM albuns WHERE id = ?`;
    conexao.query(sql, [id], (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao excluir álbum" });
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ msg: "Álbum não encontrado" });
        }
        res.status(200).json({ msg: "Álbum excluído com sucesso" });
    });
});


// LISTAR MÚSICAS COMPLETAS (Música + Álbum + Artista)
app.get("/musicas-completas", (req, res) => {
    const sql = `
        SELECT 
            musicas.id AS musica_id,
            musicas.titulo AS musica_titulo,
            musicas.duracao,
            albuns.id AS album_id,
            albuns.titulo AS album_titulo,
            artistas.id AS artista_id,
            artistas.nome AS artista_nome,
            artistas.genero
        FROM musicas
        LEFT JOIN albuns ON musicas.album_id = albuns.id
        LEFT JOIN artistas ON albuns.artista_id = artistas.id
    `;


    conexao.query(sql, (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao buscar músicas completas" });
        }
        res.status(200).json(resultado);
    });
});


app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});