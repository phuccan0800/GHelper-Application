class JobDTO {
    constructor(job) {
        this.id = job.id;
        this.title = job.title;
        this.description = job.description;
        this.options = job.options;
    }
}

module.exports = JobDTO;