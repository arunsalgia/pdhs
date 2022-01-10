import React, { useState, useContext, useEffect } from 'react';
import {  CssBaseline } from '@material-ui/core';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import lodashCloneDeep from 'lodash/cloneDeep';
import lodashSortBy from "lodash/sortBy";
import lodashMap from "lodash/map";

import VsButton from "CustomComponents/VsButton";
import VsCancel from "CustomComponents/VsCancel";
import VsRadio from "CustomComponents/VsRadio";
import VsRadioGroup from "CustomComponents/VsRadioGroup";
import VsCheckBox from "CustomComponents/VsCheckBox";




import axios from "axios";
import Drawer from '@material-ui/core/Drawer';
import { useAlert } from 'react-alert'

import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import 'react-step-progress/dist/index.css';
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";

// styles
import globalStyles from "assets/globalStyles";


import {
	BlankArea,
	DisplayMemberHeader,
} from "CustomComponents/CustomComponents.js"

import {
//SupportedMimeTypes, SupportedExtensions,
//str1by4, str1by2, str3by4,
//HOURSTR, MINUTESTR, 
MEMBERTITLE, RELATION, SELFRELATION, GENDER, BLOODGROUP, MARITALSTATUS,
DATESTR, MONTHNUMBERSTR,
CASTE, HUMADSUBCASTRE,
} from "views/globals.js";


import { 
	getImageName,
	vsDialog,
	getMemberName,
	dispAge,
} from "views/functions.js";

import { 
	decrypt, dispMobile, dispEmail, disableFutureDt,
} from 'views/functions';
import {  } from 'views/functions';

//import { update } from 'lodash';
//import { updateCbItem } from 'typescript';

var loginHid, loginMid;
var adminData = {superAdmin: false, humadAdmin: false, pjymAdmin: false, prwsAdmin: false} ;


