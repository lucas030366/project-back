const { getUserId } = require("../utils")

function user(parent, args, context, info) {
  const userId = getUserId(context)

  return context.db.query.user({
    where: { id: userId }
  },
    info
  )
}

function clients(parent, args, context, info) {
  const userId = getUserId(context)
  return context.db.query.clients({
    where: {
      user: { id: userId }
    }
  }, info)

}

function client(parent, { clientId }, context, info) {
  return context.db.query.client({
    where: { id: clientId }
  },
    info
  )
}

function orders(parent, { clientId }, context, info) {
  return context.db.query.orders({
    where: {
      client: { id: clientId }
    },
    orderBy: "createdAt_ASC"
  }, info)
}

function order(parent, { orderId }, context, info) {
  return context.db.query.order({
    where: { id: orderId }
  }, info)
}

module.exports = {
  user,
  clients,
  client,
  orders,
  order
}