class Girl {
    constructor(db) {
      this.db = db;
    }
  
    createGirl(name, prompt, avatarId) {
      this.db.run("INSERT INTO girl (name, prompt, avatarId) VALUES (?, ?, ?);", [name, prompt, avatarId]);
    }
  
    getGirlById(id) {
      const result = this.db.exec("SELECT * FROM girl WHERE id = ?;", [id]);
      return result.length ? result[0].values[0] : null;
    }
  
    getAllGirls() {
      const result = this.db.exec("SELECT * FROM girl;");
      return result.length ? result[0].values : [];
    }
  
    updateGirl(id, name, prompt, avatarId) {
      this.db.run("UPDATE girl SET name = ?, prompt = ?, avatarId = ? WHERE id = ?;", [name, prompt, avatarId, id]);
    }
  
    deleteGirl(id) {
      this.db.run("DELETE FROM girl WHERE id = ?;", [id]);
    }
}

export default Girl;
