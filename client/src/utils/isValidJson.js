const isValidJson = (data) => {
  try {
    JSON.parse(data);
    return true;
  } catch (error) {
    return false;
  }
};

export default isValidJson;
