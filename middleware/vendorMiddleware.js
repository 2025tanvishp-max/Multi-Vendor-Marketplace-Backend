const vendorMiddleware = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            message: "Authentication required"
        });
    }

    if (req.user.role !== "vendor") {
        return res.status(403).json({
            message: "Vendor access required"
        });
    }

    next();
};

module.exports = vendorMiddleware;