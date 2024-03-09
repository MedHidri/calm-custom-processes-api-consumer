import axios from "axios";
import oauth from "axios-oauth-client";

const user = "uaa client id"; // The cliendid of SAP Cloud ALM API instance
const password = "uaa client secret"; // The cliendsecret of SAP Cloud ALM API instance
const tenantBaseUrl = "https://{tenant}.{region}.alm.cloud.sap"; // The SAP Cloud ALM tenant url, it should be in this format https://{tenant}.{region}.alm.cloud.sap
const tenantAuthUrl = "uaa url"; // The url of SAP Cloud ALM API instance

//Fetch the OAuth token.
//Considering that tokens have a limited validity period, it's worth considering implementing a token cache and refresh mechanism to manage them effectively.
//This is not covered here to keep the code simple. 
const token = await oauth.clientCredentials(
  axios.create({
    baseURL: tenantAuthUrl,
  }),
  "/oauth/token",
  user,
  password
)();

//Create the Axios instance using the tenant base url concatenated to the custom processes api path.
const api = axios.create({
  baseURL: tenantBaseUrl + "/api/calm-processauthoring/v1",
});

//Add the OAuth token to all request headers.
api.interceptors.request.use((config) => {
  if (token) {
    config.headers.Authorization = "Bearer " + token.access_token;
  }
  return config;
});

//Create a Business Process
//A Business Process is needed to create the Custom Solution Process as it's a mandatory field.
//The Business Process name should be unique this is why i'm concatenating the date to the name.
const businessProcess = await api.post("/businessProcesses", {
  name: "API Business Process" + new Date(),
  description: "Business Process Created via API",
});

//Create a Custom Solution Process 
const customSolutionProcess = await api.post("/solutionProcesses", {
  name: "API Custom Solution Process",
  description: "Solution Process Created via API",
  countries: "DE,FR",
  externalId: "PROC1",
  businessProcess: {
    id: businessProcess.data.id,
  },
});

//Get the Solution Process Flows of the created Solution Process
const solutionProcessFlow = await api.get(
  "/solutionProcesses/" +
    customSolutionProcess.data.id +
    "/solutionProcessFlows"
);

