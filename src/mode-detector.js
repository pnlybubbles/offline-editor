module.exports = (filename) => {
  const m = filename.match(/.([^\.]+)$/);
  const ext = m ? m[1] : null;
  let modeDisplay = null;
  let mode = null;
  switch (ext) {
  case 'md':
    modeDisplay = 'Markdown';
    mode = 'markdown';
    break;
  case 'js':
    modeDisplay = 'JavaScript';
    mode = 'javascript';
    break;
  case 'html':
    modeDisplay = 'HTML';
    mode = 'htmlmixed';
    break;
  case 'xml':
    modeDisplay = 'XML';
    mode = 'xml';
    break;
  case 'goml':
    modeDisplay = 'GOML';
    mode = 'xml';
    break;
  case 'glsl':
    modeDisplay = 'GLSL';
    mode = 'glsl';
    break;
  case 'sort':
    modeDisplay = 'SORT';
    mode = 'glsl';
    break;
  }
  return {mode, modeDisplay, ext};
};
