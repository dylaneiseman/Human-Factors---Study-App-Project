const ac = require('../accessControlConfig');

const checkAccess = (action, resource) => {
    return (req, res, next) => {
        const permission = ac.can(req.user.role)[action](resource);

        if (permission.granted) {
            next();
        } else {
            res.status(403).json({ message: "Access Denied" });
        }
    };
};

module.exports = checkAccess