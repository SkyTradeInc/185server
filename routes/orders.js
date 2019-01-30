const express = require('express');
const router = express.Router();
const Order = require('../models/Order')
const Product = require('../models/Product');
const server = express().listen(process.env.PORT);
const io = require("socket.io")(server)

io.on('connection', (client) => {
	console.log('client connected')
})


let currentOrderID = 22;
let connected = false;

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function (arg) {

	if (arg.trim() == "status") {
		console.log(`[!] Connected: ${connected}`)
		console.log(`[!] On order #${currentOrderID}`)
		return;
	}

	if (arg.trim().split(' ')[0] == "order") {
		newOrderID = +arg.trim().split(' ')[1];
		if (typeof newOrderID === 'number') {
			currentOrderID = newOrderID
			console.log(`[!] On order #${currentOrderID}`)
		} else {
			console.log(`You entered an invalid order number, you entered a ${typeof newOrderID} instead of a number`);
		}
		return;
	}
})

processScan = (orderID, barcode) => {
	let promises = []
	Order.findOne({ orderID })
		.then(order => {
			if (order.status === 'complete') return console.log("   [-] Complete")
			let filledProducts = 0;
			for (let i = 0; i < order.products.length; i++) {
				if (order.products[i].filled === true) {
					filledProducts++
				} else {
					if (order.products[i].barcode == barcode) {
						console.log("match")
						let promise = Product.findOne({
								barcode
							})
							.then(product => {
								if (product.stockCount > 0) {
									product.stockCount--;
									product.save()
									order.status = "partial";
									order.products[i].pickCount++;
									if (order.products[i].pickCount == order.products[i].quantity) {
										order.products[i].filled = true;
										filledProducts++
									}
									order.markModified('products')
									return true;
								} else {
									return false;
								}
							})
							.catch(err => {
								console.log(`   [-] ${err}`)
							})
						promises.push(promise)
					} else {}
				}
			}
			Promise.all(promises)
				.then(done => {
          if (filledProducts === order.products.length) {
            order.status = "complete";
            order.completedAt = Date.now();
          }
					order.save()
				})
		})
		.catch(err => {
			console.log(`Error: ${err}`);
		})
}


returnError = (res, message) => {
	res.status(200).send({
		success: false,
		timestamp: Date.now(),
		message: message
	})
}

returnSuccess = (res, message) => {
  res.status(200).send({
    success: true,
    timestamp: Date.now(),
    message:message
  })
}
// List of orders
router.get('/', (req, res) => {
  Order.find({})
    .then(doc => {
      if(!doc) {
        return returnError(res, 'No orders found')
      } else {
        res.status(200).send({
          success: true,
          timestamp: Date.now(),
          message: `${doc.length} order(s) found`,
          data: doc
        })
      }
    })
    .catch(err => {
      return returnError(res, `Error: ${err}`)
    })
})

router.post('/currentOrder', (req, res) => {
	const { orderID } = req.body
  if(typeof orderID == 'undefined') {
    return returnError(res, "You must include orderID in the body")
  }
  if(typeof orderID == 'number') {
  	currentOrderID = orderID;
  	console.log(`[!] On order #${currentOrderID}`)
    return returnSuccess(res, `Listening on order ${currentOrderID}`)
  } else {
    return returnError(res, `orderID expected to be type 'number', you have provided type '${typeof orderID}'`)
  }
})

router.get('/currentOrder', (req, res) => {

})

//Create

router.post('/', (req, res) => {
	const { orderID, productsList } = req.body
	const order = {
		orderID,
		status: "new",
		createdAt: Date.now(),
		completedAt: null,
		productFulfilled: false,
		products: productsList
	}
	Order.findOne({ orderID })
		.then(doc => {
			if (doc) {
				returnError(res, "Order ID already exists!")
			} else {
				Order.create(order)
					.then(doc => {
						res.send(doc)
					})
					.catch(err => {
						returnError(res, `Error: ${err}`)
					})
			}
		})
		.catch(err => {
			returnError(res, `Error: ${err}`)
		})
});

//update
router.put('/order/:orderID', (req, res) => {
	const { orderID } = req.params
	Order.findOne({ orderID })
		.then(doc => {
			doc.status = "partial"
			doc.save();
			return res.status(200).send({
				success: true,
				timestamp: Date.now(),
				message: "Data recieved",
				data: doc
			})
		})
		.catch(err => {
			returnError(res, `Error: ${err}`)
		})
})


//Read
router.get('/:id', (req, res) => {
	const { id } = req.params;
	const orderID = id;
	Order.findOne({ orderID })
		.then(doc => {
			if (!doc) {
				returnError(res, `Order #${orderID} not found!`)
			} else {
				return res.status(200).send({
					success: true,
					timestamp: Date.now(),
					message: "Data recieved",
					data: doc
				})
			}
		})
		.catch(err => {
			returnError(res, `Error: ${err}`)
		})
})

router.get('/status/:status', (req, res) => {
	const { status } = req.params;
	Order.find({ status })
		.then(doc => {
      res.status(200).send({
        success: true,
        timestamp: Date.now(),
        message: `${doc.length} orders(s) with status '${status}' found`,
        data: doc
      })
		})
		.catch(err => {
      returnError(res, `Error: ${err}`)
		})
})

//Delete an order
router.delete('/all', (req, res) => {
  Order.deleteMany({})
    .then(doc => {
			res.send({
				success: true,
				timestamp: Date.now(),
				message: doc,
			});
    })
    .catch(err => {
      returnError(res, `Error: ${err}`)
    })
})

router.delete('/', (req, res) => {
	const { orderID } = req.body
	Order.findOne({ orderID })
		.then(doc => {
			if (!doc) {
				returnError(res, `Order #${orderID} not found!`)
			} else {
				doc.delete();
				res.send({
					success: true,
					timestamp: Date.now(),
					message: `Order #${orderID} has been deleted`,
				});
			}
		})
		.catch(err => {
			returnError(res, `Error: ${err}`)
		})
})



module.exports = router;
