module.exports = function( caminio ){
  
  return function(req, res, next){

    res.status(404);

    caminio.logger.error('not route matches', req.url);

    // respond with html page
    if (req.accepts('html')) {
      res.render( __dirname+'/../../api/views/404.html.hbs', { url: req.url });
      return;
    }

    // respond with json
    if (req.accepts('json')) {
      res.send({ error: 'Not found' });
      return;
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');

  }

}
