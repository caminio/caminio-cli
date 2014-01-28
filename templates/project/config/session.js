module.exports.session = {
  
  // this is a secret key that has been created
  // when you created your app
  secret: 'SECRET',
  
  // session timeout in milliseconds
  timeout: 30 * 60 * 1000,

  // where should caminio redirect the user after login
  // this will only match, if the user hasn't entered a
  // specific url, which redirected them to /login
  redirectUrl: '/'

}
