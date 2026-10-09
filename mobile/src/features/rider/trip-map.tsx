import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { colors, fontSize, radius, spacing } from '@/constants/theme';
import { useLayout } from '@/hooks/use-layout';
import type { LatLng } from '@/types';

import { buildMapHtml } from './map-html';

type Props = {
  pickup: LatLng;
  dropoff: LatLng;
  /** The rider's current position, or null while it is unknown. */
  rider: LatLng | null;
};

/** The R2 map: pickup, drop-off and the rider's live position on OpenStreetMap. */
export function TripMap({ pickup, dropoff, rider }: Props) {
  const webView = useRef<WebView>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const html = useMemo(() => buildMapHtml(pickup, dropoff), [pickup, dropoff]);
  // Lower on a phone held sideways, taller on a tablet. Leaflet redraws itself when the size changes.
  const { short, height } = useLayout();
  const mapHeight = { height: short ? 200 : height >= 900 ? 360 : 260 };

  // Move the blue rider dot whenever the position changes, once the page has loaded.
  useEffect(() => {
    if (loaded && rider) {
      webView.current?.injectJavaScript(`window.setRider(${rider.lat}, ${rider.lng}); true;`);
    }
  }, [loaded, rider]);

  if (failed) {
    return (
      <View style={[styles.map, mapHeight, styles.failed]}>
        <Text style={styles.failedText}>
          The map could not load. Check your internet connection. You can still use the address and
          the Navigate button below.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.map, mapHeight]}>
      <WebView
        ref={webView}
        accessibilityLabel="Map showing pickup, drop-off and your position"
        source={{ html, baseUrl: 'https://rasaexpress.app' }}
        originWhitelist={['*']}
        onLoadEnd={() => setLoaded(true)}
        onError={() => setFailed(true)}
        onHttpError={() => setFailed(true)}
        javaScriptEnabled
        style={styles.web}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    overflow: 'hidden',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.coverPeach,
  },
  web: { flex: 1, backgroundColor: colors.coverPeach },
  failed: { alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  failedText: { fontSize: fontSize.body, color: colors.textMuted, textAlign: 'center' },
});
