import React, { useState, useContext, useEffect } from 'react';
import { Container, CssBaseline } from '@material-ui/core';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Divider from '@material-ui/core/Divider';
import TablePagination from '@material-ui/core/TablePagination';
import ReactTooltip from "react-tooltip";

import VsTextSearch from "CustomComponents/VsTextSearch";
//import VsButton from "CustomComponents/VsButton";
//import VsCancel from "CustomComponents/VsCancel";
//import VsCheckBox from "CustomComponents/VsCheckBox";
//import VsRadio from "CustomComponents/VsRadio";

//import { useLoading, Audio } from '@agney/react-loading';
import axios from "axios";
//import Drawer from '@material-ui/core/Drawer';
import { useAlert } from 'react-alert'

import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
//import Stack from '@material-ui/core/Stack';
//import { deepOrange, deepPurple } from '@material-ui/core/colors';

//import 'react-step-progress/dist/index.css';
//import Datetime from "react-datetime";
//import "react-datetime/css/react-datetime.css";
//import moment from "moment";

// styles
import globalStyles from "assets/globalStyles";
//import modalStyles from "assets/modalStyles";



import InfoIcon   from 	'@material-ui/icons/Info';


import {
	BlankArea, DisplayPageHeader,
} from "CustomComponents/CustomComponents.js"

import {
	ADMIN,
	//DATESTR, MONTHNUMBERSTR,
	ALPHABETSTR,
} from "views/globals.js";

import { 
	isMobile,
	getAdminInfo,
	dateString,
	//vsDialog,
	getMemberName,
	dispAge,
} from "views/functions.js";

//import { 
//	dispMobile, dispEmail, disableFutureDt,
//} from 'views/functions';


