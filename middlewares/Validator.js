const ValidRequest = (schema) => async (req, res, next) => {
    try {
        const parseBody = await schema.parseAsync(req.body);
        req.body = parseBody;
        next();
    } catch (error) {
        const err = {
            status: 400,
            message: error.issues[0].message
        }
        next(err);
        // res.status(400).json({ success: false, message: error.message });
    }
}

module.exports = ValidRequest;