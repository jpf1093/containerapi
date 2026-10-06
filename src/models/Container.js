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
    const [result] = await db.query(
      `DELETE FROM containers
             WHERE id = ?`,
      [id],
    );

    return result.affectedRows;
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
        fillStatus = 'VAZIO';
    } else if (fillLevel <= 49) {
        fillStatus = 'BAIXO';
    } else if (fillLevel <= 74) {
        fillStatus = 'MEDIO';
    } else if (fillLevel <= 89) {
        fillStatus = 'ALTO';
    } else {
        fillStatus = 'CHEIO';
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
        [fillLevel, fillStatus, id]
    );

    return result.affectedRows;
}
}

module.exports = Container;
