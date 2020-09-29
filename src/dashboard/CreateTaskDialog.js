import React, {useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
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
    KeyboardDatePicker,
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


function CreateTaskDialog(props) {
    const classes = useStyles();
    const {
        dialogBoxState,
        setDialogBoxState,
    } = props;

    useEffect(()=>{
        fetchUsersList();
    },[])

    const [task,setTask] = useState({});
    const [users,setUsers] = useState([])

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

    const createNewTask = async () => {
        try {
            let formData = new FormData();
            formData.append('message',task.message);
            formData.append('priority',task.priority);
            formData.append('due_date',task.due_date);
            formData.append('assigned_to',task.assigned_to);
            const result = await axios.post('/tests/tasks/create',formData)
            console.log(result);
        }
        catch (error) {
            console.log(error);
        }
    }
    return (
        <div>
            <Dialog open={dialogBoxState}  aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Create a new task</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please create a new task y filling the following form.
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
                        <TextField
                            id="datetime-local"
                            label="Next appointment"
                            type="datetime-local"
                            value={task.due_date}
                            name={'due_date'}
                            defaultValue="2017-05-24T10:30"
                            className={classes.textField}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
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
                                value={task.assignedTo}
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
                    <Button  color="primary" onClick={()=>createNewTask()}>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default CreateTaskDialog;