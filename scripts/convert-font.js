const opentype = require('opentype.js');
const fs = require('fs');
const path = require('path');

// Convert font to Three.js JSON typeface format
function convertToThreejsFont(fontPath, outputPath) {
  const font = opentype.loadSync(fontPath);

  const glyphs = {};
  const scale = 1000 / font.unitsPerEm;

  // Get all available glyphs
  for (let i = 0; i < font.glyphs.length; i++) {
    const glyph = font.glyphs.get(i);
    if (glyph.unicode !== undefined) {
      const char = String.fromCharCode(glyph.unicode);
      const path = glyph.getPath(0, 0, font.unitsPerEm);

      // Convert path to Three.js format
      const o = [];
      for (const cmd of path.commands) {
        switch (cmd.type) {
          case 'M':
            o.push('m', cmd.x * scale, cmd.y * scale);
            break;
          case 'L':
            o.push('l', cmd.x * scale, cmd.y * scale);
            break;
          case 'Q':
            o.push('q', cmd.x1 * scale, cmd.y1 * scale, cmd.x * scale, cmd.y * scale);
            break;
          case 'C':
            o.push('b', cmd.x1 * scale, cmd.y1 * scale, cmd.x2 * scale, cmd.y2 * scale, cmd.x * scale, cmd.y * scale);
            break;
          case 'Z':
            break;
        }
      }

      glyphs[char] = {
        ha: Math.round(glyph.advanceWidth * scale),
        x_min: Math.round((glyph.xMin || 0) * scale),
        x_max: Math.round((glyph.xMax || 0) * scale),
        o: o.join(' ')
      };
    }
  }

  const typefaceData = {
    glyphs: glyphs,
    familyName: font.names.fontFamily?.en || 'Unknown',
    ascender: Math.round(font.ascender * scale),
    descender: Math.round(font.descender * scale),
    underlinePosition: Math.round((font.tables.post?.underlinePosition || -100) * scale),
    underlineThickness: Math.round((font.tables.post?.underlineThickness || 50) * scale),
    boundingBox: {
      xMin: Math.round((font.tables.head?.xMin || 0) * scale),
      yMin: Math.round((font.tables.head?.yMin || 0) * scale),
      xMax: Math.round((font.tables.head?.xMax || 0) * scale),
      yMax: Math.round((font.tables.head?.yMax || 0) * scale)
    },
    resolution: 1000,
    original_font_information: {
      format: 0,
      copyright: font.names.copyright?.en || '',
      fontFamily: font.names.fontFamily?.en || '',
      fontSubfamily: font.names.fontSubfamily?.en || '',
      uniqueID: font.names.uniqueID?.en || '',
      fullName: font.names.fullName?.en || '',
      version: font.names.version?.en || '',
      postScriptName: font.names.postScriptName?.en || ''
    }
  };

  fs.writeFileSync(outputPath, JSON.stringify(typefaceData));
  console.log(`Converted ${fontPath} to ${outputPath}`);
  console.log(`Total glyphs: ${Object.keys(glyphs).length}`);
}

// Run conversion
const fontPath = path.join(__dirname, '..', 'public', 'fonts', 'Marcellus-Regular.ttf');
const outputPath = path.join(__dirname, '..', 'public', 'fonts', 'Marcellus-Regular.json');

convertToThreejsFont(fontPath, outputPath);
