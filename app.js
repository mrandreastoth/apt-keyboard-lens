/* ══════════════════════════════════════════════════════════════════════
   apt-keyboard-lens  ·  app.js
   Static keyboard-legend comparison tool.
   No build step · no backend · no dependencies.
   ══════════════════════════════════════════════════════════════════════ */

'use strict';

// ── Key sizing constants (must match style.css :root) ──────────────────
const KU   = 3;      // rem per key-unit
const KGAP = 0.28;   // rem gap between keys

/** Width (flex-basis) for a key that is `w` key-units wide */
function kwRem(w) {
  return `${w * (KU + KGAP) - KGAP}rem`;
}

// ── Modifier state ──────────────────────────────────────────────────────
const modState = { shift: false, caps: false, ctrl: false, alt: false };

/**
 * Map from XKB key code to logical modifier name.
 * Both left and right variants of Shift/Ctrl/Alt map to the same modifier.
 */
const MODIFIER_MAP = {
  LSHFT: 'shift', RSHFT: 'shift',
  CAPS:  'caps',
  LCTL:  'ctrl',  RCTL:  'ctrl',
  LALT:  'alt',   RALT:  'alt',
};

function toggleModifier(modName) {
  modState[modName] = !modState[modName];
  render();
}

// ── Layout index (embedded — no network request needed) ────────────────
const LAYOUT_INDEX = [
  { key: 'us',      label: 'US (American English)',      file: 'us.json' },
  { key: 'uk',      label: 'UK (British English)',       file: 'uk.json' },
  { key: 'be',      label: 'BE (Belgian French)',        file: 'be.json' },
  { key: 'br',      label: 'BR (Brazilian Portuguese)',  file: 'br.json' },
  { key: 'ch-de',   label: 'CH (Swiss German)',          file: 'ch-de.json' },
  { key: 'ch-fr',   label: 'CH (Swiss French)',          file: 'ch-fr.json' },
  { key: 'de',      label: 'DE (German)',                file: 'de.json' },
  { key: 'dk',      label: 'DK (Danish)',                file: 'dk.json' },
  { key: 'es',      label: 'ES (Spanish)',               file: 'es.json' },
  { key: 'fr',      label: 'FR (French)',                file: 'fr.json' },
  { key: 'hu',      label: 'HU (Hungarian QWERTZ)',       file: 'hu.json' },
  { key: 'hu-prog', label: 'HU (Hungarian QWERTY)',       file: 'hu-prog.json' },
  { key: 'it',      label: 'IT (Italian)',               file: 'it.json' },
  { key: 'la',      label: 'LA (Latin American Spanish)',file: 'la.json' },
  { key: 'no',      label: 'NO (Norwegian)',             file: 'no.json' },
  { key: 'pt',      label: 'PT (Portuguese)',            file: 'pt.json' },
  { key: 'se',      label: 'SE (Swedish)',               file: 'se.json' },
];

