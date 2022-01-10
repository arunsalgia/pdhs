import React, { useState, useContext, useEffect } from 'react';
import { Container, CssBaseline } from '@material-ui/core';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Divider from '@material-ui/core/Divider';
import lodashCloneDeep from 'lodash/cloneDeep';
import lodashSortBy from "lodash/sortBy"
import lodashMap from "lodash/map";

import VsButton from "CustomComponents/VsButton";
import VsCancel from "CustomComponents/VsCancel";
import VsCheckBox from "CustomComponents/VsCheckBox";
import VsTextSearch from "CustomComponents/VsTextSearch";
import VsRadio from "CustomComponents/VsRadio";

//import { useLoading, Audio } from '@agney/react-loading';
import axios from "axios";
import Drawer from '@material-ui/core/Drawer';
import { useAlert } from 'react-alert'

import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
//import Stack from '@material-ui/core/Stack';
import { deepOrange, deepPurple } from '@material-ui/core/colors';

import 'react-step-progress/dist/index.css';
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";

// styles
import globalStyles from "assets/globalStyles";
//import modalStyles from "assets/modalStyles";


const BlankMemberData = {firstName: "", middleName: "", lastName: ""};

import {
	BlankArea, DisplayPageHeader,
} from "CustomComponents/CustomComponents.js"

import {
//SupportedMimeTypes, SupportedExtensions,
//str1by4, str1by2, str3by4,
//HOURSTR, MINUTESTR, 
DATESTR, MONTHNUMBERSTR,
MAGICNUMBER, ALPHABETSTR,
} from "views/globals.js";

import { 
	vsDialog,
	getMemberName,
	dispAge,
} from "views/functions.js";

import { 
	dispMobile, dispEmail, disableFutureDt,
} from 'views/functions';


