const express = require('express');
const router = express.Router();
const Temp = require('../models/Temp');
const Product = require('../models/Product');
router.get('/data', (req, res) => {
  let save = 0;
  let error = 0;
  Temp.find({})
    .then(doc => {
      for(let i=0; i<doc[0].inventory.length; i++) {
        let barcode = doc[0].inventory[i].Barcode;
        let productName = doc[0].inventory[i].ProductName;
        let size = doc[0].inventory[i].Size;
        let color = doc[0].inventory[i].Colour;
        let aeroCode = doc[0].inventory[i].AeroCode;
        let stockCount = 25;
        Product.create({barcode, productName, size, color, aeroCode, stockCount})
          .then(saves => {
            save++;
          })
          .catch(err=> {
            error++;
          })
      }

      console.log(save);
      console.log(error);

      res.send(doc);
    })
    .catch(err => {
      res.send(err);
    })
})

module.exports = router;