// ── Layout data (embedded — works with file://, HTTP, and GitHub Pages) ──
const LAYOUT_DATA = {
  'us': {
    TLDE:["`","~",null,null], AE01:["1","!",null,null], AE02:["2","@",null,null],
    AE03:["3","#",null,null], AE04:["4","$",null,null], AE05:["5","%",null,null],
    AE06:["6","^",null,null], AE07:["7","&",null,null], AE08:["8","*",null,null],
    AE09:["9","(",null,null], AE10:["0",")",null,null], AE11:["-","_",null,null],
    AE12:["=","+",null,null], AD01:["q","Q",null,null], AD02:["w","W",null,null],
    AD03:["e","E",null,null], AD04:["r","R",null,null], AD05:["t","T",null,null],
    AD06:["y","Y",null,null], AD07:["u","U",null,null], AD08:["i","I",null,null],
    AD09:["o","O",null,null], AD10:["p","P",null,null], AD11:["[","{",null,null],
    AD12:["]","}",null,null], BKSL:["\\","|",null,null], BKSL_ISO:["\\","|",null,null],
    LSGT:[null,null,null,null], AC01:["a","A",null,null], AC02:["s","S",null,null],
    AC03:["d","D",null,null], AC04:["f","F",null,null], AC05:["g","G",null,null],
    AC06:["h","H",null,null], AC07:["j","J",null,null], AC08:["k","K",null,null],
    AC09:["l","L",null,null], AC10:[";",":",null,null], AC11:["'","\"",null,null],
    AB01:["z","Z",null,null], AB02:["x","X",null,null], AB03:["c","C",null,null],
    AB04:["v","V",null,null], AB05:["b","B",null,null], AB06:["n","N",null,null],
    AB07:["m","M",null,null], AB08:[",","<",null,null], AB09:[".",">",null,null],
    AB10:["/","?",null,null], SPCE:[" "," ",null,null],
  },
  'uk': {
    TLDE:["`","¬","|",null], AE01:["1","!",null,null], AE02:["2","\"",null,null],
    AE03:["3","£",null,null], AE04:["4","$","€",null], AE05:["5","%",null,null],
    AE06:["6","^",null,null], AE07:["7","&",null,null], AE08:["8","*",null,null],
    AE09:["9","(",null,null], AE10:["0",")",null,null], AE11:["-","_",null,null],
    AE12:["=","+",null,null], AD01:["q","Q",null,null], AD02:["w","W",null,null],
    AD03:["e","E","€",null], AD04:["r","R",null,null], AD05:["t","T",null,null],
    AD06:["y","Y",null,null], AD07:["u","U",null,null], AD08:["i","I",null,null],
    AD09:["o","O",null,null], AD10:["p","P",null,null], AD11:["[","{",null,null],
    AD12:["]","}",null,null], BKSL:["\\","|",null,null], BKSL_ISO:["#","~",null,null],
    LSGT:["\\","|","¦",null], AC01:["a","A",null,null], AC02:["s","S",null,null],
    AC03:["d","D",null,null], AC04:["f","F",null,null], AC05:["g","G",null,null],
    AC06:["h","H",null,null], AC07:["j","J",null,null], AC08:["k","K",null,null],
    AC09:["l","L",null,null], AC10:[";",":",null,null], AC11:["'","@",null,null],
    AB01:["z","Z",null,null], AB02:["x","X",null,null], AB03:["c","C",null,null],
    AB04:["v","V",null,null], AB05:["b","B",null,null], AB06:["n","N",null,null],
    AB07:["m","M",null,null], AB08:[",","<",null,null], AB09:[".",">",null,null],
    AB10:["/","?",null,null], SPCE:[" "," ",null,null],
  },
  'be': {
    TLDE:["²","³",null,null], AE01:["&","1",null,null], AE02:["é","2","~",null],
    AE03:["\"","3","#",null], AE04:["'","4",null,null], AE05:["(","5",null,null],
    AE06:["§","6","^",null], AE07:["è","7",null,null], AE08:["!","8",null,null],
    AE09:["ç","9","{",null], AE10:["à","0","}",null], AE11:[")","°",null,null],
    AE12:["-","_",null,null], AD01:["a","A",null,null], AD02:["z","Z",null,null],
    AD03:["e","E","€",null], AD04:["r","R",null,null], AD05:["t","T",null,null],
    AD06:["y","Y",null,null], AD07:["u","U",null,null], AD08:["i","I",null,null],
    AD09:["o","O",null,null], AD10:["p","P",null,null], AD11:["^","¨","[",null],
    AD12:["$","*","]",null], BKSL:["µ","£",null,null], BKSL_ISO:["µ","£",null,null],
    LSGT:["<",">",null,null], AC01:["q","Q",null,null], AC02:["s","S",null,null],
    AC03:["d","D",null,null], AC04:["f","F",null,null], AC05:["g","G",null,null],
    AC06:["h","H",null,null], AC07:["j","J",null,null], AC08:["k","K",null,null],
    AC09:["l","L",null,null], AC10:["m","M",null,null], AC11:["ù","%",null,null],
    AB01:["w","W",null,null], AB02:["x","X",null,null], AB03:["c","C",null,null],
    AB04:["v","V",null,null], AB05:["b","B",null,null], AB06:["n","N",null,null],
    AB07:[",","?",null,null], AB08:[";",".",null,null], AB09:[":","/",null,null],
    AB10:["=","+","~",null], SPCE:[" "," ",null,null],
  },
  'br': {
    TLDE:["'","\"",null,null], AE01:["1","!",null,null], AE02:["2","@",null,null],
    AE03:["3","#",null,null], AE04:["4","$",null,null], AE05:["5","%",null,null],
    AE06:["6","¨",null,null], AE07:["7","&",null,null], AE08:["8","*",null,null],
    AE09:["9","(",null,null], AE10:["0",")",null,null], AE11:["-","_",null,null],
    AE12:["=","+",null,null], AD01:["q","Q",null,null], AD02:["w","W",null,null],
    AD03:["e","E",null,null], AD04:["r","R",null,null], AD05:["t","T",null,null],
    AD06:["y","Y",null,null], AD07:["u","U",null,null], AD08:["i","I",null,null],
    AD09:["o","O",null,null], AD10:["p","P",null,null], AD11:["´","`",null,null],
    AD12:["[","{",null,null], BKSL:["]","}",null,null], BKSL_ISO:["[","{",null,null],
    LSGT:["\\","|",null,null], AC01:["a","A",null,null], AC02:["s","S",null,null],
    AC03:["d","D",null,null], AC04:["f","F",null,null], AC05:["g","G",null,null],
    AC06:["h","H",null,null], AC07:["j","J",null,null], AC08:["k","K",null,null],
    AC09:["l","L",null,null], AC10:["ç","Ç",null,null], AC11:["~","^",null,null],
    AB01:["z","Z",null,null], AB02:["x","X",null,null], AB03:["c","C",null,null],
    AB04:["v","V",null,null], AB05:["b","B",null,null], AB06:["n","N",null,null],
    AB07:["m","M",null,null], AB08:[",","<",null,null], AB09:[".",">",null,null],
    AB10:[";",":",null,null], SPCE:[" "," ",null,null],
  },
  'ch-de': {
    TLDE:["§","°",null,null], AE01:["1","+",null,null], AE02:["2","\"","@",null],
    AE03:["3","*","#",null], AE04:["4","ç",null,null], AE05:["5","%",null,null],
    AE06:["6","&","¬",null], AE07:["7","/","|",null], AE08:["8","(","¢",null],
    AE09:["9",")",null,null], AE10:["0","=",null,null], AE11:["'","?","´",null],
    AE12:["^","`","~",null], AD01:["q","Q",null,null], AD02:["w","W",null,null],
    AD03:["e","E","€",null], AD04:["r","R",null,null], AD05:["t","T",null,null],
    AD06:["z","Z",null,null], AD07:["u","U",null,null], AD08:["i","I",null,null],
    AD09:["o","O",null,null], AD10:["p","P",null,null], AD11:["ü","è","[",null],
    AD12:["¨","!","]",null], BKSL:["$","£",null,null], BKSL_ISO:["$","£",null,null],
    LSGT:["<",">","\\",null], AC01:["a","A",null,null], AC02:["s","S",null,null],
    AC03:["d","D",null,null], AC04:["f","F",null,null], AC05:["g","G",null,null],
    AC06:["h","H",null,null], AC07:["j","J",null,null], AC08:["k","K",null,null],
    AC09:["l","L",null,null], AC10:["ö","é",null,null], AC11:["ä","à","{",null],
    AB01:["y","Y",null,null], AB02:["x","X",null,null], AB03:["c","C",null,null],
    AB04:["v","V",null,null], AB05:["b","B",null,null], AB06:["n","N",null,null],
    AB07:["m","M",null,null], AB08:[",",";",null,null], AB09:[".",":",null,null],
    AB10:["-","_",null,null], SPCE:[" "," ",null,null],
  },
  'ch-fr': {
    TLDE:["§","°",null,null], AE01:["1","+",null,null], AE02:["2","\"","@",null],
    AE03:["3","*","#",null], AE04:["4","ç",null,null], AE05:["5","%",null,null],
    AE06:["6","&","¬",null], AE07:["7","/","|",null], AE08:["8","(","¢",null],
    AE09:["9",")",null,null], AE10:["0","=",null,null], AE11:["'","?","´",null],
    AE12:["^","`","~",null], AD01:["q","Q",null,null], AD02:["w","W",null,null],
    AD03:["e","E","€",null], AD04:["r","R",null,null], AD05:["t","T",null,null],
    AD06:["y","Y",null,null], AD07:["u","U",null,null], AD08:["i","I",null,null],
    AD09:["o","O",null,null], AD10:["p","P",null,null], AD11:["è","ü","[",null],
    AD12:["¨","!","]",null], BKSL:["$","£",null,null], BKSL_ISO:["$","£",null,null],
    LSGT:["<",">","\\",null], AC01:["a","A",null,null], AC02:["s","S",null,null],
    AC03:["d","D",null,null], AC04:["f","F",null,null], AC05:["g","G",null,null],
    AC06:["h","H",null,null], AC07:["j","J",null,null], AC08:["k","K",null,null],
    AC09:["l","L",null,null], AC10:["é","ö",null,null], AC11:["à","ä","{",null],
    AB01:["z","Z",null,null], AB02:["x","X",null,null], AB03:["c","C",null,null],
    AB04:["v","V",null,null], AB05:["b","B",null,null], AB06:["n","N",null,null],
    AB07:["m","M",null,null], AB08:[",",";",null,null], AB09:[".",":",null,null],
    AB10:["-","_",null,null], SPCE:[" "," ",null,null],
  },
  'de': {
    TLDE:["^","°",null,null], AE01:["1","!",null,null], AE02:["2","\"","²",null],
    AE03:["3","§","³",null], AE04:["4","$",null,null], AE05:["5","%",null,null],
    AE06:["6","&",null,null], AE07:["7","/","{",null], AE08:["8","(","[",null],
    AE09:["9",")","]",null], AE10:["0","=","}",null], AE11:["ß","?","\\",null],
    AE12:["´","`",null,null], AD01:["q","Q","@",null], AD02:["w","W",null,null],
    AD03:["e","E","€",null], AD04:["r","R",null,null], AD05:["t","T",null,null],
    AD06:["z","Z",null,null], AD07:["u","U",null,null], AD08:["i","I",null,null],
    AD09:["o","O",null,null], AD10:["p","P",null,null], AD11:["ü","Ü",null,null],
    AD12:["+","*","~",null], BKSL:["#","'",null,null], BKSL_ISO:["#","'",null,null],
    LSGT:["<",">","|",null], AC01:["a","A",null,null], AC02:["s","S",null,null],
    AC03:["d","D",null,null], AC04:["f","F",null,null], AC05:["g","G",null,null],
    AC06:["h","H",null,null], AC07:["j","J",null,null], AC08:["k","K",null,null],
    AC09:["l","L",null,null], AC10:["ö","Ö",null,null], AC11:["ä","Ä",null,null],
    AB01:["y","Y",null,null], AB02:["x","X",null,null], AB03:["c","C",null,null],
    AB04:["v","V",null,null], AB05:["b","B",null,null], AB06:["n","N",null,null],
    AB07:["m","M","µ",null], AB08:[",",";",null,null], AB09:[".",":",null,null],
    AB10:["-","_",null,null], SPCE:[" "," ",null,null],
  },
  'dk': {
    TLDE:["½","§",null,null], AE01:["1","!",null,null], AE02:["2","\"","@",null],
    AE03:["3","#","£",null], AE04:["4","¤","$",null], AE05:["5","%",null,null],
    AE06:["6","&",null,null], AE07:["7","/","{",null], AE08:["8","(","[",null],
    AE09:["9",")","]",null], AE10:["0","=","}",null], AE11:["+","?",null,null],
    AE12:["´","`","|",null], AD01:["q","Q",null,null], AD02:["w","W",null,null],
    AD03:["e","E","€",null], AD04:["r","R",null,null], AD05:["t","T",null,null],
    AD06:["y","Y",null,null], AD07:["u","U",null,null], AD08:["i","I",null,null],
    AD09:["o","O",null,null], AD10:["p","P",null,null], AD11:["å","Å",null,null],
    AD12:["¨","^","~",null], BKSL:["'","*",null,null], BKSL_ISO:["'","*",null,null],
    LSGT:["<",">","\\",null], AC01:["a","A",null,null], AC02:["s","S",null,null],
    AC03:["d","D",null,null], AC04:["f","F",null,null], AC05:["g","G",null,null],
    AC06:["h","H",null,null], AC07:["j","J",null,null], AC08:["k","K",null,null],
    AC09:["l","L",null,null], AC10:["æ","Æ",null,null], AC11:["ø","Ø",null,null],
    AB01:["z","Z",null,null], AB02:["x","X",null,null], AB03:["c","C",null,null],
    AB04:["v","V",null,null], AB05:["b","B",null,null], AB06:["n","N",null,null],
    AB07:["m","M",null,null], AB08:[",",";",null,null], AB09:[".",":",null,null],
    AB10:["-","_",null,null], SPCE:[" "," ",null,null],
  },
  'es': {
    TLDE:["º","ª","\\",null], AE01:["1","!","|",null], AE02:["2","\"","@",null],
    AE03:["3","·","#",null], AE04:["4","$","~",null], AE05:["5","%",null,null],
    AE06:["6","&","¬",null], AE07:["7","/",null,null], AE08:["8","(",null,null],
    AE09:["9",")",null,null], AE10:["0","=",null,null], AE11:["'","?",null,null],
    AE12:["¡","¿",null,null], AD01:["q","Q",null,null], AD02:["w","W",null,null],
    AD03:["e","E","€",null], AD04:["r","R",null,null], AD05:["t","T",null,null],
    AD06:["y","Y",null,null], AD07:["u","U",null,null], AD08:["i","I",null,null],
    AD09:["o","O",null,null], AD10:["p","P",null,null], AD11:["`","^","[",null],
    AD12:["+","*","]",null], BKSL:["ç","Ç",null,null], BKSL_ISO:["ç","Ç",null,null],
    LSGT:["<",">",null,null], AC01:["a","A",null,null], AC02:["s","S",null,null],
    AC03:["d","D",null,null], AC04:["f","F",null,null], AC05:["g","G",null,null],
    AC06:["h","H",null,null], AC07:["j","J",null,null], AC08:["k","K",null,null],
    AC09:["l","L",null,null], AC10:["ñ","Ñ",null,null], AC11:["´","¨","{",null],
    AB01:["z","Z",null,null], AB02:["x","X",null,null], AB03:["c","C",null,null],
    AB04:["v","V",null,null], AB05:["b","B",null,null], AB06:["n","N",null,null],
    AB07:["m","M",null,null], AB08:[",",";",null,null], AB09:[".",":",null,null],
    AB10:["-","_",null,null], SPCE:[" "," ",null,null],
  },
  'fr': {
    TLDE:["²","³",null,null], AE01:["&","1",null,null], AE02:["é","2","~",null],
    AE03:["\"","3","#",null], AE04:["'","4","{",null], AE05:["(","5","[",null],
    AE06:["-","6","|",null], AE07:["è","7","`",null], AE08:["_","8","\\",null],
    AE09:["ç","9","^",null], AE10:["à","0","@",null], AE11:[")","°","]",null],
    AE12:["=","+","}",null], AD01:["a","A",null,null], AD02:["z","Z",null,null],
    AD03:["e","E","€",null], AD04:["r","R",null,null], AD05:["t","T",null,null],
    AD06:["y","Y",null,null], AD07:["u","U",null,null], AD08:["i","I",null,null],
    AD09:["o","O",null,null], AD10:["p","P",null,null], AD11:["^","¨",null,null],
    AD12:["$","£","¤",null], BKSL:["*","µ",null,null], BKSL_ISO:["*","µ",null,null],
    LSGT:["<",">",null,null], AC01:["q","Q",null,null], AC02:["s","S",null,null],
    AC03:["d","D",null,null], AC04:["f","F",null,null], AC05:["g","G",null,null],
    AC06:["h","H",null,null], AC07:["j","J",null,null], AC08:["k","K",null,null],
    AC09:["l","L",null,null], AC10:["m","M",null,null], AC11:["ù","%",null,null],
    AB01:["w","W",null,null], AB02:["x","X",null,null], AB03:["c","C",null,null],
    AB04:["v","V",null,null], AB05:["b","B",null,null], AB06:["n","N",null,null],
    AB07:[",","?",null,null], AB08:[";",".",null,null], AB09:[":","/",null,null],
    AB10:["!","§",null,null], SPCE:[" "," ",null,null],
  },
  'hu': {
    TLDE:["0","§",null,null], AE01:["1","'","~",null], AE02:["2","\"",null,null],
    AE03:["3","+","^",null], AE04:["4","!",null,null], AE05:["5","%",null,null],
    AE06:["6","/",null,null], AE07:["7","=",null,null], AE08:["8","(",null,null],
    AE09:["9",")",null,null], AE10:["ö","Ö",null,null], AE11:["ü","Ü",null,null],
    AE12:["ó","Ó",null,null], AD01:["q","Q","\\",null], AD02:["w","W","|",null],
    AD03:["e","E","Ä",null], AD04:["r","R",null,null], AD05:["t","T",null,null],
    AD06:["z","Z",null,null], AD07:["u","U","€",null], AD08:["i","I","Í",null],
    AD09:["o","O",null,null], AD10:["p","P",null,null], AD11:["ő","Ő","÷",null],
    AD12:["ú","Ú","×",null], BKSL:["\\","|",null,null], BKSL_ISO:["\\","|",null,null],
    LSGT:["í","Í",null,null], AC01:["a","A","ä",null], AC02:["s","S",null,null],
    AC03:["d","D","Đ",null], AC04:["f","F","[",null], AC05:["g","G","]",null],
    AC06:["h","H",null,null], AC07:["j","J","í",null], AC08:["k","K","ł",null],
    AC09:["l","L","Ł",null], AC10:["é","É","$",null], AC11:["á","Á","ß",null],
    AB01:["y","Y",">",null], AB02:["x","X","#",null], AB03:["c","C","&",null],
    AB04:["v","V","@",null], AB05:["b","B","{",null], AB06:["n","N","}",null],
    AB07:["m","M",null,null], AB08:[",","?",";",null], AB09:[".",":",null,null],
    AB10:["-","_","*",null], SPCE:[" "," ",null,null],
  },
  'hu-prog': {
    TLDE:["`","~",null,null], AE01:["1","!",null,null], AE02:["2","@",null,null],
    AE03:["3","#",null,null], AE04:["4","$",null,null], AE05:["5","%",null,null],
    AE06:["6","^",null,null], AE07:["7","&",null,null], AE08:["8","*",null,null],
    AE09:["9","(",null,null], AE10:["0",")",null,null], AE11:["-","_",null,null],
    AE12:["=","+",null,null], AD01:["q","Q",null,null], AD02:["w","W",null,null],
    AD03:["e","E","€",null], AD04:["r","R",null,null], AD05:["t","T",null,null],
    AD06:["y","Y",null,null], AD07:["u","U",null,null], AD08:["i","I",null,null],
    AD09:["o","O",null,null], AD10:["p","P",null,null], AD11:["[","{",null,null],
    AD12:["]","}",null,null], BKSL:["\\","|",null,null], BKSL_ISO:["\\","|",null,null],
    LSGT:["<",">",null,null], AC01:["a","A",null,null], AC02:["s","S",null,null],
    AC03:["d","D",null,null], AC04:["f","F",null,null], AC05:["g","G",null,null],
    AC06:["h","H",null,null], AC07:["j","J",null,null], AC08:["k","K",null,null],
    AC09:["l","L",null,null], AC10:[";",":",null,null], AC11:["'","\"",null,null],
    AB01:["z","Z",null,null], AB02:["x","X",null,null], AB03:["c","C",null,null],
    AB04:["v","V",null,null], AB05:["b","B",null,null], AB06:["n","N",null,null],
    AB07:["m","M",null,null], AB08:[",","<",null,null], AB09:[".",">",null,null],
    AB10:["/","?",null,null], SPCE:[" "," ",null,null],
  },
  'it': {
    TLDE:["\\","|",null,null], AE01:["1","!",null,null], AE02:["2","\"",null,null],
    AE03:["3","£",null,null], AE04:["4","$",null,null], AE05:["5","%",null,null],
    AE06:["6","&",null,null], AE07:["7","/",null,null], AE08:["8","(",null,null],
    AE09:["9",")",null,null], AE10:["0","=",null,null], AE11:["'","?",null,null],
    AE12:["ì","^",null,null], AD01:["q","Q",null,null], AD02:["w","W",null,null],
    AD03:["e","E","€",null], AD04:["r","R",null,null], AD05:["t","T",null,null],
    AD06:["y","Y",null,null], AD07:["u","U",null,null], AD08:["i","I",null,null],
    AD09:["o","O",null,null], AD10:["p","P",null,null], AD11:["è","é","[",null],
    AD12:["+","*","]",null], BKSL:["ù","§",null,null], BKSL_ISO:["ù","§",null,null],
    LSGT:["<",">",null,null], AC01:["a","A",null,null], AC02:["s","S",null,null],
    AC03:["d","D",null,null], AC04:["f","F",null,null], AC05:["g","G",null,null],
    AC06:["h","H",null,null], AC07:["j","J",null,null], AC08:["k","K",null,null],
    AC09:["l","L",null,null], AC10:["ò","ç","@",null], AC11:["à","°","#",null],
    AB01:["z","Z",null,null], AB02:["x","X",null,null], AB03:["c","C",null,null],
    AB04:["v","V",null,null], AB05:["b","B",null,null], AB06:["n","N",null,null],
    AB07:["m","M",null,null], AB08:[",",";",null,null], AB09:[".",":",null,null],
    AB10:["-","_",null,null], SPCE:[" "," ",null,null],
  },
  'la': {
    TLDE:["|","°",null,null], AE01:["1","!",null,null], AE02:["2","\"",null,null],
    AE03:["3","#",null,null], AE04:["4","$",null,null], AE05:["5","%",null,null],
    AE06:["6","&",null,null], AE07:["7","/",null,null], AE08:["8","(",null,null],
    AE09:["9",")",null,null], AE10:["0","=",null,null], AE11:["'","?","\\",null],
    AE12:["¡","¿",null,null], AD01:["q","Q",null,null], AD02:["w","W",null,null],
    AD03:["e","E",null,null], AD04:["r","R",null,null], AD05:["t","T",null,null],
    AD06:["y","Y",null,null], AD07:["u","U",null,null], AD08:["i","I",null,null],
    AD09:["o","O",null,null], AD10:["p","P",null,null], AD11:["´","¨",null,null],
    AD12:["+","*",null,null], BKSL:["}","]",null,null], BKSL_ISO:["}","]",null,null],
    LSGT:["<",">",null,null], AC01:["a","A",null,null], AC02:["s","S",null,null],
    AC03:["d","D",null,null], AC04:["f","F",null,null], AC05:["g","G",null,null],
    AC06:["h","H",null,null], AC07:["j","J",null,null], AC08:["k","K",null,null],
    AC09:["l","L",null,null], AC10:["ñ","Ñ",null,null], AC11:["{","[",null,null],
    AB01:["z","Z",null,null], AB02:["x","X",null,null], AB03:["c","C",null,null],
    AB04:["v","V",null,null], AB05:["b","B",null,null], AB06:["n","N",null,null],
    AB07:["m","M",null,null], AB08:[",",";",null,null], AB09:[".",":",null,null],
    AB10:["-","_",null,null], SPCE:[" "," ",null,null],
  },
  'no': {
    TLDE:["|","§",null,null], AE01:["1","!",null,null], AE02:["2","\"","@",null],
    AE03:["3","#","£",null], AE04:["4","¤","$",null], AE05:["5","%",null,null],
    AE06:["6","&",null,null], AE07:["7","/","{",null], AE08:["8","(","[",null],
    AE09:["9",")","]",null], AE10:["0","=","}",null], AE11:["+","?",null,null],
    AE12:["\\","`","|",null], AD01:["q","Q",null,null], AD02:["w","W",null,null],
    AD03:["e","E","€",null], AD04:["r","R",null,null], AD05:["t","T",null,null],
    AD06:["y","Y",null,null], AD07:["u","U",null,null], AD08:["i","I",null,null],
    AD09:["o","O",null,null], AD10:["p","P",null,null], AD11:["å","Å",null,null],
    AD12:["¨","^","~",null], BKSL:["'","*",null,null], BKSL_ISO:["'","*",null,null],
    LSGT:["<",">",null,null], AC01:["a","A",null,null], AC02:["s","S",null,null],
    AC03:["d","D",null,null], AC04:["f","F",null,null], AC05:["g","G",null,null],
    AC06:["h","H",null,null], AC07:["j","J",null,null], AC08:["k","K",null,null],
    AC09:["l","L",null,null], AC10:["ø","Ø",null,null], AC11:["æ","Æ",null,null],
    AB01:["z","Z",null,null], AB02:["x","X",null,null], AB03:["c","C",null,null],
    AB04:["v","V",null,null], AB05:["b","B",null,null], AB06:["n","N",null,null],
    AB07:["m","M",null,null], AB08:[",",";",null,null], AB09:[".",":",null,null],
    AB10:["-","_",null,null], SPCE:[" "," ",null,null],
  },
  'pt': {
    TLDE:["\\","|",null,null], AE01:["1","!",null,null], AE02:["2","\"","@",null],
    AE03:["3","#","£",null], AE04:["4","$","§",null], AE05:["5","%",null,null],
    AE06:["6","&",null,null], AE07:["7","/","{",null], AE08:["8","(","[",null],
    AE09:["9",")","]",null], AE10:["0","=","}",null], AE11:["'","?",null,null],
    AE12:["«","»",null,null], AD01:["q","Q",null,null], AD02:["w","W",null,null],
    AD03:["e","E","€",null], AD04:["r","R",null,null], AD05:["t","T",null,null],
    AD06:["y","Y",null,null], AD07:["u","U",null,null], AD08:["i","I",null,null],
    AD09:["o","O",null,null], AD10:["p","P",null,null], AD11:["+","*",null,null],
    AD12:["´","`",null,null], BKSL:["~","^",null,null], BKSL_ISO:["~","^",null,null],
    LSGT:["<",">",null,null], AC01:["a","A",null,null], AC02:["s","S",null,null],
    AC03:["d","D",null,null], AC04:["f","F",null,null], AC05:["g","G",null,null],
    AC06:["h","H",null,null], AC07:["j","J",null,null], AC08:["k","K",null,null],
    AC09:["l","L",null,null], AC10:["ç","Ç",null,null], AC11:["º","ª",null,null],
    AB01:["z","Z",null,null], AB02:["x","X",null,null], AB03:["c","C",null,null],
    AB04:["v","V",null,null], AB05:["b","B",null,null], AB06:["n","N",null,null],
    AB07:["m","M",null,null], AB08:[",",";",null,null], AB09:[".",":",null,null],
    AB10:["-","_",null,null], SPCE:[" "," ",null,null],
  },
  'se': {
    TLDE:["§","½",null,null], AE01:["1","!",null,null], AE02:["2","\"","@",null],
    AE03:["3","#","£",null], AE04:["4","¤","$",null], AE05:["5","%",null,null],
    AE06:["6","&",null,null], AE07:["7","/","{",null], AE08:["8","(","[",null],
    AE09:["9",")","]",null], AE10:["0","=","}",null], AE11:["+","?","\\",null],
    AE12:["´","`",null,null], AD01:["q","Q",null,null], AD02:["w","W",null,null],
    AD03:["e","E","€",null], AD04:["r","R",null,null], AD05:["t","T",null,null],
    AD06:["y","Y",null,null], AD07:["u","U",null,null], AD08:["i","I",null,null],
    AD09:["o","O",null,null], AD10:["p","P",null,null], AD11:["å","Å",null,null],
    AD12:["¨","^","~",null], BKSL:["'","*",null,null], BKSL_ISO:["'","*",null,null],
    LSGT:["<",">","|",null], AC01:["a","A",null,null], AC02:["s","S",null,null],
    AC03:["d","D",null,null], AC04:["f","F",null,null], AC05:["g","G",null,null],
    AC06:["h","H",null,null], AC07:["j","J",null,null], AC08:["k","K",null,null],
    AC09:["l","L",null,null], AC10:["ö","Ö",null,null], AC11:["ä","Ä",null,null],
    AB01:["z","Z",null,null], AB02:["x","X",null,null], AB03:["c","C",null,null],
    AB04:["v","V",null,null], AB05:["b","B",null,null], AB06:["n","N",null,null],
    AB07:["m","M",null,null], AB08:[",",";",null,null], AB09:[".",":",null,null],
    AB10:["-","_",null,null], SPCE:[" "," ",null,null],
  },
};

