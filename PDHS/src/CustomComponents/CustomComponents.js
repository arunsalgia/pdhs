import React from 'react';
import ReactDOM from 'react-dom';
import ReactTooltip from "react-tooltip";
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import PDFViewer from 'pdf-viewer-reactjs';
import lodashSumBy from 'lodash/sumBy';
//import VsCancel from "CustomComponents/VsCancel";

import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {red, blue, green, deepOrange, yellow} from '@material-ui/core/colors';
import {
  validateSpecialCharacters, validateEmail, validateMobile, validateInteger, validateUpi,
  encrypt, decrypt, 
  currentAPLVersion, latestAPLVersion,
	getImageName,
	dispOnlyAge, dispAge, dispEmail, dispMobile,
	checkIfBirthday,
	ordinalSuffix,
} from "views/functions.js";

import {
HOURSTR, MINUTESTR, DATESTR, MONTHNUMBERSTR, MONTHSTR, INR,
} from "views/globals.js";

//import {setTab} from "CustomComponents/CricDreamTabs.js"
//import Divider from "@material-ui/core/Divider";
import globalStyles from "assets/globalStyles";
//import VsButton from "CustomComponents/VsButton";

//Icons
//import IconButton from '@material-ui/core/IconButton';
//import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
//import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from 			'@material-ui/icons/Edit';
//import PreviewIcon from '@material-ui/icons/Preview';
//import VisibilityIcon from '@material-ui/icons/Visibility';
import InfoIcon from 			'@material-ui/icons/Info';

const useStyles = makeStyles((theme) => ({
  title: {
		fontSize: theme.typography.pxToRem(20),
		fontWeight: theme.typography.fontWeightBold,
		color: blue[300],
	},
	paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  button: {
    margin: theme.spacing(0, 1, 0),
  },
  jumpButton: {
    // margin: theme.spacing(0, 1, 0),
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    backgroundColor: '#FFFFFF',
    color: '#1A233E',
    fontWeight: theme.typography.fontWeightBold,
    fontSize: '16px',
    width: theme.spacing(20),
  },
  jumpButtonFull: {
    // margin: theme.spacing(0, 1, 0),
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    backgroundColor: '#FFFFFF',
    color: '#1A233E',
    fontWeight: theme.typography.fontWeightBold,
    fontSize: '16px',
    width: theme.spacing(40),
  },
  groupName:  {
    // right: 0,
    fontSize: '14px',
    fontWeight: theme.typography.fontWeightBold,
    color: blue[300],
    // position: 'absolute',
    alignItems: 'center',
    marginTop: '0px',
  },
  balance:  {
    // right: 0,
    marginRight: theme.spacing(3),
    fontSize: '18px',
    fontWeight: theme.typography.fontWeightBold,
    color: blue[900],
    // // position: 'absolute',
    // alignItems: 'center',
    // marginTop: '0px',
  },
  version:  {
    //marginRight: theme.spacing(3),
    fontSize: '18px',
    color: blue[900],
  },
  error:  {
    // right: 0,
    fontSize: '12px',
    color: red[300],
    // position: 'absolute',
    alignItems: 'center',
    marginTop: '0px',
  },
  successMessage: {
    color: green[300],
  }, 
  failureMessage: {
    color: red[300],
  }, 
  table: {
    // minWidth: 650,
  },
  th: { 
    border: 5,
    align: "center",
    padding: "none",
		fontSize: theme.typography.pxToRem(13),
		fontWeight: theme.typography.fontWeightBold,
		//backgroundColor: '#FFA326',
		backgroundColor: deepOrange[200],
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
  },
  td : {
    spacing: 0,
    // border: 5,
    align: "center",
    padding: "none",
    height: 10,
  },
	allBlue: {
		backgroundColor: blue[100],
	},
	tdBlue : {
    border: 5,
    align: "center",
    padding: "none",
		borderWidth: 1,
		backgroundColor: blue[100],
		borderColor: 'black',
		borderStyle: 'solid',
  },
	apptName: {
		fontSize: theme.typography.pxToRem(15),
		fontWeight: theme.typography.fontWeightBold,
		color: blue[300]
	},  
  ngHeader: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  ngCard: {
    backgroundColor: '#B3E5FC',
  },
  divider: {
    backgroundColor: '#000000',
    color: '#000000',
    fontWeight: theme.typography.fontWeightBold,
  }
}));

