import db from "../configs/database_config.js"

const addHours = (date) => {
  date.setTime(date.getTime() + 25200000);
  return date;
};

export const getAllDevice = async (req, res) => {
  try {
    const schema = req.params.db
    const response = await db.db(schema).collection("device").find({})
		.project({_id:0}).toArray();
    return res.status(200).json({
      status: 200,
      success: true,
      message: "ok",
      data: {
        response,
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

export const getOneDevice = async (req, res, next) => {
  try {
    const schema = req.params.db
    const sn  = req.query.sn.split(",");
    const response = await db.db(schema).collection("device")
		.find({serial_number: { $in: sn }})
		.project({_id:0}).toArray();

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

export const postDevice = async (req, res) => {
  try {
    const schema = req.params.db
    const requestData = req.body;
    const doc = requestData.map(data => ({
		  ...data,
		  status: "Not Connected",
		  createdAt: addHours(new Date()),
		  updatedAt: addHours(new Date()),
		 }));
    const response = await db.db(schema).collection("device").insertMany(doc);

    return res.status(201).json({
      status: 201,
      success: true,
      message: "new device created",
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

export const updateDevice = async (req, res) => {
  try {
    const schema = req.params.db
    const sn = { serial_number: req.params.sn };
    const requestData = req.body;
    const newValues = { $set: {...requestData,updateAt: addHours(new Date()),} };
    const response = await db.db(schema).collection("device")
			.updateOne(sn,newValues);

    if (!response) {
      return res.status(200).json({
        status: 200,
        success: false,
        message: "failed to update device",
        data: null,
        error: "Failed To Update Device",
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: "device updated",
      data: null,
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

export const deleteDevice = async (req, res) => {
  try {
    const schema = req.params.db
    const sn = req.query.sn.split(",");
    const response = await db.db(schema).collection("device")
			.deleteMany({serial_number: {$in: sn}});

    if (!response) {
      return res.status(200).json({
        status: 200,
        success: false,
        message: "failed to delete device",
        data: null,
        error: "Failed To Delete Device",
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: "device deleted",
      data: null,
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