/** Look up an embedded layout by key. Returns the data object or null. */
function getLayout(key) {
  return LAYOUT_DATA[key] ?? null;
}

// ── Character resolution ────────────────────────────────────────────────
/**
 * Resolve the character shown at a key given the current modifier state.
 * levels: [base, shift, altgr, altgrShift] — any element may be null.
 * Returns a string (possibly a hex display like "U+001B") or null.
 */
function resolveChar(levels) {
  if (!levels) return null;
  const [base, shift, altgr, altgrShift] = levels;

  if (modState.ctrl) {
    return deriveCtrl(base);
  }

  if (modState.alt && modState.shift) {
    return altgrShift ?? null;
  }

  if (modState.alt) {
    return altgr ?? null;
  }

  // Caps Lock inverts shift for letter keys only
  let effectiveShift = modState.shift;
  if (modState.caps && base && /^[a-zA-Z]$/.test(base)) {
    effectiveShift = !effectiveShift;
  }

  if (effectiveShift) {
    // Fall back to uppercase of base if no explicit shift char
    return shift ?? (base ? base.toUpperCase() : null);
  }

  return base ?? null;
}

/**
 * Derive what Ctrl+key produces.
 * Letters become control codes ^A-^Z; a few others have standard codes.
 * Everything else is null (no output).
 */
