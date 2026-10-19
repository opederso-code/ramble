import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { legMinutes, stops, tour } from '@/data/lantern-loop';
import { font, theme } from '@/constants/theme';
import type { Phase } from '@/lib/ramble-store';

type Props = {
  phase: Phase;
  index: number;
  walkT: number;
  noticed: Record<string, boolean>;
  onPrimary: () => void;
  onToggleNotice: (id: string) => void;
  onBackHome: () => void;
};

export function StopPanel({
  phase,
  index,
  walkT,
  noticed,
  onPrimary,
  onToggleNotice,
  onBackHome,
}: Props) {
  const stop = stops[index] ?? stops[0];
  const next = stops[index + 1];

  return (
    <View style={styles.stack}>
      {phase === 'ready' ? <Overview onPrimary={onPrimary} /> : null}
      {phase === 'walking' && stop && next ? (
        <Walking stopName={next.name} from={stop} minutes={legMinutes(index)} walkT={walkT} />
      ) : null}
      {phase === 'at-stop' && stop ? (
        <AtStop
          stop={stop}
          index={index}
          noticed={!!noticed[stop.id]}
          nextName={next?.name ?? null}
          onPrimary={onPrimary}
          onToggleNotice={() => onToggleNotice(stop.id)}
        />
      ) : null}
      {phase === 'done' ? <Done onPrimary={onPrimary} onBackHome={onBackHome} /> : null}
    </View>
  );
}

function Overview({ onPrimary }: { onPrimary: () => void }) {
  return (
    <View style={styles.stack}>
      <Text style={styles.kicker}>{tour.kicker}</Text>
      <Text style={styles.title}>{tour.title}</Text>
      <Text style={styles.place}>{tour.place}</Text>
      <Text style={styles.body}>{tour.summary}</Text>
      <View style={styles.list}>
        {stops.map((stop, index) => (
          <View key={stop.id} style={styles.listRow}>
            <View style={styles.badge}>
              <Text style={styles.listIndex}>{index + 1}</Text>
            </View>
            <View style={styles.listCopy}>
              <Text style={styles.listName}>{stop.name}</Text>
              <Text style={styles.listMeta}>{stop.minutes === 0 ? 'Start' : `${stop.minutes} min`}</Text>
            </View>
          </View>
        ))}
      </View>
      <Button label="Begin at the clock" onPress={onPrimary} />
      <Text style={styles.hint}>On this preview, Walk carries you to the next stop.</Text>
    </View>
  );
}

function AtStop({
  stop,
  index,
  noticed,
  nextName,
  onPrimary,
  onToggleNotice,
}: {
  stop: (typeof stops)[number];
  index: number;
  noticed: boolean;
  nextName: string | null;
  onPrimary: () => void;
  onToggleNotice: () => void;
}) {
  return (
    <View style={styles.stack}>
      <Text style={styles.kicker}>
        Stop {index + 1} of {stops.length} · {stop.minutes === 0 ? 'Start' : `${stop.minutes} min`}
      </Text>
      <Text style={styles.title}>{stop.name}</Text>
      {stop.paragraphs.map((paragraph) => (
        <Text key={paragraph} selectable style={styles.body}>
          {paragraph}
        </Text>
      ))}
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: noticed }}
        onPress={onToggleNotice}
        style={[styles.notice, noticed && styles.noticeOn]}
      >
        <View style={[styles.check, noticed && styles.checkOn]}>
          {noticed ? <Text style={styles.checkMark}>✓</Text> : null}
        </View>
        <View style={styles.noticeCopy}>
          <Text style={styles.noticeLabel}>{noticed ? 'Noted' : 'Look for'}</Text>
          <Text style={styles.noticeText}>{stop.lookFor}</Text>
        </View>
      </Pressable>
      <Button label={nextName ? `Walk to ${nextName}` : 'Finish the ramble'} onPress={onPrimary} />
      {index > 0 ? <Text style={styles.hint}>Tap a stop you have already reached to hear it again.</Text> : null}
    </View>
  );
}

