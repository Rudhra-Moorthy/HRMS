const timeTrackerRepo = require('../repository/timeTrackerRepo');
const timeEntryDto = require('../dto/timeEntry');

const createTimeEntry = async (body) => {

    const result = await timeTrackerRepo.createTimeEntry(body);

    return timeEntryDto(result);
};

const getAllTimeEntries = async () => {

    const timeEntries = await timeTrackerRepo.getAllTimeEntries();

    return timeEntries.map(timeEntryDto);
};

const getTimeEntryById = async (id) => {

    const timeEntry = await timeTrackerRepo.getTimeEntryById(id);

    return timeEntryDto(timeEntry);
};

const updateTimeEntry = async (id, body) => {

    const result = await timeTrackerRepo.updateTimeEntry(id, body);

    return timeEntryDto(result);
};

const deleteTimeEntry = async (id) => {

    return await timeTrackerRepo.deleteTimeEntry(id);
};
const getTimesheet = async (employeeId) => {

    return await timeTrackerRepo.getTimesheet(employeeId);

};
module.exports = {
    createTimeEntry,
    getAllTimeEntries,
    getTimeEntryById,
    updateTimeEntry,
    deleteTimeEntry,
    getTimesheet
};