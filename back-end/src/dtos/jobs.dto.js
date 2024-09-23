class JobDTO {
    constructor(job) {
        this.id = job._id;
        this.title = job.title;
        this.description = job.description;
    }
}

module.exports = JobDTO;