function deriveCtrl(base) {
  if (!base) return null;
  const lc = base.toLowerCase();
  if (lc >= 'a' && lc <= 'z') {
    return `^${lc.toUpperCase()}`;   // ^A … ^Z
  }
  // Standard ASCII control combos
  const table = { '[': 'U+001B', '\\': 'U+001C', ']': 'U+001D', '/': 'U+001F' };
  return table[base] ?? null;
}

/**
 * For custom (textarea) layouts we only have a base character.
 * Derive a minimal 4-level array from it.
 */
function levelsFromBase(base) {
  if (!base) return [null, null, null, null];
  const shift = /^[a-z]$/.test(base) ? base.toUpperCase() : null;
  return [base, shift, null, null];
}

// ── Fixed key labels ────────────────────────────────────────────────────
// Keys in this set are non-comparable (they never get status colours).
const FIXED = {
  ESC:'Esc',
  FK01:'F1',  FK02:'F2',  FK03:'F3',  FK04:'F4',
  FK05:'F5',  FK06:'F6',  FK07:'F7',  FK08:'F8',
  FK09:'F9',  FK10:'F10', FK11:'F11', FK12:'F12',
  PRSC:'PrtSc', SCLK:'ScrLk', PAUS:'Pause',
  BKSP:'⌫', TAB:'Tab', CAPS:'Caps', RTRN:'Enter',
  LSHFT:'Shift', RSHFT:'Shift',
  LCTL:'Ctrl',   RCTL:'Ctrl',
  LWIN:'⊞',     RWIN:'⊞',
  LALT:'Alt',    RALT:'AltGr', MENU:'☰',
  INS:'Ins',  HOME:'Home', PGUP:'PgUp',
  DELE:'Del', END:'End',   PGDN:'PgDn',
  UP:'↑', LEFT:'←', DOWN:'↓', RGHT:'→',
  FN:'fn',
};

