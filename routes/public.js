const express = require('express');
const router = express.Router();
var os = require('os-utils');
router.get('/ping', (req,res) => {
  res.status(200).send({
    success: true,
    timestamp: Date.now(),
    message: 'pong'
  })
})

getUptime = () => {
  const uptime = process.uptime();
  if(uptime > 86400) {
      uptime = uptime/86400;
      return "" + uptime.toFixed(3) + " days";
    } else if (uptime > 3600) {
      uptime = uptime/3600;
      return "" + uptime.toFixed(2) + " hours";
    } else if (uptime > 60) {
      uptime = uptime/60;
      return "" + uptime.toFixed(1) + " minutes";
    } else {
      return "" + uptime.toFixed(0) + " seconds";
    }
}

router.get('/uptime', (req, res) => {
  res.status(200).send({
    success: true,
    timestamp: Date.now(),
    message: getUptime()
  })
})
module.exports = router;
