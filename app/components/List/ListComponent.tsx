import {Divider, List, ListItem, ListItemButton, styled, SxProps} from "@mui/material";
import React, {ReactNode} from "react";
import styles from '../../app.module.css'
import {CommonProps} from "@mui/material/OverridableComponent";

export const MyListSubHeader = styled('div')(({theme}) => ({
    position: 'sticky',
    top: 0,
    zIndex: 2,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
}))

export const MyList: React.FunctionComponent<{
    className?: string,
    children: ReactNode | ReactNode[],
    sx?: SxProps
}> = ({
          className,
          sx,
          children
      }) => {
    return <List className={`${styles.noScrollbar} ${className}`} disablePadding={true} sx={sx}>
        {children}
    </List>
}

export const MyListItem: React.FunctionComponent<{ children: ReactNode }> = ({children}) => {
    return <ListItem disablePadding={true}>
        {children}
    </ListItem>
}
export const MyListItemDivider: React.FunctionComponent = () => {
    return <Divider
        variant={"middle"}
        component={"li"}/>
}

export const MyListItemButton = styled(ListItemButton)