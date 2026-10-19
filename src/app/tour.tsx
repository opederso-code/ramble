import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RouteMap } from '@/components/route-map';
import { StopPanel } from '@/components/stop-panel';
import { stops, tour } from '@/data/lantern-loop';
import { font, theme } from '@/constants/theme';
import {
  begin,
  cancelWalk,
  completeWalk,
  finish,
  jumpTo,
  replay,
  startWalk,
  toggleNoticed,
  useRamble,
  type Phase,
} from '@/lib/ramble-store';

export default function TourScreen() {
  const ramble = useRamble();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const wide = width >= 980;
  const anim = useRef(new Animated.Value(0)).current;
  const [walkT, setWalkT] = useState(0);

  useEffect(() => {
    return () => cancelWalk();
  }, []);

  useEffect(() => {
    if (ramble.phase !== 'walking') return undefined;

    let cancelled = false;
    anim.setValue(0);
    setWalkT(0);
    const listener = anim.addListener(({ value }) => {
      if (!cancelled) setWalkT(value);
    });
    const timing = Animated.timing(anim, {
      toValue: 1,
      duration: 2600,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: false,
    });
    timing.start(({ finished }) => {
      if (!finished || cancelled) return;
      completeWalk();
    });

    return () => {
      cancelled = true;
      anim.stopAnimation();
      anim.removeListener(listener);
    };
  }, [anim, ramble.index, ramble.phase]);

  const onPrimary = () => {
    if (ramble.phase === 'ready') begin();
    else if (ramble.phase === 'done') replay();
    else if (ramble.phase === 'at-stop' && ramble.index === stops.length - 1) finish();
    else if (ramble.phase === 'at-stop') startWalk();
  };

  const goHome = () => {
    router.push('/');
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 12 }]}>
      <View style={styles.top}>
        <Pressable accessibilityRole="link" hitSlop={16} style={styles.backHit} onPress={goHome}>
          <Text style={styles.back}>Home</Text>
        </Pressable>
        <View style={styles.topCopy}>
          <Text style={styles.topTitle}>{tour.title}</Text>
          <Text style={styles.topSub}>{subtitle(ramble.phase, ramble.index)}</Text>
        </View>
      </View>
      <Progress phase={ramble.phase} index={ramble.index} maxReached={ramble.maxReached} />
      <View style={[styles.body, wide && styles.bodyWide]}>
        <View style={[styles.mapPane, wide && styles.mapPaneWide]}>
          <RouteMap
            activeIndex={ramble.phase === 'ready' ? -1 : ramble.index}
            maxReached={ramble.maxReached}
            walking={ramble.phase === 'walking'}
            walkT={walkT}
            done={ramble.phase === 'done'}
            onSelectStop={jumpTo}
          />
        </View>
        <ScrollView
          style={styles.story}
          contentContainerStyle={styles.storyContent}
          showsVerticalScrollIndicator={false}
        >
          <StopPanel
            phase={ramble.phase}
            index={ramble.index}
            walkT={walkT}
            noticed={ramble.noticed}
            onPrimary={onPrimary}
            onToggleNotice={toggleNoticed}
            onBackHome={goHome}
          />
        </ScrollView>
      </View>
    </View>
  );
}

function subtitle(phase: Phase, index: number) {
  if (phase === 'ready') return `${tour.place} · ${stops.length} stops`;
  if (phase === 'done') return 'Loop complete';
  if (phase === 'walking') {
    const next = stops[index + 1];
    return next ? `Walking to ${next.name}` : 'Walking';
  }
  return `Stop ${index + 1} of ${stops.length}`;
}

function Progress({ phase, index, maxReached }: { phase: Phase; index: number; maxReached: number }) {
  return (
    <View style={styles.rail}>
      {stops.map((stop, stopIndex) => {
        const current = phase !== 'ready' && phase !== 'done' && stopIndex === index;
        const filled =
          phase === 'done' || (phase !== 'ready' && !current && stopIndex <= maxReached && stopIndex !== index);
        return (
          <View
            key={stop.id}
            style={[
              styles.railSeg,
              filled && styles.railFilled,
              current && styles.railCurrent,
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.paper,
    paddingHorizontal: 18,
    gap: 12,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backHit: {
    paddingVertical: 6,
  },
  back: {
    fontFamily: font.semibold,
    fontSize: 15,
    color: theme.ink,
  },
  topCopy: {
    flex: 1,
    gap: 2,
  },
  topTitle: {
    fontFamily: font.display,
    fontSize: 22,
    color: theme.ink,
  },
  topSub: {
    fontFamily: font.medium,
    fontSize: 14,
    color: theme.inkSoft,
  },
  rail: {
    flexDirection: 'row',
    gap: 6,
  },
  railSeg: {
    flex: 1,
    height: 4,
    borderRadius: 99,
    backgroundColor: theme.line,
  },
  railFilled: {
    backgroundColor: theme.moss,
  },
  railCurrent: {
    backgroundColor: theme.terracotta,
  },
  body: {
    flex: 1,
    minHeight: 0,
    gap: 8,
  },
  bodyWide: {
    flexDirection: 'row',
    gap: 28,
    alignItems: 'stretch',
  },
  mapPane: {
    alignItems: 'center',
  },
  mapPaneWide: {
    flex: 1.1,
    justifyContent: 'center',
  },
  story: {
    flex: 1,
    minWidth: 0,
  },
  storyContent: {
    paddingBottom: 24,
    maxWidth: 560,
    width: '100%',
    alignSelf: 'center',
  },
});
