require("dotenv").config();
const mongoose = require("mongoose");

const dbConection = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_CNN, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		// MongoParseError: options usecreateindex, usefindandmodify are not supported

		// useCreateIndex: true,
		// useFindAndModify: false,

		console.log("Base de datos online");
	} catch (e) {
		console.error(e);
		throw new Error("Error a la hora de iniciar la DB");
	}
};

module.exports = { dbConection };
