const authorize = (permission) => {

    return (req, res, next) => {

        const permissions = req.user.permissions || [];

        const hasPermission = permissions.includes(permission);

        if(!hasPermission) {
            return res.status(403).json({
                    message: "Permission Denied"
            });
        }

        next();

    }
}

module.exports = authorize;