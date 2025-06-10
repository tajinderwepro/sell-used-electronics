import React from 'react'
import { useColorClasses } from '../../theme/useColorClasses';
import {PROJECT_NAME} from '../../constants/index'
function Footer() {
      const COLOR_CLASSES = useColorClasses();
      return (
            <footer
                  className={`w-full text-center text-sm py-6 border-t ${COLOR_CLASSES.borderGray200} ${COLOR_CLASSES.textSecondary}`}
            >
                  © {new Date().getFullYear()} {PROJECT_NAME}. All rights reserved.
            </footer>
      )
}

export default Footer