// ── Geometry helpers ────────────────────────────────────────────────────
function F(code, w, label) { return { code, w, fixed: true, label: label ?? FIXED[code] }; }
function K(code, w = 1)    { return { code, w }; }
function SP(w)              { return { code: '_SP', w, spacer: true }; }

// ── Shared row fragments ────────────────────────────────────────────────
const ROW_NUMBERS = [
  K('TLDE'),
  K('AE01'), K('AE02'), K('AE03'), K('AE04'), K('AE05'), K('AE06'),
  K('AE07'), K('AE08'), K('AE09'), K('AE10'), K('AE11'), K('AE12'),
  F('BKSP', 2),
];
const ROW_TOP_ALPHA_ANSI = [
  F('TAB', 1.5),
  K('AD01'), K('AD02'), K('AD03'), K('AD04'), K('AD05'), K('AD06'),
  K('AD07'), K('AD08'), K('AD09'), K('AD10'), K('AD11'), K('AD12'),
  K('BKSL', 1.5),
];
const ROW_TOP_ALPHA_ISO = [
  F('TAB', 1.5),
  K('AD01'), K('AD02'), K('AD03'), K('AD04'), K('AD05'), K('AD06'),
  K('AD07'), K('AD08'), K('AD09'), K('AD10'), K('AD11'), K('AD12'),
  { code:'RTRN', w:1.5, fixed:true, label:'', isoEnterTop: true },
];
const ROW_HOME_ANSI = [
  F('CAPS', 1.75),
  K('AC01'), K('AC02'), K('AC03'), K('AC04'), K('AC05'), K('AC06'),
  K('AC07'), K('AC08'), K('AC09'), K('AC10'), K('AC11'),
  F('RTRN', 2.25),
];
const ROW_HOME_ISO = [
  F('CAPS', 1.75),
  K('AC01'), K('AC02'), K('AC03'), K('AC04'), K('AC05'), K('AC06'),
  K('AC07'), K('AC08'), K('AC09'), K('AC10'), K('AC11'),
  K('BKSL_ISO'),
  F('RTRN', 1.25),
];
const ROW_BOTTOM_ANSI = [
  F('LSHFT', 2.25),
  K('AB01'), K('AB02'), K('AB03'), K('AB04'), K('AB05'),
  K('AB06'), K('AB07'), K('AB08'), K('AB09'), K('AB10'),
  F('RSHFT', 2.75),
];
const ROW_BOTTOM_ISO = [
  F('LSHFT', 1.25),
  K('LSGT'),
  K('AB01'), K('AB02'), K('AB03'), K('AB04'), K('AB05'),
  K('AB06'), K('AB07'), K('AB08'), K('AB09'), K('AB10'),
  F('RSHFT', 2.75),
];
const ROW_SPACE = [
  F('LCTL', 1.25), F('LWIN', 1.25), F('LALT', 1.25),
  K('SPCE', 6.25),
  F('RALT', 1.25), F('RWIN', 1.25), F('MENU', 1.25), F('RCTL', 1.25),
];

