import { useMemo } from 'react';
import { Platform, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Svg, { Circle, Path, Rect, Text as SvgText } from 'react-native-svg';

import { MAP, stops, type Point } from '@/data/lantern-loop';
import { font, theme } from '@/constants/theme';
import { canOpenStop } from '@/lib/ramble-store';
import { buildRoute, pointOnBend, polyline, walkedPoints } from '@/lib/route';

const segments = buildRoute(stops);
const basePath = polyline(segments.flatMap((segment, index) => (index === 0 ? segment : segment.slice(1))));

const blocks: { x: number; y: number; w: number; h: number }[] = [
  { x: 16, y: 16, w: 64, h: 88 },
  { x: 214, y: 28, w: 128, h: 72 },
  { x: 16, y: 230, w: 78, h: 120 },
  { x: 196, y: 268, w: 92, h: 64 },
  { x: 16, y: 400, w: 52, h: 78 },
  { x: 210, y: 400, w: 130, h: 64 },
];

type Props = {
  activeIndex: number;
  maxReached: number;
  walking: boolean;
  walkT: number;
  done: boolean;
  compact?: boolean;
  onSelectStop?: (index: number) => void;
};

export function RouteMap({
  activeIndex,
  maxReached,
  walking,
  walkT,
  done,
  compact = false,
  onSelectStop,
}: Props) {
  const { width, height } = useWindowDimensions();
  const frameWidth = useMemo(() => {
    if (compact) return Math.min(300, width - 72);
    const wide = width >= 980;
    const heightCap = Math.max(280, height - (wide ? 150 : 280));
    const widthCap = wide ? 520 : width - 36;
    return Math.min(widthCap, heightCap * (MAP.width / MAP.height));
  }, [compact, height, width]);

  const completed = done ? segments.length : walking ? Math.max(activeIndex, 0) : Math.max(maxReached, 0);
  const partial = walking ? walkT : 0;
  const showWalked = done || walking || maxReached > 0;
  const walked = showWalked ? walkedPoints(segments, completed, partial) : [];
  const walkedPath = polyline(walked);

  const marker = markerPosition(activeIndex, walking, walkT, done);

  return (
    <View style={styles.wrap}>
      <View style={[styles.frame, { width: frameWidth, aspectRatio: MAP.width / MAP.height }]}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${MAP.width} ${MAP.height}`} pointerEvents="none">
          <Rect width={MAP.width} height={MAP.height} rx={18} fill={theme.street} />
          <Rect x={0} y={498} width={MAP.width} height={42} fill={theme.water} />
          <Rect x={92} y={470} width={14} height={52} fill="#CDBEA8" />
          <Rect x={196} y={156} width={146} height={120} rx={18} fill={theme.park} />
          {blocks.map((block) => (
            <Rect
              key={`${block.x}-${block.y}`}
              x={block.x}
              y={block.y}
              width={block.w}
              height={block.h}
              rx={6}
              fill={theme.block}
            />
          ))}
          <SvgText x={18} y={524} fill={theme.waterDeep} fontSize={12} fontFamily={font.medium}>
            Harbor
          </SvgText>
          <Path d={basePath} stroke="#D2C4B2" strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {walkedPath ? (
            <Path
              d={walkedPath}
              stroke={theme.terracotta}
              strokeWidth={5}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}
          {stops.map((stop, index) => {
            const here = !done && !walking && index === activeIndex;
            const visited =
              done || (!here && index <= (walking ? activeIndex : maxReached) && !(walking && index > activeIndex));
            const destination = walking && index === activeIndex + 1;
            const start = activeIndex < 0 && index === 0;
            const fill = here ? theme.terracotta : visited ? theme.moss : theme.ahead;
            return (
              <Circle
                key={stop.id}
                cx={stop.position.x}
                cy={stop.position.y}
                r={here || destination || start ? 13 : 11}
                fill={fill}
                stroke={destination || start ? theme.terracotta : here ? theme.terracottaDeep : theme.line}
                strokeWidth={destination || start ? 3 : 1.5}
              />
            );
          })}
          {stops.map((stop, index) => {
            const here = !done && !walking && index === activeIndex;
            const visited =
              done || (!here && index <= (walking ? activeIndex : maxReached) && !(walking && index > activeIndex));
            return (
              <SvgText
                key={`${stop.id}-n`}
                x={stop.position.x}
                y={stop.position.y + 4}
                fill={here || visited ? '#FFFBF6' : theme.ink}
                fontSize={11}
                textAnchor="middle"
                fontFamily={font.semibold}
              >
                {index + 1}
              </SvgText>
            );
          })}
          {stops.map((stop) => (
            <SvgText
              key={`${stop.id}-label`}
              x={stop.position.x + stop.label.x}
              y={stop.position.y + stop.label.y}
              fill={theme.inkSoft}
              fontSize={11}
              fontFamily={font.medium}
            >
              {stop.shortName}
            </SvgText>
          ))}
          {marker ? (
            <>
              <Circle cx={marker.x} cy={marker.y + (walking ? 0 : 16)} r={14} fill="rgba(28,25,22,0.14)" />
              <Circle
                cx={marker.x}
                cy={marker.y + (walking ? 0 : 16)}
                r={6.5}
                fill={theme.ink}
                stroke="#FFFBF6"
                strokeWidth={2.5}
              />
            </>
          ) : null}
        </Svg>
        {onSelectStop
          ? stops.map((stop, index) => {
              const open = canOpenStop(index);
              return (
                <Pressable
                  key={`${stop.id}-hit`}
                  accessibilityRole="button"
                  accessibilityLabel={`${stop.name}${open ? '' : ', not yet'}`}
                  accessibilityState={{ disabled: !open }}
                  disabled={!open}
                  onPress={() => onSelectStop(index)}
                  style={[
                    styles.hit,
                    {
                      left: `${(stop.position.x / MAP.width) * 100}%`,
                      top: `${(stop.position.y / MAP.height) * 100}%`,
                    },
                    Platform.OS === 'web' && open ? { cursor: 'pointer' as const } : null,
                  ]}
                />
              );
            })
          : null}
      </View>
      {compact ? null : (
        <View style={styles.legend}>
          <Legend swatch={theme.moss} label="Walked" />
          <Legend swatch={theme.ink} label="You" ring />
          <Legend swatch={theme.ahead} label="Ahead" />
        </View>
      )}
    </View>
  );
}

function Legend({ swatch, label, ring = false }: { swatch: string; label: string; ring?: boolean }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: swatch }, ring && styles.legendRing]} />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

function markerPosition(activeIndex: number, walking: boolean, walkT: number, done: boolean): Point | null {
  const last = stops[stops.length - 1];
  if (!last) return null;
  if (done) return last.position;
  if (activeIndex < 0) return null;
  const current = stops[activeIndex];
  const next = stops[activeIndex + 1];
  if (walking && current?.bend && next) {
    return pointOnBend(current.position, current.bend, next.position, walkT);
  }
  return current?.position ?? null;
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: 12,
  },
  frame: {
    position: 'relative',
    maxWidth: '100%',
  },
  hit: {
    position: 'absolute',
    width: 44,
    height: 44,
    marginLeft: -22,
    marginTop: -22,
    borderRadius: 22,
  },
  legend: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: theme.line,
  },
  legendRing: {
    borderColor: '#FFFBF6',
    borderWidth: 2,
  },
  legendLabel: {
    fontFamily: font.medium,
    fontSize: 13,
    color: theme.inkSoft,
  },
});
