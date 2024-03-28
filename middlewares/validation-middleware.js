const validate = (schema) => async (req, res, next) => {
    try {
        const validated = await schema.validateAsync(req.body);
        req.body = validated;
        next();
    } catch (e) {
        if (e.isJoi) {
            res.status(400).json({ message: e.message });
        } else {
            res.status(500).json({ message: e.message });
        }
    }
}

module.exports = validate;