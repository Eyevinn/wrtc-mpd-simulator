# MPD + WebRTC Live Simulator 

A node.js application that simulates a live mpeg-dash stream a normal AdaptionSet as well as an WebRTC WHEP AdaptionSet. The resulting manifest is based on the example in the dash-if [report](https://dashif.org/webRTC/report.html#596-webrtc-adaptation-set).

## Requirements
- [ffmpeg](https://ffmpeg.org/)
- [whip-mpegts](https://github.com/Eyevinn/whip-mpegts) 0.5.2+
- [whip-whep](https://github.com/Eyevinn/whip-whep) 0.2.0+

## Usage
1. Start the whip-whep docker container as described in that repository
2. `npm start <input.mp4>`
3. A Live MPEG-DASH stream will now be available at `http://localhost:5000/live.mpd`