/*
 * Old Unused
 *
 export function DisplayPrizeTable(props) {
  const classes = useStyles();
  // console.log("in Table");
  // console.log(props.tableName);
  return (
    <TableContainer component={Paper}>
      <Table> 
      <TableHead p={0}>
          <TableRow align="center">
          <TableCell className={classes.th} p={0} align="center">Rank</TableCell>
          <TableCell className={classes.th} p={0} align="center">Prize</TableCell>
          </TableRow>
      </TableHead>
      <TableBody p={0}>
        {props.tableName.map(x => {
        return (
          <TableRow key={x.rank} align="center">
          <TableCell  className={classes.td} p={0} align="center" >
              {x.rank}
          </TableCell>
          <TableCell  className={classes.td} p={0} align="center" >
              {x.prize}
          </TableCell>
          </TableRow>
          )
          })}
      </TableBody>
      </Table>
  </TableContainer>    
  );
}

export function ShowCreateGroup() {
  return (
    <div>
    <Typography paragraph>
    Click on Group Icon (on right hand side) and select “New Group”.
    </Typography>
    <Typography paragraph>
    You will need the following information to create new Group.
    </Typography>
    <Typography paragraph>
    1.  Name of your group. e.g. "Bonaventure Gold". User who creates the new group is considered as the group "OWNER/ADMIN".
    </Typography>
    <Typography paragraph>
    2.  Number of members that will be part of this group.
    </Typography>
    <Typography paragraph>
    3.  Member Free (e.g. 50/35/100 Rupees as desired by you.) It will be available in your wallet.
    </Typography>
    <Typography paragraph>
    4.  Select the tournamenet for which you want to play.
    </Typography>
    Once above information is provided, user can click on "Create" button to create new group.
    <Typography paragraph>
    Next is to select the number of prizes (in the range 1 to 5).
    </Typography>
    <Typography paragraph>
    Total Prize money will be equal to Number of Members * Member Fee 
    </Typography>
    <Typography paragraph>
    The final step is to copy the Groupcode and share with the members.
    </Typography>
    </div>
  )
}


export function ShowJoinGroup() {
  return (
    <div>
    <Typography paragraph>
    Click on Group Icon (on right hand side) and select “Join Group”.
    </Typography>
    <Typography paragraph>
    When the GroupCode is shared with you, just go to "Join Group" and join the group using the group code.
    </Typography>
    </div>
  )
}

export function ShowAuctionGroup() {
  return (
    <div>
    <Typography paragraph>
    Once all the players have joined the group, the next step is to purchase Players by the process of Auction.
    </Typography>
    <Typography paragraph>
    Go to "Auction" tab. Group onwer can click on "Start Auction" button.
    </Typography>
    <Typography paragraph>
    Now the player details will be displayed to all memebers. Click on amount button and do bidding. When Group owner find that bid amount is not increasiunng, then owner will press of "Sold" button and the player will be awarded to the highest bidder.
    </Typography>
    <Typography paragraph>
    If there is no bid (bid amount 0) for the player, group owner can click on "Unsold" to skip the player. details will be displayed to all memebsr. Click on amount button and do bidding. When Group owner find that bid amount is not increasiunng, then he will pess of "Sold" button and the player will be awarded to the highest bidder.
    </Typography>
    <Typography paragraph>
    Once auction is complete, Admin will click on “Stop Auction” button. After this, all group members will get message indicating end of Auction.
    </Typography>
    <Typography paragraph>
    User can view the number of players purchased by them along with the balance amount.
    </Typography>
    <Typography paragraph>
    All the members can view the players purchased during auction by clicking on “My Team” tab.
    </Typography>
    </div>
  )
}

export function ShowCaptainGroup() {
  return (
    <div>
    <Typography paragraph>
    After the Auction is complete. Use can click on "Captain" (availabein Menu) and select Captain and Vice Captain.
    </Typography>
    </div>
  )
}

export function ShowMultipleGroup() {
  return (
    <div>
    <Typography paragraph>
    After the Auction is complete. Use can click on "Captain" (availabein Menu) and select Captain and Vice Captain.
    </Typography>
    </div>
  )
}

export function NoGroup() {
  const classes = useStyles();
  return (<h3>Does not belong to any Group</h3>);
}

export class NothingToDisplay extends React.Component {
  render() {return null}
}

export function GeneralMessage (props) {
  return(<h3 align="center">{props.message}</h3>);
}

export function DisplayGroupName (props) {
  const classes = useStyles();
  if (props.groupName.length > 0)
    return(<Typography className={classes.groupName} align="center">({props.groupName})</Typography>);
  else
    return(<NothingToDisplay />);
}



export function JumpButton(props) {
  let myDisabled = false;
  if (props.disabled) myDisabled = props.disabled;
  const classes = useStyles();
  return (
    <div align="center">
      <Button variant="outlined" size="medium" color="primary"
        disabled={myDisabled}
        className={classes.jumpButton}
        onClick={() => setTab(props.page) }>
        {props.text}
      </Button>
  </div>
  )
}

export function JumpButton2(props) {
  let myDisabled1 = (props.disabled1) ? props.disabled1 : false;
  let myDisabled2 = (props.disabled2) ? props.disabled2 : false;
  //const classes = useStyles();
  return (
    <Grid container >
      <Grid item xs={6} sm={6} md={6} lg={6} >
        <JumpButton page={props.page1} text={props.text1} disabled={myDisabled1}/>
      </Grid>
      <Grid item xs={6} sm={6} md={6} lg={6} >
        <JumpButton page={props.page2} text={props.text2} disabled={myDisabled2}/>
      </Grid>
    </Grid>
  )
}

export function JumpButtonFull(props) {
  let myDisabled = false;
  if (props.disabled) myDisabled = props.disabled;
  const classes = useStyles();
  return (
    <div align="center">
      <Button variant="outlined" size="medium" color="primary"
        disabled={myDisabled}
        className={classes.jumpButtonFull}
        onClick={() => setTab(props.page) }>
        {props.text}
      </Button>
  </div>
  )
}

export function JumpButtonOnly(props) {
  let myDisabled = false;
  if (props.disabled) myDisabled = props.disabled;
  const classes = useStyles();
  return (
    <div align="center">
      <Button variant="outlined" size="medium" color="primary"
        disabled={myDisabled}
        className={classes.jumpButton}
        onClick={() => setTab(props.page) }>
        {props.text}
      </Button>
  </div>
  )
}


export function DisplayCancel(props) {
return(
  <div align="right" >
  <IconButton
  // iconStyle={{width: '24px', height: '24px'}}
    onClick={props.onCancel}
    // disabled={currentTournament === 0}
    aria-label="left" color="primary">
  < CancelIcon fontSize="large" />
  </IconButton>
  </div>
)}

export function ShowTeamImage(props) {
	let myTeam = getImageName(props.teamName);
	return(
	<Avatar variant="square" src={myTeam} />    
	)
} 

export function DisplayMyPlayers(props) {
const gClasses = globalStyles();
return(
  <Table>
		<TableHead p={0}>
			<TableRow key="header" align="center">
			<TableCell className={gClasses.th} p={0} align="center">Team</TableCell>
			<TableCell className={gClasses.th} p={0} align="center">Player Name</TableCell>
			<TableCell className={gClasses.th} p={0} align="center">Bid Amount</TableCell>      
			</TableRow>
		</TableHead>
		<TableBody p={0}>
			{props.players.map(item => {
			return (
				<TableRow key={item.playerName}>
				<TableCell className={gClasses.td} p={0} align="center" ><ShowTeamImage teamName={item.team} /></TableCell> 
				<TableCell className={gClasses.td} p={0} align="center" >{item.playerName}</TableCell>
				<TableCell className={gClasses.td} p={0} align="center" >{item.bidAmount}</TableCell>
				</TableRow>
			)})}
		</TableBody> 
	</Table>
)}

export function DisplayYesNo(props) {
	let myId = sessionStorage.getItem("YESNO_id");
	let myTitle = sessionStorage.getItem("YESNO_title");
	let myMessage = sessionStorage.getItem("YESNO_message");
	let myButton1 = sessionStorage.getItem("YESNO_yesbutton");
	let myButton2 = sessionStorage.getItem("YESNO_nobutton");
	let isError = sessionStorage.getItem("YESNO_iserror");
	
	const gClasses = globalStyles();
	let msgClass = (isError == "true") ? gClasses.yesNoErrorMessage : gClasses.yesNoNormalMessage
	return(
		<div align="center">
			{(myTitle != "") && 
				<div>
				<Typography className={gClasses.yesNoTitle}>{myTitle}</Typography>
				<BlankArea />
				</div>
			}
			{(myMessage != "") && 
				<Typography className={gClasses.msgClass}>{myMessage}</Typography>
			}
			<BlankArea />
			{(myButton1 != "") && <VsButton name={myButton1} onClick={() => { props.close(); props.func(myId, "YES"); }} />}
			{(myButton2 != "") && <VsButton name={myButton2} color='red' onClick={() => { props.close(); props.func(myId, "NO");  }} />}
		</div>
	)}

	
export function DisplayDocumentList(props) {
 const classes = useStyles();
 const gClasses = globalStyles();
 if (props.documentArray.length === 0) 
	 return <Box className={classes.allBlue} width="100%"><Typography>No Reports avaialble</Typography></Box>
 
 //console.log(props.documentArray);
let _view = (props.viewHandle == null);
let _reload = (props.reloadHandle == null);
let _del = (props.deleteHandle == null);
let cmdCount = 0;
if (!_view) ++cmdCount;
if (!_reload) ++cmdCount;
if (!_del) ++cmdCount;
return (	
<Box className={classes.allBlue} width="100%">
		<TableContainer>
		<Table style={{ width: '100%' }}>
		<TableHead>
			<TableRow align="center">
				<TableCell key={"TH1"} colSpan={5+cmdCount} component="th" scope="row" align="center" padding="none"
				className={classes.th} >
				Medical Reports
				</TableCell>
			</TableRow>
			<TableRow align="center">
				<TableCell key={"TH21"} component="th" scope="row" align="center" padding="none"
				className={classes.th} >
				Date
				</TableCell>
				<TableCell key={"TH22"} component="th" scope="row" align="center" padding="none"
				className={classes.th} >
					Title
				</TableCell>
				<TableCell key={"TH23"} component="th" scope="row" align="center" padding="none"
				className={classes.th} >
				Description
				</TableCell>
				<TableCell key={"TH24"} component="th" scope="row" align="center" padding="none"
				className={classes.th} >
				Type
				</TableCell>
				<TableCell key={"TH25"} component="th" scope="row" align="center" padding="none"
				className={classes.th} >
				Name
				</TableCell>
				{(cmdCount > 0) &&
					<TableCell colSpan={3} key={"TH31"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					cmds
					</TableCell>
				}
			</TableRow>
		</TableHead>
		<TableBody>  
		{props.documentArray.map( (a, index) => {
			//let myExpiry = getOnlyDate(a.expiryDate);
			let myClass = classes.tdBlue;
			return(
				<TableRow align="center" key={"TROW"+index}>
				<TableCell key={"TD1"+index} align="center" component="td" scope="row" align="center" padding="none"
					className={myClass}>
					<Typography className={classes.apptName}>
						{getOnlyDate(a.date)}
					</Typography>
				</TableCell>
				<TableCell key={"TD2"+index} align="center" component="td" scope="row" align="center" padding="none"
					className={myClass}>
					<Typography className={classes.apptName}>
						{a.title}
					</Typography>
				</TableCell>
				<TableCell key={"TD3"+index} align="center" component="td" scope="row" align="center" padding="none"
					className={myClass}>
					<Typography className={classes.apptName}>
						{a.desc}
					</Typography>
				</TableCell>
				<TableCell key={"TD4"+index} align="center" component="td" scope="row" align="center" padding="none"
					className={myClass}>
					<Typography className={classes.apptName}>
						{a.type}
					</Typography>
				</TableCell>
				<TableCell key={"TD5"+index} align="center" component="td" scope="row" align="center" padding="none"
					className={myClass}>
					<Typography className={classes.apptName}>
						{a.name}
					</Typography>
				</TableCell>
				{(!_view) &&
				<TableCell key={"TD11"+index} align="center" component="td" scope="row" align="center" padding="none"
					className={myClass}>
						<IconButton className={gClasses.blue} size="small" onClick={() => {props.viewHandle(a)}} >
							<VisibilityIcon	 />
						</IconButton>
				</TableCell>
				}
				{(!_reload) &&
				<TableCell key={"TD12"+index} align="center" component="td" scope="row" align="center" padding="none"
					className={myClass}>
						<Typography className={classes.link}>
						<Link href="#" variant="body2" onClick={() => {props.reloadHandle(a)}}>Reload</Link>
						</Typography>
				</TableCell>
				}
				{(!_del) &&
				<TableCell key={"TD13"+index} align="center" component="td" scope="row" align="center" padding="none"
					className={myClass}>
						<IconButton color="secondary" size="small" onClick={() => {props.deleteHandle(a)}} >
							<DeleteIcon	 />
						</IconButton>
				</TableCell>
				}
				</TableRow>
		)})}
		</TableBody> 
		</Table>
		</TableContainer>
	</Box>	
)}


*/