// Create a Solution Process Flow Diagram from BPMN content
//For now there is only one Solution Process Flow per Custom Solution Process so we will use it as a container for the diagrams.
const solutionProcessFlowDiagram = await api.post(
  "/solutionProcessFlows/" +
    solutionProcessFlow.data.value[0].id +
    "/solutionProcessFlowDiagrams/bpmn",
  {
    name: "API BPMN Diagram",
    bpmn: '<?xml version="1.0" encoding="UTF-8"?><definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:signavio="http://www.signavio.com" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" exporter="Signavio Process Editor, http://www.signavio.com" exporterVersion="17.13.1" expressionLanguage="http://www.w3.org/TR/XPath" id="sid-5fdcc601-5000-4ab6-b88e-4433521b62fa" targetNamespace="http://www.signavio.com" typeLanguage="http://www.w3.org/2001/XMLSchema" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL http://www.omg.org/spec/BPMN/2.0/20100501/BPMN20.xsd"><collaboration id="sid-36909f60-615f-4371-b8f3-883e2ffbb3d9"><participant id="sid-C27475A3-EB6E-420E-A50E-512DC50CE5E2" name="Pool" processRef="sid-0E710C9C-2698-4FAC-B253-9706A4E3A461"><extensionElements><signavio:signavioMetaData metaKey="bgcolor" metaValue="#ffffff"/><signavio:signavioMetaData metaKey="bordercolor" metaValue="#000000"/></extensionElements></participant></collaboration><process id="sid-0E710C9C-2698-4FAC-B253-9706A4E3A461" isClosed="false" isExecutable="false" name="Pool" processType="None"><extensionElements/><laneSet id="sid-cfbe2113-6b02-49b3-996d-e6753a57c684"><lane id="sid-8ABC4DD7-9999-497E-BD1A-D9834C7346B6" name="Lane"><extensionElements><signavio:signavioMetaData metaKey="bgcolor" metaValue=""/><signavio:signavioMetaData metaKey="bordercolor" metaValue="#000000"/></extensionElements><flowNodeRef>sid-165FD2A8-553D-464A-A033-A32D33FEF9CF</flowNodeRef><flowNodeRef>sid-57B3B393-8005-45E4-9085-5681FA0F43A9</flowNodeRef><flowNodeRef>sid-5375E623-E07C-4322-B43F-D7EB9AE4BC8D</flowNodeRef></lane></laneSet><startEvent id="sid-165FD2A8-553D-464A-A033-A32D33FEF9CF" name=""><extensionElements><signavio:signavioMetaData metaKey="bgcolor" metaValue="#ffffff"/><signavio:signavioMetaData metaKey="bordercolor" metaValue="#000000"/></extensionElements><outgoing>sid-A0C0A710-028B-4B57-AC2D-091BB8DB7998</outgoing></startEvent><task completionQuantity="1" id="sid-57B3B393-8005-45E4-9085-5681FA0F43A9" isForCompensation="false" name="Task" startQuantity="1"><extensionElements><signavio:signavioMetaData metaKey="bgcolor" metaValue="#ffffcc"/><signavio:signavioMetaData metaKey="bordercolor" metaValue="#000000"/><signavio:signavioMetaData metaKey="meta-descriptionlongchar" metaValue=""/></extensionElements><incoming>sid-A0C0A710-028B-4B57-AC2D-091BB8DB7998</incoming><outgoing>sid-FE527107-1943-4616-9FB6-5C41EA243301</outgoing></task><endEvent id="sid-5375E623-E07C-4322-B43F-D7EB9AE4BC8D" name=""><extensionElements><signavio:signavioMetaData metaKey="bgcolor" metaValue="#ffffff"/><signavio:signavioMetaData metaKey="bordercolor" metaValue="#000000"/></extensionElements><incoming>sid-FE527107-1943-4616-9FB6-5C41EA243301</incoming></endEvent><sequenceFlow id="sid-A0C0A710-028B-4B57-AC2D-091BB8DB7998" name="" sourceRef="sid-165FD2A8-553D-464A-A033-A32D33FEF9CF" targetRef="sid-57B3B393-8005-45E4-9085-5681FA0F43A9"><extensionElements><signavio:signavioMetaData metaKey="bordercolor" metaValue="#000000"/></extensionElements></sequenceFlow><sequenceFlow id="sid-FE527107-1943-4616-9FB6-5C41EA243301" name="" sourceRef="sid-57B3B393-8005-45E4-9085-5681FA0F43A9" targetRef="sid-5375E623-E07C-4322-B43F-D7EB9AE4BC8D"><extensionElements><signavio:signavioMetaData metaKey="bordercolor" metaValue="#000000"/></extensionElements></sequenceFlow></process><bpmndi:BPMNDiagram id="sid-f98e40b6-c1e4-427f-883d-9639060a0568"><bpmndi:BPMNPlane bpmnElement="sid-36909f60-615f-4371-b8f3-883e2ffbb3d9" id="sid-a3fca2ce-e9c7-4f67-84cb-c63991b958e3"><bpmndi:BPMNShape bpmnElement="sid-C27475A3-EB6E-420E-A50E-512DC50CE5E2" id="sid-C27475A3-EB6E-420E-A50E-512DC50CE5E2_gui" isHorizontal="true"><omgdc:Bounds height="250.0" width="600.0" x="210.0" y="80.0"/><bpmndi:BPMNLabel labelStyle="sid-d4d97145-01c8-46db-850f-eee678de4077"><omgdc:Bounds height="22.371429443359375" width="12.0" x="215.0" y="193.8142852783203"/></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNShape bpmnElement="sid-8ABC4DD7-9999-497E-BD1A-D9834C7346B6" id="sid-8ABC4DD7-9999-497E-BD1A-D9834C7346B6_gui" isHorizontal="true"><omgdc:Bounds height="250.0" width="570.0" x="240.0" y="80.0"/><bpmndi:BPMNLabel labelStyle="sid-d4d97145-01c8-46db-850f-eee678de4077"><omgdc:Bounds height="25.457143783569336" width="12.0" x="246.0" y="192.27142810821533"/></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNShape bpmnElement="sid-165FD2A8-553D-464A-A033-A32D33FEF9CF" id="sid-165FD2A8-553D-464A-A033-A32D33FEF9CF_gui"><omgdc:Bounds height="30.0" width="30.0" x="399.99999292194855" y="189.99999715387824"/></bpmndi:BPMNShape><bpmndi:BPMNShape bpmnElement="sid-57B3B393-8005-45E4-9085-5681FA0F43A9" id="sid-57B3B393-8005-45E4-9085-5681FA0F43A9_gui"><omgdc:Bounds height="80.0" width="100.0" x="474.99999292194855" y="164.99999715387824"/><bpmndi:BPMNLabel labelStyle="sid-d4d97145-01c8-46db-850f-eee678de4077"><omgdc:Bounds height="12.0" width="25.45714569091797" x="512.2714200764896" y="196.99999715387824"/></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNShape bpmnElement="sid-5375E623-E07C-4322-B43F-D7EB9AE4BC8D" id="sid-5375E623-E07C-4322-B43F-D7EB9AE4BC8D_gui"><omgdc:Bounds height="28.0" width="28.0" x="619.9999929219485" y="190.99999715387824"/></bpmndi:BPMNShape><bpmndi:BPMNEdge bpmnElement="sid-A0C0A710-028B-4B57-AC2D-091BB8DB7998" id="sid-A0C0A710-028B-4B57-AC2D-091BB8DB7998_gui"><omgdi:waypoint x="429.99999292194855" y="204.99999715387824"/><omgdi:waypoint x="474.99999292194855" y="204.99999715387824"/></bpmndi:BPMNEdge><bpmndi:BPMNEdge bpmnElement="sid-FE527107-1943-4616-9FB6-5C41EA243301" id="sid-FE527107-1943-4616-9FB6-5C41EA243301_gui"><omgdi:waypoint x="574.9999929219485" y="204.99999715387824"/><omgdi:waypoint x="619.9999929219485" y="204.99999715387824"/></bpmndi:BPMNEdge></bpmndi:BPMNPlane><bpmndi:BPMNLabelStyle id="sid-d4d97145-01c8-46db-850f-eee678de4077"><omgdc:Font isBold="false" isItalic="false" isStrikeThrough="false" isUnderline="false" name="Arial" size="12.0"/></bpmndi:BPMNLabelStyle></bpmndi:BPMNDiagram></definitions>'
  }
);

