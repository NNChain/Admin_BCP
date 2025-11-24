import axios from "axios";

export const getValidatorList = async (req, res) => {
  try {
    let { page = 1, limit = 10, status } = req.query;

    page = Math.max(parseInt(page), 1);
    limit = Math.max(parseInt(limit), 1);
    const offset = (page - 1) * limit;

    const VALIDATOR_API_URL = `${process.env.VALIDATOR_API_URL}`;
    const response = await axios.get(VALIDATOR_API_URL);
    let allValidators = response.data.validators || [];
    if (status) {
      allValidators = allValidators.filter(
        (v) => v.status && v.status.toLowerCase() === status.toLowerCase()
      );
    }

    const totalCount = allValidators.length;
    const paginatedValidators = allValidators.slice(offset, offset + limit);

    res.status(200).json({
      success: true,
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      data: paginatedValidators,
    });
  } catch (error) {
    console.error("Error fetching validators:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch validator list",
      error: error.message,
    });
  }
};
