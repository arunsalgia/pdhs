require('dotenv').config()
express = require('express');
path = require('path');
cookieParser = require('cookie-parser');
//logger = require('morgan');
mongoose = require("mongoose");
cors = require('cors');
//fetch = require('node-fetch');
_ = require("lodash");
cron = require('node-cron');
nodemailer = require('nodemailer');
crypto = require('crypto');
//Razorpay = require("razorpay");
//docx = require("docx");
fs = require('fs');
axios = require('axios');
pin = require('pincode');

//multer = require('multer');
readXlsxFile = require('read-excel-file');


app = express();

PRODUCTION=(process.env.PRODUCTION.toUpperCase() === "TRUE");   
WEB=(process.env.WEB.toUpperCase() === "TRUE");   
console.log("Prod", PRODUCTION);
console.log("Web", WEB);

PASSWORDLINKVALIDTIME=10			// Password link valid time in minutes


//
BASELINK='http://localhost:3000';
if (PRODUCTION) {
	console.log("Using cloud  base  link");
  BASELINK='https://pdhsamaj.herokuapp.com';
} else {
	console.log("Using local base  link");
  BASELINK='http://localhost:3000';
}
console.log(BASELINK);
ARCHIVEDIR= (PRODUCTION) ? "public/" : "public/" ;       // binary will be stored here

PORT = process.env.PORT || 4000;
//VISITTYPE = {pending: 'pending', cancelled: 'cancelled', over: 'over', expired: 'expired'};


http = require('http');
httpServer = http.createServer(app);
io = require('socket.io')(httpServer, {
  handlePreflightRequest: (req, res) => {
    const headers = {
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
      "Access-Control-Allow-Credentials": true
    };
    res.writeHead(200, headers);
    res.end();
  }

});

// Routers
router = express.Router();
indexRouter = require('./routes/index');
usersRouter = require('./routes/user');
memberRouter = require('./routes/member');
hodRouter = require('./routes/hod');
importRouter = require('./routes/import');


/*
//medicineRouter = require('./routes/medicine');
//patientRouter = require('./routes/patient');
//visitRouter = require('./routes/visit');
//holidayRouter = require('./routes/holiday');
//appointmentRouter = require('./routes/appointment');
//infoRouter = require('./routes/info');
//quoteRouter = require('./routes/quote');
//customerRouter = require('./routes/customer');
//imageRouter = require('./routes/image');
//walletRouter = require('./routes/wallet');
//doctorRouter = require('./routes/doctor');
noteRouter = require('./routes/note');
remarkRouter = require('./routes/remark');
diagnosisRouter = require('./routes/diagnosis');
symptomRouter = require('./routes/symptom');
investigationRouter = require('./routes/investigation');
treattypeRouter = require('./routes/treattype');
dentalTreatmentRouter = require('./routes/dentaltreatment');
profChargeRouter = require('./routes/profcharge');
docxRouter = require('./routes/docx');
addOnRouter = require('./routes/addon');
doctorTypeRouter = require('./routes/doctortype')

razorRouter = require('./routes/razor');

*/

app.set('view engine', 'html');
//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'PDHS', 'build')));
app.use(express.json());


app.use((req, res, next) => {
  if (req.url.includes("admin") || 
      req.url.includes("signIn") ||
      req.url.includes("Logout") ||
      req.url.includes("pdhsamaj")
    ){
    //req.url = "/";
    //res.redirect('/');
    console.log("Path is ", req.url);
    res.sendFile(path.resolve(__dirname, 'PDHS', 'build', 'index.html'));
  }
  else {
    next();
  }
});

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/member', memberRouter);
app.use('/hod', hodRouter);
app.use('/import', importRouter);

/*
app.use('/medicine', medicineRouter);
app.use('/patient', patientRouter);
app.use('/visit', visitRouter);
app.use('/holiday', holidayRouter);
app.use('/appointment', appointmentRouter);
app.use('/info', infoRouter);
app.use('/quote', quoteRouter);
app.use('/customer', customerRouter);
app.use('/image', imageRouter);
app.use('/wallet', walletRouter);
app.use('/doctor', doctorRouter); 
app.use('/razor', razorRouter); 
app.use('/note', noteRouter);
app.use('/remark', remarkRouter);
app.use('/diagnosis', diagnosisRouter);
app.use('/symptom', symptomRouter);
app.use('/investigation', investigationRouter);
app.use('/treattype', treattypeRouter);
app.use('/dentaltreatment', dentalTreatmentRouter);
app.use('/profcharge', profChargeRouter);
app.use('/docx', docxRouter);
app.use('/addon', addOnRouter);
app.use('/doctortype', doctorTypeRouter);
*/


