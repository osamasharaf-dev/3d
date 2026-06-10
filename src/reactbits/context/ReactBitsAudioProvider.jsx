import React, { createContext } from "react";
export const ReactBitsAudioContext = createContext({ muted: true, volume: 0, play: () => {}, toggleMute: () => {}, setVolume: () => {} });
const ReactBitsAudioProvider = ({ children }) => <>{children}</>;
export default ReactBitsAudioProvider;
