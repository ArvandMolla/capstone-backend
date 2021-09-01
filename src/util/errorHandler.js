export const errorHandler = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send(err.message);
  } else if (err.status === 400) {
    res.status(400).send(err.errorList);
  } else if (err.status === 401) {
    res.status(401).send(err.message || "You are not logged in!");
  } else if (err.status === 403) {
    res.status(403).send(err.message || "You are not allowed!");
  } else {
    console.log("from errorHandler: ", err);
    res.status(500).send("generic server error!");
  }
};
