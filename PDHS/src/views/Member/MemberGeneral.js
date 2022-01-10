import React, { useState, useContext, useEffect } from 'react';
import {  CssBaseline } from '@material-ui/core';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Divider from '@material-ui/core/Divider';
//import Avatar from '@material-ui/core/Avatar';
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

import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import 'react-step-progress/dist/index.css';
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
import { useAlert } from 'react-alert';


// styles
import globalStyles from "assets/globalStyles";




//const BlankMemberData = {firstName: "", middleName: "", lastName: ""};

import {
	BlankArea,
	DisplayMemberHeader,
} from "CustomComponents/CustomComponents.js"

import { 
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


var loginHid, loginMid;
var adminData ={superAdmin: false, humadAdmin: false, pjymAdmin: false, prwsAdmin: false} ;
export default function MemberGeneral (props) {
	let onlytemp = sessionStorage.getItem("hod");
	//console.log(JSON.parse(onlytemp));

	const gClasses = globalStyles();
	const alert = useAlert();

	const [currentHod, setCurrentHod] = useState(JSON.parse(onlytemp));
	const [existingGotra, setExistingGotra] = useState(true);
	
	const [memberArray, setMemberArray] = useState([])
	//const [currentMember, setCurrentMember] = useState("");
	const [currentMemberData, setCurrentMemberData] = useState({});
	const [gotraArray, setGotraArray] = useState([]);
	const [gotraFilterArray, setGotraFilterArray] = useState([]);
		
	const [radioRecord, setRadioRecord] = useState(0);
	const [emurDate1, setEmurDate1] = useState(moment());
	const [currentSelection, setCurrentSelection] = useState("");

	


	
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
			getGotraList();
		}

		loginHid = Number(sessionStorage.getItem("hid"));
		loginMid = Number(sessionStorage.getItem("mid"));
		adminData = JSON.parse(sessionStorage.getItem("adminRec"));
		getDetails();
  }, []);

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
		
		setEmurGotra(currentHod.gotra);
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
			console.log(resp.data);
			//setIsDrawerOpened("");
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
		let myGotra = emurAddr1.trim();
		if (myGotra === "") return setRegisterStatus(1001);

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

	function handleDate1(d) {
		setEmurDate1(d);
	}

	return (
	<div className={gClasses.webPage} align="center" key="main">
	<DisplayGeneralInformation />
	<Drawer 
		anchor="right"
		variant="temporary"
		open={isDrawerOpened != ""}
	>
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
	<VsCancel align="right" onClick={() => { setIsDrawerOpened("")}} />
	{((isDrawerOpened === "EDITGOTRA") || (isDrawerOpened === "APPLYGOTRA")) &&
		<ValidatorForm align="left" className={gClasses.form} onSubmit={handleEditGotra}>
			<Typography className={gClasses.title}>{((isDrawerOpened === "EDITGOTRA") ? "Edit" : "Application to change") + " Gotra, Caste, Sub Caste"}</Typography>
			<br />
			<Grid className={gClasses.noPadding} key="CASTE" container alignItems="center" align="center">
			<Grid align="left"  item xs={6} sm={6} md={2} lg={2} >
				<Typography className={gClasses.title}>Gotra</Typography>
			</Grid>
			<Grid align="left"  item xs={6} sm={6} md={10} lg={10} >
			<VsCheckBox align="left" label="Existing Gotra" checked={existingGotra} onClick={() => setExistingGotra(!existingGotra) }  />
			{(existingGotra) &&
				<VsRadioGroup 
					value={emurAddr1} onChange={(event) => setEmurAddr1(event.target.value)}
					radioField="name" radioList={gotraArray}
				/>				
			}
			{(!existingGotra) &&
				<TextValidator required fullWidth className={gClasses.vgSpacing}
					label="Gotra" type="text"
					value={emurAddr1}
					onChange={(event) => { setEmurAddr1(event.target.value) }}			
				/>	
			}
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
	{((isDrawerOpened === "EDITGENERAL") || (isDrawerOpened === "CONFIRMGENERAL")) &&
		<ValidatorForm align="left" className={gClasses.form} onSubmit={handleEditGeneral}>
		<Typography className={gClasses.title}>{"Edit family details "}</Typography>
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
			{"As per Pincode "+ emurPinCode + ", Division/District/State details are "+emurPinResp.division+"/"+emurPinResp.district+"/"+emurPinResp.state}
			</Typography>
			<Typography className={gClasses.patientInfo2Blue} >			
			Click Confirm if Pincode is correct.
			</Typography>
			<div align="center">
			<VsButton name="Confirm" type="submit" />
			<VsButton name="Cancel" onClick={() => setIsDrawerOpened("EDITGENERAL")} />
			</div>
			</div>
		}
		</ValidatorForm>
	}	
	</Box>
	</Drawer>
  </div>
  );    

}