function Walking({
  stopName,
  from,
  minutes,
  walkT,
}: {
  stopName: string;
  from: (typeof stops)[number];
  minutes: number;
  walkT: number;
}) {
  return (
    <View style={styles.stack}>
      <Text style={styles.kicker}>Walking</Text>
      <Text style={styles.title}>Toward {stopName}</Text>
      <Text style={styles.place}>
        {minutes} min · {from.nextGrade}
      </Text>
      <Text style={styles.body}>{from.cue}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.round(walkT * 100)}%` }]} />
      </View>
      <Button label="On the way…" onPress={() => {}} disabled />
    </View>
  );
}

function Done({ onPrimary, onBackHome }: { onPrimary: () => void; onBackHome: () => void }) {
  return (
    <View style={styles.stack}>
      <Text style={styles.kicker}>Loop complete</Text>
      <Text style={styles.title}>You closed the loop.</Text>
      <Text style={styles.body}>
        Six stops, {tour.distance}, from the clock by the water to the bench that looks back at it. The harbor is a
        different height than when you started.
      </Text>
      <View style={styles.list}>
        {stops.map((stop) => (
          <View key={stop.id} style={styles.listRow}>
            <View style={[styles.badge, styles.badgeDone]}>
              <Text style={styles.listIndexDone}>✓</Text>
            </View>
            <View style={styles.listCopy}>
              <Text style={styles.listName}>{stop.name}</Text>
              <Text style={styles.listMeta}>{stop.minutes} min</Text>
            </View>
          </View>
        ))}
      </View>
      <Button label="Ramble again" onPress={onPrimary} />
      <Button label="Back home" onPress={onBackHome} tone="quiet" />
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 14,
  },
  kicker: {
    fontFamily: font.semibold,
    fontSize: 13,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: theme.terracottaDeep,
  },
  title: {
    fontFamily: font.display,
    fontSize: 36,
    lineHeight: 40,
    color: theme.ink,
  },
  place: {
    fontFamily: font.medium,
    fontSize: 16,
    color: theme.inkSoft,
    marginTop: -6,
  },
  body: {
    fontFamily: font.body,
    fontSize: 17,
    lineHeight: 26,
    color: theme.ink,
  },
  hint: {
    fontFamily: font.body,
    fontSize: 14,
    lineHeight: 20,
    color: theme.inkSoft,
  },
  list: {
    gap: 8,
    marginVertical: 4,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.paperDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeDone: {
    backgroundColor: theme.mossSoft,
  },
  listIndex: {
    fontFamily: font.semibold,
    color: theme.ink,
    fontSize: 13,
  },
  listIndexDone: {
    fontFamily: font.semibold,
    color: theme.moss,
    fontSize: 13,
  },
  listCopy: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.line,
    paddingBottom: 8,
  },
  listName: {
    fontFamily: font.medium,
    fontSize: 16,
    color: theme.ink,
    flexShrink: 1,
  },
  listMeta: {
    fontFamily: font.body,
    fontSize: 14,
    color: theme.inkSoft,
  },
  notice: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: theme.paperDeep,
    alignItems: 'flex-start',
  },
  noticeOn: {
    backgroundColor: theme.mossSoft,
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: theme.inkSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkOn: {
    backgroundColor: theme.moss,
    borderColor: theme.moss,
  },
  checkMark: {
    color: '#FFFBF6',
    fontSize: 13,
    fontFamily: font.semibold,
    lineHeight: 16,
  },
  noticeCopy: {
    flex: 1,
    gap: 2,
  },
  noticeLabel: {
    fontFamily: font.semibold,
    fontSize: 13,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: theme.moss,
  },
  noticeText: {
    fontFamily: font.body,
    fontSize: 15,
    lineHeight: 22,
    color: theme.ink,
  },
  track: {
    height: 6,
    borderRadius: 99,
    backgroundColor: theme.paperDeep,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: theme.terracotta,
  },
});
