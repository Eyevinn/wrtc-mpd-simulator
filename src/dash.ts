import {
  X2jOptions,
  XMLBuilder,
  XmlBuilderOptions,
  XMLParser
} from 'fast-xml-parser';

const options: Partial<X2jOptions & XmlBuilderOptions> = {
  ignoreAttributes: false,
  preserveOrder: true,
  format: true
};
const parser = new XMLParser(options);
const builder = new XMLBuilder(options);

// insert an adaptionset with a representation for the whep stream into the provided xmlstring
export function addWHEPAdaptionSet(manifest: string): string {
  const manifestArr = parser.parse(manifest);
  const mpdEl = manifestArr.find((el: any) => !!el.MPD);
  const periodEl = mpdEl.MPD.find((el: any) => !!el.Period);

  periodEl.Period.push({
    AdaptationSet: [
      {
        Representation: [],
        ':@': {
          '@_id': 'video',
          '@_mimeType': 'video RTP/AVP',
          '@_bandwidth': '250000',
          '@_width': '1280',
          '@_height': '720',
          '@_frameRate': '24/1',
          '@_codecs': 'avc1.4D401F'
        }
      }
    ],
    ':@': {
      '@_id': 'WHEP',
      '@_contentType': 'video',
      '@_mimeType': 'video RTP/AVP',
      '@_codecs': 'avc1.4D401F',
      '@_initializationPrincipal': 'http://localhost:8300/whep/channel/dash'
    }
  });

  return builder.build(manifestArr);
}
