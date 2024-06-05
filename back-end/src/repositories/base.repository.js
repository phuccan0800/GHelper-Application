class BaseRepository {
    constructor(model) {
        this.model = model;
        this.session = null;
    }
    setSession(session) {
        this.session = session;
    }

    async create(data) {
        const document = new this.model(data);
        return await document.save();
    }

    async findAll() {
        return await this.model.find();
    }

    async findById(id) {
        return await this.model.findById(id);
    }

    async update(id, updateData) {
        return await this.model.findByIdAndUpdate(id, updateData, { new: true });
    }

    async delete(id) {
        return await this.model.findByIdAndDelete(id);
    }
}

module.exports = BaseRepository;