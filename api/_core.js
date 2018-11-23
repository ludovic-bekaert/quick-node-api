module.exports = (router) => {
  router.get('/', function(req, res) {
    res.json({ message: 'Let\'s get awesome!' });
  });
}
