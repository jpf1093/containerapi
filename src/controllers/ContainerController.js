const Container = require("../models/Container");

class ContainerController {
  static async findAll(req, res) {
    try {
      const containers = await Container.findAll();

      return res.status(200).json(containers);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Erro interno do servidor",
      });
    }
  }

  static async findById(req, res) {
    try {
      const { id } = req.params;

      const container = await Container.findById(id);

      if (!container) {
        return res.status(404).json({
          message: "Container não encontrado",
        });
      }

      return res.status(200).json(container);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Erro interno do servidor",
      });
    }
  }

  static async create(req, res) {
    try {
      const { code, status } = req.body;

      if (!code) {
        return res.status(400).json({
          message: "Código é obrigatório",
        });
      }

      const existingContainer = await Container.findByCode(code);

      if (existingContainer) {
        return res.status(409).json({
          message: "Código de container já cadastrado",
        });
      }

      const allowedStatus = [
        "EM_USO",
        "EM_TRANSITO",
        "ESVAZIANDO",
        "DISPONIVEL",
        "MANUTENCAO",
        "INATIVO",
      ];

      const containerStatus = status || "DISPONIVEL";

      if (!allowedStatus.includes(containerStatus)) {
        return res.status(400).json({
          message: "Status inválido",
        });
      }

      const containerId = await Container.create(
        code,
        containerStatus,
      );

      const container = await Container.findById(containerId);

      return res.status(201).json(container);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Erro interno do servidor",
      });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { code, status } = req.body;

      if (!code || !status) {
        return res.status(400).json({
          message: "Código e status são obrigatórios",
        });
      }

      const container = await Container.findById(id);

      if (!container) {
        return res.status(404).json({
          message: "Container não encontrado",
        });
      }

      const allowedStatus = [
        "EM_USO",
        "EM_TRANSITO",
        "ESVAZIANDO",
        "DISPONIVEL",
        "MANUTENCAO",
        "INATIVO",
      ];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Status inválido",
        });
      }

      const containerWithCode = await Container.findByCode(code);

      if (
        containerWithCode &&
        containerWithCode.id !== Number(id)
      ) {
        return res.status(409).json({
          message: "Código de container já cadastrado",
        });
      }

      await Container.update(id, code, status);

      const updatedContainer = await Container.findById(id);

      return res.status(200).json(updatedContainer);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Erro interno do servidor",
      });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;

      const container = await Container.findById(id);

      if (!container) {
        return res.status(404).json({
          message: "Container não encontrado",
        });
      }

      await Container.delete(id);

      return res.status(204).send();
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Erro interno do servidor",
      });
    }
  }

  // =====================================================
  // ATUALIZAR NÍVEL DE PREENCHIMENTO
  // =====================================================

  static async updateFillLevel(req, res) {
    try {
      const { id } = req.params;
      const { fill_level } = req.body;

      if (fill_level === undefined || fill_level === null) {
        return res.status(400).json({
          message: "Nível de preenchimento é obrigatório",
        });
      }

      const fillLevel = Number(fill_level);

      if (
        Number.isNaN(fillLevel) ||
        fillLevel < 0 ||
        fillLevel > 100
      ) {
        return res.status(400).json({
          message:
            "Nível de preenchimento deve estar entre 0 e 100",
        });
      }

      const container = await Container.findById(id);

      if (!container) {
        return res.status(404).json({
          message: "Container não encontrado",
        });
      }

      await Container.updateFillLevel(id, fillLevel);

      const updatedContainer = await Container.findById(id);

      return res.status(200).json(updatedContainer);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Erro interno do servidor",
      });
    }
  }
}

module.exports = ContainerController;