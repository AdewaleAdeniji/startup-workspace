export type Ticket = {
    ticketID: String,
    title: String,
    description: String,
    reporter: String,
    assignee: String,
    storyPoint: String,
    labels: String,
    status: String,
    ticketLogs: any,
    ticketPriority: String,
    ticketType: String,
    isChild: Boolean,
    isParent: Boolean,
    relatedID: String,
    sprintName: String,
    sprintID: String,
    boardID: String,
    workspaceID: String,
    active: Boolean,
}