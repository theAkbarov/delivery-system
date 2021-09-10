const express = require("express");
const { authMiddleware } = require("../middleware/authMidlleware");
const { asyncWrapper } = require("../utils/errorHandler");
const router = express.Router();
const { Trucks } = require("../models/Trucks");
const { roleMiddleware } = require("../middleware/roleMiddleware");

router.post(
  "/",
  authMiddleware,
  asyncWrapper(async (req, res, next) => {
    const { type } = req.body;
    const truck = new Trucks({
      type,
      assign_to: req.user._id,
      created_by: req.user._id,
      status: "IS",
    });
    console.log(req.user);
    await truck.save();

    res.status(200).json({ message: "Successfully created" });
  })
);
router.get(
  "/",
  authMiddleware,
  roleMiddleware,
  asyncWrapper(async (req, res, next) => {
    console.log(req.role)
    if (req.role == "driver") {
      const trucks = await Trucks.find({ created_by: req.user._id });
      if (!trucks) {
        return res
          .status(404)
          .json({ message: "No truck are available for this user" });
      }

      res.status(200).json({ trucks });
    } else {
      res.status(400).json({ message: "Available for only drivers" });
    }
  })
);

router.delete(
  "/:id",
  authMiddleware,
  asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    await Trucks.findOneAndDelete({ _id: id });
    res.json(200).json({
      message: "Truck deleted successfully",
    });
  })
);

router.put(
  "/:id",
  authMiddleware,
  asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const { type } = req.body;
    await Trucks.findByIdAndUpdate({ _id: id }, { $set: { type } });
    res.json(200).json({
      message: "Truck details changed successfully",
    });
  })
);
router.get(
  "/:id",
  authMiddleware,
  asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const truck = await Trucks.findById({ _id: id });
    if (!truck) {
      return res
        .status(404)
        .json({ message: `Couldn't find truck with '${id}' id.` });
    }
    res.status(200).json({
      truck,
    });
  })
);
router.post(
  "/:id/assign",
  authMiddleware,
  asyncWrapper(async (res, req, next) => {
    const { id } = req.params;

    await Trucks.findOneAndUpdate({ _id: id }, { $set: { assign_to: null } });

    res.status(200).json({
      message: "Truck assigned successfully",
    });
  })
);
module.exports = {
  truckRouter: router,
};
