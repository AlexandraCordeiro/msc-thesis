import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export default function ScrollableTabsButtonVisible({options, value, handleChange}) {

  return (
    <Box
      sx={{
        flexGrow: 1,
        maxWidth: 'fit-content',
        height: 'fit-content'
      }}
    >
      <Tabs
        orientation="vertical"
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons='auto'
        aria-label="visible arrows tabs example"
        sx={{
          [`& .${tabsClasses.scrollButtons}`]: {
            color:'black',
            '&.Mui-disabled': {opacity: 0.3}},
            '& .MuiTabs-indicator': {backgroundColor: '#8a4af3'},
            '& .Mui-selected': {color: '#8a4af3 !important'}
          }
        }
      >
        {options.map((option, i) => (
            <Tab
                key={option + i}
                sx={{fontFamily: 'dm sans', fontSize: '14px', fontWeight: '450'}}
                label={option}
                value={option}
            />

        ))}
      </Tabs>
    </Box>
  );
}