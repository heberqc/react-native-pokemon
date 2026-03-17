import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

/**
 * Custom hook to calculate the number of columns based on the window width.
 * @returns {number} The calculated number of columns.
 */
export const useResponsiveColumns = (): number => {
  const { width } = useWindowDimensions();

  const numOfColumns = useMemo(() => {
    if (width < 375) {
      return 1;
    } else if (width < 600) {
      return 2;
    } else if (width < 900) {
      return 3;
    }
    return 4;
  }, [width]);

  return numOfColumns;
};
