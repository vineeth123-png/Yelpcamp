const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedhelpers");
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Mongodb connection error:"));
db.once("open", () => {
	console.log("database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 50; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 20) + 10;
		const camp = new Campground({
			author: "60c9d0bd3b604f4e041ec0a4",
			location: `${cities[random1000].city} ${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			images: [
				{
					url: "https://res.cloudinary.com/dbvh6orz4/image/upload/v1624986448/YelpCamp/ii8iy3x37zf678quasmm.png",
					filename: "YelpCamp/ii8iy3x37zf678quasmm",
				},
				{
					url: "https://res.cloudinary.com/dbvh6orz4/image/upload/v1624986449/YelpCamp/f1uw16cye4qu3jloysif.png",
					filename: "YelpCamp/f1uw16cye4qu3jloysif",
				},
			],
			description:
				"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius praesentium, dolores aut vel odio ipsa sapiente deleniti laboriosam velit enim, voluptate, labore quo itaque dolor maxime laborum. Quibusdam, numquam aliquam?",
			price,
		});
		await camp.save();
	}
};

seedDB().then(() => {
	mongoose.connection.close();
});
