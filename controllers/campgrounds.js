const Campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");

module.exports.index = async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render("campgrounds/index", { campgrounds });
	//res.send(campgrounds);
};

module.exports.renderNewForm = (req, res) => {
	res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res) => {
	if (!req.body.campground)
		throw new ExpressError("Invalid Campground data", 400);
	const campground = new Campground(req.body.campground);
	campground.images = req.files.map((f) => ({
		url: f.path,
		filename: f.filename,
	}));
	campground.author = req.user._id;
	await campground.save();
	//console.log(campground);
	req.flash("success", "Successfully created a new campground");
	res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
	const id = req.params.id;
	//if(!id) throw new ExpressError('Invalid id', 400);
	const campground = await Campground.findById(id)
		.populate({
			path: "reviews",
			populate: {
				path: "author",
			},
		})
		.populate("author");
	//console.log(campground);
	if (!campground) {
		req.flash("error", "Cannot find that campground");
		return res.redirect("/campgrounds");
	}
	res.render("campgrounds/show", { campground });
};

module.exports.renderShowForm = async (req, res) => {
	const id = req.params.id;
	const campground = await Campground.findById(id);
	if (!campground) {
		req.flash("error", "Cannot find that campground");
		return res.redirect("/campgrounds");
	}
	res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
	const { id } = req.params;
	//const campground = req.body.campground;
	const campground = await Campground.findByIdAndUpdate(id, {
		...req.body.campground,
	});
	req.flash("success", "successfully updated campground");
	res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCamprgound = async (req, res) => {
	const { id } = req.params;
	await Campground.findByIdAndDelete(id);
	req.flash("success", "successfully deleted a campground");
	res.redirect("/campgrounds");
};
