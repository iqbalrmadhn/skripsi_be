import db from "../configs/database_config.js"
const schema = "data_plant"
const col = "data"
const addHours = (date) => {
  date.setTime(date.getTime() + 25200000);
  return date;
};

export const getAllPlant = async (req, res) => {
  try {
    const response = await db.db(schema).collection(col).find({})
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

export const getOnePlant = async (req, res, next) => {
  try {
    const plant  = req.query.plant.split(",");
    const response = await db.db(schema).collection(col)
                .find({serial_number: { $in: plant }})
                .project({_id:0}).toArray();

    if (!response) {
      return res.status(404).json({
        status: 404,
        success: false,
        success: false,
        message: "plant not found",
        data: null,
        error: "Plant Not Found",
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

export const postPlant = async (req, res) => {
  try {
    const requestData = req.body;
    const doc = requestData.map(data => ({
                  ...data,
                  createdAt: addHours(new Date()),
                  updatedAt: addHours(new Date()),
                 }));
    const response = await db.db(schema).collection(col).insertMany(doc);

    return res.status(201).json({
      status: 201,
      success: true,
      message: "new plant created",
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

export const updatePlant = async (req, res) => {
  try {
    const plant = { plant_name: req.params.plant };
    const requestData = req.body;
    const newValues = { $set: {...requestData,updateAt: addHours(new Date()),} };
    const options = { upsert: true};
    const response = await db.db(schema).collection(col)
                        .updateOne(plant,newValues,options);

    if (!response) {
      return res.status(200).json({
        status: 200,
        success: false,
        message: "failed to update plant",
        data: null,
        error: "Failed To Update Plant",
      });
    }
    return res.status(200).json({
      status: 200,
      success: true,
      message: "plant updated",
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

export const deletePlant = async (req, res) => {
  try {
    const plant = req.query.plant.split(",");
    const response = await db.db(schema).collection(col)
                        .deleteMany({plant_name: {$in: plant}});

    if (!response) {
      return res.status(200).json({
        status: 200,
        success: false,
        message: "failed to delete plant",
        data: null,
        error: "Failed To Delete plant",
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: "plant deleted",
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