// Mac bottom row — fn | Ctrl | ⌥ Option | ⌘ Command | Space | ⌘ Command | ⌥ Option | Ctrl
const ROW_SPACE_MAC = [
  F('FN',   1),
  F('LCTL', 1.25),
  F('LALT', 1.25, '⌥'),
  F('LWIN', 1.5,  '⌘'),
  K('SPCE', 5.5),
  F('RWIN', 1.5,  '⌘'),
  F('RALT', 1.25, '⌥'),
  F('RCTL', 1.25),
];
const ROW_FKEYS = [
  F('ESC', 1.5),
  F('FK01', 1), F('FK02', 1), F('FK03', 1), F('FK04', 1),
  SP(0.75),
  F('FK05', 1), F('FK06', 1), F('FK07', 1), F('FK08', 1),
  SP(0.75),
  F('FK09', 1), F('FK10', 1), F('FK11', 1), F('FK12', 1),
];
const NAV_ROWS = [
  [ F('PRSC',1,'PrtSc'), F('SCLK',1,'ScrLk'), F('PAUS',1,'Pause') ],
  [ F('INS',1), F('HOME',1), F('PGUP',1) ],
  [ F('DELE',1,'Del'), F('END',1), F('PGDN',1) ],
  null,
  [ SP(1), F('UP',1), SP(1) ],
  [ F('LEFT',1), F('DOWN',1), F('RGHT',1) ],
];

// ── Geometry definitions ────────────────────────────────────────────────
const GEOMETRY = {
  // PC geometries — most common first
  iso_tkl: {
    label: 'ISO TKL',
    frow: ROW_FKEYS,
    mainRows: [ ROW_NUMBERS, ROW_TOP_ALPHA_ISO, ROW_HOME_ISO, ROW_BOTTOM_ISO, ROW_SPACE ],
    nav: NAV_ROWS,
  },
  ansi_tkl: {
    label: 'ANSI TKL',
    frow: ROW_FKEYS,
    mainRows: [ ROW_NUMBERS, ROW_TOP_ALPHA_ANSI, ROW_HOME_ANSI, ROW_BOTTOM_ANSI, ROW_SPACE ],
    nav: NAV_ROWS,
  },
  ansi60: {
    label: 'ANSI 60%',
    frow: null,
    mainRows: [ ROW_NUMBERS, ROW_TOP_ALPHA_ANSI, ROW_HOME_ANSI, ROW_BOTTOM_ANSI, ROW_SPACE ],
    nav: null,
  },
  // Mac geometries — ISO first (most common outside US)
  mac_iso: {
    label: 'Mac ISO',
    frow: ROW_FKEYS,
    mainRows: [ ROW_NUMBERS, ROW_TOP_ALPHA_ISO, ROW_HOME_ISO, ROW_BOTTOM_ISO, ROW_SPACE_MAC ],
    nav: NAV_ROWS,
  },
  mac_ansi: {
    label: 'Mac ANSI',
    frow: ROW_FKEYS,
    mainRows: [ ROW_NUMBERS, ROW_TOP_ALPHA_ANSI, ROW_HOME_ANSI, ROW_BOTTOM_ANSI, ROW_SPACE_MAC ],
    nav: NAV_ROWS,
  },
};

