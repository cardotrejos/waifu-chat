class Message {
    constructor(db) {
        this.db = db;
    }

    // Crear un nuevo mensaje
    createMessage(girlId, role, content) {
        this.db.run("INSERT INTO message (girlId, role, content) VALUES (?, ?, ?);", [girlId, role, content]);
    }

    // Obtener mensajes por ID de chica
    getMessagesByGirlId(girlId) {
        const result = this.db.exec("SELECT * FROM message WHERE girlId = ?;", [girlId]);
        return result.length ? result[0].values : [];
    }

    // Eliminar todos los mensajes de una chica
    deleteMessagesByGirlId(girlId) {
        this.db.run("DELETE FROM message WHERE girlId = ?;", [girlId]);
    }
}

export default Message;
