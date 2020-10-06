import React, {useEffect, useState} from "react";
import {Grid} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import TaskComponent from "./TaskComponent";

import Types from "../Constants";
import {useDrop} from "react-dnd";
import TaskContainer from "./TaskContainer";
import {fetchTasksList} from "../CRUD_Operations";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles({
    loadingBox:{
        marginTop:'5rem'
    }
})

const taskTypes = [
    {
        priority:'3'
    },
    {
        priority:'2'
    },
    {
        priority:'1'
    }
]

function ViewByPriority(props) {

    const [loading,setLoading] = useState(false);
    const [taskList,setTaskList] = useState(null)
    const classes = useStyles();

    useEffect( ()=> {
        setLoading(true);
        async function waitForResult() {
            const result = await fetchTasksList();
            setTaskList(result);
            setLoading(false);
        }
        waitForResult();

    },[])

    return (

            <Grid container justify={'center'}>
                {
                  !loading ?   <Grid item xs={11}>
                        <Typography style={{textAlign:'center',fontSize:'2rem'}}>
                            Task based on priority
                        </Typography>

                        <Grid container justify={'center'} spacing={2}>
                            {taskTypes.map((taskType)=> (
                                    <Grid item xs={4} >
                                        <TaskContainer
                                            taskArray={taskList}
                                            setPriorityTask={setTaskList}
                                            containerPriority={taskType.priority}
                                        >
                                            {taskList && taskList.filter(task=>task.priority === taskType.priority).map(task => (
                                                <TaskComponent
                                                    task={task}
                                                />
                                            ))}
                                        </TaskContainer>
                                    </Grid>
                                )
                            )}
                        </Grid>
                    </Grid> : <Box className={classes.loadingBox}> <CircularProgress /> </Box>
                }
            </Grid>
    )
}

export default ViewByPriority;