/** Keyboard shapes available per platform, in display order. */
const GEOMETRY_BY_PLATFORM = {
  pc:  ['iso_tkl', 'ansi_tkl', 'ansi60'],
  mac: ['mac_iso', 'mac_ansi'],
};

// ── Layout → textarea text ──────────────────────────────────────────────
/** Show the base-level character for each key in "KEYCODE = char" format. */
function layoutDataToText(data) {
  return Object.entries(data)
    .filter(([code, levels]) => {
      const base = Array.isArray(levels) ? levels[0] : levels;
      return base && base !== ' ' && code !== 'SPCE';
    })
    .map(([code, levels]) => {
      const base = Array.isArray(levels) ? levels[0] : levels;
      return `${code} = ${base}`;
    })
    .join('\n');
}

// ── Input parser (for custom / textarea input) ──────────────────────────
/**
 * Parse textarea text into a Map<CODE, char>.
 * Format: one entry per line: "KEYCODE = legend"
 * Ignores blank lines and lines starting with #.
 */
function parseInput(text) {
  const map = new Map();
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq < 0) continue;
    const code   = line.slice(0, eq).trim().toUpperCase();
    const legend = line.slice(eq + 1).trimStart();
    if (code) map.set(code, legend);
  }
  return map;
}

// ── Status computation ──────────────────────────────────────────────────
function computeStatus(physChar, softChar) {
  const hasPh = physChar !== null && physChar !== undefined;
  const hasSo = softChar !== null && softChar !== undefined;
  if (!hasPh && !hasSo) return 'neutral';
  if (!hasPh || !hasSo) return 'missing';
  if (physChar === softChar) return 'match';
  return 'diff';
}

// ── DOM helper ──────────────────────────────────────────────────────────
function el(tag, cls, ...children) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  for (const c of children) {
    if (c == null) continue;
    e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  return e;
}

// ── Resolve character for a code from layout data ───────────────────────
/**
 * Get the resolved character for a given key code from layout data.
 * physData / softData may be:
 *   - an Object (preset): { CODE: [base, shift, altgr, altgrShift] }
 *   - a Map (custom textarea): Map<CODE, baseChar>
 */
function getChar(code, layoutData) {
  if (!layoutData) return null;
  if (layoutData instanceof Map) {
    const base = layoutData.get(code) ?? null;
    return resolveChar(levelsFromBase(base));
  }
  return resolveChar(layoutData[code] ?? null);
}

// ── Render a single key element ─────────────────────────────────────────
function renderKey(keyDef, physData, softData, viewMode) {
  const { code, w, fixed, label, spacer, isoEnterTop } = keyDef;

  if (spacer) {
    const sp = document.createElement('div');
    sp.className = 'key-spacer';
    sp.style.width = kwRem(w);
    return sp;
  }

  const div = document.createElement('div');
  div.className = 'key';
  div.style.width = kwRem(w);
  div.title = code;

  if (isoEnterTop) {
    div.classList.add('key-fixed', 'key-iso-enter-top');
    return div;
  }

  // Modifier keys: fixed appearance but interactive
  const modName = MODIFIER_MAP[code];
  if (fixed && modName !== undefined) {
    div.classList.add('key-fixed', 'key-modifier');
    if (modState[modName]) div.classList.add('key-modifier-active');
    div.appendChild(el('span', 'key-legend', label ?? FIXED[code] ?? code));
    div.addEventListener('click', () => toggleModifier(modName));
    return div;
  }

  if (fixed) {
    div.classList.add('key-fixed');
    div.appendChild(el('span', 'key-legend', label ?? FIXED[code] ?? code));
    return div;
  }

  // Spacebar: comparable but don't show — for blanks, just leave blank
  const isSPCE = code === 'SPCE';

  const physChar = getChar(code, physData);
  const softChar = getChar(code, softData);
  const status   = computeStatus(physChar, softChar);

  if (!isSPCE && status !== 'neutral') {
    div.classList.add(`key-${status}`);
  }

  if (viewMode === 'dual' && !isSPCE && status !== 'neutral') {
    const topText = physChar ?? '';
    const botText = softChar ?? '';
    if (topText || botText) div.dataset.tooltip = `${topText} / ${botText}`;
    div.appendChild(el('div', 'key-dual-top', topText));
    div.appendChild(el('div', 'key-dual-bot', botText));
  } else if (!isSPCE) {
    const val = viewMode === 'software' ? softChar : physChar;
    if (val) div.dataset.tooltip = val;
    div.appendChild(el('span', 'key-legend', val ?? ''));
  }

  if (isSPCE || status === 'neutral') {
    div.appendChild(el('span', 'key-code-hint', code));
  }

  return div;
}

// ── Render a row of keys ────────────────────────────────────────────────
function renderRow(keys, physData, softData, viewMode) {
  const row = el('div', 'kb-row');
  for (const k of keys) row.appendChild(renderKey(k, physData, softData, viewMode));
  return row;
}

// ── Main render ─────────────────────────────────────────────────────────
function render() {
  const geometryId = document.getElementById('geometrySelect').value;
  const viewMode   = document.getElementById('viewMode').value;
  const geom       = GEOMETRY[geometryId];
  const kb         = document.getElementById('keyboard');
  const empty      = document.getElementById('emptyState');

  // Resolve layout data for physical and software sides
  const physPreset = document.getElementById('physicalPreset').value;
  const softPreset = document.getElementById('softwarePreset').value;

  const physData = physPreset
    ? getLayout(physPreset)
    : parseInput(document.getElementById('physicalInput').value);
  const softData = softPreset
    ? getLayout(softPreset)
    : parseInput(document.getElementById('softwareInput').value);

  const physEmpty = physData instanceof Map ? physData.size === 0 : physData === null;
  const softEmpty = softData instanceof Map ? softData.size === 0 : softData === null;

  kb.innerHTML = '';
  kb.classList.remove('visible');

  if (physEmpty && softEmpty) {
    empty.style.display = '';
    return;
  }
  empty.style.display = 'none';
  kb.classList.add('visible');

  function mkRow(keys) { return renderRow(keys, physData, softData, viewMode); }

  if (geom.nav) {
    const body = el('div', 'kb-body');
    const main = el('div', 'kb-main');
    const nav  = el('div', 'kb-nav');

    if (geom.frow) {
      const fRowEl = mkRow(geom.frow);
      fRowEl.classList.add('kb-row--frow');
      main.appendChild(fRowEl);
    }

    for (const rowKeys of geom.mainRows) main.appendChild(mkRow(rowKeys));

    for (const navRow of geom.nav) {
      if (navRow === null) {
        const gap = el('div', 'kb-row');
        const sp  = document.createElement('div');
        sp.className = 'key-spacer';
        sp.style.width = kwRem(3);
        sp.style.height = `${KU}rem`;
        gap.appendChild(sp);
        nav.appendChild(gap);
      } else {
        nav.appendChild(mkRow(navRow));
      }
    }

    body.appendChild(main);
    body.appendChild(nav);
    kb.appendChild(body);
  } else {
    for (const rowKeys of geom.mainRows) kb.appendChild(mkRow(rowKeys));
  }
}