export class BlankArea extends React.Component {
  render() {return <h5></h5>;}
}



export class ValidComp extends React.Component {

  componentDidMount()  {
    // custom rule will have name 'isPasswordMatch'
    ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
      return (value === this.props.p1)
    });

    ValidatorForm.addValidationRule('minLength', (value) => {
      return (value.length >= 6)
    });

    ValidatorForm.addValidationRule('noSpecialCharacters', (value) => {
      // console.log("Special chars test for: ", value);
      return validateSpecialCharacters(value);
    });

    ValidatorForm.addValidationRule('isNumeric', (value) => {
      // console.log("string: ", value);
      // console.log(value.toString());
      return validateInteger(value.toString());
    });

    ValidatorForm.addValidationRule('isEmailOK', (value) => {
      return validateEmail(value);
    });

    ValidatorForm.addValidationRule('mobile', (value) => {
      return validateMobile(value);
    });

    ValidatorForm.addValidationRule('checkbalance', (value) => {
      return (value >= this.props.balance);
    });

    ValidatorForm.addValidationRule('isUpiOK', (value) => {
      return validateUpi(value);
    });
  }

  
  componentWillUnmount() {
    // remove rule when it is not needed
    ValidatorForm.removeValidationRule('isPasswordMatch');
    ValidatorForm.removeValidationRule('isEmailOK');
    ValidatorForm.removeValidationRule('mobile');
    ValidatorForm.removeValidationRule('minLength');
    ValidatorForm.removeValidationRule('noSpecialCharacters');   
    ValidatorForm.removeValidationRule('checkbalance'); 
    ValidatorForm.removeValidationRule('isNumeric');    
    ValidatorForm.removeValidationRule('isUpiOK');
  }

  render() {
    return <br/>;
  }

}


