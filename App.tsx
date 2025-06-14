import React from 'react';
import { StatusBar } from 'react-native';

import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#fff" 
        translucent={false}
      />
      
      <AppNavigator />
    </>
  );
};

export default App;