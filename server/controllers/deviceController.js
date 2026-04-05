const {v4: uuidv4} = require('uuid')
const path = require("path");
const {Device, DeviceInfo} = require("../models/models");
const ApiError = require("../error/ApiError");
const {where} = require("sequelize");

class deviceController {
  async getAll(req, res) {
    let {typeId, brandId, limit, page} = req.query;
    page = page || 1;
    limit = limit || 10;
    let offset = limit * page - limit;
    let devices;

    if (!typeId && !brandId) {
      devices = await Device.findAndCountAll({limit, offset});
    }

    if (typeId && !brandId) {
      devices = await Device.findAndCountAll({where: {typeId}, limit, offset})
    }

    if (!typeId && brandId) {
      devices = await Device.findAndCountAll({where: {brandId}, limit, offset})
    }

    if (brandId && typeId) {
      devices = await Device.findAndCountAll({
        where: {brandId, typeId},
        limit,
        offset
      })
    }

    res.json(devices)
  }

  async create(req, res, next) {
    try {
      let {name, price, typeId, brandId, info} = req.body
      const {img} = req.files

      let filename = uuidv4() + ".jpeg"
      await img.mv(path.resolve(__dirname, '..', 'static', filename));

      const device = await Device.create(
        {name, price, typeId, brandId, img: filename}
      )

      if (info) {
        info = JSON.parse(info)
        info.forEach(item => {
          DeviceInfo.create({
            title: item.title,
            description: item.description,
            deviceId: device.id,
          })
        })
      }

      return res.json(device)
    } catch (e) {
      next(ApiError.badRequest(e.message))
    }
  }

  async getOne(req, res) {
    const {id} = req.params
    const device = await Device.findOne(
      {
        where: {id},
        include: {model: DeviceInfo, as: 'info'}
      }
    )
    return res.json(device)
  }
}

module.exports = new deviceController()