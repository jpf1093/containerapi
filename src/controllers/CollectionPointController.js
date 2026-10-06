const CollectionPoint = require('../models/CollectionPoint');

class CollectionPointController {

    static async findAll(req, res) {
        try {
            const points = await CollectionPoint.findAll();

            return res.status(200).json(points);

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: 'Erro interno do servidor'
            });
        }
    }


    static async findById(req, res) {
        try {
            const { id } = req.params;

            const point = await CollectionPoint.findById(id);

            if (!point) {
                return res.status(404).json({
                    message: 'Ponto de coleta não encontrado'
                });
            }

            return res.status(200).json(point);

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: 'Erro interno do servidor'
            });
        }
    }


    static async create(req, res) {
        try {
            const {
                name,
                address,
                latitude,
                longitude,
                accuracy
            } = req.body;

            if (
                !name ||
                !address ||
                latitude === undefined ||
                longitude === undefined
            ) {
                return res.status(400).json({
                    message: 'Nome, endereço, latitude e longitude são obrigatórios'
                });
            }

            const latitudeNumber = Number(latitude);
            const longitudeNumber = Number(longitude);

            if (
                Number.isNaN(latitudeNumber) ||
                latitudeNumber < -90 ||
                latitudeNumber > 90
            ) {
                return res.status(400).json({
                    message: 'Latitude inválida'
                });
            }

            if (
                Number.isNaN(longitudeNumber) ||
                longitudeNumber < -180 ||
                longitudeNumber > 180
            ) {
                return res.status(400).json({
                    message: 'Longitude inválida'
                });
            }

            let accuracyNumber = null;

            if (accuracy !== undefined && accuracy !== null) {
                accuracyNumber = Number(accuracy);

                if (
                    Number.isNaN(accuracyNumber) ||
                    accuracyNumber < 0
                ) {
                    return res.status(400).json({
                        message: 'Accuracy inválida'
                    });
                }
            }

            const pointId = await CollectionPoint.create(
                name,
                address,
                latitudeNumber,
                longitudeNumber,
                accuracyNumber
            );

            const point = await CollectionPoint.findById(pointId);

            return res.status(201).json(point);

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: 'Erro interno do servidor'
            });
        }
    }


    static async update(req, res) {
        try {
            const { id } = req.params;

            const {
                name,
                address,
                latitude,
                longitude,
                accuracy
            } = req.body;

            if (
                !name ||
                !address ||
                latitude === undefined ||
                longitude === undefined
            ) {
                return res.status(400).json({
                    message: 'Nome, endereço, latitude e longitude são obrigatórios'
                });
            }

            const point = await CollectionPoint.findById(id);

            if (!point) {
                return res.status(404).json({
                    message: 'Ponto de coleta não encontrado'
                });
            }

            const latitudeNumber = Number(latitude);
            const longitudeNumber = Number(longitude);

            if (
                Number.isNaN(latitudeNumber) ||
                latitudeNumber < -90 ||
                latitudeNumber > 90
            ) {
                return res.status(400).json({
                    message: 'Latitude inválida'
                });
            }

            if (
                Number.isNaN(longitudeNumber) ||
                longitudeNumber < -180 ||
                longitudeNumber > 180
            ) {
                return res.status(400).json({
                    message: 'Longitude inválida'
                });
            }

            let accuracyNumber = null;

            if (accuracy !== undefined && accuracy !== null) {
                accuracyNumber = Number(accuracy);

                if (
                    Number.isNaN(accuracyNumber) ||
                    accuracyNumber < 0
                ) {
                    return res.status(400).json({
                        message: 'Accuracy inválida'
                    });
                }
            }

            await CollectionPoint.update(
                id,
                name,
                address,
                latitudeNumber,
                longitudeNumber,
                accuracyNumber
            );

            const updatedPoint = await CollectionPoint.findById(id);

            return res.status(200).json(updatedPoint);

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: 'Erro interno do servidor'
            });
        }
    }


    static async delete(req, res) {
        try {
            const { id } = req.params;

            const point = await CollectionPoint.findById(id);

            if (!point) {
                return res.status(404).json({
                    message: 'Ponto de coleta não encontrado'
                });
            }

            await CollectionPoint.delete(id);

            return res.status(204).send();

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: 'Erro interno do servidor'
            });
        }
    }
}

module.exports = CollectionPointController;