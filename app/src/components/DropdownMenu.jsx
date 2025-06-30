import * as React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from '@mui/base/Dropdown';
import { Menu } from '@mui/base/Menu';
import { MenuButton as BaseMenuButton } from '@mui/base/MenuButton';
import { MenuItem as BaseMenuItem, menuItemClasses } from '@mui/base/MenuItem';
import { fontWeight, styled, width } from '@mui/system';
import { CssTransition } from '@mui/base/Transitions';
import { PopupContext } from '@mui/base/Unstable_Popup';
import { IconButton, Select, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function DropdownMenu({options, handleTuneChange, selectedValue="Select a Tune"}) {
  const createHandleMenuClick = (menuItem, index) => {
    return () => {
      handleTuneChange(menuItem)
    };
  };

  return (
    <>
        
        <Dropdown>
        <MenuButton sx={{fontFamily: 'montserrat', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyItems: 'center'}}>
            <span className='button-text'>
              {selectedValue}
            </span>
            <KeyboardArrowDownIcon style={{fontWeight: 'normal'}}/>
        </MenuButton>
        <Menu slots={{ listbox: AnimatedListbox }} width="12px">
            {options.map((option, index) => (
                <MenuItem
                key={index}
                sx={{ fontFamily: 'Montserrat', fontSize: '14px', fontWeight: '450'}}
                value={option}
                onClick={createHandleMenuClick(option, index)}
                >
                {`${index + 1} - ${option}`}
                </MenuItem>

            ))}
        </Menu>
        </Dropdown>
    </>
  );
}

const purple = {
  50:  '#f6f0ff',
  100: '#e3d4fe',
  200: '#d1b9fd',
  300: '#be9dfb',
  400: '#b589fc',  // base purple
  500: '#a472f2',
  600: '#935cdc',
  700: '#7d45c4',
  800: '#6730a6',
  900: '#4e1f87',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const Listbox = styled('ul')(
  ({ theme }) => `
  font-family: 'montserrat', sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  padding: 6px;
  margin: auto;
  margin-top: 10px;  
  max-height: 250px;      
  width: 200px;
  border-radius: 12px;
  overflow: auto;
  outline: 0px;
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  box-shadow: 0px 4px 30px ${theme.palette.mode === 'dark' ? grey[900] : grey[200]};
  z-index: 3000;

  .closed & {
    opacity: 0;
    transform: scale(0.95, 0.8);
    transition: opacity 200ms ease-in, transform 200ms ease-in;
  }
  
  .open & {
    opacity: 1;
    transform: scale(1, 1);
    transition: opacity 100ms ease-out, transform 100ms cubic-bezier(0.43, 0.29, 0.37, 1.48);
  }

  .placement-top & {
    transform-origin: bottom;
  }

  .placement-bottom & {
    transform-origin: top;
  }
  `,
);

const AnimatedListbox = React.forwardRef(function AnimatedListbox(props, ref) {
  const { ownerState, ...other } = props;
  const popupContext = React.useContext(PopupContext);

  if (popupContext == null) {
    throw new Error(
      'The `AnimatedListbox` component cannot be rendered outside a `Popup` component',
    );
  }

  const verticalPlacement = popupContext.placement.split('-')[0];

  return (
    <CssTransition
      className={`placement-${verticalPlacement}`}
      enterClassName="open"
      exitClassName="closed"
    >
      <Listbox {...other} ref={ref} />
    </CssTransition>
  );
});

AnimatedListbox.propTypes = {
  ownerState: PropTypes.object.isRequired,
};

const MenuItem = styled(BaseMenuItem)(
  ({ theme }) => `
  list-style: none;
  padding: 8px;
  border-radius: 8px;
  cursor: default;
  user-select: none;


  &:last-of-type {
    border-bottom: none;
  }

  &.${menuItemClasses.focusVisible} {
    outline: 3px solid ${theme.palette.mode === 'dark' ? purple[600] : purple[200]};
    background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  }

  &.${menuItemClasses.disabled} {
    color: ${theme.palette.mode === 'dark' ? grey[700] : grey[400]};
  }

  &:hover:not(.${menuItemClasses.disabled}) {
    background-color: ${theme.palette.mode === 'dark' ? purple[900] : purple[50]};
    color: ${theme.palette.mode === 'dark' ? purple[100] : purple[900]};
  }
  `,
);

const MenuButton = styled(BaseMenuButton)(
  ({ theme }) => `
  font-family: 'montserrat', sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.5;
  padding: 8px 16px;
  height: 50px;
  width: 200px;
  border-radius: 8px;
  color: white;
  transition: all 150ms ease;
  cursor: pointer;
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
 /*  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]}; */
  color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;


  &:hover {
    background: ${theme.palette.mode === 'dark' ? purple[800] : purple[50]};
    border-color: ${theme.palette.mode === 'dark' ? purple[600] : purple[300]};
  }

  &:active {
    background: ${theme.palette.mode === 'dark' ? purple[700] : purple[100]};
  }

  &:focus-visible {
    box-shadow: 0 0 0 4px ${theme.palette.mode === 'dark' ? purple[300] : purple[200]};
    outline: none;
  }

  .button-text {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  `,
);