export function DisplayPageHeader (props) {
    let msg = "";
    if (props.groupName.length > 0) 
      msg = props.groupName + '-' + props.tournament;
    return (
    <div>
      <Typography align="center" component="h1" variant="h5">{props.headerName}</Typography>
      {/*<DisplayGroupName groupName={msg}/>*/}
    </div>
  );
}

export function DisplayBalance (props) {
  const classes = useStyles();
  return (
  <div>
    <Typography align="right" className={classes.balance} >{`Wallet balance: ${props.wallet}`}</Typography>
  </div>
  );
}


export function MessageToUser (props) {
  const classes = useStyles();
  // console.log(props.mtuMessage);
  let myClass = props.mtuMessage.toLowerCase().includes("success") ? classes.successMessage : classes.failureMessage;
  return (
    <Dialog aria-labelledby="simple-dialog-title" open={props.mtuOpen}
        onClose={() => {props.mtuClose(false)}} >
        <DialogTitle id="simple-dialog-title" className={myClass}>{props.mtuMessage}</DialogTitle>
    </Dialog>
  );
}


export class Copyright extends React.Component {
  render () {
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
        <Link color="inherit" href="https://material-ui.com/">
        Viraag Services
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  }
}


export function CricDreamLogo () {
  let mylogo = `${process.env.PUBLIC_URL}/VS.ICO`;
  const classes = useStyles();
  return (
    <Avatar variant="square" className={classes.avatar}  src={mylogo}/>
);
}