/* 
	Old schema
MedicineSchema = mongoose.Schema({
	id: String,
	name: String,
	enabled: Boolean,
	cid: String,
});

NoteSchema = mongoose.Schema({
	id: String,
	name: String,
	enabled: Boolean,
	cid: String,
});

RemarkSchema = mongoose.Schema({
	id: String,
	name: String,
	enabled: Boolean,
	cid: String,
});

DiagnosisSchema = mongoose.Schema({
	id: String,
	name: String,
	enabled: Boolean,
	cid: String,
});

SymptomSchema = mongoose.Schema({
	id: String,
	name: String,
	enabled: Boolean,
	cid: String,
});


MasterSettingsSchema = mongoose.Schema ({
  msId: Number,
  msKey: String,
  msValue: String
  //trialExpiry: String,
})


TreatTypeSchema = mongoose.Schema({
	id: String,
	name: String,
	enabled: Boolean,
	cid: String,
});

PatientSchema = mongoose.Schema({
  pid: Number,
	pidStr: String,
  name: String,
  displayName: String,
  email: String,
  mobile: String,
	gender: String,
	age: Number,
	dob: Date,
	enabled: Boolean,
	cid: String,
});

VisitSchema = mongoose.Schema({
  pid: Number,
	displayName: String,
	visitNumber: Number,
	visitDate: Date,
	medicines: [{name: String, dose1: Number, dose2: Number, dose3: Number, time: Number, unit: String}],
	userNotes: [{name: String}],
	remarks: [{name: String}],
	//info: [{name: String}],
	enabled: Boolean,
	//appointment: String,	// store appointment _id. If unscheduled visit then it is blank
	nextVisitTime: Number,
	nextVisitUnit: String,
	cid: String,
});


InvestigationSchema = mongoose.Schema({
  pid: Number,
	investigationNumber: Number,
	investigationDate: Date,
	symptom: [{name: String}],
	diagnosis: [{name: String}],
	enabled: Boolean,
	cid: String,
});


DentalTreatmentSchema = mongoose.Schema({
	cid: String,
  pid: Number,
	treatmentNumber: Number,
	treatmentDate: Date,
	treatment: [{name: String, amount: Number, toothArray: [Number] }],
	enabled: Boolean,
});

NextVisitSchema = mongoose.Schema({
  pid: Number,
	nextVisitDate: Date,
	cid: String,
	enabled: Boolean,
});

ProfessionalChargesSchema = mongoose.Schema({
	cid: String,
  pid: Number,
	tid: Number,
	treatment: String,			// id of treatment record will be stored
	description: String,
	treatmentDetails: [{name: String, amount: Number}],
	date: Date,
	amount: Number,
	paymentMode: String,
	enabled: Boolean,
});

HolidaySchema = mongoose.Schema({
  date: Number,
	month: Number,
	year: Number,
	holidayDate: Date,
	desc: String,
	cid: String,
});

AppointmentSchema = mongoose.Schema({
	//data: {},
	year: Number,
	month: Number,
	date: Number,
	hour: Number,
	minute: Number,
	order: Number,
	pid: Number,
	displayName: String,
	apptTime: Date,
	visit: String,	// be be visit Id. Else it will be pending cancelled.
	cid: String,
});

// 1 info record per person
// info field will have multiple entry.
// will take entry from InfoDb schema
InfoSchema = mongoose.Schema({
	pid: Number,
	info: [{name: String}],
	enabled: Boolean,
	cid: String,
});

InfoDbSchema = mongoose.Schema({
	id: String,
	name: String,
	enabled: Boolean,
	cid: String,
});

QuoteSchema = mongoose.Schema({
	sequence: Number,
	qid: String,
	author: String,
	category: String,
	quote: String,
});

CustomerSchema = mongoose.Schema({
	customerNumber: Number,
	// Doctors details
	name: String,
	type: String,
	email: String,
	mobile: String,
	// Clinic details
	doctorName: String,
	clinicName: String,
	addr1: String,
	addr2: String,
	addr3: String,
	location: String,
	pinCode: String,
	workingHours: [Number], // clinic weekly working slots (15 minute slots
	
	// 
	commission: Number,			// commission for each referral recharge
	referenceCid: String,		// the reference of doctor who made this customer join

	welcomeMessage: String,
	plan: String,
	fee: Number,
	expiryDate: Date,
	enabled:Boolean,
});


ImageSchema = mongoose.Schema({
	cid: 		String,
	pid:		Number,
	displayName: String,
	title: 	String,
	name:		String,
	desc: 	String,
	type:		String,
	date:		Date,
	image: 	{ data: Buffer, contentType: String }
});

WalletSchema = mongoose.Schema({
  cid: String,
  isWallet: Boolean,
  transNumber: Number,
  transDate: Date,
  transType: String,
  transSubType: String,
  transLink: Number,
  amount: Number,
  transStatus: Boolean,
})

PaymentSchema = mongoose.Schema({
  cid: String,
  email: String,
  amount: Number,
  status: String,
  requestId: String,
  requestTime: Date,
  paymentId: String,
  paymentTime: Date,
  fee: Number,
});

DoctorTypeSchema = mongoose.Schema({
	dtin: Number,
	name: String,
	enabled: Boolean
});

AddOnSchema = mongoose.Schema({
	aid: Number,
	name: String,
	// Which doctor type can use this add on
	// 0xFFFFFFFF indicate all types of doctors
	doctorType: Number,			
	enabled: Boolean
});

	*/

