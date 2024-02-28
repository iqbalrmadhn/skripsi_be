import db from "../configs/database_config.js"

export const validationCreateDevice = async (req,res,next) => {
  const schema = req.params.db
  const requestData = req.body;

  if (!Array.isArray(requestData)) {
      return res.status(400).json({
	 error: 'Expected an array of objects in the request body' });
    }

  const requiredFields = ["serial_number","nama_device","mesin",
			  "plant","deskripsi"];

  for (const data of requestData) {
    for (const field of requiredFields) {
	if(!data.hasOwnProperty(field)) {
	  return res.status(400).json({
		      status: 400,
		      success: false,
		      message: "bad request",
		      data: {
		        original: req.body,
		      },
		      error: `Field '${field}' is required`,
		    });
	  } else if(data[field].trim() === '') {
          return res.status(400).json({
                      status: 400,
                      success: false,
                      message: "bad request",
                      data: {
                        original: req.body,
                      },
                      error: `Value of field '${field}' is required`,
                    });
	  }
    }
  }
  const existingSn = await db.db(schema).collection("device")
			.distinct('serial_number', { serial_number: {$in: requestData.map(data=> data.serial_number) }});
  const existingSerial = requestData.filter(data => existingSn.includes(data.serial_number));
  if (existingSerial.length > 0) {
      const existingList = existingSerial.map(device => device.serial_number).join(', ');
      return res.status(400).json({ error: `Serial Number ${existingList} already exists in the collection` });
    }
 next();
};

export const validationParams = (req,res,next) => {
  const requiredParams = ["from", "to"];
  const missingParams = requiredParams.filter(param => !(param in req.query));

  if (missingParams.length > 0) {
     return res.status(400).json({
                status: 400,
                success: false,
                message: "bad request",
                error: `Missing query parameters: ${missingParams.join(', ')}`
    });
  }

  next();
};

export const validationCreatePlant = async (req,res,next) => {
  const requestData = req.body;

  if (!Array.isArray(requestData)) {
      return res.status(400).json({
         error: 'Expected an array of objects in the request body' });
    }

  const requiredFields = ["plant_name","alamat","deskripsi"];

  for (const data of requestData) {
    for (const field of requiredFields) {
        if(!data.hasOwnProperty(field)) {
          return res.status(400).json({
                      status: 400,
                      success: false,
                      message: "bad request",
                      data: {
                        original: req.body,
                      },
                      error: `Field '${field}' is required`,
                    });
          } else if(data[field].trim() === '') {
          return res.status(400).json({
                      status: 400,
                      success: false,
                      message: "bad request",
                      data: {
                        original: req.body,
                      },
                      error: `Value of field '${field}' is required`,
                    });
          }
    }
  }
  const existingPlantName = await db.db("data_plant").collection("data")
                        .distinct('plant_name', { plant_name: {$in: requestData.map(data=> data.plant_name) }});
  const existingPlant = requestData.filter(data => existingPlantName.includes(data.plant_name));
  if (existingPlant.length > 0) {
      const existingList = existingPlant.map(plant => plant.plant_name).join(', ');
      return res.status(400).json({ error: `Plant Name of  ${existingList} already exists in the collection` });
    }

  next();
};
