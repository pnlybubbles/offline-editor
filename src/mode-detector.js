module.exports = (filename) => {
  const m = filename.match(/.([^\.]+)$/);
  const ext = m ? m[1] : null;
  let mode = null;
  switch (ext) {
  case 'js':
    mode = 'javascript';
    break;
  case 'html':
    mode = 'htmlmixed';
    break;
  case 'xml':
  case 'goml':
    mode = 'xml';
    break;
  case 'glsl':
  case 'sort':
    mode = 'clike';
    break;
  }
  return {mode, ext};
};
