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
import VsPagination from 'CustomComponents/VsPagination';
import VsRolodex from 'CustomComponents/VsRolodex';

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


const BlankMemberData = {firstName: "", middleName: "", lastName: ""};

import {
	BlankArea, DisplayPageHeader,
} from "CustomComponents/CustomComponents.js"

import {
//SupportedMimeTypes, SupportedExtensions,
//str1by4, str1by2, str3by4,
//HOURSTR, MINUTESTR, 
DATESTR, MONTHNUMBERSTR,
MAGICNUMBER,
} from "views/globals.js";

import { 
	vsDialog,
	getMemberName,
	dispAge,
} from "views/functions.js";

import { 
	disableFutureDt,
} from 'views/functions';

/*
const useStyles = makeStyles((theme) => ({
	slotTitle: {
		color: 'green',
		fontSize: theme.typography.pxToRem(28),
		fontWeight: theme.typography.fontWeightBold,
		padding: "10px 10px", 
		margin: "10px 10px", 
	},
	patientName: {
		fontSize: theme.typography.pxToRem(16),
		fontWeight: theme.typography.fontWeightBold,	
		color: 'blue',
	},
	patientInfo: {
		fontSize: theme.typography.pxToRem(14),
	},
	murItem: {
		fontSize: theme.typography.pxToRem(15),
		fontWeight: theme.typography.fontWeightBold,
		paddingRight: '10px',
	},
    root: {
      width: '100%',
    }, 
    info: {
        color: blue[700],
    },     
    header: {
			color: '#D84315',
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
		},
		NoMedicines: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			color: blue[700]
		},  
		radio: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			color: "blue",
		},
		medicine: {
			fontSize: theme.typography.pxToRem(15),
			fontWeight: theme.typography.fontWeightBold,
			color: blue[700]
		},  
		modalHeader: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			color: blue[700]
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
		title: {
			fontSize: theme.typography.pxToRem(15),
			fontWeight: theme.typography.fontWeightBold,
			color: blue[700],
		},
    heading: {
			fontSize: theme.typography.pxToRem(15),
			fontWeight: theme.typography.fontWeightBold,
		},
		selectedAccordian: {
			//backgroundColor: '#B2EBF2',
		},
		normalAccordian: {
			backgroundColor: '#FFE0B2',
		},
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
		noPadding: {
			padding: '1px', 
		}
  }));
*/


