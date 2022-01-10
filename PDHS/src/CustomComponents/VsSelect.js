import React from 'react';
import Typography from '@material-ui/core/Typography';
import globalStyles from "assets/globalStyles";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem';


export default function VsCheckBox(props) {
const gClasses = globalStyles();
let _align = (props.align == null) ? 'center' : props.align;
let _label = (props.label == null) ? "" : props.label;
let _field = (props.field == null) ? "" : props.field;
return (
	<div align={_align} >
	 <FormControlLabel labelPlacement="start"
		control={
		<Select labelId="demo-simple-select-label" id="demo-simple-select"
    	value={props.value}
			labelId="Gotra"
   		onChange={props.onChange}
		>
		{
		props.option.map(item => <MenuItem key={item.name} value={item.name}>{item.name}</MenuItem>)
		}
    </Select>
		} 
		label={<Typography className={gClasses.blueSelectLabel}>{_label} </Typography>}
		/>
	</div>
	)
}

