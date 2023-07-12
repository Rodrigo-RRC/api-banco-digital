const express = require('express');
const { listarContas, criarConta, atualizarUsuarioConta, excluirConta, depositar, sacar, transferir, saldo, extrato } = require('./controladores/controladores');
const { senhaBancoObrigatoria, validarCamposObrigatorios, validarCampos, validarExcluirConta, validarDeposito, validarSaque, validarTransferencia, validarSaldo, validarExtrato } = require('./intermediarios/validacoes');
const bancoDados = require('./bancodedados');

const rotas = express.Router();


rotas.get('/contas',senhaBancoObrigatoria, listarContas);
rotas.post('/contas',validarCamposObrigatorios,validarCamposObrigatorios, criarConta);
rotas.put('/contas/:numeroConta/usuario',validarCampos, atualizarUsuarioConta);
rotas.delete('/contas/:numeroConta',validarExcluirConta, excluirConta);
rotas.post('/contas/transacoes/depositar',validarDeposito, depositar);
rotas.post('/contas/transacoes/sacar',validarSaque, sacar);
rotas.post("/transacoes/transferir",validarTransferencia, transferir);
rotas.get('/contas/saldo',validarSaldo, saldo)
rotas.get('/contas/extrato',validarExtrato, extrato);


module.exports = rotas;