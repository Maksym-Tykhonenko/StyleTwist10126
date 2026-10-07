import React, {useCallback, useRef, useState} from 'react';
import {Platform, Share, StyleSheet, View} from 'react-native';
import {captureRef} from 'react-native-view-shot';
import {Clothing} from '../../data/clothing';
import ShareLookCard from './ShareLookCard';

export type ShareLookInput = {
  items: Clothing[];
  title: string;
  subtitle?: string;
  score?: number;
  caption?: string;
  /** Plain-text fallback used when image capture or image sharing is unavailable. */
  message: string;
};

const nextFrame = () =>
  new Promise<void>(resolve =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  );

const buildMessage = (input: ShareLookInput) =>
  input.message ||
  `${input.title}\n\n${input.items.map(item => `${item.category}: ${item.name}`).join('\n')}`;

/**
 * Captures a branded look card to a PNG and opens the native share sheet.
 * The card is rendered off-screen, so callers just drop `host` into their tree
 * and call `shareLook(...)`. Falls back to a text share if capture fails.
 */
export function useLookShare() {
  const cardRef = useRef<View>(null);
  const [data, setData] = useState<ShareLookInput | null>(null);
  const [busy, setBusy] = useState(false);

  const shareLook = useCallback(
    async (input: ShareLookInput) => {
      if (busy) {
        return;
      }
      setBusy(true);
      setData(input);
      try {
        await nextFrame();
        const uri = await captureRef(cardRef, {format: 'png', quality: 1, result: 'tmpfile'});
        const message = buildMessage(input);
        await Share.share(
          Platform.OS === 'ios' ? {url: uri, message} : {message, url: uri},
        );
      } catch {
        try {
          await Share.share({message: buildMessage(input)});
        } catch {
          // user dismissed or sharing unavailable — nothing to recover
        }
      } finally {
        setData(null);
        setBusy(false);
      }
    },
    [busy],
  );

  const host = data ? (
    <View style={styles.offscreen} pointerEvents="none">
      <ShareLookCard ref={cardRef} {...data} />
    </View>
  ) : null;

  return {shareLook, host, sharing: busy};
}

const styles = StyleSheet.create({
  // Pushed far outside the viewport so the card still lays out and renders for
  // the snapshot without ever being visible to the user. Kept fully opaque so
  // the captured PNG is not blank (view-shot renders the layer directly).
  offscreen: {position: 'absolute', left: -9999, top: 0},
});