export function DisplayVersion(props) {
  const classes = useStyles();
  let ver = props.version.toFixed(1);
  let msg =  `${props.text} ${ver}`;
  return <Typography align="center" className={classes.version} >{msg}</Typography>
}

export async function DisplayCurrentAPLVersion() {
  let version = await currentAPLVersion();
  return <DisplayVersion text="Current APL version" version={version}/>
}

export async function DisplayLatestAPLVersion() {
  let version = await latestAPLVersion();
  return <DisplayVersion text="Latest APL version" version={version}/>
}



export function DisplayGotraBox(props) {
	const gClasses = globalStyles();
	let _button1 = (props.button1 == null);
	let _button2 = (props.button2 == null);
	let _button3 = (props.button3 == null);
	let _button4 = (props.button4 == null);
	let _button5 = (props.button5 == null);
return (
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<div align="center" >
		<Typography>
		<span className={gClasses.patientName}>{props.gotra.name}</span>
		</Typography>
		</div>
		<BlankArea />
		<div align="right">
			{(!_button1) && props.button1}
			{(!_button2) && props.button2}
			{(!_button3) && props.button3}
			{(!_button4) && props.button4}
			{(!_button5) && props.button5}
		</div>
	</Box>
)}

export function DisplayPatientBox(props) {
	const gClasses = globalStyles();
	let _button1 = (props.button1 == null);
	let _button2 = (props.button2 == null);
	let _button3 = (props.button3 == null);
	let _button4 = (props.button4 == null);
	let _button5 = (props.button5 == null);
	return (
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<div align="center" >
		<Typography onClick={props.onClick} >
		<span className={gClasses.patientName} >{props.patient.displayName}</span>
		</Typography>
		</div>
		<div align="left" >
		<Typography onClick={props.onClick} >
			<span className={gClasses.patientInfo}>Id: </span>
			<span className={gClasses.patientInfo2}>{props.patient.pid}</span>
		</Typography>
		<Typography onClick={props.onClick} > 
			<span className={gClasses.patientInfo}>Age: </span>
			<span className={gClasses.patientInfo2}>{dispAge(props.patient.age, props.patient.gender)}</span>
		</Typography>
		<Typography onClick={props.onClick} > 
			<span className={gClasses.patientInfo}>Email: </span>
			<span className={gClasses.patientInfo2}>{dispEmail(props.patient.email)}</span>
		</Typography>
		<Typography onClick={props.onClick} > 
			<span className={gClasses.patientInfo}>Mob.: </span>
			<span className={gClasses.patientInfo2}>{dispMobile(props.patient.mobile)}</span>
		</Typography>
		<BlankArea />
		</div>
		<div align="right">
		{(!_button1) && props.button1}
		{(!_button2) && props.button2}
		{(!_button3) && props.button3}
		{(!_button4) && props.button4}
		{(!_button5) && props.button5}
		</div>
	</Box>
	)}

export function DisplayMedicineDetails(props) {
	const gClasses = globalStyles();
	let _button1 = (props.button1 == null);
	let _button2 = (props.button2 == null);
	let _button3 = (props.button3 == null);
	let _button4 = (props.button4 == null);
	let _button5 = (props.button5 == null);
	//console.log(_button1, _button2, _button3, _button4, _button5);
return (
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<div key={"MEDDETAILS"+props.medicine.name}align="center" >
		<Typography>
		<span className={gClasses.patientName}>{props.medicine.name}</span>
		</Typography>
		</div>
		<div align="left" >
		<Typography>
			<span className={gClasses.patientInfo}>Description: </span>
			<span className={gClasses.patientInfo2}>{props.medicine.description}</span>
		</Typography>
		<Typography> 
			<span className={gClasses.patientInfo}>Precaution : </span>
			<span className={gClasses.patientInfo2}>{props.medicine.precaution}</span>
		</Typography>
		<BlankArea />
		<div align="right">
		{(!_button1) && props.button1}
		{(!_button2) && props.button2}
		{(!_button3) && props.button3}
		{(!_button4) && props.button4}
		{(!_button5) && props.button5}
		</div>
	</div>
	</Box>
)}