export default function MemberSpouse(props) {
	const gClasses = globalStyles();
	const alert = useAlert();

	const [memberArray, setMemberArray] = useState(JSON.parse(sessionStorage.getItem("members")));
	
	//const [currentMember, setCurrentMember] = useState("");
	const [currentMemberData, setCurrentMemberData] = useState({});
	const [currentHod, setCurrentHod] = useState({});
	const [gotraArray, setGotraArray] = useState([]);
	const [gotraFilterArray, setGotraFilterArray] = useState([]);
	//const [ceasedArray, setCeasedArray] = useState([]);
	const [hodNamesArray, setHodNamesArray] = useState([])
	const [groomArray, setGroomArray] = useState([])
	const [brideArray, setBrideArray] = useState([])
	const [domArray, setDomArray] = useState([])
	const [domMomemtArray, setDomMomemtArray] = useState([])
	const [unLinkedLadies, setUnLinkedLadies] = useState([]);
	const [radioRecord, setRadioRecord] = useState(0);
	const [emurDate1, setEmurDate1] = useState(moment());
	const [currentSelection, setCurrentSelection] = useState("");

	const [emurGroomArray, setEmurGroomArray] = useState([]);
	const [emurBrideArray, setEmurBrideArray] = useState([]);
	const [emurDomArray, setEmurDomArray] = useState([]);


	const [hodRadio, setHodRadio] = useState(1);
	const [cbList, setCbList] = useState([]);
	const [isDrawerOpened, setIsDrawerOpened] = useState("");
	
	const [emurGotra, setEmurGotra] = useState("");
	const [emurVillage, setEmurVillage] = useState("");
	const [emurPinCode, setEmurPincCode] = useState("");
	const [emurResPhone1, setEmurResPhone1] = useState("");
	const [emurResPhone2, setEmurResPhone2] = useState("");
	const [emurPinResp, setEmurPinResp] = useState({});

	const [emurAddr1, setEmurAddr1] = useState("");
	const [emurAddr2, setEmurAddr2] = useState("");
	const [emurAddr3, setEmurAddr3] = useState("");
	const [emurAddr4, setEmurAddr4] = useState("");
	const [emurAddr5, setEmurAddr5] = useState("");
	const [emurAddr6, setEmurAddr6] = useState("");
	const [emurAddr7, setEmurAddr7] = useState("");
	const [emurAddr8, setEmurAddr8] = useState("");
	const [emurAddr9, setEmurAddr9] = useState("");
	const [emurAddr10, setEmurAddr10] = useState("");
	const [emurAddr11, setEmurAddr11] = useState("");
	const [emurAddr12, setEmurAddr12] = useState("");
	const [emurAddr13, setEmurAddr13] = useState("");

	const [registerStatus, setRegisterStatus] = useState(0);

	

	
  useEffect(() => {	
		const getDetails = async () => {	
			let tmp = memberArray.filter(x => x.gender === "Male" && x.emsStatus === "Married");
			setGroomArray(lodashMap(tmp, 'mid'));
			console.log("Males", tmp);
			
			// create marriage date
			setDomArray(lodashMap(tmp, 'dateOfMarriage'));

			// create bride array
			let tmp1 = [];
			for(let i=0; i<tmp.length; ++i) {
				//console.log(tmp[i]);
				tmp1.push(tmp[i].spouseMid);
			}
			setBrideArray(tmp1);
			console.log(tmp1);
		}
		//setCurrentMember(getMemberName(props.member));
		loginHid = Number(sessionStorage.getItem("hid"));
		loginMid = Number(sessionStorage.getItem("mid"));
		adminData = JSON.parse(sessionStorage.getItem("adminRec"));
		getDetails();
		
  }, []);

	function DisplayRegisterStatus() {
    // console.log(`Status is ${registerStatus}`);
		let regerr = true;
    let myMsg;
    switch (registerStatus) {
      case 0:
        myMsg = "";
				regerr = false;
        break;
      case 1001:
        myMsg = `Invalid Pin Code`;
        break;
      case 1002:
        myMsg = `Unknown HOD update error`;
        break;
			case 2001:
				myMsg = `No HOD selected for new family`;
				break;
			case 2002:
				myMsg = `No member(s) selected for new family`;
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




	function handleCeasedMemberConfirm() {
		setIsDrawerOpened("");
		let tmpRec = memberArray.find(x => x.order === radioRecord);
		let d = emurDate1.toDate();
		let dateStr = d.getFullYear() + MONTHNUMBERSTR[d.getMonth()] + DATESTR[d.getDate()];
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/member/ceased/${tmpRec.mid}/${dateStr}`
			axios.post(myUrl);
			let tmpArray = memberArray.filter(x => x.order !== radioRecord);
			for(let i=0; i<tmpArray.length; ++i) {
				tmpArray[i].order = i;
			}
			setMemberArray(tmpArray);
			setRadioRecord(0);
			} catch (e) {
			console.log(e);
			alert.error(`Error setting member as ceased`);
		}	
	}
	

	function setSpouseEdit(action) {
		setEmurGroomArray(groomArray);
		setEmurBrideArray(brideArray);
		let tmp = [];
		for(let i=0; i < domArray.length; ++i)
			tmp.push(moment(new Date(domArray[i])));
		setEmurDomArray(tmp);

		let tmp1 = memberArray.filter(x => x.gender === "Female" && x.emsStatus === "Married" && x.spouseMid === 0);
		setUnLinkedLadies(lodashMap(tmp1, 'mid'));
		console.log(tmp1);
		setIsDrawerOpened(action);
	}

	function DisplaySpouseButtons() {
		let owner = (memberArray[0].hid === loginHid);
		let admin = adminData.superAdmin;
		if (admin)
			return <VsButton align="right" name="Set Spouse Relationship" onClick={() => setSpouseEdit("EDITSPOUSE")} />
		else if (owner)
			return <VsButton align="right" name="Apply Spouse Relationship" onClick={() => setSpouseEdit("APPLYSPOUSE")} />
		else
			return null;
	}
	

	function DisplaySpouseInformation() {
		let hands = getImageName("MARRIAGEHANDS");
		return (
		<div>
		{groomArray.map( (g, index) => {
			let gRec = memberArray.find(x => x.mid === g);
			let gName = getMemberName(gRec);
			let bDate = "N/A";
			let d = new Date(domArray[index]);
			if (d.getFullYear() !== 1900) {
				bDate = DATESTR[d.getDate()]+"/"+MONTHNUMBERSTR[d.getMonth()]+"/"+d.getFullYear();
			}
			let bRec = memberArray.find(x => x.mid === brideArray[index]);
			let bName = "";
			if (bRec) bName = getMemberName(bRec);
			return (
				<Grid key={"MEMGRID"+index} className={gClasses.noPadding} key={"SYM"+index} container justify="center" alignItems="center" >
				<Grid align="right" item xs={5} sm={5} md={5} lg={5} >
					<Typography className={gClasses.patientInfo2Brown}>{gName}</Typography>
				</Grid>
				<Grid item xs={5} sm={5} md={2} lg={2} >
				<Typography className={gClasses.patientInfo2Blue}>
					<Avatar size="small" variant="circular" src={hands} />
					{bDate}
				</Typography>
				</Grid>
				<Grid align="left" item xs={5} sm={5} md={5} lg={5} >
					<Typography className={gClasses.patientInfo2Brown}>{bName}</Typography>
				</Grid>
				</Grid>
			)}
		)}	
		</div>	
	)}

	function handleSpouseLink(index) {
		console.log(index);
		let mid = unLinkedLadies[index];
		console.log(mid);
		let tmpArray = [].concat(brideArray);
		console.log(brideArray);
		for(let i=0; i<tmpArray.length; ++i) {
			if (tmpArray[i] === 0) {
				console.log(`Found unlinked groom at index ${i}`)
				tmpArray[i] = mid;
				console.log(tmpArray)
				setBrideArray(tmpArray);
				setUnLinkedLadies(unLinkedLadies.filter(x => x !== mid));
				return;
			}
		}
	}

	function handleRemoveRelation(index) {
		setUnLinkedLadies([brideArray[index]].concat(unLinkedLadies));
		let tmpArray = brideArray;
		tmpArray[index] = 0;
		setBrideArray(tmpArray);
	}

	function handleEditSpouse() {

	}

	function handleDate1(d) {
		setEmurDate1(d);
	}

	function handleDateArray(index, e) {
		console.log(index);
		console.log(e);
		let tmp = [].concat(domMomemtArray);
		tmp[index] = e;
		setDomMomemtArray(tmp);
	}


	function updateCbItem(index) {
		let tmp = [].concat(cbList);
		tmp[index] = !tmp[index];
		setCbList(tmp);
		if ((!tmp[index]) && (hodRadio === index))
		setHodRadio(0);
	}

	function updateHodRadio(index) {
		if (cbList[index])
			setHodRadio(index);
	}
	
	
	return (
	<div className={gClasses.webPage} align="center" key="main">
	<DisplaySpouseButtons />
	<DisplaySpouseInformation />
	<Drawer 
		anchor="right"
		variant="temporary"
		open={isDrawerOpened != ""}
	>
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
	<VsCancel align="right" onClick={() => { setIsDrawerOpened("")}} />
	{((isDrawerOpened === "EDITSPOUSE") || (isDrawerOpened === "APPLYSPOUSE")) &&
		<div>
		<Typography className={gClasses.title}>{((isDrawerOpened === "EDITSPOUSE") ? "Edit" : "Application to change") + " Spouse relationship of family members of "+getMemberName(memberArray[0])}</Typography>
		<br />
		{groomArray.map( (g, index) => {
			let gRec = memberArray.find(x => x.mid === g);
			let gName = getMemberName(gRec);
			let bRec = memberArray.find(x => x.mid === brideArray[index]);
			let bName = (bRec) ? getMemberName(bRec) : "";
			return (
			<Box  key={"MEMBOX"+index} className={gClasses.boxStyle} borderColor="black" borderRadius={30} border={1} >
			<Grid key={"MEMGRID"+index} className={gClasses.noPadding} key={"SYM"+index} container justify="center" alignItems="center" >
				<Grid align="left" item xs={12} sm={12} md={12} lg={12} >
					<Typography className={gClasses.patientInfo2Brown}>{gName}</Typography>
				</Grid>
				<Grid align="left" item xs={8} sm={8} md={8} lg={8} >
					<Datetime 
						className={gClasses.dateTimeBlock}
						inputProps={{className: gClasses.dateTimeNormal}}
						timeFormat={false} 
						initialValue={domMomemtArray[index]}
						dateFormat="DD/MM/yyyy"
						isValidDate={disableFutureDt}
						onClose={(event) => handleDateArray(index, event)}
						closeOnSelect={true}
					/>
				</Grid>
				<Grid align="right" item xs={4} sm={4} md={4} lg={4} >
					<VsCancel onClick={() => handleRemoveRelation(index)} />
				</Grid>
				{(bName !== "") &&
				<Grid align="left" item xs={12} sm={12} md={12} lg={12} >
					<Typography className={gClasses.patientInfo2Brown}>{bName}</Typography>
				</Grid>
				}
				{(bName === "") &&
				<Grid align="left" item xs={12} sm={12} md={12} lg={12} >
					<Typography className={gClasses.patientInfo2Blue}>Select Bride</Typography>
				</Grid>
				}
			</Grid>
			</Box>
			)}
		)}
		<br />
		<Divider className={gClasses.divider} />
		<br />
		{unLinkedLadies.map( (u, index) => {
			let gRec = memberArray.find(x => x.mid === u);
			let gName = getMemberName(gRec);
			return (
			<Box  key={"MEMBOX"+index} className={gClasses.boxStyle} borderColor="black" borderRadius={30} border={1} >
			<Grid key={"MEMGRID"+index} className={gClasses.noPadding} key={"SYM"+index} container justify="center" alignItems="center" >
				<Grid align="right" item xs={12} sm={6} md={4} lg={4} >
					<Typography className={gClasses.patientInfo2Brown} onClick={() => handleSpouseLink(index)}>{gName}
					</Typography>
				</Grid>
			</Grid>
			</Box>
			)}
		)}
		<DisplayRegisterStatus />
		<BlankArea />
		<VsButton align="center" name={(isDrawerOpened === "EDITSPOUSE") ? "Update" : "Apply"} 
		onClick={handleEditSpouse} />
		</div>
	}	
	</Box>
	</Drawer>
	{/*</Container>*/}
  </div>
  );    
}
