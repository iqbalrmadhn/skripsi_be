import db from "../configs/database_config.js"
import fs from "fs"
import {DateTime} from "luxon"

export const getLogDevice = async (req, res, next) => {
  try {
    const schema = req.params.db
    const col = req.params.col;
    const from = req.query.from;
    const to = req.query.to;

    const response = await db.db(schema).collection(col)
	.find({
		updatedAt: {
			$gte: new Date(from),
			$lt: new Date(to)
		}
	})
	.project({_id:0})
	.toArray();
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

export const download = async (req, res) => {
  try {
    const schema = req.params.db
    const col = req.params.col;
    const from = req.query.from;
    const to = req.query.to;

    const response = await db.db(schema).collection(col)
        .find({
                updatedAt: {
                        $gte: new Date(from),
                        $lt: new Date(to)
                }
        })
        .project({_id:0})
        .toArray();
    const formattedResponse = response.map(doc => {
     if (doc.value2 !== null && doc.value2 !== undefined) {
       return {
            temperature: doc.value,
            humidity: doc.value2,
            updatedAt: new Date(doc.updatedAt).toISOString().replace(/T/, ' ').replace(/\..+/, '')
        };
     } else {
       return {
            pressure: doc.value,
            updatedAt: new Date(doc.updatedAt).toISOString().replace(/T/, ' ').replace(/\..+/, '')
        };
     }
    });

    const timestamp = DateTime.now().toFormat("yyyyMMddHHmmss");
    const filename = `log_${col}_${timestamp}.csv`;
    const fields = Object.keys(formattedResponse[0]);
    const header = fields.join(',') + '\n';
    const csvData = formattedResponse.map(item => fields.map(field => item[field]).join(",")).join('\n');
    const fullCsvData = header + csvData;

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "text/csv");

    return res.status(200).send(fullCsvData);
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