export function DisplayDocumentDetails(props) {
	const gClasses = globalStyles();
	let d = new Date(props.document.date);
	let myDate = DATESTR[d.getDate()] + "/" + MONTHNUMBERSTR[d.getMonth()] + "/" + d.getFullYear();
	let myTime = HOURSTR[d.getHours()] + ":" + MINUTESTR[d.getMinutes()];
	let _button1 = (props.button1 == null);
	let _button2 = (props.button2 == null);
	let _button3 = (props.button3 == null);
	let _button4 = (props.button4 == null);
	let _button5 = (props.button5 == null);
	//console.log(_button1, _button2, _button3, _button4, _button5);
	let _notbrief = (props.brief == null)
return (
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		{(_notbrief) &&
			<div>
			<div align="center" >
			<Typography>
			<span className={gClasses.patientName}>{props.document.title}</span>
			</Typography>
			</div>
			<div align="left" >
			<Typography>
				<span className={gClasses.patientInfo}>Date: </span>
				<span className={gClasses.patientInfo2}>{myDate+' '+myTime}</span>
			</Typography>
			<Typography>
				<span className={gClasses.patientInfo}>Desc: </span>
				<span className={gClasses.patientInfo2}>
					{(props.document.desc !== "ARUNANKIT") ? props.document.desc : ""}
				</span>
			</Typography>
			<Typography> 
				<span className={gClasses.patientInfo}>Type: </span>
				<span className={gClasses.patientInfo2}>{props.document.type}</span>
			</Typography>
			<BlankArea />
			</div>
			<div align="right">
				{(!_button1) && props.button1}
				{(!_button2) && props.button2}
				{(!_button3) && props.button3}
				{(!_button4) && props.button4}
				{(!_button5) && props.button5}
			</div>
			</div>
		}
		{(!_notbrief) &&
			<Typography>
			<span className={gClasses.patientName}>{props.document.title} {props.button1}</span>
			</Typography>
		}
	</Box>
)}


export function DisplayAppointmentDetails(props) {
	const gClasses = globalStyles();
	let d = new Date(props.appointment.apptTime);
	
	let myDate = DATESTR[d.getDate()] + "/" +
		MONTHNUMBERSTR[d.getMonth()] + "/" +
		d.getFullYear();
		
	let myTime = HOURSTR[d.getHours()] + ":" + MINUTESTR[d.getMinutes()];
		
	let _button1 = (props.button1 == null);
	let _button2 = (props.button2 == null);
	let _button3 = (props.button3 == null);
	let _button4 = (props.button4 == null);
	let _button5 = (props.button5 == null);
	//console.log(_button1, _button2, _button3, _button4, _button5);
return (
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<div align="center" >
		<Typography>
		<span className={gClasses.patientName}>{props.appointment.displayName}</span>
		</Typography>
		</div>
		<div align="left" >
		<Typography>
			<span className={gClasses.patientInfo}>Id: </span>
			<span className={gClasses.patientInfo2}>{props.appointment.pid}</span>
		</Typography>
		<Typography> 
			<span className={gClasses.patientInfo}>Date: </span>
			<span className={gClasses.patientInfo2}>{myDate}</span>
		</Typography>
		<Typography > 
			<span className={gClasses.patientInfo}>Time: </span>
			<span className={gClasses.patientInfo2}>{myTime}</span>
		</Typography>
		<BlankArea />
		<div align="right">
		{(!_button1) && props.button1}
		{(!_button2) && props.button2}
		{(!_button3) && props.button3}
		{(!_button4) && props.button4}
		{(!_button5) && props.button5}
		</div>
	</div>
	</Box>
)}


export function DisplayAppointmentBox(props) {
	const gClasses = globalStyles();
	let d = new Date(props.appointment.apptTime);
	
	let myDate = DATESTR[d.getDate()] + "/" +
		MONTHNUMBERSTR[d.getMonth()] + "/" +
		d.getFullYear();
		
	let myTime = HOURSTR[d.getHours()] + ":" + MINUTESTR[d.getMinutes()];
		
	let _button1 = (props.button1 == null);
	let _button2 = (props.button2 == null);
	let _button3 = (props.button3 == null);
	let _button4 = (props.button4 == null);
	let _button5 = (props.button5 == null);
	//console.log(_button1, _button2, _button3, _button4, _button5);
return (
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<Typography> 
		<span className={gClasses.patientName}>{"Appt.: "}</span>
		<span className={gClasses.patientInfo2}>{myDate+" "+myTime}</span>
		<span className={gClasses.patientInfo2}>
				{(!_button1) && props.button1}
				{(!_button2) && props.button2}
				{(!_button3) && props.button3}
				{(!_button4) && props.button4}
				{(!_button5) && props.button5}
		</span>
		</Typography>
	</Box>
)}

