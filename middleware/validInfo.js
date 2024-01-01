module.exports = async (req, res, next) => {
    const { username, password } = req.body;

    if (req.path === "/login") {
        if (![username, password].every(Boolean)) {
            return res.status(401).json("Missing Credentials");
        }
    }

    next();
}