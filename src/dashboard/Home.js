import React, {useEffect, useState} from "react";
import {Grid} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import axios from 'axios';
import makeStyles from "@material-ui/core/styles/makeStyles";
import CreateTaskDialog from "./CreateTaskDialog";
import CreateIcon from '@material-ui/icons/Create';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';



const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    heading:{
        fontSize:'24px',
        textAlign:'center',
        fontWeight:'600'
    },
    buttonBox:{
        margin:'1rem',
        display:'flex',
        justifyContent:'flex-end'
    }
});


function Home(props) {
    const classes = useStyles();

    const [tasks,setTasks] = useState([]);
    const [createTaskDialogBox,setCreateTaskDialogBoxState] = useState(false);
    const [errors,setErrors] = useState(null);

    useEffect(()=>{
        fetchTasksList();
    },[])

    const fetchTasksList = async () => {

        try {
            const result = await axios.get('/tests/tasks/list');
            setTasks(result.data.tasks);
            console.log(result.data.tasks);
        }
        catch (error) {
            setErrors(error.data);
        }

    }

    return (
        <Grid container justify={'center'}>
            <Grid item xs={12}>
                <Typography className={classes.heading}>
                    Tasks List
                </Typography>
                <Box className={classes.buttonBox}>
                    <Button variant="contained" color="primary" onClick={()=>setCreateTaskDialogBoxState(true)}>
                        Create task
                    </Button>
                </Box>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Message</TableCell>
                                <TableCell align="right">Due date</TableCell>
                                <TableCell align="right">Priority(g)</TableCell>
                                <TableCell align="right">Assigned to(g)</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tasks.map((task) => (
                                <TableRow key={task.name}>
                                    <TableCell component="th" scope="row">
                                        {task.message}
                                    </TableCell>
                                    <TableCell align="right">{task.due_date}</TableCell>
                                    <TableCell align="right">{task.priority}</TableCell>
                                    <TableCell align="right">{task.assigned_to}</TableCell>
                                    <TableCell align="center">
                                        <IconButton aria-label="delete">
                                            <CreateIcon/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <CreateTaskDialog
                    dialogBoxState={createTaskDialogBox}
                    setDialogBoxState={setCreateTaskDialogBoxState}
                />
            </Grid>
        </Grid>
    );
}

export default Home;