const graph = new window.X6.Graph({
  container: document.getElementById('container'),
  grid: true,
  connecting: {
    anchor: 'center',
    router: 'manhattan',
    connector: 'rounded',
    allowBlank: false,
    snap: true,
    highlight: true
  }
});

graph.on('edge:connected', ({ edge }) => {
  edge.attr({
    line: {
      stroke: '#5F95FF',
      targetMarker: {
        name: 'classic',
        size: 6
      }
    }
  });
});

function createNode(type, x, y) {
  const common = { x, y, attrs: { body: { magnet: true, stroke: '#5F95FF', fill: '#EFF4FF' }, label: { fill: '#6a6c8a', fontSize: 12 } } };
  switch(type) {
    case 'start':
      return graph.addNode(Object.assign({
        width: 40,
        height: 40,
        shape: 'circle',
        attrs: { label: { text: '开始' } }
      }, common));
    case 'end':
      return graph.addNode(Object.assign({
        width: 40,
        height: 40,
        shape: 'circle',
        attrs: { body: { strokeWidth: 2 }, label: { text: '结束' } }
      }, common));
    case 'gateway':
      return graph.addNode(Object.assign({
        width: 50,
        height: 50,
        shape: 'polygon',
        attrs: { body: { refPoints: '0,25 25,0 50,25 25,50' }, label: { text: '网关' } }
      }, common));
    case 'task':
    default:
      return graph.addNode(Object.assign({
        width: 80,
        height: 40,
        shape: 'rect',
        attrs: { label: { text: '任务' } }
      }, common));
  }
}

// make palette items draggable
const items = document.querySelectorAll('#stencil .item');
items.forEach(item => {
  item.draggable = true;
  item.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('shape', item.dataset.shape);
  });
});

const container = document.getElementById('container');
container.addEventListener('dragover', (e) => e.preventDefault());
container.addEventListener('drop', (e) => {
  e.preventDefault();
  const shape = e.dataTransfer.getData('shape');
  const rect = container.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  createNode(shape, x, y);
});

// 删除选中元素
graph.bindKey(['delete', 'backspace'], () => {
  const cells = graph.getSelectedCells();
  if (cells.length) {
    graph.removeCells(cells);
  }
});
