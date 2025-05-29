document.addEventListener('DOMContentLoaded', function() {
    // 增强版键盘布局
    const keyboardLayouts = {
        default: [
            ['esc', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace'],
            ['tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
            ['caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'enter'],
            ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'shift'],
            ['space']
        ],
        shift: [
            ['esc', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'backspace'],
            ['tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', '|'],
            ['caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', 'enter'],
            ['shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?', 'shift'],
            ['space']
        ],
        caps: [
            ['esc', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace'],
            ['tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
            ['caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'enter'],
            ['shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'shift'],
            ['space']
        ]
    };

    let currentLayout = 'default';
    let capsLock = true;
    let activeInput = null;
    let lastSelection = { start: 0, end: 0 }; // 新增：保存最后的光标位置
    const keyboard = document.querySelector('.virtual-keyboard');
    const keyboardRows = document.querySelector('.keyboard-rows');
    const closeButton = document.querySelector('.close-keyboard');
    const keyboardInputs = document.querySelectorAll('.keyboard-input');
    const inputs = document.querySelectorAll('.keyboard-input');

    // 初始化键盘
    function initKeyboard() {
        //console.log('initKeyboard');

        renderKeyboard();
        //console.log('Keyboardrendered');
        
        closeButton.addEventListener('click', hideKeyboard);
        
        keyboardInputs.forEach(input => {
            // 保存光标位置（新增）
            input.addEventListener('click', updateSelection);
            input.addEventListener('keyup', updateSelection);
            input.addEventListener('select', updateSelection);
            
            input.addEventListener('focus', function() {
                activeInput = this;
                updateSelection(); // 新增：立即更新光标位置

                const rect = this.getBoundingClientRect(); //获取文本框矩形

                // 获取浏览器可视区域宽度
                const viewportWidth = //window.innerWidth || 
                                       document.documentElement.clientWidth || 
                                       document.body.clientWidth;
                //console.log('keyboardWidth', rect.width);
                //console.log('viewportWidth', viewportWidth);
                var v_keyboardPosX = (viewportWidth - 800)/2;

                // 获取浏览器可视区域高度
                const viewportHeight = window.innerHeight || 
                                       document.documentElement.clientHeight || 
                                       document.body.clientHeight;
                //console.log('keyboardHeight', rect.height);
                //console.log('viewportHeight', viewportHeight);
                var v_keyboardPosY = rect.top + rect.height + 10;
                if ((viewportHeight - rect.bottom) <= 320) { v_keyboardPosY = (rect.top -350); }

                // 设置虚拟键盘位置
                keyboard.style.left = `${v_keyboardPosX}px`;
                keyboard.style.top = `${v_keyboardPosY}px`; 

                showKeyboard();
            });
        });
    }

    // 新增：更新光标位置
    function updateSelection() {
        if (!activeInput) return;
        lastSelection = {
            start: activeInput.selectionStart,
            end: activeInput.selectionEnd
        };
    }

    // 渲染键盘
    function renderKeyboard() {
        keyboardRows.innerHTML = '';
        const layout = capsLock ? 'caps' : currentLayout;
        
        keyboardLayouts[layout].forEach(row => {
            const rowElement = document.createElement('div');
            rowElement.className = 'keyboard-row';
            
            row.forEach(key => {
                const keyElement = document.createElement('div');
                keyElement.className = 'keyboard-key';
                keyElement.textContent = getKeyDisplay(key);
                
                if (['esc', 'tab', 'caps', 'shift', 'backspace', 'enter', 'space'].includes(key)) {
                    keyElement.classList.add('special', key);
                }
                
                keyElement.textContent = getKeyDisplay(key);
                keyElement.addEventListener('mousedown', (e) => e.preventDefault()); // 防止失去焦点
                keyElement.addEventListener('click', () => handleKeyPress(key));
                rowElement.appendChild(keyElement);
            });
            
            keyboardRows.appendChild(rowElement);
        });
    }

    function getKeyDisplay(key) {
        switch(key) {
            case 'esc': return 'Esc';
            case 'tab': return 'Tab';
            case 'caps': return capsLock ? 'Caps On' : 'Caps';
            case 'shift': return 'Shift';
            case 'backspace': return '←';
            case 'enter': return 'Enter';
            case 'space': return 'Space';
            default: return key;
        }
    }

    // 处理按键
    function handleKeyPress(key) {
        if (!activeInput) return;
        
        const start = activeInput.selectionStart;
        const end = activeInput.selectionEnd;
        const value = activeInput.value;
        
        switch(key) {
            case 'esc':
                hideKeyboard();
                break;
                
            case 'tab':
                insertText('\t');
                break;
                
            case 'caps':
                capsLock = !capsLock;
                renderKeyboard();
                break;
                
            case 'shift':
                currentLayout = currentLayout === 'default' ? 'shift' : 'default';
                if (!capsLock) renderKeyboard();
                break;
                
            case 'backspace':
                if (start === end && start > 0) {
                    activeInput.value = value.slice(0, start - 1) + value.slice(end);
                    setCursorPos(start - 1);
                } else if (start !== end) {
                    activeInput.value = value.slice(0, start) + value.slice(end);
                    setCursorPos(start);
                }
                break;
                
            case 'enter':
                insertText('\n');
                break;
                
            case 'space':
                insertText(' ');
                break;
                
            default:
                insertText(key);
                if (currentLayout === 'shift' && !capsLock && /[a-zA-Z]/.test(key)) {
                    currentLayout = 'default';
                    renderKeyboard();
                }
        }
        
        triggerInputEvent();
        activeInput.focus();
    }


    // 插入文本
    function insertText(text) {
        const startPos = lastSelection.start;
        const endPos = lastSelection.end;
        activeInput.value = activeInput.value.slice(0, startPos) + text + activeInput.value.slice(endPos);
        setCursorPos(startPos + text.length);
    }

    // 设置光标位置
    function setCursorPos(pos) {
        // 新增：同时更新保存的位置
        lastSelection.start = lastSelection.end = pos;
        
        // 延迟设置确保生效（关键修正）
        setTimeout(() => {
            if (activeInput) {
                activeInput.selectionStart = activeInput.selectionEnd = pos;
            }
        }, 10);
    }

    function triggerInputEvent() {
        activeInput.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function showKeyboard() {
        keyboard.classList.add('visible');
    }

    function hideKeyboard() {
        keyboard.classList.remove('visible');
        if (activeInput) activeInput.blur();
        activeInput = null;
    }


    initKeyboard();
});


document.addEventListener('DOMContentLoaded', function() {
  const draggableDiv = document.getElementById('draggableDiv');
  let isDragging = false;
  let offsetX, offsetY;

  // 鼠标按下时开始拖动
  draggableDiv.addEventListener('mousedown', function(e) {
    isDragging = true;
  // 计算鼠标相对元素左上角的偏移量
    offsetX = e.clientX - draggableDiv.getBoundingClientRect().left;
    offsetY = e.clientY - draggableDiv.getBoundingClientRect().top;

    // 防止文本选中（可选）
    e.preventDefault();
  });

  // 鼠标移动时更新元素位置
  document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;

    // 计算新位置（考虑页面滚动）
    let x = e.clientX - offsetX + window.scrollX;
    let y = e.clientY - offsetY + window.scrollY;

    // 限制边界（不超出视口）
    const maxX = window.innerWidth - draggableDiv.offsetWidth;
    const maxY = window.innerHeight - draggableDiv.offsetHeight;
    x = Math.min(Math.max(0, x), maxX);
    y = Math.min(Math.max(0, y), maxY);

    draggableDiv.style.left = `${x}px`;
    draggableDiv.style.top = `${y}px`;
  });

  // 鼠标释放时停止拖动
  document.addEventListener('mouseup', function() {
    isDragging = false;
  });
});
