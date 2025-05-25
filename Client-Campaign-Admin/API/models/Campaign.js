class Campaign {
    constructor(id, title, startDate, endDate, estimatedCost, clientId) {
        this.id = id;
        this.title = title;
        this.startDate = startDate; // campaignStartDate
        this.endDate = endDate;     // campaignFinishDate
        this.estimatedCost = estimatedCost;
        this.clientId = clientId;
    }
}

module.exports = Campaign;