//Schema

UserSchema = mongoose.Schema({
  uid: Number,
  userName: String,
  displayName: String,
  password: String,
  status: Boolean,
  email: String,
  userType: String,
  mobile: String,
	cid: String,
});

//--- Medicine structure






HodSchema = mongoose.Schema({
	hid: Number,
	mid: Number,
	gotra: String,
	village: String,
	resAddr1: String,
	resAddr2: String,
	resAddr3: String,
	resAddr4: String,
	resAddr5: String,
	resAddr6: String,
	suburb: String,
	city: String,
	pinCode: Number,
	district: String,
	state: String,
	resPhone1: String,
	resPhone2: String
});

MemberSchema = mongoose.Schema({
	hid: Number,
	order: Number,
	mid: Number,
	title: String,
	lastName: String,
	firstName: String,
	middleName: String,
	alias: String,
	relation: String,
	gender: String,
	dob: Date,
	bloodGroup: String,
	emsStatus: String,
	education: String,
	educationLevel: String,
	educationCategory: String,
	educationField: String,
	occupation: String,
	mobile: String,
	email: String,
	officeName: String,
	officeAddr1: String,
	officeAddr2: String,
	officePhone: String,
	mobile1: String,
	email1: String,
	ceased: Boolean,
	ceasedDate: Date,
})

/*
M_Medicine = mongoose.model('Medicine', MedicineSchema);
M_Note = mongoose.model('Note', NoteSchema);
M_Remark = mongoose.model('Remark', RemarkSchema);
M_MasterSetting = mongoose.model("MasterSetting", MasterSettingsSchema)
M_Patient = mongoose.model('Patient', PatientSchema);
M_Visit = mongoose.model('Visit', VisitSchema);
M_Holiday = mongoose.model('Holiday', HolidaySchema);
M_Appointment = mongoose.model('Appointment', AppointmentSchema);
M_Info = mongoose.model('Info', InfoSchema);
M_Quote = mongoose.model('Quote', QuoteSchema);
M_Customer = mongoose.model('Customer', CustomerSchema);
M_NextVisit = mongoose.model('NextVisit', NextVisitSchema);
M_Image = mongoose.model('image', ImageSchema);
M_Wallet = mongoose.model('wallet', WalletSchema);
M_Diagnosis = mongoose.model('diagnosis', DiagnosisSchema);
M_Symptom = mongoose.model('symptoms', SymptomSchema);
M_Treattype = mongoose.model('treattype', TreatTypeSchema);
M_DentalTreatment = mongoose.model('dentaltreatment', DentalTreatmentSchema);
M_ProfCharge = mongoose.model('profcharge', ProfessionalChargesSchema);
M_Investigation = mongoose.model('investigations', InvestigationSchema);
M_Payment = mongoose.model('payment', PaymentSchema);
M_AddOn = mongoose.model('addon', AddOnSchema);
M_DoctorType = mongoose.model('doctortype', DoctorTypeSchema);

*/


// models
User = mongoose.model("user", UserSchema);

M_Hod = mongoose.model('hod', HodSchema);
M_Member = mongoose.model('member', MemberSchema);

router = express.Router();

db_connection = false;      // status of mongoose connection
connectRequest = true;

// constant used by routers
minutesIST = 330;    // IST time zone in minutes 330 i.e. GMT+5:30
minutesDay = 1440;   // minutes in a day 24*60 = 1440
MONTHNAME = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
weekDays = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
weekShortDays = new Array("Sun", "Mon", "Tue", "Wedn", "Thu", "Fri", "Sat");


