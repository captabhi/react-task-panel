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
    DateTimePicker,
} from '@material-ui/pickers';
import InputLabel from "@material-ui/core/InputLabel";
import Box from "@material-ui/core/Box";
import {createNewTask, fetchUsersList} from "../CRUD_Operations";
import {convertToPriority} from "../utils";


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
        setReloadPage,
        reloadState
    } = props;

    useEffect(()=>{
        async function waitForResult() {
            const users = await fetchUsersList();
            setUsers(users);
        }
        waitForResult();
    },[])

    const [task,setTask] = useState({});
    const [users,setUsers] = useState([])
    const [selectedDate, handleDateChange] = useState(new Date());
    const handleChange = (event) => {
        setTask({
            ...task,
            [event.target.name]:event.target.value
        })
    }

    const handleCreate = async () => {
        const result = await createNewTask(task,selectedDate);
        setDialogBoxState(false);
        setReloadPage(!reloadState);
    }


    return (
        <div>
            <Dialog open={dialogBoxState}  aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Create a new task</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please create a new task by filling the following form.
                    </DialogContentText>
                    <form className={classes.container}  noValidate>
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
                    <form className={classes.container} style={{padding:'0.5rem'}} noValidate>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DateTimePicker
                            ampm={false}
                            value={selectedDate}
                            onChange={handleDateChange}
                            onError={console.log}
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
                                {[...Array(3).keys()].map((priority,index)=>
                                    (<option value={priority+1} key={index}>{convertToPriority((priority+1).toString())}</option>)
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
                    <Button  color="primary" onClick={handleCreate}>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default CreateTaskDialog;