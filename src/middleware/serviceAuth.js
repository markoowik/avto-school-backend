export const serviceAuth = (req, res, next) => {
  const token = req.headers.authorization;

  if (token !== `Bearer ${process.env.SERVICE_TOKEN}`) {
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
};