const ROWSPERPAGE = isMobile() ? 5 : 12;
export default function Pjym() {
	//var memberMasterArray;
	
	const adminInfo = getAdminInfo();
	const pjymAdmin = ((adminInfo & (ADMIN.superAdmin | ADMIN.pjymAdmin)) !== 0);
	
	const gClasses = globalStyles();
	//const alert = useAlert();

	const [firstName, setFirstName] = useState("");
	const [middleName, setMiddleName] = useState("");
	const [lastName, setLastName] = useState("");
	
	const [pjymArray, setPjymArray] = useState([]);
	const [memberArray, setMemberArray] = useState([]);
	const [memberMasterArray, setMemberMasterArray] = useState([]);

	const [currSort, setCurrSort] = useState({dir: "ASC", name: "NAME"});
	const [currentAlphabet, setCurrentAlphabet] = useState("A");
	//const [hodArray, setHodArray] = useState([])
	//const [active, setActive] = useState(true);


	//const [currentMember, setCurrentMember] = useState("");
	//const [currentMemberData, setCurrentMemberData] = useState(BlankMemberData);
//	const [currentHod, setCurrentHod] = useState({});
	//const [ceasedArray, setCeasedArray] = useState([]);

	//const [radioRecord, setRadioRecord] = useState(0);
	//const [emurDate1, setEmurDate1] = useState(moment());
	//const [currentSelection, setCurrentSelection] = useState("Symptom");
	//const [remember, setRemember] = useState(false);
	
	//const [isDrawerOpened, setIsDrawerOpened] = useState("");
	//const [isListDrawer, setIsListDrawer] = useState("");

	
	//const [filterItem, setFilterItem] = useState("");
	//const [filterItemText, setFilterItemText] = useState("");
	//const [filterItemArray, setFilterItemArray] = useState([]);
	
	
	
	//const [emurVisitNumber, setEmurIndex] = useState(0);
	//const [emurNumber, setEmurNumber] = useState(0);
	//const [emurName, setEmurName] = useState("");

	const [modalRegister, setModalRegister] = useState(0);

	// pagination
	const [page, setPage] = useState(0);	
	const [currentChar, setCurrentChar] = useState('A');

	
  useEffect(() => {	
		//const getDetails = async () => {	
			//getPjymByAlphabet("A");
		//	
		//}
		//setCurrentMember(getMemberName(props.member));
		//getDetails();
		
		getPjymList();
  }, []);


	async function getPjymList() {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/pjym/listwithnames`;
			//console.log(new Date());
			let axiosResp = await axios.get(myUrl);
			//console.log(new Date());
			setMemberMasterArray(axiosResp.data.member);
			setPjymArray(axiosResp.data.pjym);
			setMemberArray(axiosResp.data.member);
			//console.log(new Date());
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
		<Grid key={"MEMGRIDHDR"} className={gClasses.noPadding} container align="center" alignItems="center" >
			<Grid align="left" item md={4} lg={4} onClick={() => sorton("memberName")}>
				<Typography className={gClasses.patientInfo2Brown}>Name</Typography>
			</Grid>
			<Grid align="center" item md={2} lg={2} >
				<Typography className={gClasses.patientInfo2Brown}>Age</Typography>
			</Grid>		
			<Grid align="center" item md={2} lg={2} >
				<Typography className={gClasses.patientInfo2Brown}>Mobile</Typography>
			</Grid>				
			<Grid align="center" item md={2} lg={2} >
				<Typography className={gClasses.patientInfo2Brown}>Mem. Id.</Typography>
			</Grid>
			<Grid align="center" item md={2} lg={2}  >
				<Typography className={gClasses.patientInfo2Brown}>Mem. No.</Typography>
			</Grid>
		</Grid>
		</Box>
		{memberArray.slice(page*ROWSPERPAGE, (page+1)*ROWSPERPAGE).map( (m, index) => {
			let p = pjymArray.find(x => x.mid === m.mid);
			let ageGender = dispAge(m.dob, m.gender);			
			let domStr = dateString(m.dateOfMarriage);		
			let memDateStr = dateString(p.membershipDate);	
			//console.log(m);
			return (
			<Box  key={"MEMBOX"+index} className={gClasses.boxStyle} borderColor="black" borderRadius={30} border={1} >
			<Grid key={"MEMGRID"+index} className={gClasses.noPadding} key={"SYM"+index} container align="center" alignItems="center" >
				<Grid align="left" item md={4} lg={4} >
					<Typography className={gClasses.patientInfo2}>{getMemberName(m)}</Typography>
				</Grid>
				<Grid align="center" item md={2} lg={2} >
					<Typography className={gClasses.patientInfo2}>{dispAge(m.dob, m.gender) }</Typography>
				</Grid>				
				<Grid align="center" item md={2} lg={2} >
					<Typography className={gClasses.patientInfo2}>{m.mobile}</Typography>
				</Grid>				
				<Grid align="center" item md={2} lg={2} >
					<Typography className={gClasses.patientInfo2}>{m.mid}</Typography>
				</Grid>
				<Grid align="center" item md={2} lg={2} >
					<Typography className={gClasses.patientInfo2}>{p.membershipNumber}</Typography>
				</Grid>
			</Grid>
			</Box>
			)}
		)}	
		</div>	
		)}

	function DisplayMobilePjym() {
		return (
		<div>
		<Box  key={"MEMBOXHDR"} className={gClasses.boxStyle} borderColor="black" borderRadius={30} border={1} >
		<Grid key={"MEMGRIDHDR"} className={gClasses.noPadding} container align="center" alignItems="center" >
			<Grid align="left" item xs={9} sm={9} onClick={() => sorton("memberName")}>
				<Typography className={gClasses.patientInfo2Brown}>Name</Typography>
			</Grid>
			<Grid align="center" item  xs={3} sm={3} >
				<Typography className={gClasses.patientInfo2Brown}>Mobile</Typography>
			</Grid>				
		</Grid>
		</Box>
		{memberArray.slice(page*ROWSPERPAGE, (page+1)*ROWSPERPAGE).map( (m, index) => {
			let p = pjymArray.find(x => x.mid === m.mid);
			let ageGender = dispAge(m.dob, m.gender);			
			let domStr = dateString(m.dateOfMarriage);		
			let memDateStr = dateString(p.membershipDate);	
			//console.log(m);
			let myInfo = "Mem.Id. : " + m.mid + "<br />";
			myInfo +=    "Mem.No. : " +  p.membershipNumber;
			let ttt = dateString(p.membershipDate);
			if (ttt !== "") myInfo += "<br />" + "Mem.Date: ";
			return (
			<Box  key={"MEMBOX"+index} className={gClasses.boxStyle} borderColor="black" borderRadius={30} border={1} >
			<Grid key={"MEMGRID"+index} className={gClasses.noPadding} key={"SYM"+index} container align="center" alignItems="center" >
				<Grid align="left" item xs={9} sm={9} >
					<Typography >
						<span className={gClasses.patientInfo2}>{getMemberName(m) + " ("+dispAge(m.dob, m.gender)+")"}</span>
						{(pjymAdmin) &&
						<span align="left"
							data-for={"PJYM"+m.mid}
							data-tip={myInfo}
							data-iscapture="true"
						>
							<InfoIcon color="primary" size="small"/>
						</span>
						}
					</Typography>
				</Grid>			
				<Grid align="center" item xs={3} md={3} >
					<Typography className={gClasses.patientInfo2}>{m.mobile}</Typography>
				</Grid>				
			</Grid>
			</Box>
			)}
		)}	
		</div>	
		)}
	
	
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
			<Avatar size="small" className={(currentAlphabet === x) ? gClasses.bgdeepOrange : gClasses.bgBlue } onClick={() => getPjymByAlphabet(x)}>{x}</Avatar>
		</Grid>
		)}
	</Grid>
	</Box>
	)}
	
	function handleMemberSelect() {
		let tmp1 = firstName.trim().toLowerCase();
		let tmp2 = lastName.trim().toLowerCase();
		let tmp3 = middleName.trim().toLowerCase();
		
		let tmpArray = memberMasterArray;
		if (tmp1 !== "") tmpArray = tmpArray.filter(x => x.firstName.toLowerCase().includes(tmp1));
		if (tmp2 !== "") tmpArray = tmpArray.filter(x => x.lastName.toLowerCase().includes(tmp2));
		if (tmp3 !== "") tmpArray = tmpArray.filter(x => x.middleName.toLowerCase().includes(tmp3));
		
		setPage(0);
		setMemberArray(tmpArray);
	}
	
	// pagination function 
	const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

	function setFilter(fName, mName, lName) {
		//console.log(fName,"-",mName,"-",lName);
		let tmpArray = memberMasterArray;
		if (fName !== "") tmpArray = tmpArray.filter(x => x.firstName.toLowerCase().includes(fName));
		if (mName !== "") tmpArray = tmpArray.filter(x => x.middleName.toLowerCase().includes(mName));
		if (lName !== "") tmpArray = tmpArray.filter(x => x.lastName.toLowerCase().includes(lName));
		
		setPage(0);
		setMemberArray(tmpArray);
	}
	
	function updateFirstName(newName) {
		let tmp = newName.toLowerCase().trim();
		setFirstName(tmp);
		setFilter(tmp, middleName, lastName);
	}

	function updateMiddleName(newName) {
		let tmp = newName.toLowerCase().trim();
		setMiddleName(tmp);
		setFilter(firstName, tmp, lastName);
	}
	
	function updateLastName(newName) {
		let tmp = newName.toLowerCase().trim();
		setLastName(tmp);
		setFilter(firstName, middleName, tmp);
	}
	
	function DisplayAllToolTips() {
	if (!isMobile()) return null;
	return(
		<div>
		{memberArray.slice(page*ROWSPERPAGE, (page+1)*ROWSPERPAGE).map( t =>
			<ReactTooltip key={"PJYM"+t.mid} type="info" effect="float" id={"PJYM"+t.mid} multiline={true}/>
		)}
		</div>
	)}	
	
	
	return (
	<div className={gClasses.webPage} align="center" key="main">
	<CssBaseline />
	<br />
	<DisplayPageHeader headerName="PJYM Members" groupName="" tournament=""/>
	<Box  align="center" key={"MEMBOXHDR"} className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
	<Grid key="PatientFilter" container alignItems="center" >
	<Grid key={"BLANK"} item xs={4} sm={2} md={2} lg={2} >
		<Typography className={gClasses.patientInfo2}>Filter by name</Typography>
	</Grid>
	<Grid key={"LN"} item xs={12} sm={6} md={3} lg={3} >
	<VsTextSearch label="Member's last name" value={lastName}
		onChange={(event) => { updateLastName(event.target.value);  }}
		onClear={() => updateLastName("")}
	/>
	</Grid>
	<Grid key={"FN"} item xs={12} sm={6} md={3} lg={3} >
	<VsTextSearch label="Member's first name" value={firstName}
		onChange={(event) => updateFirstName(event.target.value)}
		onClear={() => updateFirstName("")}
	/>
	</Grid>
	<Grid key={"MN"} item xs={12} sm={6} md={3} lg={3} >
	<VsTextSearch label="Member's middle name" value={middleName}
		onChange={(event) => updateMiddleName(event.target.value)}
		onClear={() => updateMiddleName("")}
	/>
	</Grid>
	{/*<Grid key={"BN"} item xs={4} sm={2} md={1} lg={1} >
		<VsButton	 name="Select" onClick={handleMemberSelect} />
	</Grid>*/}
	</Grid>
	</Box>
	{(!isMobile()) &&
		<DisplayAllPjym />
	}
	{(isMobile()) &&
		<DisplayMobilePjym />
	}
	{(memberArray.length > ROWSPERPAGE) &&
		<TablePagination
			align="right"
			rowsPerPageOptions={[ROWSPERPAGE]}
			component="div"
			labelRowsPerPage="Pjym Members per page"
			count={memberArray.length}
			rowsPerPage={ROWSPERPAGE}
			page={page}
			onPageChange={handleChangePage}
			//onRowsPerPageChange={handleChangeRowsPerPage}
			//showFirstButton={true}
		/>
	}
	<DisplayAllToolTips />
  </div>
  );    
}
