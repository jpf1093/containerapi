const db = require("../config/database");

class ContainerAllocation {
  static async findAll() {
    const [rows] = await db.query(
      `SELECT
                ca.id,
                ca.container_id,
                c.code AS container_code,
                ca.collection_point_id,
                cp.name AS collection_point_name,
                ca.start_at,
                ca.end_at,
                ca.created_at
             FROM container_allocations ca
             INNER JOIN containers c
                ON c.id = ca.container_id
             INNER JOIN collection_points cp
                ON cp.id = ca.collection_point_id
             ORDER BY ca.id DESC`,
    );

    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(
      `SELECT
                ca.id,
                ca.container_id,
                c.code AS container_code,
                ca.collection_point_id,
                cp.name AS collection_point_name,
                ca.start_at,
                ca.end_at,
                ca.created_at
             FROM container_allocations ca
             INNER JOIN containers c
                ON c.id = ca.container_id
             INNER JOIN collection_points cp
                ON cp.id = ca.collection_point_id
             WHERE ca.id = ?`,
      [id],
    );

    return rows[0];
  }

  static async create(containerId, collectionPointId, startAt, endAt) {
    const [result] = await db.query(
      `INSERT INTO container_allocations (
                container_id,
                collection_point_id,
                start_at,
                end_at
             )
             VALUES (?, ?, ?, ?)`,
      [containerId, collectionPointId, startAt, endAt],
    );

    return result.insertId;
  }

  static async update(id, containerId, collectionPointId, startAt, endAt) {
    const [result] = await db.query(
      `UPDATE container_allocations
             SET container_id = ?,
                 collection_point_id = ?,
                 start_at = ?,
                 end_at = ?
             WHERE id = ?`,
      [containerId, collectionPointId, startAt, endAt, id],
    );

    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.query(
      `DELETE FROM container_allocations
             WHERE id = ?`,
      [id],
    );

    return result.affectedRows;
  }

  static async findActiveByContainerId(containerId) {
    const [rows] = await db.query(
      `SELECT
            id,
            container_id,
            collection_point_id,
            start_at,
            end_at
         FROM container_allocations
         WHERE container_id = ?
           AND end_at IS NULL
         LIMIT 1`,
      [containerId],
    );

    return rows[0];
  }
}

module.exports = ContainerAllocation;
