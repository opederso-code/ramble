import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { font, theme } from '@/constants/theme';

export default function NotFound() {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>This path isn’t on the ramble.</Text>
      <Button label="Back to Ramble" onPress={() => router.push('/')} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.paper,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    padding: 24,
  },
  title: {
    fontFamily: font.display,
    fontSize: 32,
    color: theme.ink,
    textAlign: 'center',
  },
});