export default function Pjym() {
  
	const gClasses = globalStyles();
	const alert = useAlert();

	const [searchText, setSearchText] = useState("");
	const [firstName, setFirstName] = useState("");
	const [middleName, setMiddleName] = useState("");
	const [lastName, setLastName] = useState("");
	
	const [pjymArray, setPjymArray] = useState([]);
	const [currSort, setCurrSort] = useState({dir: "ASC", name: "NAME"});
	const [currentAlphabet, setCurrentAlphabet] = useState("A");
	const [humadMasterArray, setHumadMasterArray] = useState([]);
	const [hodArray, setHodArray] = useState([])
	const [active, setActive] = useState(true);


	const [currentMember, setCurrentMember] = useState("");
	const [currentMemberData, setCurrentMemberData] = useState(BlankMemberData);
	const [currentHod, setCurrentHod] = useState({});
	const [ceasedArray, setCeasedArray] = useState([]);

	const [radioRecord, setRadioRecord] = useState(0);
	const [emurDate1, setEmurDate1] = useState(moment());
	const [currentSelection, setCurrentSelection] = useState("Symptom");
	const [remember, setRemember] = useState(false);
	
	const [isDrawerOpened, setIsDrawerOpened] = useState("");
	//const [isListDrawer, setIsListDrawer] = useState("");

	
	const [filterItem, setFilterItem] = useState("");
	const [filterItemText, setFilterItemText] = useState("");
	const [filterItemArray, setFilterItemArray] = useState([]);
	
	
	
	//const [emurVisitNumber, setEmurIndex] = useState(0);
	//const [emurNumber, setEmurNumber] = useState(0);
	const [emurName, setEmurName] = useState("");

	const [modalRegister, setModalRegister] = useState(0);

	

	
  useEffect(() => {	
		const getDetails = async () => {	
			getPjymByAlphabet("A");
		}
		//setCurrentMember(getMemberName(props.member));
		getDetails();
  }, []);


	async function getPjymList() {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/pjym/listwithnames`;
			let resp = await axios.get(myUrl);
			setPjymArray(resp.data);
		} catch (e) {
			console.log(e);
			alert.error(`Error fetching PJYM details`);
		}	
	}




	function ModalResisterStatus() {
    // console.log(`Status is ${modalRegister}`);
		let regerr = true;
    let myMsg;
    switch (modalRegister) {
      case 0:
        myMsg = "";
				regerr = false;
        break;
      case 1001:
        myMsg = `Selected Symptom already added`;
        break;
      case 2001:
        myMsg = `Selected Diagnosis already added`;
        break;
      default:
          myMsg = "Unknown Error";
          break;
    }
    return(
      <div>
        <Typography className={(regerr) ? gClasses.error : gClasses.nonerror}>{myMsg}</Typography>
      </div>
    )
  }

	function sorton(item) {
		console.log(item)
		if (currSort.name === item) {
			setPjymArray(pjymArray.reverse());
			setCurrSort({
				dir: (currSort.dir === "ASC") ? "DESC" : "ASC",
				name: item
			})
		} else {
			setPjymArray(lodashSortBy(pjymArray, item));
			setCurrSort({
				dir: "ASC",
				name: item
			})
		}
	}
	
	function DisplayAllPjym() {
		return (
		<div>
		<Box  key={"MEMBOXHDR"} className={gClasses.boxStyle} borderColor="black" borderRadius={30} border={1} >
		<Grid key={"MEMGRIDHDR"} className={gClasses.noPadding} container justify="center" alignItems="center" >
			<Grid align="left" item xs={8} sm={2} md={4} lg={4} onClick={() => sorton("memberName")}>
				<Typography className={gClasses.patientInfo2Brown}>Name (Member Id)</Typography>
			</Grid>
			<Grid align="left" item xs={2} sm={6} md={2} lg={2} >
				<Typography className={gClasses.patientInfo2Brown}>Age</Typography>
			</Grid>
			<Grid align="left" item xs={2} sm={6} md={1} lg={1} onClick={() => sorton("membershipNumber")} >
				<Typography className={gClasses.patientInfo2Brown}>M.No.</Typography>
			</Grid>
			<Grid align="center" item xs={12} sm={12} md={2} lg={2} >
				<Typography className={gClasses.patientInfo2Brown}>M.Receipt</Typography>
			</Grid>				
			<Grid align="center" item xs={12} sm={12} md={2} lg={2} >
				<Typography className={gClasses.patientInfo2Brown}>M.Date</Typography>
			</Grid>
			<Grid align="right" item xs={2} sm={6} md={1} lg={1} />
		</Grid>
		</Box>
		{pjymArray.map( (p, index) => {
			// get pjym record
			let ageGender = dispAge(p.dob, p.gender);
			
			let domStr = "";
			let d = new Date(p.dateOfMarriage);
			if (d.getFullYear() !== 1900)
				domStr = `${DATESTR[d.getDate()]}/${MONTHNUMBERSTR[d.getMonth()]}/${d.getFullYear()}`;
			
			let memDateStr = "";
			d = new Date(p.membershipDate);
			if (d.getFullYear() !== 1900)
				memDateStr = `${DATESTR[d.getDate()]}/${MONTHNUMBERSTR[d.getMonth()]}/${d.getFullYear()}`;
			
			return (
			<Box  key={"MEMBOX"+index} className={gClasses.boxStyle} borderColor="black" borderRadius={30} border={1} >
			<Grid key={"MEMGRID"+index} className={gClasses.noPadding} key={"SYM"+index} container justify="center" alignItems="center" >
				<Grid align="left" item xs={8} sm={2} md={4} lg={4} >
					<Typography className={gClasses.patientInfo2}>{p.title + " " + p.memberName+" ("+p.mid+")"}</Typography>
				</Grid>
				<Grid align="left" item xs={2} sm={6} md={2} lg={2} >
					<Typography className={gClasses.patientInfo2}>{ageGender}</Typography>
				</Grid>
				<Grid align="left" item xs={2} sm={6} md={1} lg={1} >
					<Typography className={gClasses.patientInfo2}>{p.membershipNumber}</Typography>
				</Grid>
				<Grid align="center" item xs={12} sm={12} md={2} lg={2} >
					<Typography className={gClasses.patientInfo2}>{(p.membershipReceipt === "0") ? "" : p.membershipReceipt}</Typography>
				</Grid>				
				<Grid align="center" item xs={12} sm={12} md={2} lg={2} >
					<Typography className={gClasses.patientInfo2}>{memDateStr}</Typography>
				</Grid>
				<Grid align="right" item xs={2} sm={6} md={1} lg={1} />
			</Grid>
			</Box>
			)}
		)}	
		</div>	
		)}
	
	function handleDate1(d) {
		setEmurDate1(d);
	}

	function handleHumadSelect() {
		let tmpHumad = (active) ?
			humadMasterArray.filter(x => x.upgradeIndex === MAGICNUMBER) :
			[].concat(humadMasterArray);

		//console.log(tmpHumad);
		
		let tmpMember = [].concat(memberArray);
		if (firstName !== "")
			tmpMember = tmpMember.filter(x => x.firstName.toLowerCase().includes(firstName.toLowerCase()));
		
		if (middleName !== "")
			tmpMember = tmpMember.filter(x => x.middleName.toLowerCase().includes(middleName.toLowerCase()));

		if (lastName !== "")
			tmpMember = tmpMember.filter(x => x.lastName.toLowerCase().includes(lastName.toLowerCase()));

		let selectedMids = lodashMap(tmpMember, 'mid');
		console.log(selectedMids);
		
		tmpHumad = tmpHumad.filter(x => selectedMids.includes(x.mid));
		console.log(tmpHumad);
		
		setPjymArray(tmpHumad);
	}

	async function getPjymByAlphabet(chrStr) {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/pjym/listbyalphabet/${chrStr}`;
			//console.log(myUrl);
			let resp = await axios.get(myUrl);
			setPjymArray(resp.data);
			setCurrentAlphabet(chrStr);
		} catch (e) {
			console.log(e)
		}
	}
	
	
	function DisplayAlphabetButtons() {
	return(	
		<Box  align="center" key={"MEMBOXHDR"} className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<Grid align="center" alignItems="center" container spacing={1} >
		<Grid item>
			<Typography className={gClasses.patientInfo2}>Lastname with</Typography>
		</Grid>
		{ALPHABETSTR.map( x =>
			<Grid item>
					<Avatar className={(currentAlphabet === x) ? gClasses.bgdeepOrange : gClasses.bgBlue } onClick={() => getPjymByAlphabet(x)}>{x}</Avatar>
			</Grid>
		)}
	</Grid>
	</Box>
	)}
	
	async function handleMemberSelect() {
		let f = (firstName !== "") ? firstName : "-";
		let m = (middleName !== "") ? middleName : "-";
		let l = (lastName !== "") ? lastName : "-";
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/pjym/namelist/${f}/${m}/${l}`;
			let resp = await axios.get(myUrl);
			setPjymArray(resp.data);
		} catch (e) {
			alert.error("Error fetching PJYM data");
		}
	}

	return (
	<div className={gClasses.webPage} align="center" key="main">
	<CssBaseline />
	<DisplayPageHeader headerName="PJYM Members" groupName="" tournament=""/>
	<br />
	{(false) &&
	<Grid className={gClasses.vgSpacing} key="PatientFilter" container alignItems="center" >
	<Grid key={"CB"} item xs={12} sm={6} md={1} lg={2} >
		<VsCheckBox label="Only Active" checked={active} onClick={() => setActive(!active)} />
	</Grid>
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
		<VsButton	 name="Select" onClick={handleHumadSelect} />
	</Grid>
	</Grid>
	}
	<DisplayAlphabetButtons />
	<Box  align="center" key={"MEMBOXHDR"} className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
	<Grid className={gClasses.vgSpacing} key="PatientFilter" container alignItems="center" >
	<Grid key={"BLANK"} item xs={4} sm={2} md={2} lg={2} >
		<Typography className={gClasses.patientInfo2}>Filter by name</Typography>
	</Grid>
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
	</Box>

	<DisplayAllPjym />
	<Drawer anchor="right" variant="temporary" open={isDrawerOpened !== ""} >
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
	<VsCancel align="right" onClick={() => { setIsDrawerOpened("")}} />
	</Box>
	</Drawer>
  </div>
  );    
}
