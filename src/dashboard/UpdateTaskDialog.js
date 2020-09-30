import React, {useEffect, useState} from "react";
import axios from 'axios';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import makeStyles from "@material-ui/core/styles/makeStyles";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker, KeyboardDateTimePicker,
} from '@material-ui/pickers';
import InputLabel from "@material-ui/core/InputLabel";
import Box from "@material-ui/core/Box";


const useStyles = makeStyles({
    formControl: {
        minWidth: '40%',
        margin:'0.5rem',
        display:'flex'
    },
    selectEmpty: {
        marginTop: '2rem',
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        width: '100%',
        margin:'0.5rem'
    },
    message:{
        margin:'0.5rem'
    },
    box:{
        display:'flex',
        justifyContent:'space-between',
    }
});


function UpdateTaskDialog(props) {
    const classes = useStyles();
    const {
        initialValue,
        dialogBoxState,
        setDialogBoxState,
    } = props;

    useEffect(()=>{
        fetchUsersList();
    },[]);
    useEffect(()=>{
        if(initialValue != null) {
            setTask(initialValue);
            const date = new Date(initialValue.due_date)
            handleDateChange(date)
        }
    },[initialValue])

    const [task,setTask] = useState({});
    const [users,setUsers] = useState([])
    const [selectedDate, handleDateChange] = useState(new Date("2018-01-01T00:00:00.000Z"));
    const handleChange = (event) => {
        setTask({
            ...task,
            [event.target.name]:event.target.value
        })
    }


    const fetchUsersList = async () => {
        try {
            const result = await axios.get('tests/tasks/listusers');
            setUsers(result.data.users);
        }
        catch (error) {

        }
    }

    const convertDateTimeToRequiredFormat = (selectedDate) => {
        const date = selectedDate.getFullYear().toString()+'-'+(selectedDate.getMonth()+1).toString()+'-'+selectedDate.getDate().toString()
        const time = selectedDate.getHours().toString()+':'+selectedDate.getMinutes().toString()+':'+'00';
        const dateTime = date+' '+time;
        return dateTime;
    }

    const updateTask = async () => {
        try {
            let formData = new FormData();
            formData.append('taskid',task.id)
            formData.append('message',task.message);
            formData.append('priority',task.priority);
            formData.append('due_date',convertDateTimeToRequiredFormat(selectedDate));
            formData.append('assigned_to',task.assigned_to);
            const result = await axios.post('/tests/tasks/update',formData)
            console.log(result);

        }
        catch (error) {
            console.log(error);
        }
    }
    return (
        <div>
            <Dialog open={dialogBoxState}  aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Update a new task</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please update the task by modifying values.
                    </DialogContentText>
                    <form className={classes.container} noValidate>
                    <TextField
                        className={classes.message}
                        autoFocus
                        margin="dense"
                        name="message"
                        label="Message"
                        type="text"
                        value={task.message}
                        fullWidth
                        onChange={handleChange}
                    />
                    </form>
                    <form className={classes.container} noValidate>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDateTimePicker
                            variant="inline"
                            ampm={false}
                            label="With keyboard"
                            value={task.due_date}
                            onChange={handleDateChange}
                            onError={console.log}
                            disablePast
                            format="yyyy/MM/dd HH:mm"
                        />
                        </MuiPickersUtilsProvider>
                    </form>
                    <Box className={classes.box}>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="age-native-simple">Priority</InputLabel>
                            <Select
                                native
                                value={task.priority}
                                onChange={handleChange}
                                name="priority"

                            >
                                <option aria-label="None" value="" />
                                {[...Array(10).keys()].map((priority,index)=>
                                    (<option value={priority+1} key={index}>{priority+1}</option>)
                                )}
                            </Select>
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="age-native-simple">Assigned to</InputLabel>
                            <Select
                                native
                                value={task.assigned_to}
                                onChange={handleChange}
                                name="assigned_to"
                            >
                                <option aria-label="None" value="" />
                                {
                                    users.map((user)=>(
                                        <option aria-label="None" key={user.id} value={user.id}>{user.name}</option>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </Box>


                </DialogContent>
                <DialogActions>
                    <Button  color="primary" onClick={()=>setDialogBoxState(false)}>
                        Cancel
                    </Button>
                    <Button  color="primary" onClick={()=>updateTask()}>
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default UpdateTaskDialog;