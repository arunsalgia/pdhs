import React, { useEffect, useState, useContext } from 'react';
//import TextField from '@material-ui/core/TextField';
//import { InputAdornment, makeStyles, Container, CssBaseline } from '@material-ui/core';
import { CssBaseline } from '@material-ui/core';
import axios from "axios";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Box from '@material-ui/core/Box';

import VsButton from "CustomComponents/VsButton";
import VsCancel from "CustomComponents/VsCancel";
import VsTextSearch from "CustomComponents/VsTextSearch";

import FormControl from '@material-ui/core/FormControl';



import { useAlert } from 'react-alert';
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';


import Member from "views/Member/Member";



//import {
//WEEKSTR, MONTHSTR, SHORTMONTHSTR, DATESTR, MONTHNUMBERSTR,
//} from 'views/globals';

// import { UserContext } from "../../UserContext";
import { isMobile, encrypt,
	dispOnlyAge, dispAge, dispEmail, dispMobile, checkIfBirthday,
	validateInteger,
	getAllPatients,
	vsDialog,
	disableFutureDt,
	getMemberName,
 } from "views/functions.js"
import {DisplayPageHeader, BlankArea, DisplayPatientBox,
	DisplayMemberHeader,
} from "CustomComponents/CustomComponents.js"

// styles
import globalStyles from "assets/globalStyles";
import {dynamicModal } from "assets/dynamicModal";

// icons
//import DeleteIcon from '@material-ui/icons/Delete';
//import CloseIcon from '@material-ui/icons/Close';
//import CancelIcon from '@material-ui/icons/Cancel';
//import ClearSharpIcon from '@material-ui/icons/ClearSharp';

import {red, blue, yellow, orange, green, pink } from '@material-ui/core/colors';
import { LeakRemoveTwoTone, LensTwoTone } from '@material-ui/icons';
import {setTab} from "CustomComponents/CricDreamTabs.js"

const drawerWidth=800;
const AVATARHEIGHT=4;

/*
const useStyles = makeStyles((theme) => ({
	dateTime: {
		color: 'blue',
		fontSize: theme.typography.pxToRem(28),
		fontWeight: theme.typography.fontWeightBold,
		backgroundColor: pink[100],
		align: 'center',
		width: (isMobile()) ? '60%' : '20%',
	}, 
	dateTimeNormal: {
		color: 'blue',
		fontSize: theme.typography.pxToRem(14),
		fontWeight: theme.typography.fontWeightBold,
		//backgroundColor: pink[100],
		align: 'center',
		//width: (isMobile()) ? '60%' : '20%',
	}, 
	dateTimeBlock: {
		color: 'blue',
		//fontSize: theme.typography.pxToRem(28),
		fontWeight: theme.typography.fontWeightBold,
		//backgroundColor: pink[100],
		width: '40%'
	},
	drawer: {
		width: '40%',
		flexShrink: 0
		//backgroundColor: "rgba(0,0,0,0.6)" Don't target here
	},
	boxStyle: {padding: "5px 10px", margin: "4px 2px", backgroundColor: blue[300] },
	radio: {
		fontSize: theme.typography.pxToRem(20),
		fontWeight: theme.typography.fontWeightBold,
		color: "blue",
	},
    root: {
      width: '100%',
    }, 
		link: {
			backgroundColor: 'transparent',
		},
		switchText: {
			fontSize: theme.typography.pxToRem(14),
			fontWeight: theme.typography.fontWeightBold,
    }, 
    info: {
			backgroundColor: yellow[500],	
			color: blue[700],
			height: theme.spacing(AVATARHEIGHT),
			width: theme.spacing(AVATARHEIGHT),
			fontSize: '12px',
			fontWeight: theme.typography.fontWeightBold,
			borderWidth: 1,
			borderColor: 'black',
			borderStyle: 'solid',
    }, 
		noinfo: {
			backgroundColor: '#FFFFFF',	
			color: '#000000',
			height: theme.spacing(AVATARHEIGHT),
			width: theme.spacing(AVATARHEIGHT),
			fontSize: '12px',
			fontWeight: theme.typography.fontWeightBold,
			borderWidth: 1,
			borderColor: 'black',
			borderStyle: 'solid',
		},       
    td : {
			border: 5,
			align: "center",
			padding: "none",
			borderWidth: 1,
			borderColor: 'black',
			borderStyle: 'solid',
			backgroundColor: '#00E5FF',
		},
		th : {
			border: 5,
			align: "center",
			padding: "none",
			borderWidth: 1,
			borderColor: 'black',
			borderStyle: 'solid',
			backgroundColor: '#FF7043',
		},
		header: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
    }, 
    error:  {
      // right: 0,
      fontSize: '12px',
      color: red[700],
      // position: 'absolute',
      alignItems: 'center',
      marginTop: '0px',
		},
		editdelete: {
			marginLeft:  '50px',
			marginRight: '50px',
			paddings: '20px',
		},
		NoPatients: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			color: blue[700]
		},  
		radio: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			color: "blue",
		},
		messageText: {
			color: '#4CC417',
			fontSize: 12,
			// backgroundColor: green[700],
    },
    symbolText: {
        color: '#4CC417',
        // backgroundColor: green[700],
    },
    button: {
			margin: theme.spacing(0, 1, 0),
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

*/

