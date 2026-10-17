// middleware/auth.js
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login'); // redirect to login if not authenticated
}

module.exports = ensureAuthenticated;
