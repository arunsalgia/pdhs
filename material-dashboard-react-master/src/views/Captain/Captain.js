import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
// import DialogTitle from '@material-ui/core/DialogTitle';
// import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleSharpIcon from '@material-ui/icons/CheckCircleSharp';
import SelCVC from '@material-ui/icons/AddShoppingCart';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import MenuItem from '@material-ui/core/MenuItem';
// import FormControl from '@material-ui/core/FormControl';


// import DoneIcon from '@material-ui/icons/Done';

import Select from "@material-ui/core/Select";
import Button from '@material-ui/core/Button';
import Table from "components/Table/Table.js";
import Grid from "@material-ui/core/Grid";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";

import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

import { UserContext } from "../../UserContext";

// import {green } from 'material-ui/core/colors';
const vcPrefix = "#vicecaptain#"
const cPrefix = "#captain#"


const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    captain: {
        color: "yellow",
    },     
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
  }));



export default function SelectCaptainViceCaptain() {

    // window.onbeforeunload = () => setUser(null)

    const { setUser } = useContext(UserContext);
    const classes = useStyles();
    // const theme = useTheme();
    // const [open, setOpen] = useState(false);
    // const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
    // const [selectedOwner, setSelectedOwner] = useState(null);

    // const [backDropOpen, setBackDropOpen] = useState(false);
    // const [playerStatus, setPlayerStatus] = useState();
    const [captainTableData, setCaptainTableData] = useState([{desc: "Captain", name: ""},
        {desc: "ViceCaptain", name: ""}]);
    const [myTeamTableData, setMyTeamTableData] = useState([]);
    const [isUserMemberOfGroup, setGroupMember] = useState(false);
    const [tournamentStated, setTournamentStarted] = useState(false);
    
    // const [selectWhat, setSelectWhat] = useState("Captain");
    // const [selectedPlayerValue, setSelectedPlayerValue] = useState("");

    useEffect(() => 
    {
        const a = async () => {
            // get start of tournamnet (i.e. start of 1st match)
            var gameStarted = false;  
            var mygroup  = localStorage.getItem("gid")
            if  ((mygroup === "") || (mygroup === "0")) {
                // handle if not a member of any group
                setGroupMember(false);
                setTournamentStarted(false);
                console.log("Not a member of group. No cap/vice cap")
                return;
            }
            setGroupMember(true);

            console.log("Calling getcaptain")
            var response = await axios.get(`/user/getcaptain/${mygroup}/${localStorage.getItem("uid")}`);
            // var isGroupMember = false;
            if (response.data.length > 0) {
                captainTableData[0].name = response.data[0].captainName;
                captainTableData[1].name = response.data[0].viceCaptainName;
            }
            setCaptainTableData(captainTableData);

            // get list of player purchased by user for aelecting captain / vice captain
            var myUrl = `/user/myteamwos/${mygroup}/${localStorage.getItem("uid")}`;
            const teamResponse = await axios.get(myUrl);
            setMyTeamTableData(teamResponse.data[0].players);
            console.log(teamResponse.data[0].players) ;

            response = await axios.get(`/group/gamestarted/${localStorage.getItem("gid")}`);
            gameStarted = (response.data.length > 0);
            gameStarted = false;
            setTournamentStarted(gameStarted);
            }
            // user belong to group. get cpation / vice captian alreasy set
            // let response = ""
        a();
    }, []);

    
    function CvcSummary(props) {
        return (
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
        <Typography className={classes.heading}>{props.desc}</Typography>
        <Typography className={classes.secondaryHeading}>{props.name}</Typography>
        </AccordionSummary>
        );
    }

    const [expandedPanel, setExpandedPanel] = useState(false);
    const handleAccordionChange = (panel) => (event, isExpanded) => {
      setExpandedPanel(isExpanded ? panel : false);
    };
    const [selectedCaptain, SetSelectedCaptain] = useState("");
    const handleSelectedCaptain = (event) => {
        // console.log(captainTableData);
        var newid = event.target.value;
        var myElement = document.getElementById(newid);
        if (newid.includes(captainTableData[0].name)) {
            myElement.checked = true;
        } else if (newid.includes(captainTableData[1].name) ) {
            myElement.checked = false;
        } else {
            console.log("Captioan Cheange permitted");
            console.log(`CC is ${captainTableData[0].name}`)
        }
    };
    const [selectedViceCaptain, SetSelectedViceCaptain] = useState("");
    const handleSelectedViceCaptain = (event) => {
        var newid = event.target.value;
        var myElement = document.getElementById(newid);
        if (newid.includes(captainTableData[1].name)) {
            myElement.checked = true;
        } else if (newid.includes(captainTableData[0].name) ) {
            myElement.checked = false;
        } else {
            var tmp = captainTableData;
            var xxx = newid.split('#');
            tmp[1].name = xxx[2];
            setCaptainTableData(tmp);
        }
        console.log(captainTableData);
    };

    /*

    function xxxupdateViceCaptain() {
        captainTableData[1].name = selectedViceCaptain;
        console.log(captainTableData);
        setCaptainTableData(captainTableData);
        setExpandedPanel(false);
    }


    function xxxDisplayViceCaptainSelectButton() {
        if (tournamentStated) {
            return (<div></div>)
        } else {
            return (
                <div>
                <Select labelId='vicecaptain' id='vicecaptain'
                    value={selectedViceCaptain}
                    displayEmpty onChange={handleSelectedViceCaptain}>
                    {myTeamTableData.map(item => 
                        <MenuItem key={item.pid} value={item.playerName}>{item.playerName}</MenuItem>)}
                </Select>
                <Button variant="contained" color="secondary" size="small"
                    className={classes.button} onClick={updateViceCaptain}>Update
                </Button>
                </div>
            );
        }
    }


    function  ORG_ShowCaptainorgViceCaptain() {
        if (isUserMemberOfGroup) {
            return(
            <div>
            <Accordion expanded={expandedPanel === captainTableData[0].desc} 
                onChange={handleAccordionChange(captainTableData[0].desc)}>
                <CvcSummary desc={captainTableData[0].desc} name={captainTableData[0].name}/>
              <AccordionDetails>
                  <DisplayCaptainSelectButton/>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expandedPanel === captainTableData[1].desc} 
                onChange={handleAccordionChange(captainTableData[1].desc)}>
                <CvcSummary desc={captainTableData[1].desc} name={captainTableData[1].name}/>
                <AccordionDetails>
                    <DisplayViceCaptainSelectButton/>
                </AccordionDetails>
            </Accordion>
            </div>
            );
        } else {
            return(<div></div>);
        }
    }
*/

    function updateCaptain() {
        console.log(captainTableData);
    }


    function DisplayCaptainSelectButton() {
    return (
        <Button align="center" variant="contained" color="secondary" size="small"
            className={classes.button} onClick={updateCaptain}>Update
        </Button>
        );
    }


    function  ShowCaptainViceCaptain() {
        if (isUserMemberOfGroup) {
            return(
                <Grid key="gr-cvc" container justify="center" alignItems="center" >
                <GridItem key="gi-cvc" xs={12} sm={12} md={12} lg={12} >
                    <Card key="c-cvc" profile>
                        <CardBody key="cb-cvc" profile>
                            <Table
                                tableKey="t-cvc"
                                id="t-cvc"
                                tableHeaderColor="warning"
                                tableHead={["Player Name", "Captain", "Vice Captain"]}
                                tableData={myTeamTableData.map(x => {
                                    const arr = [x.playerName,
                                    <FormControlLabel 
                                        className={classes.captain} 
                                        value={cPrefix+x.playerName}    
                                        control={<Switch id={cPrefix+x.playerName} defaultChecked={x.playerName === captainTableData[0].name}/>}
                                        onClick={handleSelectedCaptain}
                                    />,
                                    <FormControlLabel 
                                        className={classes.captain} 
                                        value={vcPrefix+x.playerName}    
                                        control={<Switch id={vcPrefix+x.playerName} defaultChecked={x.playerName === captainTableData[1].name} />}
                                        onClick={handleSelectedViceCaptain}
                                    />
                                     ]
                                    return { data: arr, collapse: [] }
                                })}
                            />
                        </CardBody>
                    </Card>
                    <DisplayCaptainSelectButton/>
                </GridItem>
                </Grid>
            );
        } else {
            return(<div></div>);
        }
    }
    return (
    <div className={classes.root} key={classes.root}>
        <h3 align="center">My Captain and Vice Captain ({localStorage.getItem("tournament")})</h3>
        <ShowCaptainViceCaptain/>
    </div>
    );

};
