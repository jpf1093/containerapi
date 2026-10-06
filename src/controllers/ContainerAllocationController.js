const ContainerAllocation = require("../models/ContainerAllocation");
const Container = require("../models/Container");
const CollectionPoint = require("../models/CollectionPoint");

class ContainerAllocationController {
  // Lista todas as alocações
  static async findAll(req, res) {
    try {
      const allocations = await ContainerAllocation.findAll();

      return res.status(200).json(allocations);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Erro interno do servidor",
      });
    }
  }

  // Busca uma alocação pelo ID
  static async findById(req, res) {
    try {
      const { id } = req.params;

      const allocation = await ContainerAllocation.findById(id);

      if (!allocation) {
        return res.status(404).json({
          message: "Alocação não encontrada",
        });
      }

      return res.status(200).json(allocation);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Erro interno do servidor",
      });
    }
  }

  // Cria uma nova alocação
  static async create(req, res) {
    try {
      const { container_id, collection_point_id, start_at, end_at } = req.body;

      if (!container_id || !collection_point_id) {
        return res.status(400).json({
          message: "Container e ponto de coleta são obrigatórios",
        });
      }

      // Verifica se o container existe
      const container = await Container.findById(container_id);

      if (!container) {
        return res.status(404).json({
          message: "Container não encontrado",
        });
      }

      // Verifica se o ponto de coleta existe
      const collectionPoint =
        await CollectionPoint.findById(collection_point_id);

      if (!collectionPoint) {
        return res.status(404).json({
          message: "Ponto de coleta não encontrado",
        });
      }

      // Se a nova alocação for ativa,
      // verifica se o container já possui outra alocação ativa
      if (!end_at) {
        const activeAllocation =
          await ContainerAllocation.findActiveByContainerId(container_id);

        if (activeAllocation) {
          return res.status(409).json({
            message: "Container já possui uma alocação ativa",
          });
        }
      }

      // Se start_at não for informado,
      // usa a data/hora atual
      const startAt = start_at || new Date();

      // NULL significa que a alocação está ativa
      const endAt = end_at || null;

      // Valida a data inicial
      const startDate = new Date(startAt);

      if (Number.isNaN(startDate.getTime())) {
        return res.status(400).json({
          message: "Data inicial inválida",
        });
      }

      // Valida a data final
      if (endAt) {
        const endDate = new Date(endAt);

        if (Number.isNaN(endDate.getTime())) {
          return res.status(400).json({
            message: "Data final inválida",
          });
        }

        if (endDate < startDate) {
          return res.status(400).json({
            message: "A data final não pode ser anterior à data inicial",
          });
        }
      }

      // Cria a alocação
      const allocationId = await ContainerAllocation.create(
        container_id,
        collection_point_id,
        startAt,
        endAt,
      );

      // Se a alocação estiver ativa,
      // o container passa para EM_USO
      if (!endAt) {
        await Container.updateStatus(container_id, "EM_USO");
      }

      const allocation = await ContainerAllocation.findById(allocationId);

      return res.status(201).json(allocation);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Erro interno do servidor",
      });
    }
  }

  // Atualiza uma alocação
  static async update(req, res) {
    try {
      const { id } = req.params;

      const { container_id, collection_point_id, start_at, end_at } = req.body;

      if (!container_id || !collection_point_id || !start_at) {
        return res.status(400).json({
          message: "Container, ponto de coleta e data inicial são obrigatórios",
        });
      }

      // Busca a alocação antes da alteração
      const allocation = await ContainerAllocation.findById(id);

      if (!allocation) {
        return res.status(404).json({
          message: "Alocação não encontrada",
        });
      }

      // Guarda o container antigo
      const oldContainerId = allocation.container_id;

      // Verifica se o novo container existe
      const container = await Container.findById(container_id);

      if (!container) {
        return res.status(404).json({
          message: "Container não encontrado",
        });
      }

      // Verifica se o ponto de coleta existe
      const collectionPoint =
        await CollectionPoint.findById(collection_point_id);

      if (!collectionPoint) {
        return res.status(404).json({
          message: "Ponto de coleta não encontrado",
        });
      }

      // Se a alocação ficará ativa,
      // verifica se o novo container já possui outra alocação ativa
      if (!end_at) {
        const activeAllocation =
          await ContainerAllocation.findActiveByContainerId(container_id);

        if (activeAllocation && activeAllocation.id !== Number(id)) {
          return res.status(409).json({
            message: "Container já possui outra alocação ativa",
          });
        }
      }

      // Valida data inicial
      const startDate = new Date(start_at);

      if (Number.isNaN(startDate.getTime())) {
        return res.status(400).json({
          message: "Data inicial inválida",
        });
      }

      // Valida data finalEM_USO
      if (end_at) {
        const endDate = new Date(end_at);

        if (Number.isNaN(endDate.getTime())) {
          return res.status(400).json({
            message: "Data final inválida",
          });
        }

        if (endDate < startDate) {
          return res.status(400).json({
            message: "A data final não pode ser anterior à data inicial",
          });
        }
      }

      // Atualiza a alocação
      await ContainerAllocation.update(
        id,
        container_id,
        collection_point_id,
        start_at,
        end_at || null,
      );

      if (oldContainerId !== Number(container_id)) {
        const oldContainerActiveAllocation =
          await ContainerAllocation.findActiveByContainerId(oldContainerId);

        // Se o container antigo não possui mais
        // nenhuma alocação ativa, fica disponível
        if (!oldContainerActiveAllocation) {
          await Container.updateStatus(oldContainerId, "DISPONIVEL");
        }
      }

      if (!end_at) {
        await Container.updateStatus(container_id, "EM_USO");
      } else {
        const activeAllocation =
          await ContainerAllocation.findActiveByContainerId(container_id);

        if (!activeAllocation) {
          await Container.updateStatus(container_id, "DISPONIVEL");
        }
      }

      const updatedAllocation = await ContainerAllocation.findById(id);

      return res.status(200).json(updatedAllocation);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Erro interno do servidor",
      });
    }
  }

  // Remove uma alocação
  static async delete(req, res) {
    try {
      const { id } = req.params;

      const allocation = await ContainerAllocation.findById(id);

      if (!allocation) {
        return res.status(404).json({
          message: "Alocação não encontrada",
        });
      }

      await ContainerAllocation.delete(id);

      // Se a alocação removida era ativa,
      // libera o container
      if (!allocation.end_at) {
        await Container.updateStatus(allocation.container_id, "DISPONIVEL");
      }

      return res.status(204).send();
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Erro interno do servidor",
      });
    }
  }
}

module.exports = ContainerAllocationController;
