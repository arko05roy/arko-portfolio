// Live audio signal shared between the music player (writer) and the <Cosmos /> canvas (reader).
export const pulse = {
  playing: false,
  /** 0..1, low-frequency energy of the current frame */
  bass: 0,
  /** 0..1, overall loudness */
  level: 0,
  /** 0..1 per band, low → high frequencies (64 bands), for the radial visualizer rings */
  bins: new Float32Array(64),
  /** album art of the current song, drawn at the galaxy's core */
  cover: null as HTMLImageElement | null,
  read: null as null | (() => void),
};
