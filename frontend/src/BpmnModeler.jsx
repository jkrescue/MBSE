

import { useEffect, useRef } from 'react';
import Modeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';


// 直接加载用户提供的 BPMN XML
import bpmnXml from './New BPMN diagram.bpmn?raw';



function BpmnModeler({ onNodeClick, onNodeDoubleClick }) {
  const ref = useRef(null);
  const modelerRef = useRef(null);

  useEffect(() => {
    const modeler = new Modeler({
      container: ref.current,
      width: '100%',
      height: '100%'
    });
    modelerRef.current = modeler;
    modeler.importXML(bpmnXml).then(() => {
      // 绑定事件
      modeler.on('element.click', (e) => {
        // 调试：打印点击的 element
        console.log('element.click', e.element);
        if (onNodeClick) onNodeClick(e.element);
      });
      modeler.on('element.dblclick', (e) => {
        if (onNodeDoubleClick) onNodeDoubleClick(e.element);
      });
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.error('加载BPMN失败', err);
    });
    return () => modeler.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={ref} className="bpmn-canvas" style={{ width: '100%', height: '100%' }} />;
}

export default BpmnModeler;
