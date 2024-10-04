class Memory {
    constructor(db) {
        this.db = db;
    }

    createMemory(girlId, memories) {
        this.db.run("INSERT INTO memory (girlId, memories) VALUES (?, ?);", [girlId, memories]);
    }

    getMemoryByGirlId(girlId) {
        const result = this.db.exec("SELECT * FROM memory WHERE girlId = ?;", [girlId]);
        return result.length ? result[0].values[0] : null;
    }

    updateMemory(girlId, memories) {
        this.db.run("UPDATE memory SET memories = ? WHERE girlId = ?;", [memories, girlId]);
    }

    deleteMemoryByGirlId(girlId) {
        this.db.run("DELETE FROM memory WHERE girlId = ?;", [girlId]);
    }
}

export default Memory;
