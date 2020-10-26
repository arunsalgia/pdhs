import React, { useEffect, useState } from 'react';
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import Table from "components/Table/Table.js";
import { makeStyles } from '@material-ui/core/styles';
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";

const drawerWidth = 100;
const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
    image: {
        height: "200px"
    },
    container: {
        backgroundImage: "url(\"../RCB/5334.jpg\")",
        backgroundSize: 'cover'
    }, drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
    },
    sold: {
        color: "green"
    }, cardCategoryWhite: {
        color: "rgba(255,255,255,.62)",
        margin: "0",
        fontSize: "14px",
        marginTop: "0",
        marginBottom: "0"
    },
    cardTitleWhite: {
        color: "#FFFFFF",
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "3px",
        textDecoration: "none"
    }, large: {
        width: theme.spacing(12),
        height: theme.spacing(12),
    },
}));


export default function MatchInfo() {
    // const { user } = useContext(UserContext);

    const classes = useStyles(); 
    const [currentArray, setCurrentArray] = useState([]);
    const [upcomingArray, setUpcomingArray] = useState([]);

    useEffect(() => { 
        const fetchMatch = async () => {
            try {
                var response = await axios.get(`/match/matchinfo/${localStorage.getItem("gid")}`);
                setCurrentArray(response.data.current);
                setUpcomingArray(response.data.upcoming);
            } catch (e) {
                console.log(e)
            }
        }
        fetchMatch();
    }, []);


    function ShowCurrentMatch() {
        var myHeader = (currentArray.length > 0)
            ? "Match running just now" : "Currently No Matches running";
        return(
        <Grid container justify="center" alignItems="center" >
            <GridItem xs={12} sm={12} md={12} lg={12} >
            <Card profile>
            <CardBody profile>
            <h4 className={classes.cardTitle}>{myHeader}</h4>
                <Table
                    tableHeaderColor="warning"
                    tableHead={["Team1", "Team2", "Match Start Time"]}
                    tableData={currentArray.map(x => {
                        const arr = [x.team1, x.team2, x.matchTime]
                        return { data: arr, collapse: [] }
                    })}
                />
            </CardBody>
            </Card>
            </GridItem>
        </Grid>
        )
    }

    function ShowUpcomingMatch() {
        var myHeader = (upcomingArray.length > 0)
            ? "Upcoming Matches" : "All Matches are over";
        return(
        <Grid container justify="center" alignItems="center" >
            <GridItem xs={12} sm={12} md={12} lg={12} >
            <Card profile>
            <CardBody profile>
                <h4 className={classes.cardTitle}>{myHeader}</h4>
                <Table
                    tableHeaderColor="warning"
                    tableHead={["Team1", "Team2", "Match Start Time"]}
                    tableData={upcomingArray.map(x => {
                        const arr = [x.team1, x.team2, x.matchTime]
                        return { data: arr, collapse: [] }
                    })}
                />
            </CardBody>
            </Card>
            </GridItem>
        </Grid>
        )
    }


    return (
        <div>
            <h3 align="center">Tournament ({localStorage.getItem("tournament")})</h3>
            <ShowCurrentMatch/>
            <ShowUpcomingMatch/>
        </div>
    )
};

