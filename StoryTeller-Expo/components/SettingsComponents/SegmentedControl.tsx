import RNSegmentedControl from '@react-native-segmented-control/segmented-control';

export function SegmentedControl(props: React.ComponentPropsWithoutRef<typeof RNSegmentedControl>) {
  return (
    <RNSegmentedControl
      backgroundColor={'rgba(255, 255, 255, 0.3)'}
      activeFontStyle={{ color: 'rgba(0, 0, 0, 1)' }}
      tintColor={'rgba(255, 255, 255, 0.8)'}
      {...props}
    />
  );
}