var userCid;


export default function Directory() {
	//const history = useHistory();	
  //const classes = useStyles();
	const gClasses = globalStyles();
	//const alert = useAlert();
	//customerData = sessionStorage.getItem("customerData");

	const [searchText, setSearchText] = useState("");
	const [firstName, setFirstName] = useState("");
	const [middleName, setMiddleName] = useState("");
	const [lastName, setLastName] = useState("");
	//const [isBirthday, setIsBirthday] = useState(false);
	
	const [currentMember, setCurrentMember] = useState("");
	const [currentMemberData, setcurrentMemberData] = useState({});

	const [currentSelection, setCurrentSelection] = useState("");
	

	// 
	const [memberMasterArray, setMemberMasterArray] = useState([]);
	const [memberArray, setMemberArray] = useState([]);



	//const [isDrawerOpened, setIsDrawerOpened] = useState(false);
	//const [isAdd, setIsAdd] = useState(false);
	//const [radioValue, setRadioValue] = useState("Male");
	
	//const [patientRec, setPatientRec] = useState({});
	const [registerStatus, setRegisterStatus] = useState(0);
	
	//const [oldPatientName, setOldPatientName] = useState("");
	//const	[patientName, setPatientName] = useState("");
	//const	[patientAge, setPatientAge] = useState(0);
	///const	[patientGender, setPatientGender] = useState("Male");
	//const	[patientEmail, setPatientEmail] = useState("");
	//const	[patientMobile, setPatientMobile] = useState(0);
	//const [emurDob, setEmurDob] = useState(new Date(2000, 1, 1));
  //const [page, setPage] = useState(0);
	
	
  useEffect(() => {
		const us = async () => {
		}
		//us();
  }, [])


	function ShowResisterStatus() {
    //console.log(`Status is ${registerStatus}`);
    let myMsg;
    switch (registerStatus) {
      case 621:
        myMsg = "Invalid patient age";
        break;
			case 1001:
        myMsg = "Invalid date of birth";
        break;
      case 601:
        myMsg = "Patient name already in database";
        break;
      case 611:
        myMsg = "Patient name not found in database";
        break;
    }
    return(
      <div>
        <Typography className={gClasses.error}>{myMsg}</Typography>
      </div>
    )
  }


	function handleSelectMember(pat) {
		setcurrentMemberData(pat);
		setCurrentMember(pat.displayName);
		setCurrentSelection("");
	}


	function DisplayFunctionItem(props) {
	let itemName = props.item;
	return (
	<Grid key={"BUT"+itemName} item xs={4} sm={4} md={2} lg={2} >
	<Typography onClick={() => setSelection(itemName)}>
		<span 
			className={(itemName === currentSelection) ? gClasses.functionSelected : gClasses.functionUnselected}>
		{itemName}
		</span>
	</Typography>
	</Grid>
	)}
	
	async function setSelection(item) {
		//sessionStorage.setItem("shareData",JSON.stringify(currentMemberData));
		setCurrentSelection(item);
	}
	



	
	function DisplayAllMembers() {
	//console.log(memberArray);
	//console.log(memberMasterArray);
	return (
	<Grid className={gClasses.noPadding} key="AllPatients" container alignItems="center" >
	{memberArray.map( (m, index) => 
		<Grid key={m._id} item xs={12} sm={6} md={4} lg={4} >
		<Box onClick={() => handleSelectMember(m)} className={gClasses.boxStyle} borderColor="black" borderRadius={15} border={1} >
			<div align="left">
			<Typography className={gClasses.patientInfo2Blue}>{getMemberName(m)}</Typography>
			</div>
		</Box>
		</Grid>
	)}
	</Grid>	
	)}
	
	function setPatientFilter(myArray, filterStr) {
		//console.log(myArray);
		//console.log(filterStr);
		filterStr = filterStr.trim().toLowerCase();
		//console.log(filterStr);
		let tmpArray;
		if (myArray !== "") {
			if (validateInteger(filterStr)) {
				// it is integer. Thus has to be Id
				//console.log("Num check",filterStr);
				tmpArray = myArray.filter(x => x.pidStr.includes(filterStr));
			} else {
				tmpArray = myArray.filter(x => x.displayName.toLowerCase().includes(filterStr));
			}
		} else {
			tmpArray = myArray;
		}
		setMemberArray(tmpArray);
	}
	
	
	function handleBack() {
		setcurrentMemberData({});
		setCurrentMember("");
		setMemberArray([]);
	}
	
	async function handleMemberSelect() {
		let f = (firstName !== "") ? firstName : "-";
		let m = (middleName !== "") ? middleName : "-";
		let l = (lastName !== "") ? lastName : "-";
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/member/namelist/${f}/${m}/${l}`;
			let resp = await axios.get(myUrl);
			setMemberArray(resp.data);
		} catch (e) {
			alert.error("Error fetching member data");
			setMemberArray([]);
		}
	}

	function handleDate(d) {
		//console.log(d);
		setEmurDob(d);
	}
	
  return (
  <div className={gClasses.webPage} align="center" key="main">
		{/*<Container component="main" maxWidth="lg">*/}
		<CssBaseline />
		{(currentMember === "") &&
			<div>
			<DisplayPageHeader headerName="Samaj Directory" groupName="" tournament=""/>
			<BlankArea />
			<Grid className={gClasses.vgSpacing} key="PatientFilter" container alignItems="center" >
				<Grid key={"BLANK"} item xs={4} sm={2} md={2} lg={2} />
				<Grid key={"LN"} item xs={12} sm={6} md={3} lg={3} >
				<VsTextSearch label="Member's last name" value={lastName}
					onChange={(event) => { setLastName(event.target.value);  }}
					onClear={() => setLastName("")}
				/>
				</Grid>
				<Grid key={"FN"} item xs={12} sm={6} md={3} lg={3} >
				<VsTextSearch label="Member's first name" value={firstName}
					onChange={(event) => setFirstName(event.target.value)}
					onClear={() => setFirstName("")}
				/>
				</Grid>
				<Grid key={"MN"} item xs={12} sm={6} md={3} lg={3} >
				<VsTextSearch label="Member's middle name" value={middleName}
					onChange={(event) => setMiddleName(event.target.value)}
					onClear={() => setMiddleName("")}
				/>
				</Grid>
				<Grid key={"BN"} item xs={4} sm={2} md={1} lg={1} >
					<VsButton	 name="Select" onClick={handleMemberSelect} />
				</Grid>
			</Grid>
			<DisplayAllMembers />
			</div>
		}
		{(currentMember !== "") &&<div>
			<VsButton align="right" name="Back to Member Directory" onClick={handleBack} />
			<Member member={currentMemberData} />
			</div> 
		}
		{(false) &&
		<Drawer className={classes.drawer}
			anchor="right"
			variant="temporary"
			open={isDrawerOpened}
		>
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<VsCancel align="right" onClick={() => { setIsDrawerOpened(false)}} />
		<ValidatorForm align="center" className={classes.form} onSubmit={handleAddEditSubmit}>
			<Typography className={gClasses.title}>{(isAdd) ? "Add Patient" : "Edit Patient"}</Typography>
			<TextValidator fullWidth  className={gClasses.vgSpacing}
				id="newPatientName" label="Name" type="text"
				value={patientName} 
				onChange={() => { setPatientName(event.target.value) }}
      />
			<div align="left">
			<Typography className={gClasses.vgSpacing}>Date of Birth</Typography>
			</div>
			<Datetime 
				className={classes.dateTimeBlock}
				inputProps={{className: classes.dateTimeNormal}}
				timeFormat={false} 
				initialValue={emurDob}
				dateFormat="DD/MM/yyyy"
				isValidDate={disableFutureDt}
				onClose={handleDate}
				closeOnSelect={true}
			/>
			<BlankArea />
			<FormControl component="fieldset">
				<RadioGroup row aria-label="radioselection" name="radioselection" value={radioValue} 
					onChange={() => {setRadioValue(event.target.value); setPatientGender(event.target.value); }}
				>
				<FormControlLabel className={gClasses.filterRadio} value="Male" 		control={<Radio color="primary"/>} label="Male" />
				<FormControlLabel className={gClasses.filterRadio} value="Female" 	control={<Radio color="primary"/>} label="Female" />
				<FormControlLabel className={gClasses.filterRadio} value="Other"   control={<Radio color="primary"/>} label="Other" />
			</RadioGroup>
			</FormControl>
			<TextValidator   fullWidth   className={gClasses.vgSpacing} 
				id="newPatientEmail" label="Email" type="email"
				value={patientEmail} 
				onChange={() => { setPatientEmail(event.target.value) }}
      />
			<TextValidator fullWidth required className={gClasses.vgSpacing} 
				id="newPatientMobile" label="Mobile" type="number"
				value={patientMobile} 
				onChange={() => { setPatientMobile(event.target.value) }}
				validators={['minNumber:1000000000', 'maxNumber:9999999999']}
        errorMessages={['Invalid Mobile number','Invalid Mobile number']}
      />	
			<ShowResisterStatus />
			<BlankArea />
			<VsButton name={(isAdd) ? "Add" : "Update"} />
			</ValidatorForm>    		
			</Box>
		</Drawer>
		}
  </div>
  );    
}

