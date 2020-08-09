const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { getUserId } = require("../utils")

const JWT_SECRET = process.env.JWT_SECRET

async function signup(parent, args, context, info) {

  const senha = await bcrypt.hash(args.senha, 12)
  const user = context.db.mutation.createUser({
    data: {
      ...args,
      senha
    }
  })

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "2h" })

  return {
    token,
    user
  }
}

async function login(parent, { email, senha }, context, info) {

  const user = await context.db.query.user({ where: { email } })
  const errorText = "Credenciais Inválidas"

  if (!user) {
    throw new Error(errorText)
  }

  const valid = await bcrypt.compare(senha, user.senha)
  if (!valid) {
    throw new Error(errorText)
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "2h" })

  return {
    token,
    user
  }
}

function createClient(parent, { nome, telefone, endereco, cep, complemento, numero, status_cli, status_ord, status_pay }, context, info) {
  const userId = getUserId(context)
  return context.db.mutation.createClient({
    data: {
      nome,
      telefone,
      endereco,
      cep,
      complemento,
      numero,
      status_cli,
      status_ord,
      status_pay,
      user: {
        connect: {
          id: userId
        }
      }
    }
  }, info)
}

function updateClient(parent, { clientId, nome, telefone, endereco, cep, complemento, numero, status_cli, status_ord, status_pay, }, context, info) {  
  const userId = getUserId(context)
  return context.db.mutation.updateClient({
    where: { id: clientId },
    data: {
      nome,
      telefone,
      endereco,
      cep,
      complemento,
      numero,
      status_cli,
      status_ord,
      status_pay,
      user: {
        connect: {
          id: userId
        }
      }
    }
  }, info)
}

function deleteClient(parent, { clientId }, context, info) {
  return context.db.mutation.deleteClient({
    where: { id: clientId }
  }, info)
}
/**********************************************/
function createOrder(parent, { clientId, descricao, valor, status }, context, info) {
  // const userId = getUserId(context)
  return context.db.mutation.createOrder({
    data: {
      descricao,
      valor,
      status,
      client: {
        connect: {
          id: clientId
        }
      }
    }
  }, info)
}

function updateOrder(parent, { orderId, clientId, descricao, valor, status }, context, info) {
  return context.db.mutation.updateOrder({
    where: { id: orderId },
    data: {
      descricao,
      valor,
      status,
      client: {
        connect: {
          id: clientId
        }
      }
    }
  }, info)
}

function deleteOrder(parent, { orderId }, context, info) {
  return context.db.mutation.deleteOrder({
    where: { id: orderId }
  }, info)
}


module.exports = {
  signup,
  login,
  createClient,
  updateClient,
  deleteClient,
  createOrder,
  updateOrder,
  deleteOrder
}