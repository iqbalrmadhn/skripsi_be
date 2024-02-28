import db from "../configs/database_config.js"

export const getWidget = async (req, res, next) => {
  try {
    const sn  = req.query.sn.split(",");
    const col = req.params.col
    const response = await db.collection("device").aggregate([
     {
        $lookup:
           {
             from: "value_device",
	     localField: "serial_number",
	     foreignField: "_id",
             as: "valueData"
           }
      },
      {
        $match: {"serial_number": { $in: sn } }
      },
      { $unwind: "$valueData" },
      { $addFields: { value:{ $arrayElemAt: ["$valueData.value", 0] } } },
      {
        $project:
            {
             _id:0,
             plant:0,
             deskripsi:0,
             createdAt:0,
             updatedAt:0,
             valueData:0
            }
      }
    ]).toArray();

    if (!response) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "device not found",
        data: null,
        error: "Device Not Found",
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: "ok",
      data: {
        response: response,
      },
      error: null,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "internal server error",
      data: null,
      error: "Internal Server Error",
    });
  }
};