export function DisplayHolidayDetails(props) {
	const gClasses = globalStyles();
	
	let myDate = ordinalSuffix(props.holiday.date) + " " + MONTHSTR[props.holiday.month] + " " + props.holiday.year;
		
	let _button1 = (props.button1 == null);
	let _button2 = (props.button2 == null);
	let _button3 = (props.button3 == null);
	let _button4 = (props.button4 == null);
	let _button5 = (props.button5 == null);
	//console.log(_button1, _button2, _button3, _button4, _button5);
return (
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<div align="center">
			<Typography>
			<span className={gClasses.patientName}>{myDate}</span>
			</Typography>
		</div>
		<div align="left">
			<Typography > 
			<span className={gClasses.patientInfo}>Desc: </span>
			<span className={gClasses.patientInfo2}>{props.holiday.desc}</span>
		</Typography>
		</div>
		<div align="right">
			{(!_button1) && props.button1}
			{(!_button2) && props.button2}
			{(!_button3) && props.button3}
			{(!_button4) && props.button4}
			{(!_button5) && props.button5}
		</div>
	</Box>
)}


export function DisplayPatientName(props) {
	let myText = props.name;
	if (props.id) myText + " (Id: " + props.id
return (
<Typography></Typography>
)}


	
export function DisplayUserDetails(props) {
	const gClasses = globalStyles();
	let _button1 = (props.button1 == null);
	let _button2 = (props.button2 == null);
	let _button3 = (props.button3 == null);
	let _button4 = (props.button4 == null);
	let _button5 = (props.button5 == null);
	//console.log(_button1, _button2, _button3, _button4, _button5);
return (
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<div align="center" >
		<Typography>
		<span className={gClasses.patientName}>{props.user.displayName}</span>
		</Typography>
		</div>
		<div align="left" >
		<Typography > 
			<span className={gClasses.patientInfo}>Email: </span>
			<span className={gClasses.patientInfo2}>{dispEmail(props.user.email)}</span>
		</Typography>
		<Typography > 
			<span className={gClasses.patientInfo}>Mob.: </span>
			<span className={gClasses.patientInfo2}>{dispMobile(props.user.mobile)}</span>
		</Typography>
		<BlankArea />
		<div align="right">
		{(!_button1) && props.button1}
		{(!_button2) && props.button2}
		{(!_button3) && props.button3}
		{(!_button4) && props.button4}
		{(!_button5) && props.button5}
		</div>
	</div>
	</Box>
)}

export function DisplayImage(props) {
const classes = useStyles();
//console.log(props);
return(	
<Box align="center" width="100%">
	<Typography className={classes.title}>{"Medical Report Title: "+props.title}</Typography>
	<BlankArea />
	<img src={`data:${props.mime};base64,${props.file}`}/>
</Box>
)}
	
export function DisplayPDF(props) {
	const classes = useStyles();
	return(	
	<Box align="center" width="100%">
		<Typography className={classes.title}>{"Medical Report Title: "+props.title}</Typography>
		<BlankArea />
		<PDFViewer 
			document={{base64: props.file }}
		/>
	</Box>
	)}

export function LoadingMessage() {
return(
<div align="center">
	<Typography>Sorry to keep you waiting. Just give a moment. Loading information from server.....</Typography>
</div>
)}


