import axios from "axios";
export const getGenesisData = async (req, res) => {
  try {
    const response = await axios.get("http://155.133.26.60:26657/genesis");
    res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching genesis data:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch genesis data",
      error: error.message,
    });
  }
};
