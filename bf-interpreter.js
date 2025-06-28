document.getElementById('run').addEventListener('click', () => {
  const code = document.getElementById('code').value;
  const outputEl = document.getElementById('output');
  outputEl.textContent = interpretBF(code);
});

document.getElementById('clear').addEventListener('click', () => {
  document.getElementById('output').textContent = '';
});

function interpretBF(code) {
  const tape = new Uint8Array(30000);
  let ptr = 0, out = '';
  const loopMap = buildLoopMap(code);
  for (let i = 0; i < code.length; i++) {
    switch (code[i]) {
      case '>': ptr++; break;
      case '<': ptr--; break;
      case '+': tape[ptr] = (tape[ptr] + 1) & 255; break;
      case '-': tape[ptr] = (tape[ptr] - 1) & 255; break;
      case '.': out += String.fromCharCode(tape[ptr]); break;
      case ',': {
          const input = prompt('Zadej jeden znak pro čtení (nebo nechte prázdné pro NUL):');
          tape[ptr] = input ? input.charCodeAt(0) : 0;
        }
        break;
      case '[':
        if (tape[ptr] === 0) i = loopMap[i];
        break;
      case ']':
        if (tape[ptr] !== 0) i = loopMap[i];
        break;
    }
  }
  return out;
}

function buildLoopMap(code) {
  const map = {}, stack = [];
  for (let i = 0; i < code.length; i++) {
    if (code[i] === '[') stack.push(i);
    if (code[i] === ']') {
      const start = stack.pop();
      map[start] = i;
      map[i] = start;
    }
  }
  return map;
}
