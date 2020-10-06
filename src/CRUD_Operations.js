import axios from "axios";

export const fetchTasksList = async () => {
    try {
        const result = await axios.get('/tests/tasks/list');
        return result.data.tasks;
    }
    catch (error) {
        return error;
    }
}

export const createNewTask = async (task,selectedDate) => {
    try {
        let formData = new FormData();
        formData.append('message',task.message);
        formData.append('priority',task.priority);
        formData.append('due_date',convertDateTimeToRequiredFormat(selectedDate));
        formData.append('assigned_to',task.assigned_to);
        const result = await axios.post('/tests/tasks/create',formData)
        return result;
    }
    catch (error) {
        return error;
    }
}

export const fetchUsersList = async () => {
    try {
        const result = await axios.get('tests/tasks/listusers');
        return result.data.users;
    }
    catch (error) {
        return error;
    }
}

export const convertDateTimeToRequiredFormat = (selectedDate) => {
    const date = selectedDate.getFullYear().toString()+'-'+(selectedDate.getMonth()+1).toString()+'-'+selectedDate.getDate().toString()
    const time = selectedDate.getHours().toString()+':'+selectedDate.getMinutes().toString()+':'+'00';
    const dateTime = date+' '+time;
    return dateTime;
}

export const updateTask = async (task,selectedDate) => {
    try {
        let formData = new FormData();
        formData.append('taskid',task.id)
        if(task.message) formData.append('message',task.message);
        if(task.priority) formData.append('priority',task.priority);
        if(selectedDate) formData.append('due_date',convertDateTimeToRequiredFormat(selectedDate));
        if(task.assigned_to) formData.append('assigned_to',task.assigned_to);
        const result = await axios.post('/tests/tasks/update',formData)
        console.log(result);
        return result;

    }
    catch (error) {
        console.log(error);
        return error;
    }
}

export const deleteTask = async (taskId) => {
    const formData = new FormData();
    formData.append('taskid',taskId);
    try {
        const result = await axios.post('/tests/tasks/delete',formData);
        console.log(result);
    }
    catch (error) {

    }
}