// Create a Solution Process Flow Diagram from SVG content
const solutionProcessFlowDiagram2 = await api.post(
    "/solutionProcessFlows/" +
      solutionProcessFlow.data.value[0].id +
      "/solutionProcessFlowDiagrams",
    {
      name: "API SVG Diagram",
      svg: "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?><svg id=\"svgRoot-1\" class=\"svgRoot\" xmlns=\"http://www.w3.org/2000/svg\" width=\"608\" height=\"258\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:galilei=\"http://www.sap.com/2014/galilei\" viewBox=\"0 0 608 258\"><defs><pattern id=\"pagePattern-1\" patternUnits=\"userSpaceOnUse\" x=\"-493\" y=\"-720\" width=\"987\" height=\"1440\"><path d=\"M987 -720 L-493 -720 L-493 1440 L987 1440 L987 -720\" fill=\"none\" stroke=\"#d9d9d9\" stroke-width=\"1.5\"/></pattern><pattern id=\"gridPattern-1\" patternUnits=\"userSpaceOnUse\" width=\"50\" height=\"50\"><path d=\"M0 10 H50 M0 20 H50 M0 30 H50 M0 40 H50 M10 0 V50 M20 0 V50 M30 0 V50 M40 0 V50\" fill=\"none\" stroke=\"#CEE0F2\" stroke-width=\"1\"/><path d=\"M50 0 L0 0 L0 50 L50 50 L50 0\" fill=\"none\" stroke=\"#ADCDED\" stroke-width=\"1.5\"/></pattern><rect id=\"Icons.invisible-icon-1\" fill=\"#000\" opacity=\"0\" x=\"0\" y=\"0\" width=\"0\" height=\"0\"/><g id=\"Bpmn.CompensationIcon-1\" focusable=\"false\"><path class=\"sapGalileiBpmnSubProcessIconStroke\" stroke=\"black\" stroke-width=\"1\" fill=\"none\" d=\"M0,6 L5.5,0 L5.5,12 Z\"/><path class=\"sapGalileiBpmnSubProcessIconStroke\" stroke=\"black\" stroke-width=\"1\" fill=\"none\" d=\"M6.5,6 L12,0 L12,12 Z\"/></g><marker id=\"Arrows.FilledEnd-428gb0-1\" class=\"ArrowsFilledEnd\" markerUnits=\"userSpaceOnUse\" refX=\"10.5\" refY=\"5\" markerWidth=\"14\" markerHeight=\"10\" orient=\"auto\"><path stroke=\"none\" fill=\"#428EB0\" d=\"M 0 0 L 14 5 L 0 10 z\"/></marker></defs><g id=\"layersGroup\"><g id=\"svgMainShapeLayer-1\" class=\"svgShapeLayer\" cursor=\"default\" transform=\"translate(-206,-76)\"><g id=\"ecc68382-907f-47e0-8183-b4859be1e527\" class=\"sapGalileiSymbolNode\" focusable=\"true\" sap-automation=\"Pool/Pool\" transform=\"translate(210,80)\" style=\"user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); touch-action: none;\"><title>Pool 'Pool'</title><g focusable=\"false\"><rect stroke=\"#A9C6DE\" stroke-width=\"2\" fill=\"#ffef9f\" x=\"0\" y=\"0\" width=\"600\" height=\"250\"/></g><text fill=\"black\" cursor=\"default\" x=\"0\" y=\"129\" font-size=\"14px\" font-family=\"Arial, Helvetica, sans-serif\" transform=\"rotate(270,15,125)\">Pool</text><line stroke=\"lightgray\" stroke-width=\"1\" fill=\"none\" x1=\"30\" y1=\"0\" x2=\"30\" y2=\"250\"/></g><g id=\"68dc5d83-8579-4930-a6ea-ae7e4cdb3489\" class=\"sapGalileiSymbolNode\" focusable=\"true\" sap-automation=\"Lane/Lane\" transform=\"translate(240,80)\" style=\"user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); touch-action: none;\"><title>Pool 'Pool' Lane 'Lane'</title><g focusable=\"false\"><rect stroke=\"#A9C6DE\" stroke-width=\"2\" fill=\"white\" x=\"0\" y=\"0\" width=\"570\" height=\"250\"/></g><text fill=\"black\" cursor=\"default\" x=\"-1\" y=\"130\" font-size=\"14px\" font-family=\"Arial, Helvetica, sans-serif\" transform=\"rotate(270,15,125.5)\">Lane</text></g><g id=\"c1a1435f-bbf5-4a68-ab96-dfc2f59a212e\" class=\"sapGalileiSymbolNode\" focusable=\"true\" sap-automation=\"Task/Task\" transform=\"translate(475,165)\" style=\"user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); touch-action: none;\"><title>Task 'Task'</title><g focusable=\"false\"><rect class=\"task\" stroke=\"#428EB0\" stroke-width=\"1\" fill=\"#D9EFFF\" x=\"0\" y=\"0\" width=\"100\" height=\"80\" rx=\"8\" ry=\"8\"/></g><use style=\"pointer-events: none;\" x=\"2\" y=\"2\" width=\"0\" height=\"0\" xmlns:ns1=\"http://www.w3.org/1999/xlink\" ns1:href=\"#Icons.invisible-icon-1\"/><text class=\"taskName\" fill=\"black\" cursor=\"default\" x=\"38\" y=\"44\" font-size=\"12px\" font-family=\"Arial, Helvetica, sans-serif\">Task</text></g><g id=\"d259795f-2349-4ce3-bcbe-7de691865026\" class=\"sapGalileiSymbolLink\" focusable=\"true\" sap-automation=\"SequenceFlow\" style=\"user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); touch-action: none;\"><title>Sequence Flow</title><path class=\"sequenceFlow\" stroke=\"#428EB0\" stroke-width=\"1\" fill=\"none\" d=\"M430.4999999999997,204.99999715387824 L471,204.99999715387824\" marker-end=\"url(#Arrows.FilledEnd-428gb0-1)\"/><path stroke=\"#FFFFFF\" stroke-width=\"10\" fill=\"none\" opacity=\"0.01\" d=\"M430.4999999999997,204.99999715387824 L471,204.99999715387824\"/></g><g id=\"283ecdce-9572-4ea0-b5f0-76d34f4a741d\" class=\"sapGalileiSymbolLink\" focusable=\"true\" sap-automation=\"SequenceFlow\" style=\"user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); touch-action: none;\"><title>Sequence Flow</title><path class=\"sequenceFlow\" stroke=\"#428EB0\" stroke-width=\"1\" fill=\"none\" d=\"M575.5,204.99999715387824 L615.0000000000002,204.99999715387824\" marker-end=\"url(#Arrows.FilledEnd-428gb0-1)\"/><path stroke=\"#FFFFFF\" stroke-width=\"10\" fill=\"none\" opacity=\"0.01\" d=\"M575.5,204.99999715387824 L615.0000000000002,204.99999715387824\"/></g><g id=\"af6f861b-a0a4-4c04-82f0-ad748944755e\" class=\"sapGalileiSymbolNode\" focusable=\"true\" sap-automation=\"EndEvent\" transform=\"translate(620,191)\" style=\"user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); touch-action: none;\"><title>End Event</title><g focusable=\"false\"><circle class=\"endEvent\" stroke=\"#CC2424\" stroke-width=\"3\" fill=\"#FFE6E5\" cx=\"14\" cy=\"14\" r=\"14\"/><use style=\"pointer-events: none;\" x=\"0\" y=\"0\" width=\"0\" height=\"0\" xmlns:ns2=\"http://www.w3.org/1999/xlink\" ns2:href=\"#Icons.invisible-icon-1\"/></g></g><g id=\"4b3cc168-8834-4210-815c-c941864dd49e\" class=\"sapGalileiSymbolNode\" focusable=\"true\" sap-automation=\"StartEvent\" transform=\"translate(400,190)\" style=\"user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); touch-action: none;\"><title>Start Event</title><g focusable=\"false\"><circle class=\"startEvent\" stroke=\"#288000\" stroke-width=\"1\" fill=\"#ECFDDC\" display=\"inline\" cx=\"15\" cy=\"15\" r=\"15\"/><use style=\"pointer-events: none;\" x=\"0\" y=\"0\" width=\"0\" height=\"0\" xmlns:ns3=\"http://www.w3.org/1999/xlink\" ns3:href=\"#Icons.invisible-icon-1\"/></g></g></g></g></svg>"
    }
  );