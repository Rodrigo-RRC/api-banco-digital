const express = require('express');
const app = require('./servidor');
const rotas = require('./rotas');

app.use(rotas);

app.listen(3000, () => {
  console.log("Servidor rodando");
});