// ── Panel state sync ────────────────────────────────────────────────────
function syncPanelState(side) {
  const preset   = document.getElementById(`${side}Preset`).value;
  const textarea = document.getElementById(`${side}Input`);
  const loadBtn  = document.getElementById(`${side}LoadBtn`);
  const clearBtn = document.getElementById(`${side}ClearBtn`);
  const isCustom = preset === '';

  textarea.readOnly = !isCustom;
  loadBtn.disabled  = !isCustom;
  clearBtn.disabled = !isCustom;

  if (!isCustom) {
    const data = getLayout(preset);
    textarea.value = data ? layoutDataToText(data) : '';
  }
}

// ── Populate preset dropdowns from layout index ─────────────────────────
function buildPresetOptions() {
  // US and UK first, then rest alphabetically by label, Custom at bottom
  const us = LAYOUT_INDEX.find(e => e.key === 'us');
  const uk = LAYOUT_INDEX.find(e => e.key === 'uk');
  const rest = LAYOUT_INDEX
    .filter(e => e.key !== 'us' && e.key !== 'uk')
    .sort((a, b) => a.label.localeCompare(b.label));

  const sorted = [];
  if (us) sorted.push(us);
  if (uk) sorted.push(uk);
  sorted.push(...rest);

  const presetOptions = sorted
    .map(e => `<option value="${e.key}">${e.label}</option>`)
    .join('');
  const customOption = '<option value="">Custom</option>';
  const fullHTML = presetOptions + customOption;

  document.getElementById('physicalPreset').innerHTML = fullHTML;
  document.getElementById('softwarePreset').innerHTML = fullHTML;
}

// ── Geometry dropdown ───────────────────────────────────────────────────
function buildGeometryOptions() {
  const platform = document.getElementById('platformSelect').value;
  const shapes   = GEOMETRY_BY_PLATFORM[platform] ?? GEOMETRY_BY_PLATFORM.pc;
  const sel      = document.getElementById('geometrySelect');
  sel.innerHTML  = shapes
    .map(id => `<option value="${id}">${GEOMETRY[id].label}</option>`)
    .join('');
}

// ── Load layout dialog ──────────────────────────────────────────────────
let dialogSide = null; // 'physical' | 'software'

function buildDialogList() {
  const us = LAYOUT_INDEX.find(e => e.key === 'us');
  const uk = LAYOUT_INDEX.find(e => e.key === 'uk');
  const rest = LAYOUT_INDEX
    .filter(e => e.key !== 'us' && e.key !== 'uk')
    .sort((a, b) => a.label.localeCompare(b.label));
  const sorted = [];
  if (us) sorted.push(us);
  if (uk) sorted.push(uk);
  sorted.push(...rest);

  const ul = document.getElementById('layoutList');
  ul.innerHTML = '';
  for (const entry of sorted) {
    const btn = document.createElement('button');
    btn.className   = 'layout-list-btn';
    btn.textContent = entry.label;
    btn.addEventListener('click', () => {
      if (dialogSide) {
        const data = getLayout(entry.key);
        if (data) {
          document.getElementById(`${dialogSide}Input`).value = layoutDataToText(data);
          render();
        }
      }
      document.getElementById('loadLayoutDialog').close();
      dialogSide = null;
    });
    const li = document.createElement('li');
    li.appendChild(btn);
    ul.appendChild(li);
  }
}

// ── Swap ────────────────────────────────────────────────────────────────
function swap() {
  const phPr = document.getElementById('physicalPreset');
  const soPr = document.getElementById('softwarePreset');
  const phIn = document.getElementById('physicalInput');
  const soIn = document.getElementById('softwareInput');

  [phPr.value, soPr.value] = [soPr.value, phPr.value];
  [phIn.value, soIn.value] = [soIn.value, phIn.value];

  syncPanelState('physical');
  syncPanelState('software');
  render();
}

// ── Debounce ────────────────────────────────────────────────────────────
function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

// ── Theme ────────────────────────────────────────────────────────────────
function applyTheme(theme) {
  if (theme === 'auto') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.dataset.theme = theme;
  }
}

// ── Wire up events ──────────────────────────────────────────────────────
document.getElementById('swapBtn').addEventListener('click', swap);
document.getElementById('platformSelect').addEventListener('change', () => {
  buildGeometryOptions(); // repopulate shapes for the new platform
  render();
});
document.getElementById('geometrySelect').addEventListener('change', render);
document.getElementById('viewMode').addEventListener('change', render);

document.getElementById('physicalPreset').addEventListener('change', () => {
  syncPanelState('physical');
  render();
});
document.getElementById('softwarePreset').addEventListener('change', () => {
  syncPanelState('software');
  render();
});

document.getElementById('physicalLoadBtn').addEventListener('click', () => {
  dialogSide = 'physical';
  document.getElementById('loadLayoutDialog').showModal();
});
document.getElementById('softwareLoadBtn').addEventListener('click', () => {
  dialogSide = 'software';
  document.getElementById('loadLayoutDialog').showModal();
});
document.getElementById('dialogCancelBtn').addEventListener('click', () => {
  document.getElementById('loadLayoutDialog').close();
  dialogSide = null;
});

document.getElementById('physicalClearBtn').addEventListener('click', () => {
  document.getElementById('physicalInput').value = '';
  render();
});
document.getElementById('softwareClearBtn').addEventListener('click', () => {
  document.getElementById('softwareInput').value = '';
  render();
});

const debouncedRender = debounce(render, 250);
document.getElementById('physicalInput').addEventListener('input', debouncedRender);
document.getElementById('softwareInput').addEventListener('input', debouncedRender);

document.getElementById('themeSelect').addEventListener('change', (e) => {
  applyTheme(e.target.value);
});

// ── Boot ────────────────────────────────────────────────────────────────
(function init() {
  buildGeometryOptions();
  buildPresetOptions();
  buildDialogList();

  // Default: US physical, UK software
  document.getElementById('physicalPreset').value = 'us';
  document.getElementById('softwarePreset').value = 'uk';

  syncPanelState('physical');
  syncPanelState('software');
  render();
}());
