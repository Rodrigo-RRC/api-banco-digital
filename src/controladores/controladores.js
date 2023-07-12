const bancoDados = require('../bancodedados');

const listarContas = (req, res) => {


    return res.status(200).json(bancoDados.contas)
}

const criarConta = (req, res) => {
    let { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    let numeroConta = (bancoDados.contas.length + 1).toString();
    let novaConta = {
        numero: numeroConta,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha,
        },
    };
    bancoDados.contas.push(novaConta);

    return res.status(201).json(novaConta);
};

const atualizarUsuarioConta = (req, res) => {
    const { numeroConta } = req.params;
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const conta = bancoDados.contas.find((conta) => conta.numero === numeroConta);

    if (nome) conta.usuario.nome = nome;
    if (cpf) conta.usuario.cpf = cpf;
    if (data_nascimento) conta.usuario.data_nascimento = data_nascimento;
    if (telefone) conta.usuario.telefone = telefone;
    if (email) conta.usuario.email = email;
    if (senha) conta.usuario.senha = senha;

    res.json({ mensagem: 'Conta atualizada com sucesso' });
}

const excluirConta = (req, res) => {
    const { numeroConta } = req.params;

    const conta = bancoDados.contas.find((conta) => {
        return Number(conta.numero) === Number(numeroConta)
    });


    const indiceConta = bancoDados.contas.indexOf(conta);
    bancoDados.contas.splice(indiceConta, 1);

    return res.json({ mensagem: 'Conta excluída com sucesso' });
}

const depositar = (req, res) => {
    const { numeroConta, valor } = req.body;

    const conta = bancoDados.contas.find((conta) => Number(conta.numero) === Number(numeroConta));
    

    conta.saldo += Number(valor);

    const operacao = {
        data: new Date().toISOString(),
        numero_conta: numeroConta,
        valor: Number(valor)
    };

    bancoDados.depositos.push(operacao);

    return res.status(200).json({ mensagem: "Depósito realizado com sucesso" });
};

const sacar = (req, res) => {
    const { numeroConta, valorSaque, senhaConta } = req.body;

    const conta = bancoDados.contas.find((conta) => Number(conta.numero) === Number(numeroConta));

    conta.saldo -= valorSaque;

    const operacao = {
        data: new Date().toISOString(),
        numero_conta: numeroConta,
        valor: valorSaque
    };

    bancoDados.saques.push(operacao);

    return res.status(200).json({ mensagem: "Saque realizado com sucesso!" });
};

const transferir = (req, res) => {
    const { numeroContaOrigem, numeroContaDestino, valorTransferencia, senhaContaOrigem } = req.body;

    const contaOrigem = bancoDados.contas.find((conta) => conta.numero === numeroContaOrigem);
    const contaDestino = bancoDados.contas.find((conta) => conta.numero === numeroContaDestino);


    contaOrigem.saldo -= valorTransferencia;
    contaDestino.saldo += valorTransferencia;

    const operacao = {
        data: new Date().toISOString(),
        numero_conta_origem: numeroContaOrigem,
        numero_conta_destino: numeroContaDestino,
        valor: valorTransferencia
    };

    bancoDados.transferencias.push(operacao);

    return res.status(200).json({ mensagem: "Transferência realizada com sucesso!" });
};

const saldo = (req, res) => {
    const { numero_conta, senha } = req.query;

    const conta = bancoDados.contas.find((conta) => conta.numero === numero_conta);

    return res.status(200).json({ saldo: conta.saldo });
};

const extrato = (req, res) => {
    const { numero_conta, senha } = req.query;

    const conta = bancoDados.contas.find((conta) => conta.numero === numero_conta);

    const extratoConta = {
        depositos: bancoDados.depositos.filter((operacao) => operacao.numero_conta === numero_conta),
        saques: bancoDados.saques.filter((operacao) => operacao.numero_conta === numero_conta),
        transferenciasEnviadas: bancoDados.transferencias.filter((operacao) => operacao.numero_conta_origem === numero_conta),
        transferenciasRecebidas: bancoDados.transferencias.filter((operacao) => operacao.numero_conta_destino === numero_conta)
    };

    return res.status(200).json(extratoConta);
}

module.exports = {
    listarContas,
    criarConta,
    atualizarUsuarioConta,
    excluirConta,
    depositar,
    sacar,
    transferir,
    saldo,
    extrato
}