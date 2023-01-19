echo $1
ffmpeg -re -stream_loop -1 -i $1 \
    -filter_complex "drawbox=x=0:y=0:width=260:height=42:color=black@0.8:t=fill,\
    settb=AVTB,setpts='trunc(PTS/1K)*1K+st(1,trunc(RTCTIME/1K))-1K*trunc(ld(1)/1K)',\
    drawtext=text='%{localtime\:%H\\\\\:%M\\\\\:%S}.%{eif\:1M*t-1K*trunc(t*1K)\:d}':x=5:y=5:\
    fontsize=36:fontcolor=white,
    split=2[udp][dash]"\
    -c:v libx264 -c:a aac \
    -map [udp] -map 0:a:0 -f mpegts udp://127.0.0.1:1234 \
    -map [dash] \
    -map 0:a:0 \
    -tune zerolatency \
    -c:v libx264 \
    -c:a aac \
    -window_size 30 \
    -remove_at_exit 1 \
    -adaptation_sets 'id=0,streams=v id=1,streams=a' \
    -f dash \
   ../tmp/live.mpd