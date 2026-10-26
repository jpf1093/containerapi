const db = require("../config/database");

class Container {
  static async findAll() {
    const [rows] = await db.query(`
    SELECT
      id,
      code,
      status,
      fill_level,
      fill_status,
      last_reading_at,
      created_at,
      updated_at
    FROM containers
    ORDER BY id DESC
  `);

    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(
      `
    SELECT
      id,
      code,
      status,
      fill_level,
      fill_status,
      last_reading_at,
      created_at,
      updated_at
    FROM containers
    WHERE id = ?
    `,
      [id],
    );

    return rows[0];
  }

  static async findByCode(code) {
    const [rows] = await db.query(
      `SELECT
                id,
                code,
                status,
                created_at,
                updated_at
             FROM containers
             WHERE code = ?`,
      [code],
    );

    return rows[0];
  }

  static async create(code, status = "DISPONIVEL") {
    const [result] = await db.query(
      `INSERT INTO containers (
                code,
                status
             )
             VALUES (?, ?)`,
      [code, status],
    );

    return result.insertId;
  }

  static async update(id, code, status) {
    const [result] = await db.query(
      `UPDATE containers
             SET code = ?,
                 status = ?
             WHERE id = ?`,
      [code, status, id],
    );

    return result.affectedRows;
  }

  static async delete(id) {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const [containers] = await connection.query(
        `SELECT id
             FROM containers
             WHERE id = ?
             FOR UPDATE`,
        [id],
      );

      if (containers.length === 0) {
        await connection.rollback();
        return 0;
      }

      await connection.query(
        `DELETE FROM container_allocations
             WHERE container_id = ?`,
        [id],
      );

      const [result] = await connection.query(
        `DELETE FROM containers
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

  static async updateStatus(id, status) {
    const [result] = await db.query(
      `UPDATE containers
         SET status = ?
         WHERE id = ?`,
      [status, id],
    );

    return result.affectedRows;
  }

  static async updateFillLevel(id, fillLevel) {
    let fillStatus;

    if (fillLevel <= 24) {
      fillStatus = "VAZIO";
    } else if (fillLevel <= 49) {
      fillStatus = "BAIXO";
    } else if (fillLevel <= 74) {
      fillStatus = "MEDIO";
    } else if (fillLevel <= 89) {
      fillStatus = "ALTO";
    } else {
      fillStatus = "CHEIO";
    }

    const [result] = await db.query(
      `
        UPDATE containers
        SET
            fill_level = ?,
            fill_status = ?,
            last_reading_at = NOW()
        WHERE id = ?
        `,
      [fillLevel, fillStatus, id],
    );

    return result.affectedRows;
  }
}

module.exports = Container;
