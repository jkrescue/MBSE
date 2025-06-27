import { useEffect, useRef } from 'react';
import Modeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

function BpmnModeler() {
  const ref = useRef(null);
  useEffect(() => {
    const modeler = new Modeler({ container: ref.current });
    modeler.createDiagram();
    return () => modeler.destroy();
  }, []);
  return <div ref={ref} className="bpmn-canvas" style={{ height: '500px' }} />;
}

export default BpmnModeler;
