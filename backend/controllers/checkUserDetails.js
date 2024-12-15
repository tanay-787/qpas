/**
 * Check and return authenticated user's details
 */
const checkUserDetails = async (req, res) => {
    try {
      res.status(200).json({
        message: "User details fetched successfully.",
        data: req.user,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal Server Error.",
        error: error.message,
      });
    }
  };

  export { checkUserDetails };