module.exports = async (req, res, next) => {
    const { username, email, password } = req.body;

    // function validEmail(userEmail) {
    //     // Regex untuk email
    //     const re = /\S+@\S+\.\S+/;
    //     return re.test(userEmail);
    // }

    // if (req.path === "/register") {
    //     console.log(!email.length);
    //     if (![email, username, password].every(Boolean)) {
    //         return res.status(401).json("Missing Credentials");
    //     } else if (!validEmail(email)) {
    //         return res.status(401).json("Invalid Email");
    //     }
    // } else 
    if (req.path === "/login") {
        if (![username, password].every(Boolean)) {
            return res.status(401).json("Missing Credentials");
        }
    }

    next();

}