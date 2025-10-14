import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    const {token} = req.cookies;

    if (!token) {
        return res.json({success: false, message: "Not Authorized. Login Again"})
    }

    try {
        
        // eslint-disable-next-line no-undef
        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (tokenDecoded.id) {
            // Store userId in both req.userId and req.body.userId for compatibility
            req.userId = tokenDecoded.id;
            req.body = req.body || {};
            req.body.userId = tokenDecoded.id;
        } else {
            return res.json({success: false, message: "Not Authorized, login again"});
        }

        next();

    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export default userAuth;