import axios from "axios";

const confirmPurchase = async (beatComprado) => {
  const result = await axios.post("/api/buy", beatComprado);
  return result;
};

const exportedFunctions = {
  confirmPurchase,
};

export default exportedFunctions;
