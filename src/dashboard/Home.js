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
import { useHistory } from "react-router-dom";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CreateTaskDialog from "./CreateTaskDialog";
import CreateIcon from '@material-ui/icons/Create';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import UpdateTaskDialog from "./UpdateTaskDialog";
import {deleteTask, fetchTasksList, fetchUsersList} from "../CRUD_Operations";
import TextField from "@material-ui/core/TextField";
import {convertToPriority} from "../utils";
import withStyles from "@material-ui/core/styles/withStyles";
import CircularProgress from "@material-ui/core/CircularProgress";



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
    },
    searchBar:{
        '& > *': {
            width: '40ch',
            marginRight:'1rem'
        },
    },
    button:{
        marginLeft:'0.3rem',
        marginRight:'0.3rem'
    },
    loadingBox:{
        marginTop:'5rem'
    }
});

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: '#3f51b5',
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);


function Home(props) {
    const classes = useStyles();
    const history = useHistory();
    const [tasks,setTasks] = useState([]);
    const [savedTaskList,setSavedTaskList] = useState([]);
    const [createTaskDialogBox,setCreateTaskDialogBoxState] = useState(false);
    const [currentUpdateValue,setCurrentUpdateValue] = useState(null);
    const [updateDialogBoxState,setUpdateDialogBoxState] = useState(false);
    const [searchText,setSearchText] = useState('');
    const [reloadPage,setReloadPage] = useState(false);
    const [loading,setLoading] = useState(false);
    const [users,setUsers] = useState([])
    const [errors,setErrors] = useState(null);

    useEffect(()=>{
        setLoading(true);
        async function waitForResult() {
            const taskList = await fetchTasksList();
            setTasks(taskList);
            setSavedTaskList(taskList);
            const users = await fetchUsersList();
            setUsers(users);
            setLoading(false);
        }

        waitForResult();

    },[reloadPage]);

    useEffect(()=>{
        handleSearch();
    },[searchText])

    const handleSearch = () => {
        let tempSearchArray = savedTaskList;
        const filteredArray = tempSearchArray.filter(task => task.message.search(searchText) !== -1 || task.assigned_name.search(searchText) !== -1)
        setTasks(filteredArray);
    }

    const handleDelete = async (id) => {
        setLoading(true);
        await deleteTask(id);
        setReloadPage(!reloadPage);
    }


    return (
        <Grid container justify={'center'}>
            {
              !loading ? <Grid item xs={11}>
                    <Typography className={classes.heading}>
                        Tasks List
                    </Typography>
                    <Box className={classes.buttonBox}>
                        <form className={classes.searchBar} noValidate autoComplete="off">
                            <TextField
                                id="standard-basic"
                                value={searchText}
                                onChange={(event)=>setSearchText(event.target.value)}
                                label="Search for a task (case sensitive)" />
                        </form>
                        <Button className={classes.button} variant="contained" color="primary" onClick={()=>history.push('/priority-view')}>
                            Priority based tasks
                        </Button>
                        <Button className={classes.button} variant="contained" color="primary" onClick={()=>setCreateTaskDialogBoxState(true)}>
                            Create task
                        </Button>
                    </Box>
                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Message</StyledTableCell>
                                    <StyledTableCell align="center">Due date</StyledTableCell>
                                    <StyledTableCell align="center">Priority</StyledTableCell>
                                    <StyledTableCell align="center">Assigned to</StyledTableCell>
                                    <StyledTableCell align="center">Actions</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tasks.map((task) => (
                                    <TableRow key={task.id}>
                                        <TableCell component="th" scope="row">
                                            {task.message}
                                        </TableCell>
                                        <TableCell align="center">{task.due_date}</TableCell>
                                        <TableCell align="center">{convertToPriority(task.priority)}</TableCell>
                                        <TableCell align="center">{task.assigned_name}</TableCell>
                                        <TableCell align="center">
                                            <IconButton aria-label="update" onClick={()=>{
                                                setCurrentUpdateValue(task)
                                                setUpdateDialogBoxState(true);
                                            }}>
                                                <CreateIcon/>
                                            </IconButton>
                                            <IconButton onClick={()=>handleDelete(task.id)} aria-label="delete">
                                                <DeleteIcon/>
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
                        reloadState={reloadPage}
                        setReloadPage={setReloadPage}
                    />
                    <UpdateTaskDialog
                        initialValue={currentUpdateValue}
                        dialogBoxState={updateDialogBoxState}
                        setDialogBoxState={setUpdateDialogBoxState}
                        reloadState={reloadPage}
                        setReloadPage={setReloadPage}
                    />
                </Grid> : <Box className={classes.loadingBox}> <CircularProgress /> </Box>
            }
        </Grid>
    );
}

export default Home;