SENDRES = 1;        // send OK response
SENDSOCKET = 2;     // send data on socket

// Error messages
DBERROR = 990;
DBFETCHERR = 991;
CRICFETCHERR = 992;
ERR_NODB = "No connection to CricDream database";

allUSER = 99999999;
serverTimer = 0;
CUSTMF=100000000;
// make mongoose connection

// Create the database connection 
if (WEB) {
	mongoose.connect(process.env.MONGOCONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });
} else {
	db_connection = true;
  connectRequest = true;
}
// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
  //console.log('Mongoose default connection open to ' + process.env.MONGOCONNECTION);
	console.log('Database connection success');
  db_connection = true;
  connectRequest = true;
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
  console.log('Database default connection error');
  console.log(err);
  db_connection = false;
  connectRequest = false;   // connect request refused
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
  db_connection = false;
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function () {
  // close mongoose connection
  mongoose.connection.close(function () {
    console.log('Database default connection disconnected through app termination');
  });
  process.exit(0);
});

// schedule task
if (WEB) {
  cron.schedule('*/15 * * * * *', () => {
    // console.log('running every 15 second');
    // console.log(`db_connection: ${db_connection}    connectREquest: ${connectRequest}`);
    if (!connectRequest)
      mongoose.connect(process.env.MONGOCONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });
  });
}


// start app to listen on specified port
httpServer.listen(PORT, () => {
  console.log("Server is running on Port: " + PORT);
});


// global functions

const AMPM = [
  "AM", "AM", "AM", "AM", "AM", "AM", "AM", "AM", "AM", "AM", "AM", "AM",
  "PM", "PM", "PM", "PM", "PM", "PM", "PM", "PM", "PM", "PM", "PM", "PM"
];
  /**
 * @param {Date} d The date
 */
const TZ_IST={hours: 5, minutes: 30};
cricDate = function (d)  {
  var xxx = new Date(d.getTime());
  xxx.setHours(xxx.getHours()+TZ_IST.hours);
  xxx.setMinutes(xxx.getMinutes()+TZ_IST.minutes);
  var myHour = xxx.getHours();
  var myampm = AMPM[myHour];
  if (myHour > 12) myHour -= 12;
  var tmp = `${MONTHNAME[xxx.getMonth()]} ${("0" + xxx.getDate()).slice(-2)} ${("0" + myHour).slice(-2)}:${("0" +  xxx.getMinutes()).slice(-2)}${myampm}`
  return tmp;
}


EMAILERROR="";
APLEMAILID='cricketpwd@gmail.com';

WEEKSTR = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];SHORTWEEKSTR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
MONTHSTR = ["January", "February", "March", "April", "May", "June",
						"July", "August", "September", "October", "November", "December"];	
						
SHORTMONTHSTR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oc", "Nov", "Dec"];	

HOURSTR = [
"00", 
"01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
"11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
"21", "22", "23"
];

MINUTESTR = [
"00", "01", "02", "03", "04", "05", "06", "07", "08", "09",
"10", "11", "12", "13", "14", "15", "16", "17", "18", "19",
"20", "21", "22", "23", "24", "25", "26", "27", "28", "29", 
"30", "31", "32", "33", "34", "35", "36", "37", "38", "39", 
"40", "41", "42", "43", "44", "45", "46", "47", "48", "49", 
"50", "51", "52", "53", "54", "55", "56", "57", "58", "59"
];

MINUTEBLOCK=[0, 15, 30, 45];

DATESTR = [
"00",
"01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
"11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
"21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
"31"							
];

//in date function 0 represents JAN I.e. month number 1
MONTHNUMBERSTR = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]

HOURSTR = [
"00", 
"01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
"11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
"21", "22", "23"
];

MINUTESTR = [
"00", "01", "02", "03", "04", "05", "06", "07", "08", "09",
"10", "11", "12", "13", "14", "15", "16", "17", "18", "19",
"20", "21", "22", "23", "24", "25", "26", "27", "28", "29", 
"30", "31", "32", "33", "34", "35", "36", "37", "38", "39", 
"40", "41", "42", "43", "44", "45", "46", "47", "48", "49", 
"50", "51", "52", "53", "54", "55", "56", "57", "58", "59"
];

// module.exports = app;
ALLDOCTORS = 0xFFFFFFFF;

MAGICNUMBER = 99999;

FAMILYMF = 1000;