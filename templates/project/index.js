var caminio = require('caminio');

caminio.run(
  require('caminio-auth'),
  require('caminio-ui'),
  require('caminio-rocksol')
);
