var path = require('path')
var http = require('http')
var cluster = require('cluster')

var NODE_ENV = 'production'
var appName = path.basename(__dirname)
var port = 9001
var numCPUs = require('os').cpus().length

if (cluster.isMaster) {
  process.title = appName + 'master'
  console.log(process.title, 'started')

  for (var i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  process.on('SIGNUP', function () {

  })

  cluster.on('death', function (worker) {
    console.log(appName, ' worker', '#' + worker.pid, 'died')
    cluster.fork()
  })
} else {
  process.title = appName + ' worker ' + process.env.NODE_WORKER_ID
  console.log(process.title, '#' + process.pid, 'started')

  process.on('SIGNUP', function() {
    process.exit(0)
  })

  http.Server(function(req, res) {
    res.writeHead(200)

    res.end('Workder ' + process.env.NODE_WORKER_ID)
  }).listen(port)
}
