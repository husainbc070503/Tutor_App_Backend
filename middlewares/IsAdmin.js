const isAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== "admin")
            return res.status(400).json({ success: false, message: 'Unauthorized user!!' });

        return next();
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

module.exports = isAdmin;