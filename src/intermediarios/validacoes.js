const bancoDados = require('../bancodedados')
const senhaBancoObrigatoria = (req, res, next) => {
    const { senha_banco } = req.query;

    if (senha_banco !== bancoDados.banco.senha) {
        return res.status(400).json({ mensagem: "Senha inválida" });
    }
    next();
}

const validarCamposObrigatorios = (req, res, next) => {

    let { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios." });
    }

    let contaCpfExistente = bancoDados.contas.find((conta) => {
        return conta.usuario.cpf === cpf;
    });

    if (contaCpfExistente) {
        return res.status(400).json({ mensagem: "Já existe uma conta com o mesmo CPF." });
    }

    let contaEmailExistente = bancoDados.contas.find((conta) => {
        return conta.usuario.email === email;
    });

    if (contaEmailExistente) {
        return res.status(400).json({ mensagem: "Já existe uma conta com o mesmo Email." });
    }
    next();
};

const validarCampos = (req, res, next) => {
    const { numeroConta } = req.params;
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    const conta = bancoDados.contas.find((conta) => conta.numero === numeroConta);
    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' });
    }

    if (!nome && !cpf && !data_nascimento && !telefone && !email && !senha) {
        return res.status(400).json({ mensagem: 'Informe ao menos um campo para atualização' });
    }

    const contaExistenteCPF = bancoDados.contas.find((c) => c.numero !== numeroConta && c.usuario.cpf === cpf);
    const contaExistenteEmail = bancoDados.contas.find((c) => c.numero !== numeroConta && c.usuario.email === email);

    if (contaExistenteCPF) {
        return res.status(400).json({ mensagem: 'CPF já cadastrado em outra conta' });
    }

    if (contaExistenteEmail) {
        return res.status(400).json({ mensagem: 'E-mail já cadastrado em outra conta' });
    }
    next();

};

const validarExcluirConta = (req, res, next) => {
    const { numeroConta } = req.params;
    const conta = bancoDados.contas.find((conta) => {
        return Number(conta.numero) === Number(numeroConta)
    });

    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' });
    };

    if (conta.saldo > 0) {
        return res.status(400).json({ mensagem: 'Não é possível excluir uma conta com saldo positivo' });
    };
    next();
};

const validarDeposito = (req, res, next) => {
    const { numeroConta, valor } = req.body;

    const conta = bancoDados.contas.find((conta) => Number(conta.numero) === Number(numeroConta));
    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' });
    }
    if (!valor) {
        return res.status(400).json({ mensagem: "Valor deve ser informado" });
    }
    if (valor <= 0) {
        return res.status(400).json({ mensagem: "O valor deve ser positivo e maior que zero" });
    }
    next();
};

const validarSaque = (req, res, next) => {
    const { numeroConta, valorSaque, senhaConta } = req.body;

    if (!numeroConta) {
        return res.status(400).json({ mensagem: "Número da conta precisa ser informado" });
    }
    if (!valorSaque) {
        return res.status(400).json({ mensagem: "O valor do saque precisa ser informado" });
    }
    if (!senhaConta) {
        return res.status(400).json({ mensagem: "A senha precisa ser informada" });
    }

    const conta = bancoDados.contas.find((conta) => Number(conta.numero) === Number(numeroConta));
    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' });
    }

    if (conta.usuario.senha !== senhaConta) {
        return res.status(404).json({ mensagem: "Senha não confere" });
    }

    if (conta.saldo <= 0) {
        return res.status(400).json({ mensagem: "Saldo insuficiente" });
    }

    if (valorSaque > conta.saldo) {
        return res.status(400).json({ mensagem: "Saldo insuficiente para realizar o saque" });
    }
    next();
};

const validarTransferencia = (req, res, next) => {
    const { numeroContaOrigem, numeroContaDestino, valorTransferencia, senhaContaOrigem } = req.body;

    if (!numeroContaOrigem || !numeroContaDestino || !valorTransferencia || !senhaContaOrigem) {
        return res.status(400).json({ mensagem: "Todos os campos devem ser preenchidos" });
    }

    const contaOrigem = bancoDados.contas.find((conta) => conta.numero === numeroContaOrigem);
    const contaDestino = bancoDados.contas.find((conta) => conta.numero === numeroContaDestino);

    if (!contaOrigem || !contaDestino) {
        return res.status(404).json({ mensagem: "Conta de origem ou conta de destino não encontrada" });
    }

    if (contaOrigem.usuario.senha !== senhaContaOrigem) {
        return res.status(401).json({ mensagem: "Senha incorreta" });
    }
    if (contaOrigem === contaDestino) {
        return res.status(400).json({ mensagem: "Não pode realizar transferência para mesma conta" })
    }
    if (contaOrigem.saldo < valorTransferencia) {
        return res.status(400).json({ mensagem: "Saldo insuficiente para realizar a transferência" });
    }
    next();
};

const validarSaldo = (req, res, next) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: 'Número da conta e senha são obrigatórios' });
    }

    const conta = bancoDados.contas.find((conta) => conta.numero === numero_conta);

    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' });
    }

    if (conta.usuario.senha !== senha) {
        return res.status(401).json({ mensagem: 'Senha incorreta' });
    }
    next();
};

const validarExtrato = (req,res,next) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: 'Número da conta e senha são obrigatórios' });
    }

    const conta = bancoDados.contas.find((conta) => conta.numero === numero_conta);

    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' });
    }

    if (conta.usuario.senha !== senha) {
        return res.status(401).json({ mensagem: 'Senha incorreta' });
    }
    next();
}


module.exports = {
    senhaBancoObrigatoria,
    validarCamposObrigatorios,
    validarCampos,
    validarExcluirConta,
    validarDeposito,
    validarSaque,
    validarTransferencia,
    validarSaldo,
    validarExtrato
}