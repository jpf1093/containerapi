const db = require('../config/database');

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
             FROM collection_points`
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
            [id]
        );

        return rows[0];
    }


    static async create(
        name,
        address,
        latitude,
        longitude,
        accuracy
    ) {
        const [result] = await db.query(
            `INSERT INTO collection_points (
                name,
                address,
                latitude,
                longitude,
                accuracy
             )
             VALUES (?, ?, ?, ?, ?)`,
            [
                name,
                address,
                latitude,
                longitude,
                accuracy
            ]
        );

        return result.insertId;
    }


    static async update(
        id,
        name,
        address,
        latitude,
        longitude,
        accuracy
    ) {
        const [result] = await db.query(
            `UPDATE collection_points
             SET name = ?,
                 address = ?,
                 latitude = ?,
                 longitude = ?,
                 accuracy = ?
             WHERE id = ?`,
            [
                name,
                address,
                latitude,
                longitude,
                accuracy,
                id
            ]
        );

        return result.affectedRows;
    }


    static async delete(id) {
        const [result] = await db.query(
            `DELETE FROM collection_points
             WHERE id = ?`,
            [id]
        );

        return result.affectedRows;
    }
}

module.exports = CollectionPoint;