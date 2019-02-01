const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

returnError = (res, message) => {
  res.status(200).send({
    success: false,
    timestamp: Date.now(),
    message: message
  })
}

//Create
router.post('/product', (req, res) => {
  const { barcode, productName, size, color, aeroCode, stockCount } = req.body
  if (barcode && productName && size && color && aeroCode && stockCount) {
    Product.findOne({barcode})
      .then(doc => {
        if(doc) {
          returnError(res, `Product with barocde ${barcode} already exists`)
        } else {
          Product.create({barcode, productName, size, color, aeroCode, stockCount}, function(err) {
            if(err) {
              res.status(200).send({
                success: false,
                timestamp: Date.now(),
                message: `Error: ${err}`,
                data: {
                  barcode: barcode,
                  productName,
                  size,
                  color,
                  aeroCode,
                  stockCount
                }
              })
            } else {
              res.status(200).send({
                success: true,
                timestamp: Date.now(),
                message: `Created new product`,
                data: {
                  barcode,
                  productName,
                  size,
                  color,
                  aeroCode,
                  stockCount
                }
              })
            }
          })
        }
      })
      .catch(err => {
        return returnError(res, `Error: ${err}`)
      })


  }else {
    res.status(200).send({
      success: false,
      timestamp: Date.now(),
      message: `You have provided one or more empty fields`,
      data: {
        barcode: barcode,
        productName:productName,
        size:size,
        color:color,
        aeroCode:aeroCode,
        stockCount:stockCount
      }
    })
  }
})
//Read

router.get('/product/all', (req, res) => {
  Product.find({})
    .then(doc => {
      if(!doc) {
        return returnError(res, 'No products found')
      } else {
        res.status(200).send({
          success: true,
          timestamp: Date.now(),
          message: `${doc.length} product(s) found`,
          data: doc
        })
      }
    })
    .catch(err => {
      return returnError(res, `Error: ${err}`)
    })
})

router.get('/product/:product', (req, res) => {
  const { product } = req.params;
  Product.findOne({ barcode: product })
    .then(doc => {
      if(!doc) {
        return returnError(res, `Product #${product} not found`)
      } else {
        return res.status(200).send({
          success: true,
          timestamp: Date.now(),
          message: `Product #${product} found`,
          data: doc
        })
      }
    })
    .catch(err => {
      return returnError(res, `Error: ${err}`)
    })
  })

//Update
router.put('/product', (req, res) => {
  const { barcode, productName, size, color, aeroCode, stockCount } = req.body
  console.log(barcode)
  if (barcode && productName && size && color && aeroCode && stockCount) {
  Product.findOne({ barcode })
    .then(doc => {
        if(!doc) {
          return returnError(res, `Product  with barcode ${barcode} not found`)
        } else {
          doc.barcode = barcode;
          doc.productName = productName;
          doc.size = size;
          doc.color = color;
          doc.aeroCode = aeroCode;
          doc.stockCount = stockCount;
          doc.save()
          return res.status(200).send({
            success: true,
            timestamp: Date.now(),
            message: `Product with barcode ${barcode} updated`,
            data: doc
          })
        }
    })
    .catch(err => {
      return returnError(res, `Error: ${err}`)
      })
    } else {
      return returnError(res, `You have provided one or more empty fields`)
    }
    })


//Delete
router.delete('/product', (req, res) => {
  const { barcode } = req.body;
  if(barcode) {
    Product.deleteOne({ barcode })
      .then(doc => {
        if(!doc) {
          return returnError(res, `Product with barcode ${barcode} not found`)
        } else {
          res.status(200).send({
            success: true,
            timestamp: Date.now(),
            message: `Product with barcode ${barcode} deleted`,
            data: doc
          })
        }
      })
      .catch(err => {
        return returnError(res, `Error: ${err}`)
      })
    } else {
      return returnError(res, 'Barcode was not provided')
    }
  })


module.exports = router;
