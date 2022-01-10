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
//import VsSelect from "CustomComponents/VsSelect";
//import VsTextFilter from "CustomComponents/VsTextFilter";
//import VsList from "CustomComponents/VsList";

import MemberGeneral from "views/Member/MemberGeneral"

//import { useLoading, Audio } from '@agney/react-loading';
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
//import modalStyles from "assets/modalStyles";



//const BlankMemberData = {firstName: "", middleName: "", lastName: ""};

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
var adminData;
export default function Member(props) {
  
  //const classes = useStyles();
	const gClasses = globalStyles();
	const alert = useAlert();

	const [memberArray, setMemberArray] = useState([])
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
	//const [isListDrawer, setIsListDrawer] = useState("");

	//const [remember, setRemember] = useState(false);
	//const [filterItem, setFilterItem] = useState("");
	//const [filterItemText, setFilterItemText] = useState("");
	//const [filterItemArray, setFilterItemArray] = useState([]);
	
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

	//const [emurCity, setEmurCity] = useState("");
	//const [emurSuburb, setEmurSuburb] = useState("");

	//const [emurVisitNumber, setEmurIndex] = useState(0);
	//const [emurNumber, setEmurNumber] = useState(0);
	//const [emurName, setEmurName] = useState("");

	const [registerStatus, setRegisterStatus] = useState(0);

	

	
  useEffect(() => {	
		const getDetails = async () => {	
			await getHod(props.member.hid);
			await getHodMembers(props.member.hid);
			await setCurrentMemberData(props.member)
			setSelection("General");
			getGotraList();
		}
		//setCurrentMember(getMemberName(props.member));
		loginHid = Number(sessionStorage.getItem("hid"));
		loginMid = Number(sessionStorage.getItem("mid"));
		adminData = JSON.parse(sessionStorage.getItem("adminRec"));
		console.log(adminData);
		getDetails();
		
  }, []);


	async function getHod(hid) {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/hod/get/${hid}`
			let resp = await axios.get(myUrl);
			setCurrentHod(resp.data);
		} catch (e) {
			console.log(e);
			alert.error(`Error fetching HOD details of ${hid}`);
			setCurrentHod({});
		}	
	}

	async function getHodMembers(hid) {
		//console.log("Hi");
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/member/hod/${hid}`
			let resp = await axios.get(myUrl);
			//let tmp = resp.data.find(x => (x.mid % 100) === 1);
			//setCurrentMemberData(tmp);
			setMemberArray(resp.data);
			//setCurrentMember()
		} catch (e) {
			console.log(e);
			alert.error(`Error fetching Member details of HOD ${hid}`);
			setMemberArray([]);
		}	
	}

	async function getHodMemberNames() {
		//console.log("Hi");
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/hod/hodnames`;
			let resp = await axios.get(myUrl);
			//let tmp = resp.data.find(x => (x.mid % 100) === 1);
			//setCurrentMemberData(tmp);
			setHodNamesArray(resp.data);
			//setCurrentMember()
		} catch (e) {
			console.log(e);
			alert.error(`Error fetching  HOD names`);
			setHodNamesArray([]);
		}	
	}

	async function getGotraList() {
		//console.log("Hi");
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/gotra/list`
			let resp = await axios.get(myUrl);
			setGotraArray(resp.data);
			//setCurrentMember()
		} catch (e) {
			console.log(e);
			alert.error(`Error fetching Gotra List`);
			setGotraArray([]);
		}	
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
		setRadioRecord(0);
		if (item === "Spouse") {

			// create groom array
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
			
			setCurrentSelection(item);
		} else {
			setCurrentSelection(item);
		}
	}
	
	
	function DisplayFunctionHeader() {
	return (
	<Box  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
	<Grid className={gClasses.noPadding} key="AllPatients" container align="center">
		<DisplayFunctionItem item="General" />
		<DisplayFunctionItem item="Personal" />
		<DisplayFunctionItem item="Office" />
		<DisplayFunctionItem item="Spouse" />
	</Grid>	
	</Box>
	)}


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



	function DisplaySingleLine(props) {
	return(
		<Grid className={gClasses.noPadding} key={props.msg1+props.msg2} container align="center">
		<Grid align="left"  item xs={4} sm={4} md={2} lg={2} >
			<Typography className={gClasses.patientInfo2Blue}>{props.msg1}</Typography>
		</Grid>	
		<Grid align="left"  item xs={8} sm={8} md={10} lg={10} >
			<Typography className={gClasses.patientInfo2}>{props.msg2}</Typography>
		</Grid>	
		</Grid>

	)} 


	function editgeneralDetials() {
		//alert.info("TO be implemented");
		setEmurGotra(currentHod.gotra);
/*		
		if (adminData.superAdmin)
			setGotraFilterArray(gotraArray);
		else
			setGotraFilterArray([{name: currentHod.gotra}])
*/
		setGotraFilterArray([{name: currentHod.gotra}])

		setEmurVillage(currentHod.village);

		setEmurAddr1(currentHod.resAddr1);
		setEmurAddr2(currentHod.resAddr2);
		setEmurAddr3(currentHod.resAddr3);
		setEmurAddr4(currentHod.resAddr4);
		setEmurAddr5(currentHod.resAddr5);
		setEmurAddr6(currentHod.suburb);
		setEmurAddr7(currentHod.city);

		setEmurPincCode(currentHod.pinCode);

		setEmurResPhone1(currentHod.resPhone1);
		setEmurResPhone2(currentHod.resPhone2);

		setIsDrawerOpened("EDITGENERAL");
	}

	async function handleVerifyPincode() {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/hod/pincode/${emurPinCode}`;
			let resp = await axios.get(myUrl);
			//console.log(resp.data);
			setEmurPinResp(resp.data);
			setIsDrawerOpened("");
			setRegisterStatus(0);
			setIsDrawerOpened("CONFIRMGENERAL")
		} catch (e) {
			console.log(e);
			setRegisterStatus(1001);
		}		
	}

	async function handleEditGeneral() {
		if (isDrawerOpened === "EDITGENERAL") return handleVerifyPincode();

		// pin has been verified. Now it is confirm
		setRegisterStatus(0);
		//console.log(emurGotra);
		let tmp = encodeURIComponent(JSON.stringify({
			gotra: emurGotra,
			village: currentHod.village,
			addr1: emurAddr1,
			addr2: emurAddr2,
			addr3: emurAddr3,
			addr4: emurAddr4,
			addr5: emurAddr5,
			suburb: emurAddr6,
			city: emurAddr7,
			pinCode: emurPinCode,
			resPhone1: emurResPhone1,
			resPhone2: emurResPhone2
		}));
		let err = 1002;
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/hod/updatedetails/${props.member.hid}/${tmp}`;
			//console.log(myUrl)
			let resp = await axios.get(myUrl);
			setCurrentHod(resp.data);
			setIsDrawerOpened("");
			alert.success("Successfully updated HOD details");
			err = 0;
		} catch (e) {
			console.log(e);
			if (e.response) 
			if (e.response.status === 602)
				err = 1001;
			//alert.error(`Error updating HOD details of ${props.member.hid}`);
		}	
		setRegisterStatus(err);
	}

	async function handleEditGotra() {
		alert.info(isDrawerOpened);
	}

	

	function handleMoveUpMember() {
		//let fIndex = index - 1;
		//let sIndex = index;
		let index = radioRecord;
		let tmpArray = [].concat(memberArray);
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/member/scrollup/${tmpArray[index].mid}`
			axios.post(myUrl);
			let tmp = tmpArray[index-1].order;
			tmpArray[index-1].order = tmpArray[index].order;
			tmpArray[index].order = tmp;
			setMemberArray(lodashSortBy(tmpArray, 'order'));
			setRadioRecord(index-1);
		} catch (e) {
			console.log(e);
			alert.error(`Error moving up member`);
		}	
	}

	function handleMoveDownMember() {
		let index = radioRecord;
		let tmpArray = [].concat(memberArray);
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/member/scrolldown/${tmpArray[index].mid}`
			axios.post(myUrl);
			let tmp = tmpArray[index].order;
			tmpArray[index].order = tmpArray[index+1].order;
			tmpArray[index+1].order = tmp;
			setMemberArray(lodashSortBy(tmpArray, 'order'));
			setRadioRecord(index+1);				
		} catch (e) {
			console.log(e);
			alert.error(`Error scrolling down member`);
		}	
	}

	function handlePersonalAdd() {

	}

	function handlePersonalEdit() {
		let m = memberArray[radioRecord];
		setEmurAddr1(m.title);
		setEmurAddr2(m.lastName);
		setEmurAddr3(m.firstName);
		setEmurAddr4(m.middleName);
		setEmurAddr5(m.alias)
		setEmurAddr6(m.relation);
		setEmurAddr7(m.gender)
		setEmurAddr8(m.emsStatus)
		setEmurAddr9(m.bloodGroup);
		setEmurDate1(moment(m.dob));
		setEmurAddr10(m.occupation);
		setEmurAddr11(m.mobile);
		setEmurAddr12(m.mobile1);
		setEmurAddr13(decrypt(m.email));

		setIsDrawerOpened("EDITPERSONAL");
	}

	async function handleEditPersonalSubmit() {

	}

	function editGotraDetails(action) {
		console.log("1Action is "+action)
		setEmurAddr1(currentHod.gotra);
		setEmurAddr2(currentHod.caste);
		setEmurAddr3(currentHod.subCaste);
		setIsDrawerOpened(action);
		console.log("2Action is "+action)
	}



	function DisplayGeneralInformation() {
		//console.log(currentHod);
		let edit = (currentHod.hid === loginHid);
		let admin = adminData.superAdmin;
	return (
	<Box  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		{(admin) &&
		<div align = "right">
		<VsButton name="Edit Gotra, Caste, subcaste" onClick={() => editGotraDetails("EDITGOTRA")} />
		<VsButton name="Edit General Details" onClick={editgeneralDetials} />
		</div>
		}
		{(!admin && edit) &&
		<div align = "right">
		<VsButton name="Application for Gotra, Caste, subcaste" onClick={() => editGotraDetails("APPLYGOTRA")} />
		<VsButton name="Edit General Details" onClick={editgeneralDetials} />
		</div>
		}
		<DisplaySingleLine msg1="Gotra" msg2={currentHod.gotra} />
		<BlankArea />
		<DisplaySingleLine msg1="Caste" msg2={currentHod.caste} />
		{(currentHod.caste === "Humad") &&
			<div>
			<BlankArea />
			<DisplaySingleLine msg1="SubCaste" msg2={currentHod.subCaste} />
			</div>
		}
		<BlankArea />
		<DisplaySingleLine msg1="Village" msg2={currentHod.village} />
		<BlankArea />
		<DisplaySingleLine msg1="Res. Addr." msg2={currentHod.resAddr1} />
		{(currentHod.resAddr2 !== "") &&
		<DisplaySingleLine msg1="" msg2={currentHod.resAddr2} />
		}
		{(currentHod.resAddr3 !== "") &&
		<DisplaySingleLine msg1="" msg2={currentHod.resAddr3} />
		}
		{(currentHod.resAddr4 !== "") &&
		<DisplaySingleLine msg1="" msg2={currentHod.resAddr4} />
		}
		{(currentHod.resAddr5 !== "") &&
		<DisplaySingleLine msg1="" msg2={currentHod.resAddr5} />
		}
		<BlankArea />
		<DisplaySingleLine msg1="Suburb" msg2={currentHod.suburb} />
		<BlankArea />
		<DisplaySingleLine msg1="City" msg2={currentHod.city} />
		<BlankArea />
		<DisplaySingleLine msg1="Pin Code" msg2={currentHod.pinCode} />
		<BlankArea />
		<DisplaySingleLine msg1="Division" msg2={currentHod.division} />
		<BlankArea />
		<DisplaySingleLine msg1="District" msg2={currentHod.district} />
		<BlankArea />
		<DisplaySingleLine msg1="State" msg2={currentHod.state} />
		<BlankArea />
		<DisplaySingleLine msg1="Res. Phone1" msg2={currentHod.resPhone1} />
		<BlankArea />
		<DisplaySingleLine msg1="Res. Phone2" msg2={currentHod.resPhone2} />
		<BlankArea />
	</Box>	
	)}
	

	function handleCeasedMember() {
		setEmurDate1(moment());
		setIsDrawerOpened("CEASED");
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
	
	

	function handleMemberAsHod() {
		let m = memberArray[radioRecord];
		vsDialog("Member Ceased", `Are you sure you want to declare ${m.lastName} ${m.firstName} ${m.middleName} as Hod?`,
		{label: "Yes", onClick: handleMemberAsHodConfirm },
		{label: "No" }
		);
	} 

	function handleMemberAsHodConfirm() {
		let tmpRec = lodashCloneDeep(memberArray[radioRecord]);
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/member/sethod/${tmpRec.mid}`
			axios.post(myUrl);
			tmpRec.relation = "Self";
			let tmpArray = memberArray.filter(x => x.order !== radioRecord);
			tmpArray[0].relation ="Relative";
			tmpArray = [tmpRec].concat(tmpArray)
			for(let i=0; i<tmpArray.length; ++i) {
				tmpArray[i].order = i;
			}
			setMemberArray(tmpArray);
			setRadioRecord(0);				
		} catch (e) {
			console.log(e);
			alert.error(`Error fetching HOD details of ${hid}`);
			setCurrentHod({});
		}	
	}

	function handlePersonalNewFamily() {
		setHodRadio(0);
		let tmp = [];
		for(let i=0; i<memberArray.length; ++i) tmp.push(false);
		setCbList(tmp);
		setIsDrawerOpened("NEWFAMILY");
	}

	function handlePersonalTransfer() {
		setIsDrawerOpened("TRANSFER");
	}

	
	function handlePersonalMergeFamily() {
		setIsDrawerOpened("MERGEFAMILY");
	}

	
	function DisplayPersonalButtons() {
		//console.log("Curent", radioRecord);
		if (memberArray.length === 0) return null;
		let edit = (memberArray[0].hid === loginHid);
		if (adminData.superAdmin) edit = true;
		if  (!edit) return null;

		let lastItemIndex =  memberArray.length-1;
		let showUp = true;
		let showDown = true;
		if (radioRecord <= 1) showUp = false;
		if ((radioRecord === 0) || (radioRecord === lastItemIndex)) showDown = false;
	return(
	<div>
		{(adminData.superAdmin) &&
			<div align="right">
			<VsButton name="Transfer Member" disabled={radioRecord === 0}  onClick={handlePersonalTransfer} />
			<VsButton name="Merge Family" onClick={handlePersonalMergeFamily} />
			<VsButton name="Split Family" onClick={handlePersonalNewFamily} />
			<VsButton name="Add new Member" onClick={handlePersonalAdd} />
			<VsButton name="Ceased" disabled={radioRecord === 0} onClick={handleCeasedMember} />
			<VsButton name="Set Hod" disabled={radioRecord === 0} onClick={handleMemberAsHod} />
			<VsButton name="Scroll Up" disabled={!showUp} onClick={handleMoveUpMember} />
			<VsButton name="Scroll Down" disabled={!showDown} onClick={handleMoveDownMember} />
			<VsButton name="Edit Details" onClick={handlePersonalEdit} />
			</div>
		}
		{(!adminData.superAdmin) &&
			<div align="right">
			<VsButton name="Scroll Up" disabled={!showUp} onClick={handleMoveUpMember} />
			<VsButton name="Scroll Down" disabled={!showDown} onClick={handleMoveDownMember} />
			<VsButton name="Edit Details" onClick={handlePersonalEdit} />
			</div>
		}
	</div>
)}

	function DisplayOfficeButtons() {
		//console.log("Curent", radioRecord);
		if (memberArray.length === 0) return null;
		let edit = (memberArray[0].hid === loginHid);
		if (adminData.superAdmin) edit = true;
		if  (!edit) return null;
	return(
	<div align="right">
		<VsButton name="Edit Details" onClick={handleOfficeEdit} />
	</div>
	)}

	function handleOfficeEdit() {
		let m = memberArray.find(x => x.order === radioRecord);
		console.log(m);
		setEmurAddr1(m.education);
		setEmurAddr2(m.officeName)
		setEmurAddr3(m.officePhone)
		setEmurAddr4(getMemberName(m));
		setIsDrawerOpened("EDITOFFICE");
	}

	function handleEditOfficeSubmit() {
		let m = memberArray.find(x => x.order === radioRecord);
		m.education = emurAddr1;
		m.officeName = emurAddr2;
		m.officePhone = emurAddr3;
		setIsDrawerOpened("");
		alert.success("Updated. Press 'Update office Details' once office details of all member are done");
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


	function DisplayPersonalInformation() {
	let lastItemIndex =  memberArray.length-1;
	if (memberArray.length === 0) return null;
	let edit = (memberArray[0].hid === loginHid);
	if (adminData.superAdmin) edit = true;

	return (
	<div>
	{memberArray.map( (m, index) => {
		//let dobStr = "";
		//let d = new Date(m.dob);
		//let myYear = d.getFullYear() ;
		//if (myYear !== 1900) {
			//dobStr = DATESTR[d.getDate()]+'/'+MONTHNUMBERSTR[d.getMonth()]+"/"+(myYear % 100) + " " + m.bloodGroup;
		//	dobStr = m.bloodGroup;
		//}
		if (m.ceased) return null;
		return (
		<Box  key={"MEMBOX"+index} className={gClasses.boxStyle} borderColor="black" borderRadius={30} border={1} >
		<Grid key={"MEMGRID"+index} className={gClasses.noPadding} key={"SYM"+index} container justify="center" alignItems="center" >
			<Grid align="left" item xs={8} sm={3} md={3} lg={3} >
				{(index === 0) &&
				<Typography className={gClasses.patientInfo2Brown}>{getMemberName(m)}</Typography>
				}
				{(index > 0) &&
				<Typography className={gClasses.patientInfo2Blue}>{getMemberName(m)}</Typography>
				}				
			</Grid>
			<Grid align="left" item xs={2} sm={6} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2}>{m.relation}</Typography>
			</Grid>
			<Grid align="left" item xs={2} sm={6} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2}>{dispAge(m.dob, m.gender)}</Typography>
			</Grid>
			<Grid align="left" item xs={4} sm={6} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2}>{m.emsStatus}</Typography>
			</Grid>
			<Grid align="left" item xs={4} sm={6} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2}>{m.bloodGroup}</Typography>
			</Grid>
			<Grid align="left" item xs={4} sm={6} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2}>{m.patientInfo2}{m.occupation}</Typography>
			</Grid>
			<Grid align="left"  item xs={6} sm={6} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2}>{m.patientInfo2}{dispMobile(m.mobile)}</Typography>
				<Typography className={gClasses.patientInfo2}>{m.patientInfo2}{dispMobile(m.mobile1)}</Typography>
			</Grid>
			<Grid align="left" item xs={6} sm={6} md={2} lg={2} >
				<Typography className={gClasses.patientInfo2}>{m.patientInfo2}{dispEmail(m.email)}</Typography>
				<Typography className={gClasses.patientInfo2}>{m.patientInfo2}{dispEmail(m.email1)}</Typography>
			</Grid>
			<Grid item xs={1} sm={1} md={1} lg={1} >
				{(edit) &&
					<VsRadio checked={radioRecord === m.order} onClick={() => setRadioRecord(m.order)}  />
				}
			</Grid>
		</Grid>
		</Box>
		)}
	)}	
	</div>	
	)}

	function DisplayOfficeInformation() {
		let lastItemIndex =  memberArray.length-1;
		//console.log(memberArray);
		if (memberArray.length === 0) return null;
		let edit = (memberArray[0].hid === loginHid);
		if (adminData.superAdmin) edit = true;
		return (
		<div>
		{memberArray.map( (m, index) => {
			return (
			<Box  key={"MEMBOX"+index} className={gClasses.boxStyle} borderColor="black" borderRadius={30} border={1} >
			<Grid key={"MEMGRID"+index} className={gClasses.noPadding} key={"SYM"+index} container justify="center" alignItems="center" >
				<Grid align="left" item xs={8} sm={2} md={3} lg={3} >
					{(index === 0) &&
					<Typography className={gClasses.patientInfo2Brown}>{getMemberName(m)}</Typography>
					}
					{(index > 0) &&
					<Typography className={gClasses.patientInfo2Blue}>{getMemberName(m)}</Typography>
					}				
				</Grid>
				<Grid align="left" item xs={2} sm={6} md={2} lg={2} >
					<Typography className={gClasses.patientInfo2}>{m.education}</Typography>
				</Grid>
				<Grid align="left" item xs={12} sm={12} md={5} lg={5} >
					<Typography className={gClasses.patientInfo2}>{m.officeName}</Typography>
				</Grid>
				<Grid align="left" item xs={4} sm={6} md={1} lg={1} >
					<Typography className={gClasses.patientInfo2}>{m.officePhone}</Typography>
				</Grid>
				<Grid item xs={12} sm={12} md={1} lg={1} >
					{(edit) &&
					<VsRadio checked={radioRecord === m.order} onClick={() => setRadioRecord(m.order)}  />
					}
				</Grid>
			</Grid>
			</Box>
			)}
		)}	
		</div>	
	)}
	
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
	

	async function handleNewFamilySubmit() {

		if (hodRadio === 0) return setRegisterStatus(2001); 

		if (cbList.filter(x => x === true).length === 0) return setRegisterStatus(2002);

		let midList = [];
		for(let i=0; i<memberArray.length; ++i) {
			if (cbList[i]) midList.push(memberArray[i].mid);
		}
		console.log(midList);
		let hodMid = memberArray[hodRadio].mid;
		console.log(hodMid);

		let tmp = encodeURIComponent(JSON.stringify({
			memberList: midList,
			hod: hodMid
		}));

		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/member/split/${tmp}`
			let resp = await axios.get(myUrl);
			//console.log(resp.data);
			getHodMembers(props.member.hid);
			//setCurrentMemberData(props.member)
		} catch (e) {
			console.log(e);
			alert.error(`Error creating new family`);
		}	
		setIsDrawerOpened("")
	}




	return (
	<div className={gClasses.webPage} align="center" key="main">
	{/*<Container component="main" maxWidth="lg">*/}
	<CssBaseline />
	<DisplayMemberHeader member={currentMemberData} />
	<Divider className={gClasses.divider} />
	<DisplayFunctionHeader />
	{(currentSelection === "General") &&
		<MemberGeneral hod={currentHod} />
	}
	{(currentSelection === "Personal") &&
		<div>
		<DisplayPersonalButtons />
		<DisplayPersonalInformation />
		</div>
	}
	{(currentSelection === "Office") &&
		<div>
		<DisplayOfficeButtons />
		<DisplayOfficeInformation />
		</div>
	}
	{(currentSelection === "Spouse") &&
		<div>
		<DisplaySpouseButtons />
		<DisplaySpouseInformation />
		</div>
	}
	<Drawer 
		anchor="right"
		variant="temporary"
		open={isDrawerOpened != ""}
	>
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
	<VsCancel align="right" onClick={() => { setIsDrawerOpened("")}} />
	{(isDrawerOpened === "CEASED") &&
		<ValidatorForm align="center" className={gClasses.form} onSubmit={handleCeasedMemberConfirm}>
		<Typography className={gClasses.title}>{"Ceased date of Member"}</Typography>
		<BlankArea />
		<Datetime 
			className={gClasses.dateTimeBlock}
			inputProps={{className: gClasses.dateTimeNormal}}
			timeFormat={false} 
			initialValue={emurDate1}
			dateFormat="DD/MM/yyyy"
			isValidDate={disableFutureDt}
			onClose={handleDate1}
			closeOnSelect={true}
			/>
			<BlankArea />
			<VsButton name="Update" type="submit" />
		</ValidatorForm>
	}	
	{((isDrawerOpened === "EDITGOTRA") || (isDrawerOpened === "APPLYGOTRA")) &&
		<ValidatorForm align="left" className={gClasses.form} onSubmit={handleEditGotra}>
		<Typography className={gClasses.title}>{((isDrawerOpened === "EDITGOTRA") ? "Edit" : "Application to change") + " Gotra, Caste, Sub Caste of "+getMemberName(memberArray[0])}</Typography>
		<BlankArea />
		<Grid className={gClasses.noPadding} key="ADDEDITPERS" container alignItems="center" align="center">
		<Grid align="left"  item xs={6} sm={6} md={2} lg={2} >
				<Typography className={gClasses.title}>Gotra</Typography>
			</Grid>
			<Grid align="left"  item xs={6} sm={6} md={10} lg={10} >
				<VsRadioGroup 
					value={emurAddr1} onChange={(event) => setEmurAddr1(event.target.value)}
					radioField="name" radioList={gotraArray}
				/>
			</Grid>	
			<Grid align="left"  item xs={6} sm={6} md={2} lg={2} >
				<Typography className={gClasses.title}>Caste</Typography>
			</Grid>
			<Grid align="left"  item xs={6} sm={6} md={10} lg={10} >
				<VsRadioGroup 
					value={emurAddr2} onChange={(event) => setEmurAddr2(event.target.value)}
					radioList={CASTE}
				/>
			</Grid>	
			</Grid>
			{(emurAddr2 === "Humad") &&
			<div>
			<Grid className={gClasses.noPadding} key="SUBCASTE2" container alignItems="center" align="center">
				<Grid align="left"  item xs={6} sm={6} md={2} lg={2} >
				<Typography className={gClasses.title}>Sub Caste</Typography>
				</Grid>
				<Grid align="left"  item xs={6} sm={6} md={10} lg={10} >
					<VsRadioGroup 
						value={emurAddr3} onChange={(event) => setEmurAddr3(event.target.value)}
						radioList={HUMADSUBCASTRE}
					/>
				</Grid>
			</Grid>
			</div>	
			}
		<DisplayRegisterStatus />
		<BlankArea />
		<VsButton align="center" name={(isDrawerOpened === "EDITGOTRA") ? "Update" : "Apply"} type="submit" />
		</ValidatorForm>
	}	
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
	{((isDrawerOpened === "EDITGENERAL") || (isDrawerOpened === "CONFIRMGENERAL")) &&
		<ValidatorForm align="left" className={gClasses.form} onSubmit={handleEditGeneral}>
		<Typography className={gClasses.title}>{"Edit family details of "+getMemberName(memberArray[0])}</Typography>
		<BlankArea />
		<Grid className={gClasses.noPadding} key="ADDEDITPERS" container alignItems="center" align="center">
			<Grid align="left"  item xs={12} sm={12} md={6} lg={6} >
				<TextValidator required fullWidth className={gClasses.vgSpacing}
					label="Res. Addr1" type="text"
					value={emurAddr1}
					disabled={(isDrawerOpened === "CONFIRMGENERAL")}
					onChange={(event) => { setEmurAddr1(event.target.value) }}			
				/>
			</Grid>
			<Grid align="left"  item xs={12} sm={12} md={6} lg={6} >
				<TextValidator  required fullWidth className={gClasses.vgSpacing}
					label="Res. Addr2" type="text"
					value={emurAddr2}
					disabled={(isDrawerOpened === "CONFIRMGENERAL")}
					onChange={(event) => { setEmurAddr2(event.target.value) }}			
				/>
			</Grid>
			<Grid align="left"  item xs={12} sm={12} md={6} lg={6} >
				<TextValidator fullWidth className={gClasses.vgSpacing}
					label="Res. Addr3" type="text"
					value={emurAddr3}
					disabled={(isDrawerOpened === "CONFIRMGENERAL")}
					onChange={(event) => { setEmurAddr3(event.target.value) }}			
				/>
			</Grid>
			<Grid align="left"  item xs={12} sm={12} md={6} lg={6} >
				<TextValidator  fullWidth className={gClasses.vgSpacing}
					label="Res. Addr4" type="text"
					value={emurAddr4}
					disabled={(isDrawerOpened === "CONFIRMGENERAL")}
					onChange={(event) => { setEmurAddr4(event.target.value) }}			
				/>
			</Grid>
			<Grid align="left"  item xs={12} sm={12} md={6} lg={6} >
				<TextValidator  fullWidth className={gClasses.vgSpacing}
					label="Res. Addr5" type="text"
					value={emurAddr5}
					disabled={(isDrawerOpened === "CONFIRMGENERAL")}
					onChange={(event) => { setEmurAddr5(event.target.value) }}			
				/>
			</Grid>
			<Grid align="left"  item xs={12} sm={12} md={6} lg={6} >
				<TextValidator  fullWidth className={gClasses.vgSpacing}
					label="Suburb" type="text"
					value={emurAddr6}
					disabled={(isDrawerOpened === "CONFIRMGENERAL")}
					onChange={(event) => { setEmurAddr6(event.target.value) }}			
				/>
			</Grid>
			<Grid align="left"  item xs={12} sm={12} md={6} lg={6} >
				<TextValidator  fullWidth className={gClasses.vgSpacing}
					label="City" type="text"
					value={emurAddr7}
					disabled={(isDrawerOpened === "CONFIRMGENERAL")}
					onChange={(event) => { setEmurAddr7(event.target.value) }}			
				/>
			</Grid>
			<Grid align="left"  item xs={12} sm={12} md={6} lg={6} >
				<TextValidator  required fullWidth className={gClasses.vgSpacing}
					label="Pin Code" type="number"
					value={emurPinCode}
					disabled={(isDrawerOpened === "CONFIRMGENERAL")}
					onChange={(event) => { setEmurPincCode(event.target.value) }}	
					validators={['minNumber:350000', 'maxNumber:449999']}
					errorMessages={['Invalid Pin code', 'Invalid Pin code']}			
				/>
			</Grid>
			<Grid align="left"  item xs={12} sm={12} md={6} lg={6} >
				<TextValidator  fullWidth className={gClasses.vgSpacing}
					label="Res. Phone 1" type="number"
					value={emurResPhone1}
					disabled={(isDrawerOpened === "CONFIRMGENERAL")}
					onChange={(event) => { setEmurResPhone1(event.target.value) }}			
				/>
			</Grid>
			<Grid align="left"  item xs={12} sm={12} md={6} lg={6} >
				<TextValidator  fullWidth className={gClasses.vgSpacing}
					label="Res. Phone 2" type="number"
					value={emurResPhone2}
					disabled={(isDrawerOpened === "CONFIRMGENERAL")}
					onChange={(event) => { setEmurResPhone2(event.target.value) }}			
				/>
			</Grid>
			<Grid align="left"  item xs={12} sm={12} md={6} lg={6} >
				<TextValidator required fullWidth className={gClasses.vgSpacing}
					label="Village" type="text"
					value={emurVillage}
					disabled={(isDrawerOpened === "CONFIRMGENERAL")}
					onChange={(event) => { setEmurVillage(event.target.value) }}			
				/>
			</Grid>
		</Grid>
		<DisplayRegisterStatus />
		<BlankArea />
		{(isDrawerOpened === "EDITGENERAL") &&
			<VsButton align="center" name="Validate PinCode" type="submit" />
		}
		{(isDrawerOpened === "CONFIRMGENERAL") &&
			<div>
			<br />
			<Typography className={gClasses.patientInfo2Blue} >
			{"As per Pincode "+ emurPinCode + ", Division/District/State details are "+emurPinResp.Division+"/"+emurPinResp.District+"/"+emurPinResp.State+". Click Confirm if Pincode is correct."}
			</Typography>
			<div align="center">
			<VsButton name="Confirm" type="submit" />
			<VsButton name="Cancel" onClick={() => setIsDrawerOpened("EDITGENERAL")} />
			</div>
			</div>
		}
		</ValidatorForm>
	}	
	{(isDrawerOpened === "EDITOFFICE") &&
		<ValidatorForm align="left" className={gClasses.form} onSubmit={handleEditOfficeSubmit}>
		<Typography className={gClasses.title}>{"Edit office details of "+emurAddr4}</Typography>
		<BlankArea />
		<TextValidator fullWidth className={gClasses.vgSpacing}
			label="Qualification" type="text"
			value={emurAddr1}
			onChange={(event) => { setEmurAddr1(event.target.value) }}			
		/>
		<TextValidator  fullWidth className={gClasses.vgSpacing}
			label="Office Details" type="text"
			value={emurAddr2}
			onChange={(event) => { setEmurAddr2(event.target.value) }}			
		/>
		<TextValidator className={gClasses.vgSpacing}
			label="Office Phone" type="text"
			value={emurAddr3}
			onChange={(event) => { setEmurAddr3(event.target.value) }}			
		/>
		<BlankArea />
		<VsButton align="center" name="Update" type="submit" />
		</ValidatorForm>
	}	
	{((isDrawerOpened === "ADDPERSONAL") || (isDrawerOpened === "EDITPERSONAL")) &&
		<ValidatorForm align="left" className={gClasses.form} onSubmit={handleEditPersonalSubmit}>
		<Typography align="center" className={gClasses.title}>{(isDrawerOpened === "ADDPERSONAL") ? "Add perosnal details of new member" : ("Edit personal details of "+getMemberName(memberArray[radioRecord]))}</Typography>
		<BlankArea />
		<Grid className={gClasses.noPadding} key="ADDEDITPERS" container alignItems="center" align="center">
			<Grid align="left"  item xs={6} sm={6} md={1} lg={1} >
				<Typography className={gClasses.title}>Title</Typography>
			</Grid>
			<Grid align="left"  item xs={6} sm={6} md={11} lg={11} >
				<VsRadioGroup 
					value={emurAddr1} onChange={(event) => setEmurAddr1(event.target.value)}
					radioList={MEMBERTITLE}
				/>
			</Grid>	
			<Grid align="left"  item xs={6} sm={6} md={3} lg={3} >
				<TextValidator required fullWidth className={gClasses.vgSpacing}
					label="Last Name" type="text"
					value={emurAddr2}
					onChange={(event) => { setEmurAddr2(event.target.value) }}			
				/>
			</Grid>
			<Grid align="left"  item xs={6} sm={6} md={3} lg={3} >
				<TextValidator required fullWidth className={gClasses.vgSpacing}
					label="First Name" type="text"
					value={emurAddr3}
					onChange={(event) => { setEmurAddr3(event.target.value) }}			
				/>
			</Grid>
			<Grid align="left"  item xs={6} sm={6} md={3} lg={3} >
				<TextValidator required fullWidth className={gClasses.vgSpacing}
					label="Middle Name" type="text"
					value={emurAddr4}
					onChange={(event) => { setEmurAddr4(event.target.value) }}			
				/>
			</Grid>
			<Grid align="left"  item xs={6} sm={6} md={3} lg={3} >
				<TextValidator fullWidth className={gClasses.vgSpacing}
					label="Alias" type="text"
					value={emurAddr5}
					onChange={(event) => { setEmurAddr5(event.target.value) }}			
				/>
			</Grid>
			<Grid align="left"  item xs={6} sm={6} md={1} lg={1} >
			<Typography className={gClasses.title}>Relation</Typography>
			</Grid>
			<Grid align="left"  item xs={6} sm={6} md={11} lg={11} >
				{(radioRecord !== 0) &&
					<VsRadioGroup 
						value={emurAddr6} onChange={(event) => setEmurAddr6(event.target.value)}
						radioList={RELATION}
					/>
				}
				{(radioRecord === 0) &&
					<VsRadioGroup 
						value={emurAddr6} onChange={(event) => setEmurAddr6(event.target.value)}
						radioList={SELFRELATION}
					/>
				}
			</Grid>	
			<Grid align="left"  item xs={6} sm={6} md={1} lg={1} >
				<Typography className={gClasses.title}>Gender</Typography>
			</Grid>
			<Grid align="left"  item xs={6} sm={6} md={11} lg={11} >
				<VsRadioGroup 
					value={emurAddr7} onChange={(event) => setEmurAddr7(event.target.value)}
					radioList={GENDER}
				/>
			</Grid>	
			<Grid align="left"  item xs={6} sm={6} md={1} lg={1} >
				<Typography className={gClasses.title}>Marital Status</Typography>
			</Grid>
			<Grid align="left"  item xs={6} sm={6} md={11} lg={11} >
				<VsRadioGroup 
					value={emurAddr8} onChange={(event) => setEmurAddr8(event.target.value)}
					radioList={MARITALSTATUS}
				/>
			</Grid>	
			<Grid align="left"  item xs={6} sm={6} md={1} lg={1} >
				<Typography className={gClasses.title}>Birth Date</Typography>
			</Grid>
			<Grid align="left"  item xs={6} sm={6} md={11} lg={11} >
				<br />
				<Datetime 
					className={gClasses.dateTimeBlock}
					inputProps={{className: gClasses.dateTimeNormal}}
					timeFormat={false} 
					initialValue={emurDate1}
					dateFormat="DD/MM/yyyy"
					isValidDate={disableFutureDt}
					onClose={handleDate1}
					closeOnSelect={true}
				/>
				<br />
			</Grid>	
			<Grid align="left"  item xs={6} sm={6} md={1} lg={1} >
				<Typography className={gClasses.title}>Blood Group</Typography>
			</Grid>
			<Grid align="left"  item xs={6} sm={6} md={11} lg={11} >
				<VsRadioGroup 
					value={emurAddr9} onChange={(event) => setEmurAddr9(event.target.value)}
					radioList={BLOODGROUP}
				/>
			</Grid>	
			<Grid align="left"  item xs={6} sm={6} md={3} lg={3} >
				<TextValidator fullWidth className={gClasses.vgSpacing}
					label="Occupation" type="text"
					value={emurAddr10}
					onChange={(event) => { setEmurAddr10(event.target.value) }}			
				/>
			</Grid>
			<Grid align="left"  item xs={6} sm={6} md={3} lg={3} >
				<TextValidator fullWidth className={gClasses.vgSpacing}
					label="Mobile 1" type="number"
					value={emurAddr11}
					onChange={(event) => { setEmurAddr11(event.target.value) }}			
					validators={['minNumber:1000000000', 'maxNumber:9999999999']}
					errorMessages={['Invalid mobile number', 'Invalid mobile number']}			
						/>
			</Grid>
			<Grid align="left"  item xs={6} sm={6} md={3} lg={3} >
				<TextValidator fullWidth className={gClasses.vgSpacing}
					label="Mobile 2" type="number"
					value={emurAddr12}
					onChange={(event) => { setEmurAddr12(event.target.value) }}			
					validators={['minNumber:1000000000', 'maxNumber:9999999999']}
					errorMessages={['Invalid mobile number', 'Invalid mobile number']}			
				/>
			</Grid>
			<Grid align="left"  item xs={6} sm={6} md={3} lg={3} >
				<TextValidator fullWidth className={gClasses.vgSpacing}
					label="Email" type="email"
					value={emurAddr13}
					onChange={(event) => { setEmurAddr13(event.target.value) }}			
				/>
			</Grid>
		</Grid>
		<BlankArea />
		<VsButton align="center" name="Update" type="submit" />
		</ValidatorForm>
	}	
	{(isDrawerOpened === "NEWFAMILY") &&
	<div>
		<Typography align="center" className={gClasses.title}>{"Create new family (Select members and Hod for new family)"}</Typography>
		<BlankArea />
		{memberArray.map( (m, index) => {
			if (index === 0) return (
				<Grid className={gClasses.noPadding} key={"NEWFAM"+index} container alignItems="center" align="center">
				<Grid item xs={12} sm={12} md={8} lg={8} >
					<Typography className={gClasses.titleOrange}>{"Member Name"}</Typography>
				</Grid>	
				<Grid item xs={4} sm={4} md={2} lg={2} >
				<Typography className={gClasses.titleOrange}>{"Transfer"}</Typography>
				</Grid>
				<Grid item xs={4} sm={4} md={2} lg={2} >
				<Typography className={gClasses.titleOrange}>{"HOD"}</Typography>
				</Grid>
				</Grid>	
			);
			return (
				<Grid className={gClasses.noPadding} key={"NEWFAM"+index} container alignItems="center" align="center">
				<Grid align="left"  item xs={12} sm={12} md={8} lg={8} >
					<Typography className={gClasses.title}>{getMemberName(m)}</Typography>
				</Grid>	
				<Grid item xs={4} sm={4} md={2} lg={2} >
					<VsCheckBox checked={cbList[index]} onClick={() => updateCbItem(index) }  />
				</Grid>
				<Grid item xs={4} sm={4} md={2} lg={2} >
					<VsRadio checked={hodRadio === index} onClick={() => updateHodRadio(index)}  />
				</Grid>
				</Grid>	
			)}
		)}
		<DisplayRegisterStatus />
		<BlankArea />
		<VsButton align="center" name="Create New Family" onClick={handleNewFamilySubmit} />
	</div>
	}
	</Box>
	</Drawer>
	{/*</Container>*/}
  </div>
  );    
}