const ROWSPERPAGE=13
export default function Humad() {
	const gClasses = globalStyles();
	const alert = useAlert();

	const [humadArray, setHumadArray] = useState([]);
	const [humadMasterArray, setHumadMasterArray] = useState([]);
	const [memberArray, setMemberArray] = useState([])
	//const [hodArray, setHodArray] = useState([])
	
	const [active, setActive] = useState(true);
	
	const [firstName, setFirstName] = useState("");
	const [middleName, setMiddleName] = useState("");
	const [lastName, setLastName] = useState("");


	const [currentSelection, setCurrentSelection] = useState("Symptom");
	const [remember, setRemember] = useState(false);
	
	const [isDrawerOpened, setIsDrawerOpened] = useState("");
	//const [isListDrawer, setIsListDrawer] = useState("");

	
	const [filterItem, setFilterItem] = useState("");
	const [filterItemText, setFilterItemText] = useState("");
	const [filterItemArray, setFilterItemArray] = useState([]);
	

	const [emurName, setEmurName] = useState("");

	const [modalRegister, setModalRegister] = useState(0);

	// pagination
	const [left, setLeft] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [currentPage, setCurrentPage] = useState(1);
	
	
	const [currentChar, setCurrentChar] = useState('A');
	
  useEffect(() => {	
		const getDetails = async () => {	
			getHumad('A');
		//setCurrentMember(getMemberName(props.member));
		}
		getDetails();

  }, []);
	async function getHumad(chrStr) {
		try {
		console.log('in humad fetch', chrStr )
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/humad/listbyalphabet/${chrStr}`;
			let resp = await axios.get(myUrl);
			
			setHumadArray(resp.data.humad);
			setMemberArray(resp.data.member);

			// calculate number of pages to display all data
			let count = Math.floor(resp.data.member.length / ROWSPERPAGE);
			if ((resp.data.member.length % ROWSPERPAGE) > 0)
				++count;
			setTotalPages(count);
			console.log(count);
			setLeft(1);
			setCurrentPage(1);
			setCurrentChar(chrStr);
		} catch (e) {
			console.log(e);
			alert.error(`Error fetching Humad details`);
			//setHumadMasterArray([]);
			setMemberArray([]);
			//setHodArray([]);
			//setHumadArray([]);
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

	async function newPage(newChar) {
		await getHumad(newChar);
		//console.log(num)
	}
	
	function DisplayAllHumad() {
		if (memberArray.length !== humadArray.length ) return null;
		//console.log(memberArray.length);
		//console.log(humadArray.length);
		return (
		<div>
		<Box  key={"CHARS"} className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<VsRolodex label="Last name with: " current={currentChar} onClick={newPage} />
		</Box>
		<Box  key={"MEMHDRBOX"} className={gClasses.boxStyle} borderColor="black" borderRadius={30} border={1} >
		<Grid key={"MEMHDRGRID"} className={gClasses.noPadding} container justify="center" alignItems="center" >
		<Grid align="left" item xs={8} sm={8} md={5} lg={5} >
			<Typography className={gClasses.patientInfo2Brown}>Name (Member Id)</Typography>
		</Grid>
		<Grid align="center" item xs={2} sm={6} md={1} lg={1} >
			<Typography className={gClasses.patientInfo2Brown}>Age</Typography>
		</Grid>
		<Grid align="center" item xs={2} sm={6} md={1} lg={1} >
			<Typography className={gClasses.patientInfo2Brown}>Mobile</Typography>
				{/*<Typography className={gClasses.patientInfo2Brown}>{m.mobile1}</Typography>*/}
		</Grid>
		<Grid align="center" item xs={12} sm={12} md={1} lg={1} >
			<Typography className={gClasses.patientInfo2Brown}>Mem. No.</Typography>
		</Grid>
		<Grid align="center" item xs={2} sm={6} md={1} lg={1} >
			<Typography className={gClasses.patientInfo2Brown}>Mem. Date</Typography>
		</Grid>
		<Grid align="center" item xs={2} sm={6} md={1} lg={1} >
			<Typography className={gClasses.patientInfo2Brown}>Remarks</Typography>
		</Grid>
		<Grid align="center" item xs={2} sm={6} md={1} lg={1} />
		<Grid align="center" item xs={2} sm={6} md={1} lg={1} >

		</Grid>
		</Grid>
		</Box>
		{memberArray.slice((currentPage-1)*ROWSPERPAGE, currentPage*ROWSPERPAGE).map( (m, index) => {
			let h = humadArray.find(x => x.mid === m.mid);
			let ageGender = dispAge(m.dob, m.gender);
			let d = new Date(h.membershipDate);
			let memDateStr = (d.getFullYear() !== 1900)
				? memDateStr = `${DATESTR[d.getDate()]}/${MONTHNUMBERSTR[d.getMonth()]}/${d.getFullYear()}`
				: "";
			return (
			<Box  key={"MEMBOX"+index} className={gClasses.boxStyle} borderColor="black" borderRadius={30} border={1} >
			<Grid key={"MEMGRID"+index} className={gClasses.noPadding} container justify="center" alignItems="center" >
				<Grid align="left" item xs={8} sm={8} md={5} lg={5} >
					<Typography className={gClasses.patientInfo2}>{getMemberName(m)+" ( "+m.mid+" )"}</Typography>
						{/*<Typography className={gClasses.patientInfo2}>{"( "+m.mid+" )"}</Typography>*/}
				</Grid>
				<Grid align="center" item xs={2} sm={6} md={1} lg={1} >
					<Typography className={gClasses.patientInfo2}>{ageGender}</Typography>
				</Grid>
				<Grid align="center" item xs={2} sm={6} md={1} lg={1} >
					<Typography className={gClasses.patientInfo2}>{m.mobile}</Typography>
						{/*<Typography className={gClasses.patientInfo2}>{m.mobile1}</Typography>*/}
				</Grid>
				<Grid align="center" item xs={12} sm={12} md={1} lg={1} >
					<Typography className={gClasses.patientInfo2}>{h.membershipNumber}</Typography>
				</Grid>
				<Grid align="center" item xs={2} sm={6} md={1} lg={1} >
					<Typography className={gClasses.patientInfo2}>{memDateStr}</Typography>
				</Grid>
				<Grid align="center" item xs={2} sm={6} md={1} lg={1} >
					<Typography className={gClasses.patientInfo2}>{h.remarks}</Typography>
				</Grid>
				<Grid align="center" item xs={2} sm={6} md={1} lg={1} />
				<Grid align="center" item xs={2} sm={6} md={1} lg={1} >

				</Grid>
			</Grid>
			</Box>
			)}
		)}	
		{(totalPages > 1) &&
		<Box  key={"PAGES"} className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
			<VsPagination label="Page: " showStart showEnd count={totalPages} left={left} setLeft={setLeft} current={currentPage} onClick={setCurrentPage} />
		</Box>
		}
		</div>	
		)}
	
	function handleDate1(d) {
		setEmurDate1(d);
	}

/*
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
		
		setHumadArray(tmpHumad);
	}
*/

	return (
	<div className={gClasses.webPage} align="center" key="main">
	<CssBaseline />
	<DisplayPageHeader headerName="Humad Members" groupName="" tournament=""/>
	{(false) &&
	<Grid className={gClasses.vgSpacing} key="PatientFilter" container alignItems="center" >
	<Grid key={"CB"} item xs={12} sm={6} md={1} lg={2} >
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
	<br />
	<DisplayAllHumad />
	<Drawer anchor="right" variant="temporary" open={isDrawerOpened !== ""} >
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
	<VsCancel align="right" onClick={() => { setIsDrawerOpened("")}} />
	</Box>
	</Drawer>
  </div>
  );    
}
