// 将 initialNodes 和 initialEdges 自动转换为 BPMN 2.0 XML
import { initialNodes, initialEdges } from './workflowData';

function escapeXml(str) {
  return str.replace(/[<>&"']/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;','\'':'&apos;'}[c]));
}

export function generateBpmnXml() {
  const nodeMap = {};
  initialNodes.forEach(n => { nodeMap[n.id] = n; });
  // 头部
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n` +
    `  xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"\n` +
    `  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"\n` +
    `  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"\n` +
    `  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"\n` +
    `  id="Definitions_1"\n` +
    `  targetNamespace="http://bpmn.io/schema/bpmn">\n`;
  xml += `  <bpmn:process id="Process_1" isExecutable="false">\n`;
  // 节点
  initialNodes.forEach((n, idx) => {
    xml += `    <bpmn:task id="${n.id}" name="${escapeXml(n.data.label)}" />\n`;
  });
  // 连线
  initialEdges.forEach(e => {
    xml += `    <bpmn:sequenceFlow id="${e.id}" sourceRef="${e.source}" targetRef="${e.target}" />\n`;
  });
  xml += `  </bpmn:process>\n`;
  // 画布布局
  xml += `  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\n`;
  xml += `    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">\n`;
  initialNodes.forEach((n, idx) => {
    const x = 150 + idx * 200;
    const y = 200;
    xml += `      <bpmndi:BPMNShape id="_BPMNShape_${n.id}" bpmnElement="${n.id}">\n`;
    xml += `        <dc:Bounds x="${x}" y="${y}" width="100" height="60"/>\n`;
    xml += `      </bpmndi:BPMNShape>\n`;
  });
  initialEdges.forEach((e) => {
    const srcIdx = initialNodes.findIndex(n => n.id === e.source);
    const tgtIdx = initialNodes.findIndex(n => n.id === e.target);
    const srcX = 200 + srcIdx * 200;
    const tgtX = 200 + tgtIdx * 200;
    xml += `      <bpmndi:BPMNEdge id="_BPMNEdge_${e.id}" bpmnElement="${e.id}">\n`;
    xml += `        <di:waypoint x="${srcX}" y="230" />\n`;
    xml += `        <di:waypoint x="${tgtX}" y="230" />\n`;
    xml += `      </bpmndi:BPMNEdge>\n`;
  });
  xml += `    </bpmndi:BPMNPlane>\n`;
  xml += `  </bpmndi:BPMNDiagram>\n`;
  xml += `</bpmn:definitions>`;
  return xml;
}
