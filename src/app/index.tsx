import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { Button } from '@/components/button';
import { RouteMap } from '@/components/route-map';
import { stops, tour } from '@/data/lantern-loop';
import { font, theme } from '@/constants/theme';
import { reset, useRamble } from '@/lib/ramble-store';

const steps = [
  'Begin under the ferry clock.',
  'Walk the hill. On this preview, the button moves you.',
  'The story at each stop opens when you arrive.',
];

export default function HomeScreen() {
  const ramble = useRamble();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const wide = width >= 960;
  const stop = stops[ramble.index];

  const cta =
    ramble.phase === 'done'
      ? 'Walk it again'
      : ramble.phase === 'ready'
        ? 'Open the ramble'
        : `Continue · ${stop?.name ?? 'the loop'}`;

  const status =
    ramble.phase === 'done'
      ? 'You finished this loop.'
      : ramble.phase === 'ready'
        ? 'Not started.'
        : `You're at stop ${ramble.index + 1} of ${stops.length}.`;

  const open = () => {
    if (ramble.phase === 'done') reset();
    router.push('/tour');
  };

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 28, paddingBottom: insets.bottom + 40 },
        wide && styles.contentWide,
      ]}
    >
      <View style={styles.copy}>
        <Text style={styles.mark}>Ramble</Text>
        <Text style={[styles.headline, !wide && styles.headlineNarrow]}>A tour that moves when you do.</Text>
        <Text style={styles.lede}>
          Self-guided walks. The route stays on the map, and the story at each stop stays shut until you get there.
        </Text>
        <View style={styles.steps}>
          {steps.map((step, index) => (
            <View key={step} style={styles.stepRow}>
              <Text style={styles.stepIndex}>{index + 1}</Text>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.note}>Port Meridian is a sample place, written for this demo.</Text>
      </View>

      <View style={[styles.card, wide && styles.cardWide]}>
        <Text style={styles.kicker}>{tour.kicker}</Text>
        <Text style={styles.cardTitle}>{tour.title}</Text>
        <Text style={styles.place}>{tour.place}</Text>
        <Text style={styles.blurb}>{tour.summary}</Text>
        <View style={styles.stats}>
          <Stat value={tour.stopsLabel} />
          <Stat value={tour.distance} />
          <Stat value={tour.duration} />
        </View>
        <Text style={styles.status}>{status}</Text>
        <Button label={cta} onPress={open} />
        <RouteMap
          compact
          activeIndex={ramble.phase === 'ready' ? -1 : ramble.index}
          maxReached={ramble.maxReached}
          walking={false}
          walkT={0}
          done={ramble.phase === 'done'}
        />
      </View>
    </ScrollView>
  );
}

function Stat({ value }: { value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statText}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.paper,
  },
  content: {
    paddingHorizontal: 22,
    gap: 28,
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
  },
  contentWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 48,
  },
  copy: {
    flex: 1,
    gap: 16,
    minWidth: 280,
  },
  mark: {
    fontFamily: font.semibold,
    fontSize: 14,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    color: theme.terracottaDeep,
  },
  headline: {
    fontFamily: font.display,
    fontSize: 52,
    lineHeight: 54,
    color: theme.ink,
    maxWidth: 520,
  },
  headlineNarrow: {
    fontSize: 40,
    lineHeight: 42,
  },
  lede: {
    fontFamily: font.body,
    fontSize: 18,
    lineHeight: 28,
    color: theme.ink,
    maxWidth: 460,
  },
  steps: {
    gap: 10,
    marginTop: 8,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    maxWidth: 460,
  },
  stepIndex: {
    fontFamily: font.semibold,
    color: theme.terracottaDeep,
    fontSize: 15,
    width: 16,
  },
  stepText: {
    flex: 1,
    fontFamily: font.body,
    fontSize: 16,
    lineHeight: 23,
    color: theme.ink,
  },
  note: {
    fontFamily: font.body,
    fontSize: 14,
    lineHeight: 20,
    color: theme.inkSoft,
    marginTop: 8,
  },
  card: {
    backgroundColor: theme.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: theme.line,
    padding: 18,
    gap: 12,
    width: '100%',
  },
  cardWide: {
    width: 400,
  },
  kicker: {
    fontFamily: font.semibold,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: theme.terracottaDeep,
  },
  cardTitle: {
    fontFamily: font.display,
    fontSize: 32,
    lineHeight: 36,
    color: theme.ink,
  },
  place: {
    fontFamily: font.medium,
    fontSize: 16,
    color: theme.inkSoft,
    marginTop: -6,
  },
  blurb: {
    fontFamily: font.body,
    fontSize: 15,
    lineHeight: 22,
    color: theme.ink,
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  stat: {
    backgroundColor: theme.paper,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statText: {
    fontFamily: font.medium,
    fontSize: 13,
    color: theme.ink,
  },
  status: {
    fontFamily: font.medium,
    fontSize: 14,
    color: theme.inkSoft,
  },
});
