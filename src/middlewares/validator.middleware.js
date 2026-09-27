export const validator = (schema, source = "body") => (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
        return res.status(400).json({
            message: "Invalid input",
            errors: result.error.issues
        });
    }

    req[source] = result.data;

    next();
};