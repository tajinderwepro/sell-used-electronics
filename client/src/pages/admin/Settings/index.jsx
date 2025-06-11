import React, { useState } from 'react';
import { useColorClasses } from '../../../theme/useColorClasses';
import Heading from '../../../components/ui/Heading';
import ShipmentAddress from '../../../components/common/ShipmentAddress';

function Settings() {
  const COLOR_CLASSES = useColorClasses();
  return (
    <div className={`min-h-screen ${COLOR_CLASSES.bgWhite}`}>
        <Heading className="text-start">Settings</Heading>
        <ShipmentAddress/>
    </div>
  );
}

export default Settings;