export function DisplayProfChargeBalance(props) {
	const gClasses = globalStyles();	
	//console.log(props.balance);
	return (
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1}>
		<Grid container className={gClasses.noPadding} key="BALANCE" >
			<Grid key={"BAL1"} align="center" item xs={4} sm={4} md={4} lg={4} >
				<Typography className={gClasses.indexSelection} >
					{"Billing: "+INR+props.balance.billing}
				</Typography>
			</Grid>
			<Grid key={"BAL2"} align="center" item xs={4} sm={4} md={4} lg={4} >
				<Typography className={gClasses.indexSelection} >
					{"Collection: "+INR+props.balance.payment}
				</Typography>
			</Grid>
			<Grid key={"BAL3"} align="center" item xs={4} sm={4} md={4} lg={4} >
				<Typography className={gClasses.indexSelection} >
					{"Due: "+INR+Math.abs(props.balance.due)+((props.balance.due < 0) ? " (Cr)" : "")}
				</Typography>
			</Grid>
			<Grid key={"BAL11"} align="center" item xs={12} sm={12} md={12} lg={12} >
				<Typography className={gClasses.patientInfo2Green} >{"(balance details as on date)"}</Typography>
			</Grid>
		</Grid>	
		</Box>
	);
}

	
export function DisplayProfCharge(props) {
	const gClasses = globalStyles();	
	let _edit =   (props.handleEdit == null);
	let _cancel = (props.handleCancel == null);
	let tmp = props.profChargeArray.filter(x => x.amount > 0);
	let myCollection = lodashSumBy(tmp, 'amount');
	tmp = props.profChargeArray.filter(x => x.amount < 0);
	let myBilling = Math.abs(lodashSumBy(tmp, 'amount'));
	return (
		<div>
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1}>
		<div>
		<Grid  key={"HDR"} container alignItems="center" >
			<Grid item  align="left" xs={2} sm={2} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2Blue}>Date</Typography>
			</Grid>
			<Grid item align="left" xs={3} sm={3} md={3} lg={3} >
				<Typography className={gClasses.patientInfo2Blue}>Name</Typography>
			</Grid>
			<Grid item align="left" xs={4} sm={4} md={4} lg={4} >
				<Typography className={gClasses.patientInfo2Blue}>Description</Typography>
			</Grid>
			<Grid item  align="center" xs={1} sm={1} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2Blue}>Mode</Typography>
			</Grid>
			<Grid item align="right" xs={1} sm={1} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2Blue}>Billing</Typography>
			</Grid>
			<Grid item  xs={1} sm={1} md={1} lg={1} >
			<Typography align="right" className={gClasses.patientInfo2Blue}>Collection</Typography>
			</Grid>
			<Grid item xs={1} sm={1} md={1} lg={1} >
			</Grid>
		</Grid>
		{props.profChargeArray.map( (p, index) => {
		let d = new Date(p.date);
		let myDate = `${DATESTR[d.getDate()]}/${MONTHNUMBERSTR[d.getMonth()]}/${d.getFullYear()}`;
		//myDate += ` ${HOURSTR[d.getHours()]}:${MINUTESTR[d.getMinutes()]}`;
		let isBilling = (p.treatment !== "");
		let myInfo = "";
		let tmp = props.patientArray.find(x => x.pid === p.pid);
		let myName = tmp.displayName;
		for(let i=0; i<p.treatmentDetails.length; ++i) {
			myInfo += p.treatmentDetails[i].name + ": "+p.treatmentDetails[i].amount + "<br />";
		}
		let myMode = "-";
		if ((p.paymentMode) && (p.paymentMode !== ""))
			myMode =  p.paymentMode;
		let myDesc = (p.description !== "") ? p.description : "Payment by patient"
		//console.log(myMode);
		//console.log(myDesc);
		return (
			<Grid  key={"PAY"+index} container alignItems="center" align="center">
			<Grid item align="left" xs={2} sm={2} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2}>{myDate}</Typography>
			</Grid>
			<Grid item align="left" xs={4} sm={4} md={3} lg={3} >
			<Typography className={gClasses.patientInfo2}>{myName}</Typography>
			</Grid>
			<Grid item align="left" xs={4} sm={4} md={4} lg={4} >
				<Typography >
				<span className={gClasses.patientInfo2}>{myDesc}</span>
				{(isBilling) &&
					<span align="left"
						data-for={"TREAT"+p.tid}
						data-tip={myInfo}
						data-iscapture="true"
					>
					<InfoIcon color="primary" size="small"/>
					</span>
				}
				</Typography>
			</Grid>
			<Grid item align="center" xs={1} sm={1} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2}>{myMode}</Typography>
			</Grid>
			<Grid item align="right" xs={1} sm={1} md={1} lg={1} >
				{(p.amount <= 0) &&
				<Typography className={gClasses.patientInfo2}>{INR+Math.abs(p.amount)}</Typography>
				}
			</Grid>
			<Grid item align="right" xs={1} sm={1} md={1} lg={1} >
				{(p.amount > 0) &&
				<Typography className={gClasses.patientInfo2}>{INR+p.amount}</Typography>
				}
			</Grid>
			<Grid item xs={1} sm={1} md={1} lg={1} >
				{(!isBilling) &&
				<div>
					{(!_edit) &&  
						<EditIcon color="primary" size="small" onClick={() =>  props.handleEdit(p)}  />
					}
					{(!_cancel) &&  
						<CancelIcon color="secondary" size="small" onClick={() =>  props.handleCancel(p)}  />
					}
				</div>
				}
			</Grid>
			</Grid>
		)}
		)}
		<Grid  key={"SUM"} container alignItems="center" align="center">
			<Grid item align="right" xs={9} sm={9} md={9} lg={9} >
				<Typography className={gClasses.patientInfo2Green}>{"Grand Total"}</Typography>
			</Grid>
			<Grid item align="right" xs={1} sm={1} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2Green}>{INR+myBilling}</Typography>
			</Grid>
			<Grid item align="right" xs={1} sm={1} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2Green}>{INR+myCollection}</Typography>
			</Grid>
		</Grid>
		</div>
		</Box>
		<DisplayAllToolTips profChargeArray={props.profChargeArray} />
		</div>
)}

export function DisplayAllToolTips(props) {
	let myArray = props.profChargeArray.filter(x => x.treatment !== "");
	return(
		<div>
		{myArray.map( t =>
			<ReactTooltip type="info" effect="float" id={"TREAT"+t.tid} multiline={true}/>
		)}
		</div>
	)}	

export function DisplayMemberHeader(props) {
const gClasses = globalStyles();	
let patRec = props.member;
return (
<Box  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1}>
<Grid className={gClasses.noPadding} key="AllPatients" container align="left">
	<Grid key={"PAT0"} item xs={12} sm={6} md={4} lg={4} >
		<Typography>
			<span className={gClasses.patientInfo2Green}>{patRec.title+" "+patRec.lastName+" "+patRec.firstName+" "+patRec.middleName}</span>
		</Typography>
	</Grid>
</Grid>	
</Box>
)}	

	