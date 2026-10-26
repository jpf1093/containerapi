const db = require("../config/database");

class CollectionPoint {
  static async findAll() {
    const [rows] = await db.query(
      `SELECT
                id,
                name,
                address,
                latitude,
                longitude,
                accuracy,
                created_at,
                updated_at
             FROM collection_points`,
    );

    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(
      `SELECT
                id,
                name,
                address,
                latitude,
                longitude,
                accuracy,
                created_at,
                updated_at
             FROM collection_points
             WHERE id = ?`,
      [id],
    );

    return rows[0];
  }

  static async create(name, address, latitude, longitude, accuracy) {
    const [result] = await db.query(
      `INSERT INTO collection_points (
                name,
                address,
                latitude,
                longitude,
                accuracy
             )
             VALUES (?, ?, ?, ?, ?)`,
      [name, address, latitude, longitude, accuracy],
    );

    return result.insertId;
  }

  static async update(id, name, address, latitude, longitude, accuracy) {
    const [result] = await db.query(
      `UPDATE collection_points
             SET name = ?,
                 address = ?,
                 latitude = ?,
                 longitude = ?,
                 accuracy = ?
             WHERE id = ?`,
      [name, address, latitude, longitude, accuracy, id],
    );

    return result.affectedRows;
  }

  static async delete(id) {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const [points] = await connection.query(
        `SELECT id
             FROM collection_points
             WHERE id = ?
             FOR UPDATE`,
        [id],
      );

      if (points.length === 0) {
        await connection.rollback();
        return 0;
      }

      const [allocations] = await connection.query(
        `SELECT DISTINCT container_id
             FROM container_allocations
             WHERE collection_point_id = ?`,
        [id],
      );

      await connection.query(
        `DELETE FROM container_allocations
             WHERE collection_point_id = ?`,
        [id],
      );

      for (const allocation of allocations) {
        const [active] = await connection.query(
          `SELECT id
                 FROM container_allocations
                 WHERE container_id = ?
                   AND end_at IS NULL
                 LIMIT 1`,
          [allocation.container_id],
        );

        if (active.length === 0) {
          await connection.query(
            `UPDATE containers
                     SET status = 'DISPONIVEL'
                     WHERE id = ?`,
            [allocation.container_id],
          );
        }
      }

      const [result] = await connection.query(
        `DELETE FROM collection_points
             WHERE id = ?`,
        [id],
      );

      await connection.commit();

      return result.affectedRows;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = CollectionPoint;
