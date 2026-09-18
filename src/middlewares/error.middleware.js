

export const errorHandler = (err, req, res, next) => {
    console.log(err);

    if (err.name === "ValidationError") {
        const errors = {};

        for (const field in err.errors) {
            errors[field] = err.errors[field].message;
        }

        return res.status(400).json({
            message: "Validation failed",
            errors
        });
    }

    if (err.name === "CastError") {
        return res.status(400).json({
            message: "Invalid ID or data format"
        });
    }

    res.status(500).json({
        message: "Internal server error"
    });
};