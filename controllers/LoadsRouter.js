const express = require("express");
const Joi = require("joi");

const { asyncWrapper } = require("../utils/errorHandler");
const { authMiddleware } = require("../middleware/authMidlleware");
const { Loads } = require("../models/Loads");
const { roleMiddleware } = require("../middleware/roleMiddleware");
const { Trucks } = require("../models/Trucks");
const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware,
  asyncWrapper(async (req, res, next) => {
    console.log(req.role);
    if (req.role == "shipper") {
      const { _id } = req.user;
      const {
        height,
        name,
        payload,
        pickup_address,
        width,
        length,
        delivery_address,
      } = req.body;
      const load = new Loads({
        name,
        payload,
        pickup_address,
        created_by: req.user._id,
        delivery_address,
        status: "New",
        dimensions: {
          width,
          length,
          height,
        },
      });
      await load.save();

      res.status(200).json({ message: "Load created successfully" });
    } else {
      res.status(400).json({ message: "Available for only SHIPPER" });
    }
  })
);
router.get(
  "/",
  authMiddleware,
  roleMiddleware,
  asyncWrapper(async (req, res, next) => {
    if (req.role == "shipper") {
      const { status, limit, offset } = req.body;
      const load = await Loads.find({ created_by: req.user._id });
      res.status(200).json({ load });
    } else {
      res.status(400).json({ message: "Available for only SHIPPER" });
    }
  })
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware,
  asyncWrapper(async (req, res, next) => {
    if (req.role == "shipper") {
      await Loads.findByIdAndDelete({ _id: req.params.id });

      res.status(200).json({ message: "Load deleted successfully" });
    } else {
      res.status(400).json({ message: "Available for only SHIPPER" });
    }
  })
);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware,
  asyncWrapper(async (req, res, next) => {
    const {
      height,
      name,
      payload,
      pickup_address,
      width,
      length,
      delivery_address,
    } = req.body;
    const { id } = req.params;
    if (req.role == "shipper") {
      await Loads.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            height,
            name,
            payload,
            pickup_address,
            width,
            length,
            delivery_address,
          },
        }
      );

      res.status(200).json({ message: "Load details changed successfully" });
    } else {
      res.status(400).json({ message: "Available for only SHIPPER" });
    }
  })
);
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware,
  asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const load = await Loads.findById({ _id: id });

    res.status(200).json({ load });
  })
);
router.post(
  "/:id/post",
  authMiddleware,
  roleMiddleware,
  asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    await Loads.findByIdAndUpdate({ _id: id }, { $set: { status: "POSTED" } });
    const trucks = await Trucks.find({})
    res.status(200).json({
      message: "Load posted successfully",
      driver_found: true,
      trucks
    });
  })
);
module.exports = {
  LoadsRouter: router,
};
