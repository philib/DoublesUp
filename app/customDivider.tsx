import React, {ReactNode} from "react";
import {Divider} from "@mui/material";

export const CustomDivider: React.FC<{ children?: ReactNode }> = (props) => (
    <Divider style={{marginTop: '20px', marginBottom: '20px'}}>{props.children}</Divider>)
